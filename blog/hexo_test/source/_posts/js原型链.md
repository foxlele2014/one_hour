---
title: js原型链
date: 2018-02-07 16:13:17
tags:
- js
- 原型链
category: 
- javascript
---

- prototype
- constructor
- new

## 原型链的构成
对象.__proto__ -> 原型对象
原型对象.constructor -> 构造函数
构造函数.prototype -> 原型对象
```javascript
function Person(name) {
    this.name = name;
}
const p1 = new Person('张三');

console.log(p1.__proto__ === Person.prototype);  // true
console.log(Person.prototype.constructor === Person);  // true
```
## 继承
```javascript
// 原型继承
function Animal(name) {
    this.name = name;
}
Animal.prototype.eat = function() {
    console.log(this.name + ' eating');
}

function Dog(name) {
    Animal.call(this, name);  // 继承属性
}
// 继承方法
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```
## 检查
```javascript
// 检查原型链
Object.getPrototypeOf(obj)    // 获取原型
obj.hasOwnProperty('prop')    // 是否自身属性
obj instanceof Constructor     // 是否在原型链上
Object.create(proto)          // 创建指定原型的对象
```
## 属性查找过程
obj.prop 
-> obj自身属性
-> obj.__proto__属性
-> obj.__proto__.__proto__属性
-> ... 直到null


### constructor属性
- 标识对象由哪个构造函数创建
- 维护正确的原型链关系
- 方便实例识别其构造函数

### new
- 创建空对象
- 将空对象的__proto__指向构造函数的prototype
- 将构造函数的this指向空对象
- 执行构造函数
- 返回空对象

```javascript
function Person(name) {
    this.name = name;
}

// new Person('张三') 实际上做了：
function newOperator(Constructor, ...args) {
    // 1. 创建一个空对象，原型指向构造函数的prototype
    const obj = Object.create(Constructor.prototype);
    
    // 2. 将构造函数的this指向这个对象
    // 3. 执行构造函数
    const result = Constructor.apply(obj, args);
    
    // 4. 如果构造函数返回对象，则返回该对象
    // 否则返回第一步创建的对象
    return (typeof result === 'object' && result !== null) ? result : obj;
}
```

1. 函数都可以作为构造函数，但是箭头函数不行
2. 箭头函数没有自己的this
3. 箭头函数的this是在定义时就确定的，指向外层作用域的this
4. 箭头函数没有prototype属性
5. 不能通过call/apply/bind改变箭头函数的this

```javascript
// call：立即执行，参数列表
function.call(thisArg, arg1, arg2, ...)

// apply：立即执行，参数数组
function.apply(thisArg, [arg1, arg2, ...])

// bind：返回新函数，参数列表
function.bind(thisArg, arg1, arg2, ...)
```

## 类和原型
```javascript
// ES6 class
class Animal {
    constructor(name) {
        this.name = name;
    }
}

// 等同于
function Animal(name) {
    this.name = name;
}
```
