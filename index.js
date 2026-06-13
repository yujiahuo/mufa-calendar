async function main(){
  const scriptStartTime = new Date().getTime();
  const MAX_RUNTIME_MS = 5 * 60 * 1000; // App scripts have a max runtime of 6 min. Stop at 5.

  const resultsByTeamAndDivision = [];
  const teamsByDivision = {
    554: [6371, 6419, 6376, 6365, 6380, 6359, 6372, 6374, 6394, 6378, 6442, 6363, 6401, 6383, 6405, 6414, 6356, 6395, 6400, 6406, 6412, 6381, 6417, 6379, 6410, 6386, 6413, 6454, 6366, 6387, 6393, 6436, 6458, 6399, 6443, 6373, 6420, 6449]
  };

  let hasError = false;
  let calendarCount = 0;
  let currentTime;
  let elapsedTime;


  for (const [divisionId, teamList] of Object.entries(teamsByDivision)){
    resultsByTeamAndDivision[divisionId] = {};
    for (const teamId of teamList){
      const errors = new Set();
      calendarCount++;
      try {
        setEventsForTeam(teamId, divisionId, errors);
      }
      catch(e) {
        errors.add("Hit catch block with error: " + e)
      }
      if (errors.size > 0){
        hasError = true;
        resultsByTeamAndDivision[divisionId][teamId] = errors;
      }
      else {
        resultsByTeamAndDivision[divisionId][teamId] = ["Success"]; // Array so that we can just loop through success and errors the same way
      }

      console.log("Calendars processed: " + calendarCount);
      currentTime = new Date().getTime();
      elapsedTime = currentTime - scriptStartTime;
      if (elapsedTime > MAX_RUNTIME_MS) {
        hasErrors = true;
        errors.add("Reached max runtime");
        break;
      }

      Utilities.sleep(2 * 1000); // Throttle so we don't make mufa's website angry
    }
  }

  const elapsedMinutes = Math.round((elapsedTime / 60000) * 10) / 10;
  console.log(`Elapsed time: ${elapsedMinutes} mins`);

  if (hasError){
    notifyOfResultsWithErrors(resultsByTeamAndDivision, teamsByDivision);
  }
  else {
    notifyOfSuccess();
  }
}

// Called whenever we run into google's limit on calendar/event creation
function createOneTimeTrigger() {
  return; // Not done implementing

  if (CREATED_ONE_TIME_TRIGGER) return; // Only ever do this once

  // Get the current time and add 15 minutes
  var timeToRun = new Date();
  timeToRun.setTime(timeToRun.getTime() + 15 * 60 * 1000); 
  
  // Create the trigger for your target function
  ScriptApp.newTrigger('yourTargetFunctionName')
    .timeBased()
    .at(timeToRun)
    .create();
}