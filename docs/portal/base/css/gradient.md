# 渐变

渐变要通过 `background-image` 来设置。是的，你没看错，渐变不是颜色，而是图片。

```css
.nav1 {
  /* 线性渐变 */
  /* 默认是从上往下渐变，红色在上 */
  /* background-image: linear-gradient(red,yellow); */
  /* 从左向右渐变 */
  /* background-image: linear-gradient(to right,red,yellow); */
  /* background-image: linear-gradient(to top left,red,yellow); */
  /* 设置渐变角度 */
  /* background-image: linear-gradient(45deg,red,yellow); */
  width: 200px;
  height: 200px;
  /* 渐变可以同时指定多个颜色 */
  /* 这几个颜色默认是平均分配的 */
  background-image: linear-gradient(to top left,red,yellow,green,#f60);
  /* 分配颜色比例，就是设置颜色的开始位置，如果它的前面或后面没有颜色，则会填充它的颜色 */
  /* background-image: linear-gradient(green,#f60 70px); */
  /* background-image: linear-gradient(green,#f60 30%); */
}

.nav2 {
  background-image: repeating-linear-gradient(#7C61DD 30px,#5BC0DE 80px);
  width: 200px;
  height: 200px;
  margin-top: 50px;
}

.nav3 {
  /* 径向渐变 */
  width: 200px;
  height: 200px;
  margin-top: 50px;
  /* 其形状是根据该元素的形状来计算 */
  background-image: radial-gradient(#5BC0DE,#3EAF7C);
  background-image: radial-gradient(#5BC0DE 50px,#3EAF7C);
  background-image: radial-gradient(100px 100px,#5BC0DE 50px,#3EAF7C);
  /* 用 at 设置圆心 */
  background-image: radial-gradient(100px 100px at 0 0,#5BC0DE 50px,#3EAF7C);
  /* background-image: radial-gradient(#5BC0DE,#3EAF7C,#F1393A);
  background-image: repeating-radial-gradient(#5BC0DE 20px,#3EAF7C ,#F1393A );
  background-image: repeating-radial-gradient(circle,#5BC0DE 20px,#3EAF7C ,#F1393A ); */
  /* 椭圆效果 */
  /* background-image: repeating-radial-gradient(ellipse,#5BC0DE 20px,#3EAF7C ,#F1393A ); */
}
```
