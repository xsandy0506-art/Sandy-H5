(function () {
  function getSceneLabel() {
    return document.querySelector('.scene-label[role="button"], .scene-label');
  }

  function openCurrentSceneVideo() {
    const label = getSceneLabel();
    if (label) {
      label.click();
    }
  }

  function enhanceSceneFrame() {
    const frame = document.querySelector('.scene-frame');
    if (!frame || frame.dataset.videoEnhancementReady === '1') {
      return;
    }

    frame.dataset.videoEnhancementReady = '1';
    frame.style.cursor = 'pointer';
    frame.title = '点击场景画面可播放当前场景视频';

    const hint = document.createElement('div');
    hint.className = 'scene-video-hint';
    hint.textContent = '点击画面播放当前场景视频';
    Object.assign(hint.style, {
      position: 'absolute',
      right: '12px',
      bottom: '12px',
      zIndex: '3',
      padding: '6px 10px',
      borderRadius: '999px',
      background: 'rgba(0, 0, 0, 0.58)',
      color: '#fff',
      fontSize: '12px',
      lineHeight: '1',
      pointerEvents: 'none'
    });

    frame.appendChild(hint);
  }

  document.addEventListener('click', function (event) {
    const frame = event.target.closest('.scene-frame');
    if (frame && !event.target.closest('.scene-label, .collect-button, button, a, video')) {
      openCurrentSceneVideo();
      return;
    }

    const sceneButton = event.target.closest('.scene-button');
    if (sceneButton) {
      setTimeout(openCurrentSceneVideo, 0);
    }
  });

  const observer = new MutationObserver(enhanceSceneFrame);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhanceSceneFrame();
})();
