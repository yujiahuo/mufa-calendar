const TEST_TEAMS = {
  569: {
    6508: true, // Kirby's dreamland
  },
};

function test() {
  debugMode = true;
  excludePastEvents = false;
  updateCalendars(TEST_TEAMS);
}
