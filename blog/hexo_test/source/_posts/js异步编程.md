---
title: js异步编程
date: 2018-02-07 16:11:29
tags:
- js
- 异步编程
category: 
- javascript
---

### 计划内容
- 单线程
- 事件驱动
- callback
- setTimeout、setInterval
- Promise
- generator
- async/await

### JavaScript的单线程特性
JavaScript是一门单线程的编程语言，这意味着它只有一个主线程来处理所有的任务。这种设计是由其最初在浏览器环境下的应用场景决定的。

### 事件驱动
JavaScript通过事件驱动的方式来处理异步操作：
- 事件循环（Event Loop）
- 事件队列（Event Queue）
- 宏任务（Macro-task）和微任务（Micro-task）

#### 1. 事件循环（Event Loop）
事件循环是JavaScript实现异步的核心机制，它主要负责：
- 执行同步代码
- 检查宏任务队列
- 执行微任务队列
- 更新渲染

执行顺序：
1. 执行同步代码（主线程）
2. 清空微任务队列（micro-task queue）
3. 执行一个宏任务（macro-task queue）
4. 重复步骤2-3
```javascript
// 事件循环示例
console.log('1'); // 同步代码
setTimeout(() => {
console.log('2'); // 宏任务
}, 0);
Promise.resolve().then(() => {
console.log('3'); // 微任务
});
console.log('4'); // 同步代码
// 输出顺序：1 -> 4 -> 3 -> 2
```


#### 2. 事件队列（Event Queue）
JavaScript中有两种主要的任务队列：

1. **宏任务队列（Macro-task Queue）**
   - setTimeout/setInterval
   - setImmediate (Node.js)
   - requestAnimationFrame (浏览器)
   - I/O操作
   - UI渲染
   - script标签

2. **微任务队列（Micro-task Queue）**
   - Promise.then/catch/finally
   - process.nextTick (Node.js)
   - MutationObserver
   - queueMicrotask

```javascript 
// 宏任务和微任务的执行顺序
setTimeout(() => {
console.log('宏任务1');
Promise.resolve().then(() => {
console.log('微任务2');
});
}, 0);
Promise.resolve().then(() => {
console.log('微任务1');
setTimeout(() => {
console.log('宏任务2');
}, 0);
});
// 输出顺序：微任务1 -> 宏任务1 -> 微任务2 -> 宏任务2

```


#### 3. 实际应用示例

1. **异步操作的优先级控制**

```javascript
// 高优先级任务使用微任务
function highPriorityTask() {
queueMicrotask(() => {
console.log('高优先级任务执行');
});
}
// 低优先级任务使用宏任务
function lowPriorityTask() {
setTimeout(() => {
console.log('低优先级任务执行');
}, 0);
}
```

2. **避免回调地狱的最佳实践**
```javascript
// 不好的实践
// 回调地狱示例
setTimeout(() => {
    console.log('1');
    setTimeout(() => {
        console.log('2');
        setTimeout(() => {
            console.log('3');
        }, 0);
    }, 0);
}, 0);

// 使用Promise改写
new Promise(resolve => {
    setTimeout(() => {
        console.log('1');
        resolve();
    }, 0);
}).then(() => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('2');
            resolve();
        }, 0);
    });
}).then(() => {
    setTimeout(() => {
        console.log('3');
    }, 0);
});

// 使用async/await改写（最优雅）
async function sequence() {
    await new Promise(resolve => setTimeout(() => {
        console.log('1');
        resolve();
    }, 0));
    
    await new Promise(resolve => setTimeout(() => {
        console.log('2');
        resolve();
    }, 0));
    
    await new Promise(resolve => setTimeout(() => {
        console.log('3');
        resolve();
    }, 0));
}

// 执行
sequence();
// 好的实践
async function betterWay() {
await new Promise(resolve => setTimeout(resolve, 0));
console.log('1');
await new Promise(resolve => setTimeout(resolve, 0));
console.log('2');
await new Promise(resolve => setTimeout(resolve, 0));
console.log('3');
}
```

#### 4. 注意事项

1. **性能考虑**
- 微任务优先级高，但不要过度使用
- 避免在微任务中执行耗时操作
- 合理使用宏任务分散负载

2. **常见陷阱**
```javascript
// 死循环微任务
function deadlock() {
Promise.resolve().then(() => deadlock());
}
// 这会阻塞事件循环，导致宏任务无法执行
```

