// Called whenever we run into google's limit on calendar/event creation
function createOneTimeTrigger(functionName, params, delayInMinutes) {
  if (CREATED_ONE_TIME_TRIGGER) return; // Protection against creating multiple triggers in one session
  CREATED_ONE_TIME_TRIGGER = true;

  // Get the current time and add the delay
  let timeToRun = new Date();
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
    JSON.stringify(params)
  );
}

function deleteTriggerById(id) {
  const allTriggers = ScriptApp.getProjectTriggers();

  // Loop through all project triggers to find the matching ID
  for (let i = 0; i < allTriggers.length; i++) {
    if (allTriggers[i].getUniqueId() === id) {
      ScriptApp.deleteTrigger(allTriggers[i]);
      break;
    }
  }
}
