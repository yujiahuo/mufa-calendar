// Called whenever we run into google's limit on calendar/event creation
function createOneTimeTrigger(functionName, teamsByDivision, delayInMinutes) {
  if (CREATED_ONE_TIME_TRIGGER) return; // Protection against creating multiple triggers in one session
  CREATED_ONE_TIME_TRIGGER = true;

  // Get the current time and add the delay
  var timeToRun = new Date();
  timeToRun.setTime(timeToRun.getTime() + +delayInMinutes * 60 * 1000);

  // Create the trigger for your target function
  const trigger = ScriptApp.newTrigger(functionName)
    .timeBased()
    .at(timeToRun)
    .create();

  const triggerUid = trigger.getUniqueId();

  // Set the remaining teams to process
  PropertiesService.getScriptProperties().setProperty(
    triggerUid,
    JSON.stringify(teamsByDivision)
  );
}
