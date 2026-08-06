// Takes html content and returns a list of Calendar events with data pulled from the page
function getEventsFromPageViaTable(
  teamId,
  divisionId,
  resultsByTeamAndDivision,
) {
  let response = UrlFetchApp.fetch(
    "https://mufa.org/League/Division/Team.aspx?t=" +
      teamId +
      "&d=" +
      divisionId,
  );
  let htmlContent = response.getContentText();

  if (!htmlContent) {
    resultsByTeamAndDivision.addError(teamId, divisionId, "No html found");
    return [null, null];
  }

  let myTeamName = getTeamNameFromPage(htmlContent);

  if (!myTeamName) {
    resultsByTeamAndDivision.addError(
      teamId,
      divisionId,
      "Unable to get team name",
    );
    return [null, null];
  }

  const events = [];

  // Get the table of games
  const tableMatchList = Array.from(htmlContent.matchAll(TABLE_REGEX));

  if (!(tableMatchList?.length > 0)) {
    resultsByTeamAndDivision.addError(
      teamId,
      divisionId,
      "No table of games found",
    );
    return [null, null];
  }

  // Get all the rows, each row representing one game
  const rowMatchList = [];

  for (const tableMatch of tableMatchList) {
    rowMatchList.push(...(Array.from(tableMatch[1].matchAll(ROW_REGEX)) ?? []));
  }

  if (!(rowMatchList?.length > 0)) {
    resultsByTeamAndDivision.addError(
      teamId,
      divisionId,
      "No rows found in table",
    );
    return [null, null];
  }

  // Get events from each row
  for (const rowMatch of rowMatchList) {
    if (rowMatch.length > 1) {
      const rowHtml = rowMatch[1];
      let isBye = false;
      let isCancelled = false;

      // Time
      const startTimeString = getCellContent(rowHtml, 3);
      if (!startTimeString)
        resultsByTeamAndDivision.addError(
          teamId,
          divisionId,
          "Unable to extract start time",
        );
      const startTime = getStartTime(startTimeString);

      // Opponent
      const opponentWithWinHistory = getCellContent(rowHtml, -3);
      if (!opponentWithWinHistory)
        resultsByTeamAndDivision.addError(
          teamId,
          divisionId,
          "Unable to extract opponent info",
        );

      // Field
      const fieldString = getCellContent(rowHtml, 5);
      if (!fieldString) {
        resultsByTeamAndDivision.addError(
          teamId,
          divisionId,
          "Unable to extract field info",
        );
      } else if (fieldString.includes("BYE/")) {
        isBye = true;
      }
      const field = fieldString.replace("(Map)(Diagram)", "").trim();

      // Check for cancellation
      const gameResultString = getCellContent(rowHtml, 6);
      if (gameResultString === "CO") isCancelled = true;

      // Our jersey color
      const ourJersey = getCellContent(rowHtml, 4);
      if (!ourJersey)
        resultsByTeamAndDivision.addError(
          teamId,
          divisionId,
          "Unable to extract my team jersey",
        );

      // Their jersey color
      const theirJersey = getCellContent(rowHtml, -1);
      if (!theirJersey)
        resultsByTeamAndDivision.addError(
          teamId,
          divisionId,
          "Unable to extract opponent team jersey",
        );

      // Diagram link
      const diagramAnchor = getDiagramAnchor(rowHtml);

      // Create event
      if (isBye) {
        console.log(`Bye for ${divisionId} - ${teamId}`);
        events.push({
          title: "NO GAME (bye)",
          startTime: startTime,
          endTime: getEndTime(startTime),
          description: getStringDescription(getRandomByeMessage()),
        });
      } else if (isCancelled) {
        console.log(`Cancellation for ${divisionId} - ${teamId}`);
        events.push({
          title: "GAME CANCELLED",
          startTime: startTime,
          endTime: getEndTime(startTime),
          description: getStringDescription(getRandomCancellationMessage()),
        });
      } else {
        events.push({
          title: getTitle(opponentWithWinHistory),
          startTime: startTime,
          endTime: getEndTime(startTime),
          location: getAddressFromParkName(field),
          description: getDescription(
            ourJersey,
            theirJersey,
            field,
            diagramAnchor,
          ),
        });
      }
    }
  }

  return [myTeamName, events];
}

function getCellContent(tableHtml, colIndex) {
  const cells = Array.from(tableHtml.matchAll(CELL_REGEX));
  let cellMatch;
  if (colIndex > 0) {
    cellMatch = cells[colIndex];
  } else {
    cellMatch = cells[cells.length + colIndex]; // negative colIndex counts from the back
  }

  if (cellMatch) {
    return cellMatch[1].replace(/<[^>]*>/g, "").trim(); // Get rid of any other markup in the cell
  }

  return "";
}

function getDiagramAnchor(rowHtml) {
  const match = rowHtml.match(DIAGRAM_ANCHOR_REGEX);
  if (match?.length > 0) {
    return match[0];
  }
  return "";
}

function getTeamNameFromPage(htmlContent) {
  const match = htmlContent.match(TEAM_NAME_REGEX);
  if (match?.length > 1) {
    return match[1];
  }
  return "";
}

function getTeamName(teamId, divisionId) {
  let response = UrlFetchApp.fetch(
    "https://mufa.org/League/Division/Team.aspx?t=" +
      teamId +
      "&d=" +
      divisionId,
  );
  let htmlContent = response.getContentText();
  return getTeamNameFromPage(htmlContent)?.trim();
}
