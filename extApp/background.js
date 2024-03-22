chrome.alarms.onAlarm.addListener(function(alarm) {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Reminder',
      message: alarm.name,
      requireInteraction: true
    });
    
    chrome.tts.speak(alarm.name);
  });
  