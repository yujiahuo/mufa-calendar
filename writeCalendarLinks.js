function writeCalendarLinks() {
  const calendarInfo = getMUFACalendarNamesAndLinks();
  const spreadsheet = SpreadsheetApp.create("MUFA calendar links");
  addRows(spreadsheet, calendarInfo);
  console.log("Ok I did it");
}

function getMUFACalendarNamesAndLinks() {
  const allCalendars = CalendarApp.getAllCalendars();
  const calendarInfo = [];

  for (const calendar of allCalendars) {
    const calendarName = calendar.getName();
    if (calendarName.includes("MUFA")) {
      const calendarId = calendar.getId();
      const encodedId = encodeURIComponent(calendarId);
      const url = "https://calendar.google.com/calendar/u/0?cid=" + encodedId;
      calendarInfo.push({
        name: calendarName,
        url: url,
      });
    }
  }

  return calendarInfo;
}

function addRows(spreadsheet, calendarInfo) {
  const sheet = spreadsheet.getSheets()[0];

  for (let i = 0; i < calendarInfo.length; i++) {
    const cellLink = getCellRichTextLink(
      calendarInfo[i]?.name,
      calendarInfo[i]?.url
    );
    const targetRange = sheet.getRange("A" + (i + 1));
    targetRange.setRichTextValue(cellContent);
  }
}

function getCellRichTextLink(name, url) {
  return SpreadsheetApp.newRichTextValue()
    .setText(name)
    .setLinkUrl(url)
    .build();
}
