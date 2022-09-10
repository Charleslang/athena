<template>
  <div :class="[containerClass, 'clipboard-container', staticClass, positionClass]">
    <button :class="[btnClass, 'btn-clipboard']" @click="copyContent($event)">
      <i class="iconfont icon-copy"></i>
      <i class="iconfont icon-success"></i>
    </button>
  </div>
</template>

<script>
  import { computed, onBeforeUnmount, onMounted, toRefs, onUpdated, onBeforeMount } from 'vue'

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
      
      const genDefaultOption = (options) => {
        return {
          position: options?.position || 'top',
          show: options?.show || 'hover',
          selector: options?.selector || 'div[class*="language-"]',
          delay: options?.delay || 400,
          hoverText: options?.hoverText || 'Copy to clipboard',
          successText: options?.successText || 'Copied!',
          tippy: options?.tippy || { placement: 'top' },
        }
      }
      
      const componentOptions = computed(() => options.value === null ? genDefaultOption(null) : genDefaultOption(options.value))
      const containerClass = computed(() => `clipboard-container-${index.value}`)
      const btnClass = computed(() => `btn-clipboard-${index.value}`)
      const staticClass = computed(() => componentOptions.value.show === 'hover' ? '' : 'clipboard-container-static')
      const positionClass = computed(() => componentOptions.value.position === 'top' ? 'clipboard-container-top' : 'clipboard-container-bottom')
      const tippyConfig = computed(() => componentOptions.value.tippy)

      let tippyInstance = null

      onMounted(() => {
        if (parent.value !== null) {
          // onMounted 中无法直接获取 DOM https://segmentfault.com/a/1190000041292717
          setTimeout(() => {
            tippyInstance = addCopyToolTips(document.querySelector(`.${containerClass.value}`), componentOptions.value.hoverText)
          })
        }
      })
      
      onBeforeUnmount(() => {
        if (parent.value !== null) {
          tippyInstance?.destroy()
        }
      })

      /**
       * 给复制按钮添加提示词
       */
      const addCopyToolTips = (selector, hoverText) => {
        const instance = tippy(selector, {
          content: hoverText,
          trigger: 'mouseenter',
          hideOnClick: false,
          zIndex: 999,
          ...tippyConfig.value,
          onDestroy: () => {
          },
          onHidden: (instance) => {
            instance.reference.children[0].disabled = false
            instance.reference.children[0].classList.remove('btn-copy-success')
            instance.reference.classList.remove('success')
            instance.setContent(hoverText)
          }
        })

        return instance
      }

      /**
       * 复制按钮的复制事件
       */
      const copyContent = (e) => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(code.value).then(
            () => onCopySuccess(e),
            () => onCopyFailed()
          )
        } else {
          const copyElement = document.createElement('textarea')
          document.body.appendChild(copyElement)
          copyElement.value = code.value
          copyElement.select()
          try {
            document.execCommand('Copy')
            onCopySuccess(e)
          } catch (error) {
            onCopyFailed(error)
          }
          copyElement.remove()
        }
      }

      /**
       * 复制成功后的回调
       */
      const onCopySuccess = (e) => {
        if (e.target.nodeName === 'BUTTON') {
          e.target.disabled = true
          e.target.classList.add('btn-copy-success')
          e.target.parentNode.classList.add('success')
          e.target.parentNode._tippy.setContent(componentOptions.value.successText)
        } else {
          e.target.parentNode.disabled = true
          e.target.parentNode.classList.add('btn-copy-success')
          e.target.parentNode.parentNode.classList.add('success')
          e.target.parentNode.parentNode._tippy.setContent(componentOptions.value.successText)
        }
      }

      /**
       * 复制失败后的回调
       */
      const onCopyFailed = (error) => {
        console.log('复制失败', error)
      }

      return {
        containerClass,
        btnClass,
        staticClass,
        positionClass,
        copyContent
      }
    }
  }
</script>

<style scoped>
  .clipboard-container {
    position: absolute;
    right: 0;
    z-index: 9;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s;
  }

  .clipboard-container-static {
    opacity: 0.9;
  }

  .clipboard-container-top {
    top: 0;
  }

  .clipboard-container-bottom {
    bottom: 0;
  }

  .clipboard-container.success {
    opacity: 1 !important;
  }

  .clipboard-container:hover .btn-clipboard {
    /* background-color: #f3f4f6; */
    background-color: #d3d5d8;
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

  .clipboard-container:hover .btn-copy-success {
    background-color: #f3f4f6;
  }

  .clipboard-container .btn-copy-success .icon-copy {
    display: none;
  }

  .clipboard-container .btn-copy-success .icon-success {
    display: inline-block;
  }

</style>