(function() {
  const IGNORE_TAGS = [
    // ignore tags in Text content
    'figure', // 'figcaption',
    // Image and multimedia & Embeded content
    'audio', 'img', 'map', 'video', 'picture',
    'embeded', 'iframe', 'object',  // 'area', 'param',  'source', 'track', 
    // Scripting
    'canvas', 'noscript', 'script',
    // Table
    'table', // 'caption', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
    // Form
    'button', 'datalist', 'fieldset', 'form', 'input', 'meter', 'output', 'progress', 'select', 'textarea', // 'option', 'label', 'legend', 'optgroup'
    // TODO: Interactive elements, Web Components
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  ]

  const WebPage = class {
    constructor(element) {
      this.element = element
    }
    getMain() {
      // TODO: how to select main content area
      let main = this.element.querySelector('[role="main"]')
      if (main) return main
      return this.element.querySelector('article')
    }
    extract() {
      const main = this.getMain().cloneNode(true)

      // remove ignore tags
      for (const ignoreTag of IGNORE_TAGS) {
        const tags = main.querySelectorAll(ignoreTag)
        tags.forEach((node) => {
          node.parentNode.removeChild(node)
        })
      }

      // extract text
      const walker = document.createTreeWalker(
        main,
        NodeFilter.SHOW_TEXT
      )
      const textList = []
      let currentNode = walker.currentNode
      while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
          const text = currentNode.textContent.trim()
          if (text.length > 0) textList.push(text)
        }
        currentNode = walker.nextNode()
      }

      main.remove()
      return textList.join('\r\n')
    }
  }

  const download = (text) => {
    let anchor = document.createElement('a')
    anchor.download = document.title + '.txt'
    anchor.href = window.URL.createObjectURL(new Blob([ text ], { type: 'text/plain' }))
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
  }

  const webPage = new WebPage(document.body)
  const text = webPage.extract()
  if (!text) {
    alert('Failed to extract text.')
    return
  }
  download(text)
})()
