---
title: 在浏览器输入URL后发生了什么
date: 2018-02-07 15:37:32
tags:
- http
category:
- 科普
---

- 相对路径、绝对路径
- http(请求头、状态码)
- dns
- tcp三次握手
### 概览
用户在浏览器输入 URL（或点击链接）后，浏览器会把高层的“请求页面”行为拆成若干步骤：解析 URL、DNS 查询、建立传输层连接（TCP / TLS）、发送 HTTP 请求、接收响应后处理缓存与重定向、下载资源并执行解析/渲染、最终呈现并触发页面事件（DOMContentLoaded、load）。下面按序简要说明要点与常见优化点。

### 1. URL 与路径解析
- 绝对 URL：包含协议、主机和路径（如 https://example.com/path）。
- 相对 URL：基于当前文档的 location 或 <base> 标签解析（如 ../img.png）。
- 协议相对（//example.com）继承当前协议（较少用）。
- 路径解析影响请求 Host、Referer、同源策略。

### 2. DNS 解析
- 浏览器/操作系统首先查询域名到 IP：先查本地缓存，再系统 DNS 缓存/hosts、最后向递归 DNS 服务器查询。
- 可以被 DNS 缓存、CDN 和解析加速（DNS 预解析 dns-prefetch）.

### 3. 建立连接：TCP 三次握手
- 客户端发送 SYN -> 服务器 SYN+ACK -> 客户端 ACK，建立可靠连接。
- 之后可通过该连接发送请求（TCP 有拥塞控制、慢启动）。
- HTTP/1.1 通常复用 keep-alive 连接；HTTP/2 在单连接上多路复用多个请求。

### 4. TLS（HTTPS）握手（若使用 https）
- 在 TCP 建立后进行 TLS 握手：协商协议版本、交换证书、公钥，生成对称密钥。
- 握手完成后加密的应用层数据传输开始（会增加连接延迟，通常通过 TLS 复用、session resumption 优化）.

### 5. 发送 HTTP 请求
- 客户端构造请求行 + 请求头（Host、User-Agent、Accept、Cookie、Referer 等），然后可有请求体（POST/PUT）。
- 示例（简略）：
  GET /path/resource HTTP/1.1
  Host: example.com
  Accept: text/html
- 可能遇到重定向（3xx）或鉴权（401/403）.

### 6. 服务端响应与状态码
- 响应包含状态码、响应头、以及可选的响应体。
- 常见状态码：200（成功）、301/302（重定向）、304（未修改，使用缓存）、4xx（客户端错误）、5xx（服务器错误）。
- 缓存相关头：Cache-Control、Expires、ETag、Last-Modified。若命中 304，浏览器可使用本地缓存资源。

### 7. 浏览器接收响应与缓存策略
- 浏览器依据响应头决定是否缓存、如何验证缓存（协商缓存：If-Modified-Since / If-None-Match）。
- Service Worker 可拦截请求并自定义缓存/离线策略。
- CDN 可在边缘缓存静态资源减少延迟。

### 8. 浏览器解析与渲染流水线
- HTML -> 解析器构建 DOM 树。
- CSS -> 构建 CSSOM。
- DOM + CSSOM -> 合成 render tree（只包含可见节点）。
- Layout（reflow）：计算每个节点的几何位置与大小。
- Paint：把节点绘制成图层像素。
- Composite：合并图层到屏幕。
- JS 脚本会在解析 HTML 时执行（普通 <script> 会阻塞解析；使用 async/defer 可避免阻塞或推迟执行）。
- 图片、脚本、样式表是外部资源，按优先级并行/串行下载（受同源并发限制、HTTP/2 多路复用影响）.

### 9. 页面生命周期事件与指标
- DOMContentLoaded：DOM 构建完成且无需等待样式/图片完成（脚本阻塞则会延迟）。
- load：页面所有资源完成加载。
- 性能指标：FP（First Paint）、FCP（First Contentful Paint）、LCP（Largest Contentful Paint）、TTI（Time to Interactive）.

### 10. 优化与工程实践要点
- 合理使用 CDN 与缓存策略，减少 DNS/连接/首字节延迟（TTFB）。
- 使用 HTTP/2/3 减少连接成本、多路复用与头部压缩。
- 减少阻塞脚本，使用 async/defer，优先加载关键 CSS（critical CSS）。
- 合并/压缩资源，使用图片现代格式与响应式图片，启用 gzip/brotli 压缩。
- 使用 Prefetch、Preconnect、DNS-Prefetch、Preload 等 hint 优化关键资源加载。
- 在调试时用 DevTools Network 面板：查看请求/响应头、时间线、缓存命中、重定向链。

### 11. 安全与协议相关
- 同源策略限制跨域 JS/DOM 访问；CORS 决定跨域资源是否可被脚本访问。
- HTTPS 保证传输加密与证书验证；HSTS 强制 HTTPS。
- Cookie/Set-Cookie 头与 SameSite、HttpOnly、Secure 等影响安全与跨站行为。

小结
用户在地址栏输入 URL 后的流程是多阶段、跨层（DNS → 传输 → 应用 → 渲染）的流水线。理解每一层的延迟来源与优化手段（DNS、连接、TLS、TTFB、渲染阻塞）有助于定位性能瓶颈并改进用户体验。