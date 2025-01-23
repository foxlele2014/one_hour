---
title: webpack注意事项
date: 2018-02-07 15:40:59
tags:
- webpack
category: 
- 自动化
---

### 计划写的内容
- publicPath
- outputPath
- contentBase
- webpack runtime code 
- 等

### Webpack配置核心概念

#### 1. 路径配置
##### publicPath（公共路径）
- 作用：指定资源的访问路径前缀
- 配置位置：output.publicPath
```javascript
// webpack.config.js
module.exports = {
  output: {
  publicPath: '/assets/', // 生产环境
  // publicPath: '/', // 开发环境
  // publicPath: 'https://cdn.example.com/' // CDN环境
  }
}
```

##### outputPath（输出路径）
- 作用：指定打包文件的输出目录
- 配置位置：output.path
```javascript
// webpack.config.js
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist')
  }
}
```

##### contentBase（开发服务器静态资源目录）
- 作用：配置开发服务器的静态资源访问
- 配置位置：devServer.contentBase
```javascript
module.exports = {
  devServer: {
  contentBase: path.join(dirname, 'public'),
  // 支持多个静态资源目录
  contentBase: [
      path.join(dirname, 'public'),
      path.join(dirname, 'assets')
    ]
  }
}
```


#### 2. Webpack Runtime Code
##### 运行时代码
- 作用：管理模块的加载和依赖关系
- 优化方案:
  - 使用SplitChunksPlugin
  - 使用DllPlugin
  - 使用externals
  - 使用import()
  - 使用require.ensure
  - 使用require.include
  - 使用require.ensure
  - 使用require.include

```javascript 
module.exports = {
  optimization: {
    // 提取运行时代码
    runtimeChunk: {
      name: 'runtime'
    },
    // 持久化缓存
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  }
}
```


#### 3. 常见优化配置

##### 1. 分包策略
```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  }
}
```


##### 2. 缓存优化
```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  // 持久化缓存
  cache: {
    type: 'filesystem'
  }
}
```

##### 3. 开发体验优化
```javascript
module.exports = {
  devServer: {
    hot: true, // 热更新
    open: true, // 自动打开浏览器
    compress: true, // gzip压缩
    proxy: { // 接口代理
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api': ''}
      }
    }
  }
}
```


#### 4. 常见问题解决

##### 1. 路径问题
- publicPath配置不当导致资源404
- 开发环境和生产环境路径不一致
- 静态资源访问路径错误

##### 2. 缓存问题
- 文件名hash不更新
- 浏览器缓存未清除
- 运行时代码频繁变化

##### 3. 性能问题
- 包体积过大
- 首屏加载慢
- 重复打包

#### 5. 最佳实践

1. **路径配置**
- 开发环境使用相对路径
- 生产环境根据部署策略配置
- CDN路径配置时注意版本控制

2. **缓存策略**
- 合理使用contenthash
- 提取运行时代码
- 配置持久化缓存

3. **开发优化**
- 启用热更新
- 配置合适的source-map
- 使用webpack-bundle-analyzer分析包体积


### Webpack运行原理及中间件实现

#### 1. Webpack运行原理
##### 基本流程
```javascript
// 简化版的webpack工作流程
class Webpack {
constructor(options) {
this.options = options;
this.hooks = {
// 定义各个生命周期钩子
run: new SyncHook(),
emit: new SyncHook(),
done: new SyncHook()
};
}
```

```javascript
run() {
// 1. 读取入口文件
const entry = this.options.entry;
// 2. 解析依赖
const dependencies = this.parse(entry);
// 3. 转换代码
const transformedCode = this.transform(dependencies);
// 4. 生成bundle
this.emit(transformedCode);
}
}
```

##### 中间件机制
```javascript
// Webpack中间件实现
class WebpackMiddleware {
constructor() {
this.middlewares = [];
}
use(middleware) {
this.middlewares.push(middleware);
}
async execute(context) {
// 洋葱模型实现
const dispatch = async (i) => {
if (i === this.middlewares.length) return;
const middleware = this.middlewares[i];
await middleware(context, () => dispatch(i + 1));
};
await dispatch(0);
}
}
```


#### 2. 自定义Webpack中间件示例
- 通过tapAsync或tap注册到具体的钩子上
- 处理完成后调用callback()继续下一个中间件
- 同步操作用tap
- 回调式异步用tapAsync
- Promise式异步用tapPromise
```javascript
// 1. 文件处理中间件
function fileProcessMiddleware() {
return async (context, next) => {
console.log('开始处理文件');
// 处理文件逻辑
await next();
console.log('文件处理完成');
};
}
// 使用中间件
const compiler = new WebpackMiddleware();
compiler.use(fileProcessMiddleware());
```

```javascript
// 1. 标准的Webpack中间件写法
class MyMiddleware {
    apply(compiler) {
        // 在不同的钩子上注册处理函数
        compiler.hooks.beforeCompile.tapAsync('MyMiddleware', (params, callback) => {
            // 在这里处理beforeCompile阶段的逻辑
            callback();
        });

        compiler.hooks.emit.tapAsync('MyMiddleware', (compilation, callback) => {
            // 在这里处理emit阶段的逻辑
            callback();
        });
    }
}

// 2. 使用中间件
const webpack = require('webpack');
const config = {
    // webpack配置
    plugins: [
        new MyMiddleware()
    ]
};
```

```javascript
// 1. Webpack插件标准写法（使用apply）
class WebpackPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
            // 处理逻辑
            callback();
        });
    }
}

// 2. 函数式中间件写法
const webpackMiddleware = (compiler) => {
    compiler.hooks.emit.tapAsync('MyMiddleware', (compilation, callback) => {
        // 处理逻辑
        callback();
    });
};

// 3. 使用Generator的中间件写法
function* webpackMiddleware(compiler) {
    // 在不同阶段执行
    yield new Promise((resolve) => {
        compiler.hooks.emit.tapAsync('MyMiddleware', (compilation, callback) => {
            // 处理逻辑
            callback();
            resolve();
        });
    });
}

// 4. 简单函数写法
const simpleMiddleware = (options) => (req, res, next) => {
    // 处理逻辑
    next();
};
```
