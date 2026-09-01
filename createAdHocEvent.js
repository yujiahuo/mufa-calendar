function createAdHocEvent() {
  const eventData = {
    title: "MUFA finals party at Warner Park",
    startTime: new Date("8/18/2026, 6:00 PM"),
    endTime: new Date("8/18/2026, 9:00 PM"),
    location: "43.12976, -89.36630",
    description:
      "MUFA summer league finals party. Food from Blue Plate Catering. BYOB. Guests can attend for free but must purchase a $20 wristband if they want food/drink.\n\n MW championship - 6:00pm\n TR Championship - 7:30pm",
  };

  const allCalendars = CalendarApp.getAllCalendars();

  allCalendars.forEach((calendar) => {
    try {
      calendar.createEvent(
        eventData.title,
        eventData.startTime,
        eventData.endTime,
        {
          location: eventData.location,
          description: eventData.description,
        },
      );
    } catch {
      console.log("Couldn't update something");
    }
  });
}
