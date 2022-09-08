/* https://clipboardjs.com */
import Clipboard from 'clipboard'
import tippy from 'tippy.js'

export const addCopyEvent = (selector, options, successCallback, errorCallback) => {

  const el = document.querySelector(selector)
  if (!el) {
    return
  }

  let clipboard
  if (options && Object.keys(options).length) {
    clipboard = new Clipboard(selector, options)
  } else {
    clipboard = new Clipboard(selector)
  }

  clipboard.on('success', e => {
    if (successCallback) {
      successCallback(e)
    } else {
      console.log('复制成功:' + e.text)
      console.log('---------------')
    }
    e.clearSelection()
  })

  clipboard.on('error', e => {
    if (errorCallback) {
      errorCallback(e)
    } else {
      console.log('复制失败')
    }
  })

  return clipboard
}

export const addCopyToolTips = (selector, hoverText) => {
  const a = tippy(selector, {
    content: hoverText,
    trigger: 'mouseenter',
    hideOnClick: false,
    zIndex: 999,
    // onHidden: (instance) => {
    //   instance.reference.children[0].disabled = false
    //   instance.setContent(hoverText)
    // }
  })
  console.log(a)
}