3. **最佳实践**
- 耗时操作放入宏任务队列
- 需要即时响应的放入微任务队列
- 合理组合async/await与Promise
- 避免同步阻塞操作

### 回调函数（Callback）
最基础的异步编程方式，但可能导致回调地狱：
```javascript
// 回调地狱示例
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
      console.log('数据获取完成');
      });
    });
  });
});

```

### setTimeout和setInterval
用于延时执行和周期性执行任务的定时器函数：
```javascript
// setTimeout示例
setTimeout(function() {
  console.log('延时执行');
}, 1000);
```

### Promise
Promise是一种更优雅的异步编程解决方案，可以有效避免回调地狱：
```javascript
// Promise示例
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('数据获取完成');
  }, 1000);
});
```

### Generator
生成器函数提供了一种可以暂停和恢复执行的方式：
```javascript
function dataGenerator() {
const data1 = yield getData();
const data2 = yield getMoreData(data1);
const data3 = yield getMoreData(data2);
return data3;
}

// 使用生成器
const gen = dataGenerator();
gen.next().value.then(data1 => {
  gen.next(data1).value.then(data2 => {
    gen.next(data2).value.then(data3 => {
      console.log('最终数据:', data3);
    });
  });
});
```

### async/await
async/await是ES2017引入的一种更简洁的异步编程方式,它是Generator的语法糖:
```javascript
// async/await示例
async function fetchData() {
  const data1 = await getData();
  const data2 = await getMoreData(data1);
  const data3 = await getMoreData(data2);
  return data3;
}
```

### 实践建议
1. 优先使用async/await进行异步编程
2. 合理使用Promise.all()处理并发请求
3. 注意错误处理和异常捕获
4. 避免回调地狱
5. 合理使用定时器，注意及时清除不需要的定时器

### 总结
JavaScript的异步编程经历了从回调函数、Promise、Generator到async/await的演进过程，每种方式都有其适用场景：
- 回调函数：简单场景
- Promise：中等复杂度的异步操作
- Generator：需要精细控制执行流程的场景
- async/await：复杂的异步流程控制


### 异步编程方案对比

#### 1. 回调函数（Callback）
优点：
- 简单直接，容易理解
- 适用于简单的异步操作
- 基础代码量少

缺点：
- 容易产生回调地狱
- 错误处理复杂
- 代码可读性差
- 不能使用try-catch捕获错误

适用场景：
- 简单的一次性异步操作
- 事件监听处理


#### 2. Promise
优点：
- 链式调用，避免回调地狱
- 统一的错误处理机制
- 多个异步操作的状态管理
- 支持并行操作（Promise.all/race）

缺点：
- 无法取消执行
- 无法获取执行进度
- 代码较callback略微复杂

适用场景：
- 多个依赖异步操作
- 需要错误统一处理
- 并行异步操作


#### 3. Generator
默认执行之后会返回一个迭代器，
优点：
- 可以暂停和恢复执行
- 提供了更好的异步流程控制
- 可以在生成器函数内部捕获错误

缺点：
- 需要手动执行next()
- 代码较复杂
- 不直观，理解成本高

