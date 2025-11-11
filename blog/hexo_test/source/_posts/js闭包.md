---
title: js闭包
date: 2018-02-07 16:09:41
tags:
- js
- 闭包
category:
- javascript
---

### 计划内容
- 经典问题for循环
- 函数式编程、柯里化

### 闭包（Closure）简介
闭包是函数与其词法环境的组合。函数能访问定义时所在作用域的变量，即便在其外部被调用，这就是闭包的核心。

### 经典问题：for 循环与闭包
问题：用 var 的 for 创建回调，会发现回调打印的都是循环结束后的 i 值。

示例（有问题）：
```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() { console.log(i); });
}
funcs.forEach(f => f()); // 输出 3 3 3
```
解决方式：

1. 使用 let（块级作用域）：

```javascript
const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(function() { console.log(i); });
}
funcs.forEach(f => f()); // 输出 0 1 2
```
2. 使用 IIFE（立即调用函数表达式）创造闭包：

```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  (function(j){
    funcs.push(function(){ console.log(j); });
  })(i);
}
funcs.forEach(f => f()); // 输出 0 1 2
```
3. 使用函数工厂：
```javascript
function makeLogger(j){ return function(){ console.log(j); }; }
for (var i = 0; i < 3; i++) {
  funcs.push(makeLogger(i));
}
```

### 函数式编程与柯里化（Currying）
柯里化是把多个参数的函数转换为一系列单参数函数的技术，便于部分应用和复用。

例：手动柯里化
```javascript
function add(a) {
  return function(b) {
    return a + b;
  };
}
const add5 = add(5);
console.log(add5(3)); // 8
```
通用柯里化辅助：
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return function(...more) { return curried.apply(this, args.concat(more)); };
  };
}
function sum(a,b,c){ return a+b+c; }
const cs = curry(sum);
console.log(cs(1)(2)(3)); // 6
```

应用场景

事件处理器生成、配置化函数、部分应用（预设常用参数）。
用闭包保存私有状态（例如计数器、缓存、惰性初始化）。

注意事项

闭包会保留外部变量的引用，可能导致内存无法及时释放，避免无意中持有大量数据。
在循环或大量创建闭包时考虑性能与内存。

小结

闭包是强大的工具：解决异步/回调作用域问题，实现数据封装与函数式模式（如柯里化、部分应用）。合理使用 let、IIFE 和函数工厂能避免常见陷阱