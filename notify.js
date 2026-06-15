function getEmailBodyFromResults(resultsByTeamAndDivision) {
  let body = "";

  // Create hash table by teamId
  const resultsHash = {};
  for (const result in resultsByTeamAndDivision.results) {
    if (!teamId) continue;
    resultsHash[result.teamId] = resultsHash[result.teamId] ?? [];
    resultsHash[result.teamId].push(result);
  }

  // Go through hash and make email body
  for (const [teamId, resultList] of Object.entries(teamsByDivision)) {
    body = body + `Results for team ${teamId}:\n`;
    for (const result in resultList) {
      const line = results.type === "error" ? "- Error: " : "- ";
      line = line + result.message;
      body = body + `${line}\n`;
    }
  }
}

function notifyOfResults(resultsByTeamAndDivision) {
  console.log(
    `Notifying of results ${
      resultsByTeamAndDivision.hasErrors ? "with errors" : "with no errors"
    }`
  );

  const hasErrors = resultsByTeamAndDivision.hasErrors;
  const emailBody = getEmailBodyFromResults(resultsByTeamAndDivision);
  if (!debugMode) {
    MailApp.sendEmail(
      MY_EMAIL,
      hasErrors
        ? "MUFA calendar update ran with errors"
        : "Success! MUFA calendar update ran with no errors",
      emailBody
    );
  }
}
