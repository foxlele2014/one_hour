---
title: css基础属性解析
date: 2018-02-07 15:02:38
tags:
- 基础属性
category: 
- css
---

[//]: # ### 块元素
    常见的`div、p、ul、li、ol、h1~h6、`
    特点：
    - 定义`width、height`有效
    ### 行内元素
    `span、a、i`
    特点：
    - 定义`width、height`无效。
    - padding有效，margin只有左右的有效，上下的无效

元素类型由以下两项定义：

- [Catagories](https://www.w3.org/TR/html/dom.html#element-dfn-categories)
- [Content Model](https://www.w3.org/TR/html/dom.html#element-dfn-content-model)

### 元素包含规则

由Content Model决定，


### Catagories

### Content Model 


- text-align基于文本元素
- line-height
- vertical-align：设置元素的垂直对齐方式
该属性定义行内元素的基线相对于该元素所在行的基线的垂直对齐。允许指定负长度值和百分比值。这会使元素降低而不是升高。在表单元格中，这个属性会设置单元格框中的单元格内容的对齐方式。
![image](/one_hour/img/css/vertical_align.jpeg)

### 参考

> [元素的使用姿势](https://www.zhihu.com/question/48130783/answer/109271752)
> [line-height 和vertical-align](http://www.cnblogs.com/xiaohuochai/p/5271217.html)
> [line-height 和vertical-align](https://zhuanlan.zhihu.com/p/25808995)
> [字体设计的视频](http://v.youku.com/v_show/id_XMzg4NDUzMDUy.html)