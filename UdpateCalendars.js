function updateAllCalendars() {
  updateCalendars(TEAMS_BY_DIVISION);
}

function continueUpdateCalendars(e) {
  const triggerUid = e.triggerUid; // Extract the firing trigger's ID
  const props = PropertiesService.getScriptProperties();
  const savedTeams = props.getProperty(triggerUid);

  if (savedTeams) {
    const teamsByDivision = JSON.parse(savedTeams);
    updateCalendars(teamsByDivision);

    // Clean up
    props.deleteProperty(triggerUid);
    deleteTriggerById(triggerUid);
  }
}

function updateCalendars(teamsByDivision) {
  const scriptStartTime = new Date().getTime(); // Make sure we don't exceed script run time limit
  let elapsedTime;
  const resultsByTeamAndDivision = new ResultsByTeamAndDivision();

  for (item of teamsByDivisionIterator(teamsByDivision)) {
    // Skip if set to false
    if (!item.value) continue;

    const teamId = item.teamId;
    const divisionId = item.divisionId;

    try {
      elapsedTime = new Date().getTime() - scriptStartTime;
      if (elapsedTime > MAX_RUNTIME_MS) {
        resultsByTeamAndDivision.addLog(
          teamId,
          divisionId,
          "Reached max runtime - creating new trigger"
        );
        createOneTimeTrigger("continueUpdateCalendars", teamsByDivision, 1);
        break;
      }
      updateCalendarEventsForTeam(teamId, divisionId, resultsByTeamAndDivision);
      if (resultsByTeamAndDivision.hasFatalErrors) {
        break;
      }
      teamsByDivision[divisionId][teamId] = false;
      console.log(`Calendar processed: ${divisionId}-${teamId}`);
    } catch (e) {
      resultsByTeamAndDivision.addError(
        teamId,
        divisionId,
        `Hit catch block with error: ${e.message}. Stack: ${e.stack}`
      );
    }

    Utilities.sleep(2 * 1000); // Throttle so we don't make mufa's website angry
  }

  notifyOfResults(resultsByTeamAndDivision);
  if (hasIncompleteTeams(teamsByDivision)) {
    // We made it through the whole list but had errors. Wait longer before trying again
    createOneTimeTrigger("continueUpdateCalendars", teamsByDivision, 180);
  }
}

function updateCalendarEventsForTeam(
  teamId,
  divisionId,
  resultsByTeamAndDivision
) {
  let [myTeamName, gameEvents] = getEventsFromPageViaTable(
    teamId,
    divisionId,
    resultsByTeamAndDivision
  );

  if (
    resultsByTeamAndDivision.hasErrors ||
    !myTeamName ||
    !gameEvents ||
    gameEvents.length === 0
  ) {
    return;
  }

  let calendar = getCalendarToEdit(
    teamId,
    divisionId,
    myTeamName,
    resultsByTeamAndDivision
  );

  if (calendar) {
    gameEvents?.forEach(function (eventData) {
      let now = new Date();

      if (eventData.startTime < now) {
        return; // Don't touch past events
      }

      updateEventWithRetry(
        teamId,
        divisionId,
        calendar,
        eventData,
        resultsByTeamAndDivision
      );
    });
  } else {
    resultsByTeamAndDivision.addError(
      teamId,
      divisionId,
      "Failed to create calendar"
    );
    return;
  }
}

function getCalendarToEdit(
  teamId,
  divisionId,
  teamName,
  resultsByTeamAndDivision
) {
  const calendarName = `${teamName} - MUFA 2026 summer`;
  let calendar = CalendarApp.getCalendarsByName(calendarName);
  if (calendar?.length > 0) {
    return calendar[0];
  }

  calendar = createCalendarWithRetry(
    teamId,
    divisionId,
    calendarName,
    resultsByTeamAndDivision
  );
  return calendar;
}

// There is also a quota for calendar/event update but I don't know what it is.
function updateEventWithRetry(
  teamId,
  divisionId,
  calendar,
  eventData,
  resultsByTeamAndDivision
) {
  // Check if event already exists
  let existingEvents = calendar.getEvents(
    eventData.startTime,
    eventData.endTime,
    { search: "MUFA game" } // Each calendar should have at most one of these
  );

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (existingEvents.length > 0) {
        updateExistingEvent(
          teamId,
          divisionId,
          eventData,
          existingEvents,
          resultsByTeamAndDivision
        );
      } else {
        createNewEvent(
          teamId,
          divisionId,
          calendar,
          eventData,
          resultsByTeamAndDivision
        );
      }
      return; // Success, exit function
    } catch (e) {
      if (i === maxRetries - 1) throw e; // Last retry failed, throw error
      let waitTime = 2 * 1000; // Just wait 2 seconds every time
      Utilities.sleep(waitTime);
    }
  }
}

function updateExistingEvent(
  teamId,
  divisionId,
  newEvent,
  existingEvents,
  resultsByTeamAndDivision
) {
  if (existingEvents.length === 1) {
    const event = existingEvents[0];
    let madeChanges = false;
    if (event.getTitle() !== newEvent.title) {
      event.setTitle(newEvent.title);
      resultsByTeamAndDivision.addLog(
        teamId,
        divisionId,
        "Updated existing event title"
      );
      madeChanges = true;
    }
    if (
      event.getStartTime()?.getTime() !== newEvent.startTime?.getTime() ||
      event.getEndTime()?.getTime() !== newEvent.endTime?.getTime()
    ) {
      event.setTime(newEvent.startTime, newEvent.endTime);
      resultsByTeamAndDivision.addLog(
        teamId,
        divisionId,
        "Updated existing event time"
      );
      madeChanges = true;
    }

    if (event.getLocation() !== newEvent.location) {
      event.setLocation(newEvent.location);
      resultsByTeamAndDivision.addLog(
        teamId,
        divisionId,
        "Updated existing event location"
      );
      madeChanges = true;
    }
    event.setDescription(newEvent.description); // Always set description since it contains the last updated timestamp
    if (!madeChanges) {
      // TODO: Currently will log this incorrectly if something in description changed
      resultsByTeamAndDivision.addLog(
        teamId,
        divisionId,
        "Event processed with no changes"
      );
    }
  }
}

function createNewEvent(
  teamId,
  divisionId,
  calendar,
  eventData,
  resultsByTeamAndDivision
) {
  calendar.createEvent(
    eventData.title,
    eventData.startTime,
    eventData.endTime,
    {
      location: eventData.location,
      description: eventData.description,
    }
  );

  resultsByTeamAndDivision.addLog(
    teamId,
    divisionId,
    "Created new event for team"
  );
}

function hasIncompleteTeams(teamsByDivision) {
  for (item of teamsByDivisionIterator(teamsByDivision)) {
    if (item.value) return true;
  }
  return false;
}
