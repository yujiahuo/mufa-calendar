function* teamsByDivisionIterator(teamsByDivision) {
  for (const [divisionId, teams] of Object.entries(teamsByDivision)) {
    for (const [teamId, value] of Object.entries(teams)) {
      yield { divisionId, teamId, value };
    }
  }
}
