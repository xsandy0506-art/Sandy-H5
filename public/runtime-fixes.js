(function () {
  var prefix = location.hostname.indexOf('github.io') !== -1 ? '/Sandy-H5/' : '/'

  function rewritePath(value) {
    if (!value || typeof value !== 'string') return value
    if (!value.startsWith('/')) return value
    if (prefix !== '/' && value.startsWith(prefix)) return value
    if (prefix === '/' && value.startsWith('/')) return value
    if (value.startsWith('/assets/')) return prefix + value.slice(1)
    if (value.startsWith('/background-music.m4a')) return prefix + value.slice(1)
    if (value.startsWith('/panorama')) return prefix + value.slice(1)
    if (value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.png') || value.endsWith('.webm') || value.endsWith('.mp4') || value.endsWith('.m4a')) {
      return prefix + value.slice(1)
    }
    return value
  }

  function rewriteBackground(element) {
    if (!element || !element.style) return
    var bg = element.style.backgroundImage
    if (!bg || bg.indexOf('url(') === -1) return
    element.style.backgroundImage = bg.replace(/url\((['"]?)(\/[^'")]+)\1\)/g, function (_, quote, path) {
      return 'url(' + quote + rewritePath(path) + quote + ')'
    })
  }

  function rewriteNode(node) {
    if (!node || node.nodeType !== 1) return

    if (node.hasAttribute && node.hasAttribute('src')) {
      var src = node.getAttribute('src')
      var nextSrc = rewritePath(src)
      if (nextSrc !== src) node.setAttribute('src', nextSrc)
    }

    if (node.tagName === 'SOURCE' && node.src) {
      node.src = rewritePath(node.getAttribute('src') || node.src)
    }

    rewriteBackground(node)

    if (node.querySelectorAll) {
      var children = node.querySelectorAll('[src], [style]')
      children.forEach(function (child) {
        if (child.hasAttribute('src')) {
          var childSrc = child.getAttribute('src')
          var nextChildSrc = rewritePath(childSrc)
          if (nextChildSrc !== childSrc) child.setAttribute('src', nextChildSrc)
        }
        rewriteBackground(child)
      })
    }
  }

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

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(rewriteNode)
      if (mutation.target) rewriteNode(mutation.target)
    })
    enhanceSceneFrame()
  });

  document.addEventListener('DOMContentLoaded', function () {
    rewriteNode(document.documentElement)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style']
    })
    enhanceSceneFrame()
  })
})();
