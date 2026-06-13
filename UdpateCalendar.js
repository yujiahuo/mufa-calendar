function setEventsForTeam(teamId, divisionId, errors) {
  var response = UrlFetchApp.fetch("https://mufa.org/League/Division/Team.aspx?t=" + teamId + "&d=" + divisionId);
  var teamWebPage = response.getContentText();

  if (!teamWebPage) {
    errors.add("No html found");
    return;
  }

  var myTeamName = getTeamNameFromPage(teamWebPage, errors);

  if (errors.length > 0){
    return;
  }

  var gameEvents = getEventsFromPageViaTable(teamWebPage, myTeamName, errors);

  if (errors.length > 0){
    return;
  }

  var calendar = getCalendarToEdit(myTeamName);

  if (calendar){
    gameEvents.forEach(function(eventData) {
      var now = new Date();

      if (eventData.startTime < now){
        return; // Don't touch past events
      }

      updateEventWithRetry(calendar, eventData)
    }); 
  }
  else {
    errors.add("Failed to create calendar");
    return;
  }
}

function getCalendarToEdit(teamName){
  const calendarName = `${teamName} - MUFA 2026 summer`;
  let calendar = CalendarApp.getCalendarsByName(calendarName);
  if (calendar?.length > 0){
    return calendar[0];
  }
  
  const accessRule = {
    role: 'reader', // 'reader' allows public viewing of event details
    scope: {
      type: 'default' // 'default' represents the public
    }
  };

  calendar = createCalendarWithRetry(calendarName);
  Calendar.Acl.insert(accessRule, calendar?.getId());
  return calendar;
}

// Calendar has a limit on how often you can create calendars and events
// After making 60 calendars, it may need several hours to replenish.
// https://knowledge.workspace.google.com/admin/calendar/avoid-calendar-use-limits
function createCalendarWithRetry(calendarName){
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      calendar = CalendarApp.createCalendar(calendarName);
      return calendar; // Success, exit function
    } catch (e) {
      if (i === maxRetries - 1) throw e; // Last retry failed, throw error
      var waitTime = 2 * 1000; // Just wait 2 seconds every time
      Utilities.sleep(waitTime);
    }
  }
  createOneTimeTrigger();
  return null;
}

// There is also a quota for calendar/event update but I don't know what it is.
function updateEventWithRetry(calendar, eventData){
  // Check if event already exists
  var existingEvents = calendar.getEvents(eventData.startTime, eventData.endTime, {search: "MUFA game"});

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (existingEvents.length > 0) {
        updateExistingEvent(eventData, existingEvents);
      }
      else {
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

function updateExistingEvent(newEvent, existingEvents){
  if (existingEvents.length === 1){
    const event = existingEvents[0];
    if (event.getTitle() !== newEvent.title) event.setTitle(newEvent.title);
    if (event.getStartTime() !== newEvent.startTime || event.getEndTime() !== newEvent.endTime) event.setTime(newEvent.startTime, newEvent.endTime);
    if (event.getLocation() !== newEvent.location) event.setLocation(newEvent.location);
    event.setDescription(newEvent.description); // Always set description since it contains the last updated timestamp
  }
}

function createNewEvent(calendar, eventData){
  calendar.createEvent(eventData.title, eventData.startTime, eventData.endTime, {
    location: eventData.location,
    description: eventData.description
  });
}