适用场景：
- 需要精确控制异步流程
- 需要实现迭代器
- 复杂的状态管理
```javascript
// 1.创建自定义的迭代规则
// 创建一个范围迭代器
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// 使用迭代器
const iterator = range(1, 5);
for (const value of iterator) {
  console.log(value);
}

// 2状态机管理：
function* playerStateMachine() {
    let state = 'IDLE';
    
    while(true) {
        switch(state) {
            case 'IDLE':
                state = yield '等待操作';
                break;
            case 'RUNNING':
                state = yield '正在奔跑';
                break;
            case 'JUMPING':
                state = yield '正在跳跃';
                break;
        }
    }
}
const player = playerStateMachine();
console.log(player.next().value); // "等待操作"
console.log(player.next('RUNNING').value); // "正在奔跑"
console.log(player.next('JUMPING').value); // "正在跳跃"

// 3. 异步操作控制
function* dataFetchFlow() {
    try {
        // 显示加载状态
        yield showLoading();
        
        // 获取数据
        const data = yield fetchData();
        
        // 处理数据
        yield processData(data);
        
        // 隐藏加载状态
        yield hideLoading();
    } catch (error) {
        yield handleError(error);
    }
}

// 4. 工作流程控制
function* uploadProcess() {
    // 检查文件
    const file = yield '检查文件';
    if (!file) throw new Error('文件不存在');
    
    // 压缩文件
    yield '压缩文件';
    
    // 上传
    const result = yield '上传中';
    
    // 更新界面
    yield '更新完成';
}
// 表单验证流程
function* formValidation() {
    // 验证用户名
    const username = yield '请输入用户名';
    if (!username) yield '用户名不能为空';
    
    // 验证密码
    const password = yield '请输入密码';
    if (password.length < 6) yield '密码太短';
    
    // 验证邮箱
    const email = yield '请输入邮箱';
    if (!email.includes('@')) yield '邮箱格式错误';
    
    return '验证通过';
}
```
#### 疑问
1. for of这里为啥没有使用next()?
可以手动使用next，也可以直接使用for of，Generator函数自动实现了迭代器协议，返回的对象自动实现Symbol.iterator方法;for of 循环内部自动调用next了;展开运算符；解构赋值；Array.from都会自动调用迭代器
```javascript
// for...of 循环内部大致相当于：
function forOf(iterator) {
    let result = iterator.next();
    while(!result.done) {
        console.log(result.value);
        result = iterator.next();
    }
}
// 这些语法都会自动调用迭代器：
const numbers = [...range(1, 5)];  // 展开运算符
const [a, b, c] = range(1, 3);     // 解构赋值
Array.from(range(1, 5));           // Array.from
```
2. Generator函数是为啥没有显式的return，但是却可以调用它的返回值？
Generator函数的隐式返回是Javascript引擎在调用时自动完成的，创建迭代器对象，设置内部状态，实现迭代器协议，返回这个迭代器对象。所以它总是会返回一个迭代器对象。
```javascript
// 1. Generator函数的简化实现原理
function* simpleGenerator() {
    console.log('开始执行');
    yield 1;    // 第一个暂停点
    yield 2;    // 第二个暂停点
    console.log('结束执行');
}

// 当我们调用Generator函数时，JavaScript引擎实际上会：
// 1. 创建一个迭代器对象
// 2. 设置初始状态
// 大致相当于以下代码：

function createGenerator() {
    // 创建迭代器对象
    const iterator = {
        // 内部状态
        _state: 0,
        
        // next方法实现
        next: function() {
            switch(this._state) {
                case 0:
                    this._state = 1;
                    return { value: 1, done: false };
                case 1:
                    this._state = 2;
                    return { value: 2, done: false };
                case 2:
                    return { value: undefined, done: true };
            }
        },
        
        // 实现迭代器协议
        [Symbol.iterator]: function() {
            return this;
        }
    };
    
    return iterator;
}
```
3. 有什么更真实的场景会使用到状态机呢？（TODO: 还需要更深入的学习了解）
游戏角色的状态（初始化，攻击，受伤，死亡等），中间可以加入其他不是这几个的动作或者事件。（状态可以自动保存在闭包中，不需要额外的状态管理代码）其他的需要手动维护状态，保存和恢复需要显示编写。

#### 使用Generator的关键考虑因素

1. 何时使用：
- 需要延迟计算
- 需要控制执行流程
- 需要自定义迭代逻辑
- 处理大量数据时需要分步处理

2. 何时不使用：
- 简单的异步操作（用async/await更合适）
- 不需要暂停/恢复的操作
- 团队对Generator不熟悉的情况

3. 注意事项：
- Generator函数的错误处理需要特别注意
- 需要考虑内存使用（特别是无限序列）
- 调试可能比普通函数更复杂


#### 4. Async/Await
优点：
- 同步代码风格编写异步
- 简洁直观，易于理解
- 更好的错误处理机制
- 支持try-catch捕获异常
- 便于调试

缺点：
- 可能导致性能问题（如果使用不当）
- 无法处理取消操作
- await会阻塞后续代码执行

适用场景：
- 复杂的异步业务逻辑
- 需要顺序执行的异步操作
- 依赖前一个异步结果的操作


#### 如何取消异步操作 
如果是fetch请求，优先使用AbortController
如果需要精细控制，考虑Generator
如果是复杂的异步流程，考虑RxJS
如果是简单场景，可以使用自定义Promise