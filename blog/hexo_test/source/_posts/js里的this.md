---
title: js里的this
date: 2018-02-07 16:09:51
tags:
- js
- this
category: 
- javascript
---

### 计划内容
- bind
- es5里的，es6里的

### 默认绑定
```javascript
// 非严格模式下，this指向全局对象
function test() {
    console.log(this);  // window/global
}

// 严格模式下，this指向undefined
'use strict';
function test() {
    console.log(this);  // undefined
}
```

### 隐式绑定
```javascript
// 作为对象方法调用时，this指向该对象
const obj = {
    name: '张三',
    sayHi() {
        console.log(this.name);
    }
};
obj.sayHi();  // '张三'

// 注意：方法单独使用会丢失this
const say = obj.sayHi;
say();  // undefined，this指向全局
```

### 显式绑定
```javascript
// call/apply/bind 可以指定this
function greet() {
    console.log(this.name);
}

const person = { name: '李四' };
greet.call(person);    // '李四'
greet.apply(person);   // '李四'
greet.bind(person)();  // '李四'
```

### new绑定
```javascript
// 构造函数中的this指向新创建的实例
function Person(name) {
    this.name = name;
}
const p = new Person('王五');  // this指向p
```


### 箭头函数
箭头函数没有自己的this，它的this继承自外层作用域的this。

```javascript
const obj = {
    name: '张三',
    sayHi: () => {
        console.log(this.name);  // undefined，this指向全局
    }
};
obj.sayHi();  // undefined
```

假如想要在sayHi里读取到obj的name
1. 使用普通函数
```javascript
const obj = {
    name: '张三',
    sayHi: function() {
        console.log(this.name);  // '张三'
    }
};
obj.sayHi();  // '张三'
```
2. 保存外部引用
```javascript
const obj = {
    name: '赵六',
    sayHi: () => {
        console.log(obj.name);  // 直接引用obj
    }
};
```
### 优先级
- new绑定
- 显式绑定（call/apply/bind）
- 隐式绑定（对象方法）
- 默认绑定（全局/undefined）