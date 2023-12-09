const isYT = () => {
  return (
    window.location.hostname === 'www.youtube.com' ||
    window.location.hostname === 'youtu.be'
  );
};

const isYTActive = () => {
  return document.hasFocus();
};

const task = () => {
  if (isYT() && isYTActive()) {
    const vid = document.querySelector('video');
    if (vid) {
      const els = document.getElementsByTagName('tp-yt-paper-dialog');
      if (els.length > 0) {
        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          const lookupText = 'Ad blockers are not allowed on YouTube';
          if (el.outerHTML.includes(lookupText)) {
            if (el.style.display !== 'none') {
              console.log('[YT-DIALOG-CHECKER]: found el: remove now...');
              // el.remove();
              el.style.display = 'none';
              const overlay = document.querySelector(
                'tp-yt-iron-overlay-backdrop'
              );
              if (overlay && overlay.style.display !== 'none') {
                // overlay.remove();
                overlay.style.display = 'none';
              }
              const vid = document.querySelector('video');
              if (vid && vid.paused) {
                console.log('[YT-DIALOG-CHECKER]: vid el: resume now...');
                vid.play();
              }
            }
          }
        }
      }
    }
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('[YT-DIALOG-CHECKER]: chrome.runtime.onMessage:', request);
  if (request.action === 'doATask') {
    task();
  }
});
