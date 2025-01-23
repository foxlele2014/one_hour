---
title: debug的各种姿势
date: 2018-02-07 17:03:45
tags:
- debug 
category: 
- debug
---

- [ ] wireshark
- [ ] pc端和移动端调试
- [ ] node调试方法


## wireshark

### 过滤器使用：
常用过滤语法：
- ip.addr == 192.168.1.1    // 指定IP
- tcp.port == 80            // 指定端口
- http                      // HTTP协议
- tcp.flags.syn == 1        // TCP SYN包
- frame contains "password"  // 包含关键字

### 抓包技巧
定位问题：
- 使用颜色标记重要数据包
- 跟踪TCP流
- 查看协议层级
- 分析握手过程
- 检查重传包

### 调试场景
- 网络连接问题
- HTTP请求分析
- WebSocket通信
- DNS解析问题
- SSL/TLS问题

### 实用快捷键

快捷操作：
- Ctrl + E    // 开始/停止捕获
- Ctrl + R    // 重新开始捕获
- Ctrl + F    // 查找
- Ctrl + .    // 转到下一个包
- Ctrl + ,    // 转到上一个包


### 调试建议
- 先用过滤器缩小范围
- 关注异常状态码
- 检查响应时间
- 分析错误包
- 保存重要捕获


## PC端和移动端调试

### PC 端
1. console 
2. 断点
3. postman接口测试
4. 性能分析（performance面板，memory面板）

#### Performance面板
录制步骤：
1. 点击录制按钮（⚫）
2. 进行页面操作
3. 停止录制
4. 分析火焰图：
   - 红色：JavaScript执行
   - 紫色：页面渲染
   - 绿色：页面绘制
   - 灰色：空闲时间

#### Memory面板
Memory面板三种分析方式：
1. Heap Snapshot（堆快照）
   - 拍摄快照
   - 对比前后变化
   - 查看内存占用

2. Allocation Timeline（分配时间轴）
   - 记录内存分配
   - 查看对象生命周期
   - 定位频繁GC

3. Allocation Sampling（分配采样）
   - JS堆分配
   - 定位大对象
  
#### 常见性能问题
排查要点：
- 长任务阻塞
- 频繁GC
- DOM操作过多
- 图片资源过大
- 未释放的事件监听
- 闭包导致的内存泄露

#### 优化建议
- 使用防抖节流
- 虚拟列表
- 图片懒加载
- 合理使用缓存
- 及时解绑事件
- 避免闭包滥用
- 代码分割
- 资源压缩
- CDN加速
- 合理缓存

### 移动端
常用方法：
- Chrome远程调试（Android）
- Safari调试（iOS）
- vConsole（移动端调试工具）
- Eruda（移动端调试面板）
- Charles/Fiddler（抓包）

Charles/Fiddler 本地文件映射（https需要额外的配置）

#### Charles配置
本地文件映射步骤：
1. Tools -> Map Local
2. Add New Mapping
3. 设置：
   - 远程URL路径
   - 本地文件路径
   - 启用/禁用规则

### Fiddler配置
AutoResponder设置：
1. 切换到AutoResponder标签
2. Enable rules
3. 添加规则：
   - 匹配规则（正则/通配符）
   - 选择本地文件
   - 设置响应类型

### 场景
- 替换线上JS/CSS文件
- 修改API响应数据
- 测试不同版本
- 调试线上问题
- 模拟各种响应
