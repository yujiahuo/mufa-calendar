function deleteCalendars() {
  const allCalendars = CalendarApp.getAllCalendars();
  allCalendars.forEach((calendar) => {
    try {
      calendar.deleteCalendar();
    } catch {
      console.log("Didn't delete " + calendar.getName());
    }
  });
}
