// function createCalendars() {
//   const scriptStartTime = new Date().getTime();
//   const errors = new Set();

//   for (const [divisionId, teamList] of Object.entries(TEAMS_BY_DIVISION)) {
//     for (const teamId of teamList) {
//       const teamName = getTeamName(teamId, divisionId);
//       const calendarName = getCalendarName(teamName);

//       try {
//         // Check if the calendar exists already
//         let calendar = CalendarApp.getCalendarsByName(calendarName);
//         if (calendar?.length > 0) {
//           console.log(`${calendarName} already exits`);
//         } else {
//           createCalendarWithRetry(teamId, divisionId, calendarName, resultsByTeamAndDivision);
//           console.log(`Created calendar: ${calendarName}`);
//         }
//       } catch (e) {
//         errors.add(`Error while creating calendar: ${e}`);
//       } finally {
//         currentTime = new Date().getTime();
//         elapsedTime = currentTime - scriptStartTime;
//         if (elapsedTime > MAX_RUNTIME_MS) {
//           errors.add("Reached max runtime");
//           break;
//         }
//         Utilities.sleep(2 * 1000); // Throttle so we don't make mufa's website angry
//       }
//     }
//   }

//   if (errors) {
//     createOneTimeTrigger("createCalendars");
//   }
// }

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
      var waitTime = 2 * 1000; // Just wait 2 seconds every time
      Utilities.sleep(waitTime);
    }
  }
  createOneTimeTrigger("create");
  return null;
}
