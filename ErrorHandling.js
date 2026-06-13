/*
Error {
  teamId: string,
  divisionId: string,
  teamName: string,
  message: string,
}

*/

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

function addError(teamId, divisionId, teamName, message, errors) {
  console.log(`Added error: ${teamId} - ${message}`);

  const error = {
    teamId: teamId,
    divisionId: divisionId,
    teamName: teamName,
    message: message,
  };
  errors.add(error);
}

function notifyOfUpdateSuccessful() {
  //MailApp.sendEmail(MY_EMAIL, "MUFA calendar update ran successfully", "Yay good job");
}

function notifyOfUpdateWithErrors(resultsDictionary, teamsByDivision) {
  let message =
    "Well something went wrong with the update script. Here's what:\n\n";

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
  //MailApp.sendEmail(MY_EMAIL, "MUFA calendar update ran with errors", message);
}

function notifyOfCreateWithErrors() {
  console.log("Calendar creation didn't finish");
  //MailApp.sendEmail(MY_EMAIL, "MUFA calendar creation ran with errors", "Retrying again in an hour");
}
