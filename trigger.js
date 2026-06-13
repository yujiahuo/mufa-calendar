// Called whenever we run into google's limit on calendar/event creation
function createOneTimeTrigger(action) {
  return; // Not done implementing

  if (CREATED_ONE_TIME_TRIGGER) return; // Only ever do this once

  // Get the current time and add 15 minutes
  var timeToRun = new Date();
  timeToRun.setTime(timeToRun.getTime() + 15 * 60 * 1000);

  // Create the trigger for your target function
  ScriptApp.newTrigger("yourTargetFunctionName")
    .timeBased()
    .at(timeToRun)
    .create();
}
