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
        let text = ''
        if (typeof heroText === 'string') {
          text = heroText
        } else {
          const index = Math.floor(Math.random() * heroText.length)
          text = heroText[index]
        }
        description.innerText = text
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