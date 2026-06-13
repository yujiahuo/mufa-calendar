async function updateCalendars() {
  const scriptStartTime = new Date().getTime();
  const resultsByTeamAndDivision = [];

  let hasError = false;
  let calendarCount = 0;
  let currentTime;
  let elapsedTime;

  for (const [divisionId, teamList] of Object.entries(teamsByDivision)) {
    resultsByTeamAndDivision[divisionId] = {};
    for (const teamId of teamList) {
      const errors = new Set();
      calendarCount++;
      try {
        updateCalendarEventsForTeam(teamId, divisionId, errors);
      } catch (e) {
        errors.add("Hit catch block with error: " + e);
      }
      if (errors.size > 0) {
        hasError = true;
        resultsByTeamAndDivision[divisionId][teamId] = errors;
      } else {
        resultsByTeamAndDivision[divisionId][teamId] = ["Success"]; // Array so that we can just loop through success and errors the same way
      }

      console.log("Calendars processed: " + calendarCount);
      currentTime = new Date().getTime();
      elapsedTime = currentTime - scriptStartTime;
      if (elapsedTime > MAX_RUNTIME_MS) {
        hasErrors = true;
        errors.add("Reached max runtime");
        break;
      }

      Utilities.sleep(2 * 1000); // Throttle so we don't make mufa's website angry
    }
  }

  const elapsedMinutes = Math.round((elapsedTime / 60000) * 10) / 10;
  console.log(`Elapsed time: ${elapsedMinutes} mins`);

  if (hasError) {
    notifyOfResultsWithErrors(resultsByTeamAndDivision, teamsByDivision);
  } else {
    notifyOfSuccess();
  }
}

function updateCalendarEventsForTeam(teamId, divisionId, errors) {
  var gameEvents = getEventsFromPageViaTable(errors);

  if (errors.length > 0) {
    return;
  }

  var calendar = getCalendarToEdit(myTeamName);

  if (calendar) {
    gameEvents.forEach(function (eventData) {
      var now = new Date();

      if (eventData.startTime < now) {
        return; // Don't touch past events
      }

      updateEventWithRetry(calendar, eventData);
    });
  } else {
    errors.add("Failed to create calendar");
    return;
  }
}

function getCalendarToEdit(teamName) {
  const calendarName = `${teamName} - MUFA 2026 summer`;
  let calendar = CalendarApp.getCalendarsByName(calendarName);
  if (calendar?.length > 0) {
    return calendar[0];
  }

  calendar = createCalendarWithRetry(calendarName);
  return calendar;
}

// There is also a quota for calendar/event update but I don't know what it is.
function updateEventWithRetry(calendar, eventData) {
  // Check if event already exists
  var existingEvents = calendar.getEvents(
    eventData.startTime,
    eventData.endTime,
    { search: "MUFA game" }
  );

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (existingEvents.length > 0) {
        updateExistingEvent(eventData, existingEvents);
      } else {
        createNewEvent(calendar, eventData);
      }
      return; // Success, exit function
    } catch (e) {
      if (i === maxRetries - 1) throw e; // Last retry failed, throw error
      var waitTime = 2 * 1000; // Just wait 2 seconds every time
      Utilities.sleep(waitTime);
    }
  }
  createOneTimeTrigger();
}

function updateExistingEvent(newEvent, existingEvents) {
  if (existingEvents.length === 1) {
    const event = existingEvents[0];
    if (event.getTitle() !== newEvent.title) event.setTitle(newEvent.title);
    if (
      event.getStartTime() !== newEvent.startTime ||
      event.getEndTime() !== newEvent.endTime
    )
      event.setTime(newEvent.startTime, newEvent.endTime);
    if (event.getLocation() !== newEvent.location)
      event.setLocation(newEvent.location);
    event.setDescription(newEvent.description); // Always set description since it contains the last updated timestamp
  }
}

function createNewEvent(calendar, eventData) {
  calendar.createEvent(
    eventData.title,
    eventData.startTime,
    eventData.endTime,
    {
      location: eventData.location,
      description: eventData.description,
    }
  );
}
