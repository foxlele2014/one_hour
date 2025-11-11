---
title: 远程桌面服务搭建
date: 2025-01-20 17:29:14
tags:
---

- novnc
- guacamole

### 概览
VNC 是远程桌面协议家族（RFB），常用服务端有 TigerVNC、x11vnc 等。noVNC 提供基于 Web 的 VNC 客户端（通过 WebSocket + canvas），Guacamole 是一个更完整的网关，支持 VNC/RDP/SSH 并提供 Web 界面与认证后端（可用 Docker 部署）。

### 常见方案对比
- noVNC：轻量、直接把 VNC 流量通过 websockify 转成 WebSocket，适合需要快速在浏览器打开远程桌面的场景。
- Guacamole：企业级网关，支持多协议、认证、会话管理、录制/剪贴板/文件传输（通过扩展），适合集中化接入。

### Ubuntu 上的快速示例（最小化）
1) 安装 VNC 服务（TigerVNC）并创建用户桌面：
```bash
sudo apt update
sudo apt install -y tigervnc-standalone-server xfce4
# 为用户设置 vnc 密码
vncpasswd
# 启动（示例）：
vncserver :1 -geometry 1280x800 -depth 24
```
2) 使用 noVNC（websockify）暴露到浏览器：
```bash
# 安装 noVNC (示例)
git clone https://github.com/novnc/noVNC.git
git clone https://github.com/novnc/websockify.git noVNC/utils/websockify
# 启动 noVNC，连接到本地 VNC :1（5901）
./noVNC/utils/novnc_proxy --vnc localhost:5901 --listen 6080
# 然后在浏览器访问 http://server:6080/vnc.html
```

### Guacamole（推荐用 Docker 快速部署）
使用官方 Docker 镜像和 MySQL/Postgres 后端的最小 docker-compose 示例（省略持久化/细节）：
```yaml
version: '3'
services:
  guacd:
    image: guacamole/guacd
  guacamole:
    image: guacamole/guacamole
    links:
      - guacd
      - db
    environment:
      MYSQL_HOSTNAME: db
      MYSQL_DATABASE: guacamole_db
      MYSQL_USER: guacamole_user
      MYSQL_PASSWORD: secret
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: rootpw
      MYSQL_DATABASE: guacamole_db
      MYSQL_USER: guacamole_user
      MYSQL_PASSWORD: secret
```
启动后访问 guacamole 容器提供的 web 界面，配置 VNC 连接并启用用户/权限。

### 安全与运维要点
- 永远为 VNC 连接设置强密码；默认 VNC 协议无加密，建议通过 TLS 或 SSH 隧道转发 VNC（或使用 noVNC + nginx TLS 反向代理）。
- 若使用 noVNC，使用 websockify 的 TLS 或在前端用 Nginx/Traefik 做 HTTPS 终端并限制访问（认证/防火墙）。
- Guacamole 提供认证与会话控制，但仍需放在 HTTPS 和受限网络后面；为 Guacamole 数据库启用备份与最小权限用户。
- 防火墙：仅开放必要端口（如 6080/8443 给 Web，VNC 原生端口建议仅内部可达）。
- 性能：降低色深、启用压缩、调整分辨率可改善带宽占用；HTTP/2/3/负载均衡用于大规模访问场景。

### 小结
- 简单场景：TigerVNC + noVNC 快速可用，适合临时或轻量化需求。
- 企业/集中管理：Guacamole 更完整，支持多协议与认证/审计。
- 部署时优先考虑加密（HTTPS/TLS/SSH 隧道）、认证与防火墙策略，并在生产环境使用持久化存储与监控。

### 其他
novnc使用虚拟机来建立多账号访问的时候，会很卡。
但是guacamole创建的服务，可以在一台电脑上，创建多个账号，使用rdp协议来达到同时可以多个人使用不同账号连接这台电脑使用服务。

TODO:具体的细节之后再分享。

（背景：需求：通过网页输入链接来达到访问某台服务器的服务，而且支持多账号访问同一个服务器的不同服务。且最好能使用一台电脑就能做这个事情。
之后一开始我接手的时候，他们定好了要使用novnc来实现。且他们使用创建多个虚拟机+novnc来访问，但是这样很卡；这期间还做了很多关于novnc进入页面时的自动登录；密码管理，域账号管理等；后来他们觉得novnc的这个方案还是不可行，所以选择了guacamole的方案。但是怎么可以做到访问多个账号呢。就是需要一个应用将windows类似破解一样，让它支持rdp访问支持同时在线。）