const clipboardOptions = {

	/**
   * @description: 设置复制按钮的位置
   * @default: "top"
   */
	position: 'top' || 'bottom',

  /**
   * @description: 复制按钮显示的实际, 默认在 selector 选项指定的选择器处于 hover 状态时才显示
   * @default: "hover"
   */
  show: 'hover' || 'static',
  
  /**
   * @description: 将复制按钮插入到哪个 DOM 中。取值为目标代码块的 CSS 选择器
   * @default: 'div[class*="language-"]'
   */
  selector: 'div[class*="language-"]',

  /**
   * @description: 页面加载完成后延迟多久渲染复制按钮
   * @default: 400
   */
  delay: 400,

 /**
  * @description: 鼠标移动到复制按钮上的提示词
  * @default: "Copy to clipboard"
  */
  hoverText: 'Copy to clipboard',

  /**
   * @description: 复制成功后的提示词
   * @default: "Copied!"
   */
  successText: 'Copied!',

  /**
   * @description: 提示词显示的位置, 可以传入 tippyjs 支持的参数。见 https://atomiks.github.io/tippyjs
   * @default: "top"
   */
  tippy: {
		placement: 'top' || 'bottom' || 'left' || 'right' || 'top-start' || 'right-start' || 'bottom-start' || 'left-start' || 'top-end' || 'right-end' || 'bottom-end' || 'left-end'
	},
}