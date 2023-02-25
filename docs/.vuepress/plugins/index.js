import clipboardPlugin from './clipboard/index.js'

// @vuepress/plugin-docsearch 的版本必须要和 vuepress 的版本对应, 不然访问报错如下
// Uncaught (in promise) Error: useRouteLocale() is called without provider.
// npm i -D @vuepress/plugin-docsearch@next 会安装最新版
// npm i -D @vuepress/plugin-docsearch@2.0.0-beta.51 才会安装指定的版本
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export const plugins = [
  // 音乐播放器 https://www.npmjs.com/package/vuepress-plugin-meting
  // 代码复制 https://vuepress.qbb.sh/clipboard/#install
  clipboardPlugin({
    position: 'top',
    show: 'hover',
    selector: 'div[class*="language-"]',
    delay: 400,
    hoverText: 'Copy to clipboard',
    successText: 'Copied!',
    tippy: {
      placement: 'top',
    }
  }),
  // 自动生成侧边栏
  // 侧边栏左右分离
  // 搜索
  docsearchPlugin({
    appId: 'KWBCXTQMRD',
    apiKey: '81b0fddd1a6626f2dce6fac3d542eb16',
    indexName: 'daijunfeng',
    // 见 https://docsearch.algolia.com/docs/api/#translations
    translations: {
      button: {
        buttonText: '搜索文档', // 输入框显示的文字
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消',
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: 'Favorite',
          removeFavoriteSearchButtonTitle: 'Remove this search from favorites',
        },
        errorScreen: {
          titleText: 'Unable to fetch results',
          helpText: 'You might want to check your network connection.',
        },
        footer: {
          selectText: '选择',
          selectKeyAriaLabel: 'Enter key',
          navigateText: '切换',
          navigateUpKeyAriaLabel: 'Arrow up',
          navigateDownKeyAriaLabel: 'Arrow down',
          closeText: '关闭',
          closeKeyAriaLabel: 'Escape key',
          searchByText: '搜索提供者',
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: 'Believe this query should return results?',
          reportMissingResultsLinkText: 'Let us know.',
        }
      }
    },
    placeholder: '搜索文档' // 点击搜索框后, 输入框聚焦时的文字
  })
]