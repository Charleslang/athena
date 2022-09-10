import { createApp, onBeforeUnmount, onMounted, onUpdated, watch } from 'vue'
import { useRoute } from 'vue-router'
import clipboard from '../components/clipboard.vue'

import '../styles/main.css'

const options = __CODE_CLIPBOARD_OPTIONS__

export const setupClipboard = () => {
  const route = useRoute()
  const copyBtnClassName = 'code-copy-added'

  const instances = []

  const update = () => {
    if (route.path === '/') {
      return
    }
    const delay = options?.delay || 400
    setTimeout(() => {
      const targetEls = document.querySelectorAll(options?.selector || 'div[class*="language-"]')
      targetEls.forEach((el, i) => {
        if (el.classList.contains(copyBtnClassName) || el.querySelector('pre, code[class*=\'pre-\']') === null) {
          return
        }
        const codeContent = el.querySelector('pre, code[class*=\'pre-\']')
        const instance = createApp(clipboard, {
          parent: el,
          code: codeContent.innerText || codeContent.textContent,
          index: i,
          options,
        })
        instances.push(instance)
        const childEl = document.createElement('div')
        const app = instance.mount(childEl)
        el.appendChild(app.$el)
        el.classList.add(copyBtnClassName)
      })
    }, delay + 100)
  }
  const clear = () => {
    document.querySelectorAll(options.selector || 'div[class*="language-"]').forEach(el => {
      if (el.classList.contains(copyBtnClassName)) {
        el.classList.remove(copyBtnClassName)
      }
    })

    // instances.forEach(e => e?.unmount())

    document.querySelectorAll('.clipboard-container').forEach(el => {
      el.remove()
    })
  }
  onMounted(() => {
    update()
  })

  onBeforeUnmount(() => {
    clear()
  })

  onUpdated(() => {
    update()
  })

  watch(
    () => route.path,
    () => {
      clear()
      update()
    },
  )

  return update
}