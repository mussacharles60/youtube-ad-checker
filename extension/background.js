let interval = null;
let isTabActive = true;

const run = () => {
  console.log('[YT-DIALOG-CHECKER]: is starting...');

  // const isYT = () => {
  //   return (
  //     window.location.hostname === 'www.youtube.com' ||
  //     window.location.hostname === 'youtu.be'
  //   );
  // };

  // const isYTActive = () => {
  //   return document.hasFocus();
  // };

  const doAThing = () => {
    console.log('[YT-DIALOG-CHECKER]: starting a job');
    stop();
    interval = setInterval(task, 5000);
  };

  // const task = () => {
  //   const vid = document.querySelector('video');
  //   if (vid) {
  //     const els = document.getElementsByTagName('tp-yt-paper-dialog');
  //     if (els.length > 0) {
  //       for (let i = 0; i < els.length; i++) {
  //         const el = els[i];
  //         const lookupText = 'Ad blockers are not allowed on YouTube';
  //         if (el.outerHTML.includes(lookupText)) {
  //           if (el.style.display !== 'none') {
  //             console.log('YT: found el: remove now...');
  //             // el.remove();
  //             el.style.display = 'none';
  //             const overlay = document.querySelector(
  //               'tp-yt-iron-overlay-backdrop'
  //             );
  //             if (overlay && overlay.style.display !== 'none') {
  //               // overlay.remove();
  //               overlay.style.display = 'none';
  //             }
  //             const vid = document.querySelector('video');
  //             if (vid && vid.paused) {
  //               console.log('YT: vid el: resume now...');
  //               vid.play();
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // };

  const task = () => {
    console.log('[YT-DIALOG-CHECKER]: task: called');
    chrome.tabs.query(
      { active: true, /*currentWindow: true*/ lastFocusedWindow: true },
      (tabs) => {
        console.log('[YT-DIALOG-CHECKER]: tabs:', tabs);
        if (tabs.length > 0) {
          const tab = tabs[0];
          sendTask(tab);
        }
      }
    );
  };

  const sendTask = (tab) => {
    console.log('[YT-DIALOG-CHECKER]: sendTask: tab', tab);
    if (
      tab &&
      tab.url &&
      (tab.url.includes('www.youtube.com') || tab.url.includes('youtu.be')) &&
      isTabActive
    ) {
      console.log(
        '[YT-DIALOG-CHECKER]: sendTask: found a matching site: send a task now...'
      );
      chrome.tabs.sendMessage(tab.id, { action: 'doATask' });
    }
  };

  // // Check conditions when the content script is loaded
  // if (isYT() && isYTActive()) {
  //   doAThing();
  // } else {
  //   console.log('[YT-DIALOG-CHECKER]: not a YT site');
  //   stop();
  // }

  doAThing();
};

const stop = () => {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
};

// auto start the script job
run();

// Listen for future tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('[YT-DIALOG-CHECKER]: chrome.tabs.onUpdated: tabId:', tabId);
  console.log(
    '[YT-DIALOG-CHECKER]: chrome.tabs.onUpdated: changeInfo:',
    changeInfo
  );
  console.log('[YT-DIALOG-CHECKER]: chrome.tabs.onUpdated: tab:', tab);
  if (changeInfo.status === 'complete') {
    console.log('[YT-DIALOG-CHECKER]: chrome.tabs.onUpdated: status: complete');
    run();
  }
});

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(function (activeInfo) {
  console.log(
    '[YT-DIALOG-CHECKER]: chrome.tabs.onActivated: activeInfo:',
    activeInfo
  );
  // Check if the current tab is active
  // isTabActive = activeInfo.tabId === chrome.tabs.TAB_ID_NONE ? false : true;
  isTabActive = activeInfo.tabId !== chrome.tabs.TAB_ID_NONE;
  // Clear the interval if the tab is not active
  if (!isTabActive) {
    stop();
    // console.log('Interval stopped because the tab is no longer active.');
  } else {
    run();
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  console.log(
    '[YT-DIALOG-CHECKER]: chrome.webNavigation.onCompleted: details:',
    details
  );
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log(
      '[YT-DIALOG-CHECKER]: chrome.webNavigation.onCompleted: tabs:',
      tabs
    );
    if (tabs.length > 0) {
      const tab = tabs[0];
      if (tab) {
        console.log(
          '[YT-DIALOG-CHECKER]: chrome.webNavigation.onCompleted: tab.utl:',
          tab.url
        );
      }
    }
  });
});

chrome.runtime.onInstalled.addListener(async () => {
  console.log('[YT-DIALOG-CHECKER]: chrome.runtime.onInstalled: called');
  run();
});
