function getCalendarName(teamName) {
  return `${teamName} - MUFA 2026 summer`;
}

function getTitle(opponent) {
  if (!opponent) return null;
  return "MUFA game vs. " + opponent;
}

function getStartTime(timeString) {
  if (!timeString) return null;
  return new Date(timeString);
}

function getEndTime(startTime) {
  if (!startTime) return "";
  return new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000);
}

function getAddressFromParkName(field) {
  if (!(field?.length > 0)) return;

  const match = field.match(/(.*)\s.$/); // Gields at a park are indicated by a single number or letter
  const cleanName = match[1] ?? field;

  switch (cleanName) {
    case "Glacier":
      return "Glacier Hill Park, 1037 Bultman Rd, Madison, WI 53704";
    case "Olin":
      return "Olin Park, 202 E Lakeside St, Madison, WI 53715, USA";
    case "Manchester":
      return "Manchester Park, 3238 Manchester Rd, Madison, WI 53719";
    case "Midtown":
      return "Midtown Commons Park, 1310 Waldorf Blvd, Madison, WI 53719";
    case "Northstar":
      return "North Star Park, 502 North Star Dr, Madison, WI 53718";
    case "Stoner Prairie":
      return "Stoner Prairie Elementary School, 5830 Devoro Rd, Fitchburg, WI 53711";
    default:
      return cleanName;
  }
}

function getDescription(ourJersey, theirJersey, field, diagramAnchor) {
  let now = new Date();
  let lastUpdated = now.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let description = `
    Field: ${field} (${diagramAnchor})
    Our color: ${ourJersey}
    Their color: ${theirJersey}

    (Last updated ${lastUpdated})
  `;

  return description;
}
