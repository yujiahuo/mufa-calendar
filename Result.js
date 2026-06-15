class Result {
  constructor(teamId, divisionId, type, message) {
    (this.teamId = teamId),
      (this.divisionId = divisionId),
      (this.type = type),
      (this.message = message);
  }
}

class ResultsByTeamAndDivision {
  constructor() {
    (this.hasErrors = false),
      (this.hasFatalErrors = false),
      (this.results = []);
  }

  addLog(teamId, divisionId, message) {
    console.log(`Added log: ${divisionId}-${teamId} - ${message}`);
    const result = new Result(teamId, divisionId, "log", message);
    this.results.push(result);
  }

  addError(teamId, divisionId, message) {
    console.log(`Added error: ${divisionId}-${teamId} - ${message}`);
    const result = new Result(teamId, divisionId, "error", message);
    this.results.push(result);
    this.hasErrors = true;
  }

  addFatalError(teamId, divisionId, message) {
    console.log(`Added fatal error: ${divisionId}-${teamId} - ${message}`);
    const result = new Result(teamId, divisionId, "error", message);
    this.results.push(result);
    this.hasErrors = true;
    this.hasFatalErrors = true;
  }
}
