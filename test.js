const TEST_TEAMS = {
  555: {
    6450: true, // Disc Jockeys (bye)
  },
  554: {
    6372: true, // Disc Don't Lie (cancellation)
  },
};

function test() {
  debugMode = true;
  excludePastEvents = false;
  updateCalendars(TEST_TEAMS);
}
