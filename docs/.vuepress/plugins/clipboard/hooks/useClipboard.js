import { createApp, onBeforeUnmount, onMounted, onUpdated, watch } from 'vue'
import { useRoute } from 'vue-router'
import clipboard from '../components/clipboard.vue'

import '../styles/main.css'

const options = __CODE_CLIPBOARD_OPTIONS__

console.log(options)

export const setupClipboard = () => {
  const router = useRoute()
  const copyBtnClassName = `code-copy-added-${options?.align || 'bottom'}`
  const update = () => {
    if (router.path === '/') {
      console.log('根路由')
      return
    }
    console.log('其它路由')
    const delay = options.delay || 400
    setTimeout(() => {
      const targetEls = document.querySelectorAll(options.selector || 'div[class*="language-"]')
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
        const childEl = document.createElement('div')
        el.appendChild(instance.mount(childEl).$el)

        el.classList.add(copyBtnClassName)
      })
    }, delay + 100)
  }
  const clear = () => {
    // document.querySelectorAll(options.selector || 'div[class*="language-"]').forEach(el => {
    //   if (el.classList.contains(copyBtnClassName)) {
    //     el.classList.remove(copyBtnClassName)
    //   }
    // })
  }
  onMounted(() => {
    console.log('use onMounted')
    update()
    // todo ?
    window.addEventListener('vuepress-plugin-clipboard-update-event', update)
  })

  onBeforeUnmount(() => {
    console.log('use onBeforeUnmount')
    clear()
    // todo ?
    window.removeEventListener('vuepress-plugin-clipboard-update-event', update)
  })

  onUpdated(() => {
    console.log('use onUpdated')
    update()
  })

  watch(
    () => router.path,
    () => {
      console.log('watch...')
      clear()
      update()
    },
  )

  return update
}