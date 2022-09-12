export default (options) => {
  if (!(options && Object.keys(options).length)) {
    return {}
  }

  const config = {
    backgroundImg: '/images/P6.jpg',
    heroText: '有些人没有见过汪洋，以为江河最为壮美'
  }

  const backgroundImgConfig = options.backgroundImg
  const heroTextConfig  = options.heroText
  const footerTextConfig = options.footerText

  if (backgroundImgConfig) {
    if (backgroundImgConfig instanceof Array) {
      if (backgroundImgConfig.length > 0) {
        config.backgroundImg = backgroundImgConfig
      }
    } else if (typeof backgroundImgConfig === 'string' && backgroundImgConfig.trim() !== '') {
      config.backgroundImg = backgroundImgConfig
    }
  }

  if (heroTextConfig) {
    if (heroTextConfig instanceof Array) {
      if (heroTextConfig.length > 0) {
        config.heroText = heroTextConfig
      }
    } else if (typeof heroTextConfig === 'string' && heroTextConfig.trim() !== '') {
      config.heroText = heroTextConfig
    }
  }

  config.footerText = {
    left: footerTextConfig?.left || '好好学习',
    right: footerTextConfig?.right || '天天向上'
  }

  return config
}