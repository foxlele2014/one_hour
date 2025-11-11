---
title: css奇淫技巧
date: 2018-02-07 15:03:22
tags:
- 奇淫技巧
category:
- css
---

### border实现三角小图标
- 原理
  通过设置元素宽高为 0，然后利用四个边框（border）的宽度与颜色，其中将不需要的两条边设为透明，就能得到不同方向的三角形。因为边框会在元素为 0x0 时相互交汇，形成斜边。

示例（向上三角）：

```html
<div class="tri-up"></div>
```

```css
.tri-up{
  width:0;
  height:0;
  border-left:10px solid transparent;
  border-right:10px solid transparent;
  border-bottom:10px solid #333; /* 三角颜色 */
}
```

其他方向：

向下：把 border-top 设为有色，左右透明。
向左：把 border-right 设为有色，上下透明。
向右：把 border-left 设为有色，上下透明。
用在伪元素上（常用于提示箭头）：

```css
.btn{
  position:relative;
}
.btn::after{
  content:"";
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  bottom:-6px; /* 根据需要调整位置 */
  width:0;
  height:0;
  border-left:6px solid transparent;
  border-right:6px solid transparent;
  border-top:6px solid rgba(0,0,0,0.75);
}
```

补充技巧：

用 em/rem 可以做相对尺寸的三角，随文本缩放。
如果需要可抗锯齿的斜角效果，考虑用 clip-path 或 transform: rotate() 的正方形截取。


### display:none;visibility:hidden;区别，以及使用visibility实现神奇的效果

#### layout（布局）

- display:none：元素从文档流中移除，不占用空间。
- visibility:hidden：元素不可见，但保留原有占位空间。

#### 交互与焦点

- display:none 的元素无法被选中、点击或聚焦（不可交互）。
- visibility:hidden 同样不可见且通常不可交互（也不能聚焦），但占位存在。

#### 动画与过渡

- display 属性不能过渡（无法平滑动画）。
- visibility 可以与 opacity 联动，配合 transition 实现渐隐/渐现效果（常用技巧）。

渐显 / 渐隐的常用实现（只用 CSS，无 JS 回调）：

```css
.modal{
  opacity:0;
  visibility:hidden;
  transition: opacity .25s ease, visibility 0s linear .25s; /* 隐藏时延迟 visibility */
}
.modal.show{
  opacity:1;
  visibility:visible;
  transition-delay:0s,0s;
}
```
解释：当加上 .show，visibility 立刻变为 visible，opacity 过渡到 1；当移除 .show，opacity 先过渡到 0（.25s），visibility 在 0.25s 后才变为 hidden，从而实现平滑消失并在消失后移除占位/交互。

pointer-events 辅助

有时希望元素不可见但仍阻止点击，可结合 pointer-events: none 或 auto。
表格折叠

visibility:collapse 对表格行/列有特殊语义，可折叠格子（支持性检查）。

#### 实用场景举例

想在页面保持布局不变但暂时隐藏某区域（例如保持栅格高度），使用 visibility:hidden。
想彻底移除元素（不占位、减少文档流影响），使用 display:none。
想做淡入淡出动画：用 visibility + opacity（并配合 transition-delay）或用 JS 在 transitionend 后再改 display。
小结

display 控制是否参与布局；visibility 控制是否可见但不影响布局空间。
动画用 visibility+opacity 比直接切换 display 更平滑；若需无缝交互控制，可配合 pointer-events 或在动画结束后用 JS 切换 display。


