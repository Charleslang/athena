import { useThemeData } from '@vuepress/plugin-theme-data/client'

export const useUserConfig = () => {

  const userConfig = useThemeData().value.userConfig

  if (userConfig && Object.keys(userConfig).length) {
    const backgroundImg = userConfig.backgroundImg
    const heroText = userConfig.heroText
    const footerText = userConfig.footerText

    if (backgroundImg) {
      const mainContainer = document.querySelector('#app .no-sidebar main.home')
      if (mainContainer) {
        let url = ''
        if (typeof backgroundImg === 'string') {
          url = `url('${backgroundImg}')`
        } else {
          const index = Math.floor(Math.random() * backgroundImg.length)
          url = `url('${backgroundImg[index]}')`
        }
        mainContainer.style.backgroundImage = url
      }
    }

    if (heroText) {
      const description = document.querySelector('#app .no-sidebar main.home header.hero .description')
      if (description) {
        let texts = typeof heroText === 'string' ? [heroText] : heroText
        let currentIndex = Math.floor(Math.random() * texts.length)
        
        // 创建三个 span 元素分别存放『、文本内容和』
        const leftBracket = document.createElement('span')
        const content = document.createElement('span')
        const rightBracket = document.createElement('span')
        const cursor = document.createElement('span')
        
        leftBracket.textContent = '『'
        rightBracket.textContent = '』'
        cursor.className = 'cursor'
        
        description.innerHTML = ''
        description.appendChild(leftBracket)
        description.appendChild(content)
        description.appendChild(cursor)
        description.appendChild(rightBracket)
        
        const typeWriter = (text, callback) => {
          let index = 0
          
          const type = () => {
            if (index < text.length) {
              content.textContent = text.slice(0, index + 1)
              index++
              setTimeout(type, 100)
            } else if (callback) {
              setTimeout(callback, 3000)
            }
          }

          content.textContent = ''
          setTimeout(type, 500)
        }
        
        const deleteText = () => {
          const text = content.textContent
          if (text.length > 0) {
            content.textContent = text.slice(0, -1)
            setTimeout(deleteText, 100)
          } else {
            currentIndex = (currentIndex + 1) % texts.length
            setTimeout(() => {
              typeWriter(texts[currentIndex], deleteText)
            }, 1000)
          }
        }
        
        // 开始第一轮打字
        typeWriter(texts[currentIndex], deleteText)
      }
    }

    if (footerText && Object.keys(footerText)) {
      const left = document.querySelector('#app > div > main > div.footer > div > div > span.left')
      const right = document.querySelector('#app > div > main > div.footer > div > div > span.right')
      if (left && right) {
        left.innerText = `[ ${footerText.left}`
        right.innerText = `${footerText.right} ]`
      } else {
        const footerLeft = document.querySelector('#app-page-bottom > div > div > span.left')
        const footerRight = document.querySelector('#app-page-bottom > div > div > span.right')
        if (footerLeft && footerRight) {
          footerLeft.innerText = `[ ${footerText.left}`
          footerRight.innerText = `${footerText.right} ]`
        }
      }
    }
  }
}

const getTextWidth = (text, element) => {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = canvas.getContext('2d')
  const computedStyle = window.getComputedStyle(element)
  context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`
  return context.measureText(text).width
}