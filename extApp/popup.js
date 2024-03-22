document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('setReminder').addEventListener('click', function() {
    var reminder = document.getElementById('reminder').value;
    var datetime = new Date(document.getElementById('datetime').value).getTime();
    var repeat = document.getElementById('repeat').value;
    var now = Date.now();

    if (datetime > now) {
      var delayInMinutes = (datetime - now) / (1000 * 60);
      var periodInMinutes;

      if (repeat === 'daily') {
        periodInMinutes = 24 * 60; 
      } else if (repeat === 'weekly') {
        periodInMinutes = 7 * 24 * 60; 
      } else if (repeat === 'monthly') {
        periodInMinutes = 30 * 24 * 60; 
      } else {
        periodInMinutes = null; 
      }

      chrome.alarms.create(reminder, { delayInMinutes: delayInMinutes, periodInMinutes: periodInMinutes });
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Reminder Set',
        message: 'Your reminder has been set.',
        requireInteraction: true
      });
    } else {
      alert("Please select a future time for the reminder.");
    }
  });
});
