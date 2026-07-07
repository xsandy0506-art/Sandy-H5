(function () {
  var prefix = '/Sandy-H5/'

  function rewritePath(value) {
    if (!value || typeof value !== 'string') return value
    if (!value.startsWith('/')) return value
    if (value.startsWith(prefix)) return value
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

    if (node.hasAttribute('src')) {
      var src = node.getAttribute('src')
      var nextSrc = rewritePath(src)
      if (nextSrc !== src) node.setAttribute('src', nextSrc)
    }

    if (node.tagName === 'SOURCE' && node.src) {
      node.src = rewritePath(node.getAttribute('src') || node.src)
    }

    rewriteBackground(node)

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

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(rewriteNode)
      if (mutation.target) rewriteNode(mutation.target)
    })
  })

  document.addEventListener('DOMContentLoaded', function () {
    rewriteNode(document.documentElement)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'style']
    })
  })
})()