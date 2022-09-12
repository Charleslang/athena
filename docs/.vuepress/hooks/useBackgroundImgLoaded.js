export const loadImgSuccess = () => {
  const source = document.querySelector('#app .no-sidebar main.home header.hero')
  if (source) {
    setTimeout(() => {
      const background = document.querySelector('#app .no-sidebar main.home')
      if (background) {
        const style = background.currentStyle || window.getComputedStyle(background, false)
        let url = style.backgroundImage?.slice(4, -1).replace(/['"]/g, "")
        if (url) {
          if (decodeURI(url) === url) {
            url = encodeURI(url)
          }
          const img = document.createElement('img')
          img.src = url
          img.onload = () => {
            source.style.display = 'table-cell'
          }
        }
      }
    })
  }
}