<template>
  <div :class="[containerClass, 'clipboard-container']">
    <button :class="[btnClass, 'btn-clipboard']">
      <i class="iconfont icon-copy"></i>
      <i class="iconfont icon-success"></i>
    </button>
  </div>
</template>

<script>
  import { computed, onBeforeUnmount, onMounted, ref, toRefs } from 'vue'

  import Clipboard from 'clipboard'
  import tippy from 'tippy.js'
  import 'tippy.js/dist/tippy.css'
  
  export default {
    props: {
      parent: {
        default: null,
      },
      options: {
        type: Object,
        default: null,
      },
      index: {
        type: Number,
        required: true
      },
      code: {
        type: String,
        required: true,
      }
    },
    setup(props) {
      const { code, index, parent, options } = toRefs(props)
      const originalBackground = ref(null)
      const originalTransition = ref(null)
      let clipboardInstance = ref(null)
      
      const genDefaultOption = (options) => {
        return {
          staticIcon: options?.staticIcon === true || false,
          align: options?.align || 'bottom',
          selector: options?.selector || 'div[class*="language-"]',
          delay: options?.delay || 400,
          color: options?.color || 'var(--c-brand)',
          backgroundTransition: options?.backgroundTransition !== false || true,
          backgroundTransitionColor: options?.backgroundTransitionColor || 'var(--code-bg-color)',
          successTextColor: options?.successTextColor || 'var(--c-brand-light)',
          hoverText: options?.hoverText || 'Copy to clipboard',
          successText: options?.successText || 'Copied!',
        }
      }
      
      const componentOptions = computed(() => options.value === null ? genDefaultOption(null) : genDefaultOption(options.value))
      const containerClass = computed(() => ('clipboard-container-' + index.value))
      const btnClass = computed(() => ('btn-clipboard-' + index.value))

      const addCopyToolTips = (selector, hoverText) => {
        tippy(selector, {
          content: hoverText,
          trigger: 'mouseenter',
          hideOnClick: false,
          zIndex: 999,
          onHidden: (instance) => {
            instance.reference.children[0].disabled = false
            instance.reference.children[0].classList.remove('btn-copy-success')
            instance.setContent(hoverText)
          }
        })
      }

      const addCopyEvent = (selector, options, successCallback, errorCallback) => {
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
        
      
      onMounted(() => {
        if (parent.value !== null) {
          console.log('clipboard-onMounted渲染...')
          console.log(containerClass.value)

          // onMounted 中无法直接获取 DOM https://segmentfault.com/a/1190000041292717
          setTimeout(() => {

            addCopyToolTips(`.${containerClass.value}`, componentOptions.value.hoverText)

            clipboardInstance = addCopyEvent(`.${btnClass.value}`, {
              text: trigger => {
                // 此处使用 code.value 会有问题, 一直都是复制最后一个代码块的内容
                const codeNode = trigger.parentNode.parentNode?.firstElementChild
                return codeNode?.innerText || codeNode?.textContent || ''
              }
            }, e => {
              console.log('回调成功')
              e.trigger.disabled = true
              e.trigger.classList.add('btn-copy-success')
              e.trigger.parentNode._tippy.setContent(componentOptions.value.successText)
            }, e => {
              console.error('复制到剪切板失败')
            })
          })
          
        }
      })
      
      onBeforeUnmount(() => {
        console.log('clipboard-onBeforeUnmount卸载...')
        if (parent.value !== null) {
          if (originalBackground.value !== null)
            parent.value.style.background = originalBackground.value
          if (originalTransition.value !== null)
            parent.value.style.transition = originalTransition.value
        }
        // if (successTimeout.value !== undefined) {
        //   window.clearTimeout(successTimeout.value)
        // }

        // if (clipboardInstance?.value !== null) {
        //   clipboardInstance.destroy()
        // }  
      })
      
      

      return {
        containerClass,
        btnClass
      }
    }
  }
</script>

<style scoped>
  .clipboard-container {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s;
  }

  .clipboard-container:hover .btn-clipboard {
    background-color: #f3f4f6;
    transition-duration: .1s;
  }

  .btn-clipboard {
    display: inline-block;
    cursor: pointer;
    margin: 8px;
    width: 2rem;
    height: 2rem;
    outline: none;
    border: 1px solid rgba(27, 31, 36, 0.15);
    border-radius: 5px;
    color: #24292f;
    background-color: #f6f8fa;
    box-shadow: rgba(27,31,36,0.04);
    transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
    transition-property: color,background-color,box-shadow,border-color;
  }

  .btn-clipboard .icon-success {
    display: none;
  }

  .clipboard-container .btn-copy-success {
    color: #2da44e;
    border-color: rgb(74, 194, 107);
    font-weight: 600;
  }

  .clipboard-container .btn-copy-success .icon-copy {
    display: none;
  }

  .clipboard-container .btn-copy-success .icon-success {
    display: inline-block;
  }

</style>