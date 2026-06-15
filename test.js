function test() {
  console.log(TEAMS_BY_DIVISION);
  delete TEAMS_BY_DIVISION[554][6371];
  const stringified = JSON.stringify(TEAMS_BY_DIVISION);
  console.log(`stringified: ${stringified}`);
  const unstringified = JSON.parse(stringified);
  console.log(`unstringified: ${unstringified}`);
  console.log(unstringified[554][6372]);
  console.log(unstringified[554][6371]);
}
