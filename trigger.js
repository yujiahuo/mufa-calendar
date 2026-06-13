// Called whenever we run into google's limit on calendar/event creation
function createOneTimeTrigger(functionName) {
  if (CREATED_ONE_TIME_TRIGGER) return; // Protection against creating multiple triggers in one session
  CREATED_ONE_TIME_TRIGGER = true;

  // Get the current time and add 60 minutes
  var timeToRun = new Date();
  timeToRun.setTime(timeToRun.getTime() + 60 * 60 * 1000);

  // Create the trigger for your target function
  ScriptApp.newTrigger(functionName).timeBased().at(timeToRun).create();
}
