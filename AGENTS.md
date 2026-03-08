# TeleConan

名侦探柯南 TV 动画版数据索引站，部署在 conan.xingrz.me。

## 架构概览

- 前端：Vue 3 + TypeScript + Vite，详见 `package.json`
- 数据：原始 YAML 存放在独立的 `data` orphan 分支，构建时通过 `scripts/slice.ts` 切片为 JSON
- 部署：GHA 自动部署到 GitHub Pages

## 分支策略

- `master` - 源代码
- `data` - 独立 orphan 分支，存放 fetcher 抓取的原始数据
- `gh-pages` - 构建产物

## 数据分片

前端通过链式分片 JSON 实现渐进加载。分片规则和文件命名见 `scripts/slice.ts`。

数据模型定义在 `src/types/`，streaming 通过 `maps_to.episode_num` 关联到 episode。

## 开发

- `npm run dev` - 开发服务器
- `npm run slice` - 单独运行分片脚本（需要 `data/` 目录下有 YAML 数据）
- `npm run build` - 完整构建（slice + vite build）

## 约定

- 不要直接编辑 `package.json` 的 dependencies，通过 `npm install` 安装
- Git 提交风格：简短英文描述
- 提交以项目作者名义，co-author 自己
