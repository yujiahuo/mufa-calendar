function validateGameEvents(gameEvents, errors) {
  for (const event of gameEvents) {
    if (!event.title) {
      errors.add("No event title");
    }
    if (!event.startTime) {
      errors.add("No start time");
    }
    if (!event.endTime) {
      errors.add("No end time");
    }
    if (!event.location) {
      errors.add("No location");
    }
    if (!event.description) {
      errors.add("No description");
    }
  }
}

function notifyOfSuccess() {
  //MailApp.sendEmail(MY_EMAIL, "MUFA calendar ran successfully", "Yay good job");
}

function notifyOfResultsWithErrors(resultsDictionary, teamsByDivision) {
  let message = "Well something went wrong. Here's what:\n\n";

  message = message.concat(
    `Target teams: ${JSON.stringify(teamsByDivision)}\n\n`
  );

  for (const [divisionId, teamResultList] of Object.entries(
    resultsDictionary
  )) {
    for (const [teamId, result] of Object.entries(teamResultList)) {
      message = message.concat(`Team: ${teamId}, Division: ${divisionId}\n`);
      result.forEach((e) => {
        message = message.concat(`- ${e} \n`);
      });
    }
  }

  console.log(message);
  //MailApp.sendEmail(MY_EMAIL, "MUFA calendar ran with errors", message);
}
