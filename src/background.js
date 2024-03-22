chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("reminder-")) {
    const reminderId = alarm.name.split("-")[1];
    const reminder = getReminderById(reminderId);
    if (reminder) {
      displayReminderNotification(reminder);
    }
  }
});

function getReminderById(id) {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  return reminders.find((reminder) => reminder.id === id);
}

function displayReminderNotification(reminder) {
  const notificationOptions = {
    type: "basic",
    title: "Reminder",
    message: reminder.name,
    iconUrl: "reminder.png", 
  };

  chrome.notifications.create(notificationOptions);
}


function setReminderAlarms() {
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach((reminder) => {
    const { id, remindAt } = reminder;
    const remindAtTime = new Date(remindAt).getTime();
    const currentTime = Date.now();
    if (remindAtTime > currentTime) {
      const alarmTimeInMilliseconds = remindAtTime - currentTime;
      chrome.alarms.create(`reminder-${id}`, {
        when: currentTime + alarmTimeInMilliseconds,
      });
    }
  });
}


chrome.alarms.clearAll();


setReminderAlarms();
