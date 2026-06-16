function getCalendarName(teamName) {
  if (!teamName) return "";
  return `${teamName} - MUFA 2026 summer`;
}

function getTitle(opponent) {
  if (!opponent) return "";
  return "MUFA game vs. " + opponent;
}

function getStartTime(timeString) {
  if (!timeString) return "";
  return new Date(timeString);
}

function getEndTime(startTime) {
  if (!startTime) return "";
  return new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000);
}

function getAddressFromParkName(field) {
  if (!(field?.length > 0)) return "";

  const match = field.match(/(.*)\s.$/); // Fields at a park are indicated by a single number or letter
  if (!match || match.length < 2) return field;

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

function getRandomByeMessage() {
  const messages = [
    "It might sound crazy but it ain't no lie, you have a bye, bye, bye.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomCancellationMessage() {
  const messages = [
    "Aw, sorry, no fun for you today. You can stare longingly out the window or maybe go to the Dane with your friends.",
    "If you were unsatisfied with today's weather, you may file a formal complaint by shaking your fist and yelling at a cloud.",
    "The fields are feeling vulnerable today and need some personal time off.",
    "Just think of this as the day you would have been injured, but due to a miraculous cancellation, you'll be ok.",
    "At least you won't be dropping any pulls today.",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function getStringDescription(message) {
  const lastUpdated = getLastUpdatedDateString();
  let description = message;
  description = description + "\n\n" + `(Last updated ${lastUpdated})`;
  return description;
}

function getDescription(ourJersey, theirJersey, field, diagramAnchor) {
  const lastUpdated = getLastUpdatedDateString();
  let description = "";

  if (field) {
    const diagram = diagramAnchor ?? "no diagram";
    description = description + "\n" + `Field: ${field} (${diagram})`;
  }
  if (ourJersey) {
    description = description + "\n" + `Our color: ${ourJersey}`;
  }
  if (theirJersey) {
    description = description + "\n" + `Their color: ${theirJersey}`;
  }

  description = description + "\n\n" + `(Last updated ${lastUpdated})`;
  return description;
}

function getLastUpdatedDateString() {
  const now = new Date();
  const lastUpdated = now.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return lastUpdated;
}
