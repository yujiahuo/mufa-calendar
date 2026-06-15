// Calendar has a limit on how often you can create calendars and events
// After making 60 calendars, it may need several hours to replenish.
// https://knowledge.workspace.google.com/admin/calendar/avoid-calendar-use-limits
function createCalendarWithRetry(
  teamId,
  divisionId,
  calendarName,
  resultsByTeamAndDivision
) {
  const accessRule = {
    role: "reader", // 'reader' allows public viewing of event details
    scope: {
      type: "default", // 'default' represents the public
    },
  };
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      calendar = CalendarApp.createCalendar(calendarName);
      Calendar.Acl.insert(accessRule, calendar?.getId());
      resultsByTeamAndDivision.addLog(
        teamId,
        divisionId,
        `Calendar created (${calendarName})`
      );
      return calendar; // Success, exit function
    } catch (e) {
      if (i === maxRetries - 1) throw e; // Last retry failed, throw error
      let waitTime = 2 * 1000; // Just wait 2 seconds every time
      Utilities.sleep(waitTime);
    }
  }
  createOneTimeTrigger("create");
  return null;
}
