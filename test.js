const TEST_TEAMS = {
  555: {
    6450: true, // Disc Jockeys (bye 6/1)
  },
  554: {
    6372: true, // Disc Don't Lie (cancellation 6/11)
  },
};

function test() {
  debugMode = true;
  excludePastEvents = false;
  updateCalendars(TEST_TEAMS);
}
