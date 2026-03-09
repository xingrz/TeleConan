[TeleConan](https://conan.xingrz.me)
====================================

[![Deploy](https://github.com/xingrz/TeleConan/actions/workflows/deploy.yml/badge.svg)](https://github.com/xingrz/TeleConan/actions/workflows/deploy.yml) [![Data Update](https://github.com/xingrz/TeleConan/actions/workflows/update.yml/badge.svg)](https://github.com/xingrz/TeleConan/actions/workflows/update.yml) ![Last Updated](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fxingrz%2FTeleConan%2Fraw%2Frefs%2Fheads%2Fdata%2Fstats.json&query=%24.updated_at&label=Last%20Updated&color=green) [![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](./LICENSE)

这个项目提供动画集数检索、来源筛选和流媒体映射查询，数据会定期自动更新，并以静态站点形式发布到 GitHub Pages。

## 技术栈

- Vue 3
- TypeScript
- Vite

## 本地开发

安装依赖：

```bash
npm install
```

准备数据目录：

```bash
git clone --branch data --single-branch https://github.com/xingrz/TeleConan.git data
```

构建数据与站点：

```bash
npm run build
```

启动开发服务器：

```bash
npm run dev
```

默认监听 `0.0.0.0:8080`。

## 数据与构建

原始数据维护在 [`data` 分支](https://github.com/xingrz/TeleConan/tree/data)。本地开发前需要先准备 `data/` 目录并执行一次 `npm run build`，否则站点不会有可用数据。

## 分支说明

- `master`：站点源码
- `data`：原始数据

## 自动化

- 数据更新由 GitHub Actions 定时执行
- 站点构建完成后自动部署到 GitHub Pages

## 许可

项目代码采用 [GPL-3.0](./LICENSE) 许可发布。
