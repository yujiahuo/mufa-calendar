const TEST_TEAMS = {
  555: {
    6450: true,
  },
};

function test() {
  const results = new ResultsByTeamAndDivision();
  results.hasErrors = true;
  results.results = [
    new Result(1, 2, "log", "mmm"),
    new Result(2, 2, "log", "qqqq"),
    new Result(3, 2, "error", "fwefwef"),
    new Result(4, 2, "log", "wwww"),
    new Result(5, 2, "error", "aaaaa"),
    new Result(6, 3, "log", "aaaa"),
    new Result(7, 2, "log", "fff"),
    new Result(8, 2, "log", "fwef"),
  ];

  console.log(getEmailBodyFromResults(results));
}
