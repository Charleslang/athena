
# 背景

- **background-image**  

  设置元素的背景图像。注意！如果图片太大，则只会显示一部分。如果图片太小，则会重复显示。

  ```css
  body { 
    background-image: url(bgimage.gif);
  }
  ```

- **background-color**  

  该属性可以和 `background-image` 同时使用。

- **background**  

  在一个声明中设置所有的背景属性，可以设置如下属性：  
  
    - `background-color`
    - `background-position`
    - `background-size`
    - `background-repeat`
    - `background-origin`
    - `background-clip`
    - `background-attachment`
    - `background-image`

  这几个属性没有顺序要求。如果不设置其中的某个值，也不会出问题，其它的会使用默认值。通常建议使用这个属性，而不是分别使用单个属性，因为这个属性在较老的浏览器中能够得到更好的支持，而且需要键入的字母也更少。

  ```css
  .ele { 
    background: #00FF00 url(bgimage.gif) no-repeat fixed top;
  }
  ```

- **background-attachment**  

  设置背景图像是否固定或者随着页面的其余部分滚动。

  |值|描述|
  |---|---|
  |`scroll`|默认值。背景图像会随着页面其余部分的滚动而移动|
  |`fixed`|当页面的其余部分滚动时，背景图像不会移动。该值永远相对于浏览器窗口，博客中经常使用。一般只给 `body` 设置此值|
  |`inherit`|规定应该从父元素继承 `background-attachment` 属性的设置|

- **background-position**  

  设置背景图像的开始位置。

  |值|描述|
  |---|---|
  |top left<br>top center<br>top right<br>center left<br>center center<br>center right<br>bottom left<br>bottom center<br>bottom right|如果您仅规定了一个关键词，那么第二个值将是"center"。<br>默认值: 0% 0%。|
  |x% y%|第一个值是水平位置，第二个值是垂直位置。<br>左上角是 0% 0%。右下角是 100% 100%。<br>如果您仅规定了一个值，另一个值将是 50%。<br>该值可以是负数。|
  |xpos ypos|第一个值是水平位置，第二个值是垂直位置。<br>左上角是 0 0。单位是像素 (0px 0px) 或任何其他的 CSS 单位。<br>如果您仅规定了一个值，另一个值将是50%。<br>您可以混合使用 % 和 position 值。<br>该值可以是负数。|

- **background-repeat**  

  设置是否及如何重复背景图像。

  |值|描述|
  |---|---|
  |`repeat`|默认。背景图像将在垂直方向和水平方向重复。|
  |`repeat-x`|背景图像将在水平方向重复。|
  |`repeat-y`|背景图像将在垂直方向重复。|
  |`no-repeat`|背景图像将仅显示一次。|
  |`inherit`|规定应该从父元素继承 `background-repeat` 属性的设置。|

- **background-clip**  

  规定背景的绘制区域。

- **background-origin**  

  规定背景图片的定位区域

- **background-size**  

  规定背景图片的尺寸。

  ```css
  background-size: length|percentage|cover|contain;
  ```

  |值|描述|
  |---|---|
  |`length`|设置背景图像的高度和宽度。<br>第一个值设置宽度，第二个值设置高度。<br>如果只设置一个值，则第二个值会被设置为 "auto"。<br>单位为 px。|
  |`percentage`|以父元素的百分比来设置背景图像的宽度和高度。<br>第一个值设置宽度，第二个值设置高度。<br>如果只设置一个值，则第二个值会被设置为 "auto"。|
  |`cover`|把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。<br>背景图像的某些部分也许无法显示在背景定位区域中。|
  |`contain`|把图像图像扩展至最大尺寸，以使其宽度和高度完全适应内容区域。|


  :::tip 提示
  在使用背景图片时，最好将多张图片拼接为 1 张，然后只需改变图片的 `background-position`（设置为元素宽度的负倍数）。
  :::
