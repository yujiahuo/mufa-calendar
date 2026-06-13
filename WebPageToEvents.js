// Takes html content and returns a list of Calendar events with data pulled from the page
function getEventsFromPageViaTable(myTeamOut, errors) {
  var response = UrlFetchApp.fetch(
    "https://mufa.org/League/Division/Team.aspx?t=" +
      teamId +
      "&d=" +
      divisionId
  );
  var htmlContent = response.getContentText();

  if (!htmlContent) {
    errors.add("No html found");
    return [];
  }

  myTeamOut = getTeamNameFromPage(htmlContent);

  if (!myTeamOut) {
    errors.add("Unable to get team name");
    return [];
  }

  const events = [];

  // Get the table of games
  const tableMatch = htmlContent.match(TABLE_REGEX);

  if (!(tableMatch?.length > 1)) {
    errors.add("No table of games found");
    return [];
  }

  // Get all the rows, each row representing one game
  const rowMatchList = Array.from(tableMatch[1].matchAll(ROW_REGEX));

  if (!(rowMatchList?.length > 0)) {
    errors.add("No rows found in table");
    return [];
  }

  // Get events from each row
  for (const rowMatch of rowMatchList) {
    if (rowMatch.length > 1) {
      const rowHtml = rowMatch[1];

      const startTimeString = getCellContent(rowHtml, 3);
      if (!startTimeString) errors.add("Unable to extract start time");
      const startTime = getStartTime(startTimeString);

      const opponentWithWinHistory = getCellContent(rowHtml, -3);
      if (!opponentWithWinHistory)
        errors.add("Unable to extract opponent info");

      const fieldString = getCellContent(rowHtml, 5);
      if (!fieldString) errors.add("Unable to extract field info");
      const field = fieldString.replace("(Map)(Diagram)", "").trim();

      const ourJersey = getCellContent(rowHtml, 4);
      if (!ourJersey) errors.add("Unable to extract my team jersey");
      const theirJersey = getCellContent(rowHtml, -1);
      if (!theirJersey) errors.add("Unable to extract opponent team jersey");

      const diagramAnchor = getDiagramAnchor(rowHtml);

      events.push({
        title: getTitle(opponentWithWinHistory),
        startTime: startTime,
        endTime: getEndTime(startTime),
        location: getAddressFromParkName(field),
        description: getDescription(
          ourJersey,
          theirJersey,
          field,
          diagramAnchor
        ),
      });
    }
  }

  validateGameEvents(events, errors);
  if (errors?.length > 0) {
    return [];
  }
  return events;
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
  var response = UrlFetchApp.fetch(
    "https://mufa.org/League/Division/Team.aspx?t=" +
      teamId +
      "&d=" +
      divisionId
  );
  var htmlContent = response.getContentText();
  return getTeamNameFromPage(htmlContent);
}
