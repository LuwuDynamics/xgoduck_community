<div align="center">

# XGO-Duck Community

结构 · 整机固件 · 动作模型 · 音视频交互

[探索社区作品](https://luwudynamics.github.io/xgoduck_community/) · [分享你的项目](CONTRIBUTING.md) · [社区讨论](https://github.com/LuwuDynamics/xgoduck_community/discussions)

[![Validate projects](https://github.com/LuwuDynamics/xgoduck_community/actions/workflows/validate.yml/badge.svg)](https://github.com/LuwuDynamics/xgoduck_community/actions/workflows/validate.yml)
[![Deploy GitHub Pages](https://github.com/LuwuDynamics/xgoduck_community/actions/workflows/pages.yml/badge.svg)](https://github.com/LuwuDynamics/xgoduck_community/actions/workflows/pages.yml)

</div>

XGO-Duck 社区项目目录。通过 PR 分享作品，项目源文件由作者自己的仓库独立维护。

**项目由原作者独立维护。** 这个仓库只保存项目元数据、展示素材与网站源码。访客通过卡片进入作者自己的 GitHub、MakerWorld 等项目页面，下载文件、查看更新和反馈问题。

## 项目分类

| 分类 | YAML 值 | 适合的项目 |
| --- | --- | --- |
| 结构 | `structure` | 3D 打印件、机械结构、轮足改装 |
| 整机固件 | `firmware` | 整机运行系统、控制固件、串口协议 |
| 动作模型 | `motion-model` | 运动策略、强化学习、仿真与模型部署 |
| 音视频交互 | `av-interaction` | 摄像头、语音、音频与视频交互 |

不同项目可以使用不同的硬件与固件，不要求相互兼容。请在条目中准确标注依赖和已验证版本。

## 分享你的项目

1. 在自己的平台公开发布项目，补充介绍、安装说明与许可证。
2. Fork 本仓库，将 [项目模板](examples/project-template.yaml) 复制到 `projects/your-project.yaml`。
3. 填写真实信息，可附截图、视频、文档和问题反馈地址。
4. 复制 [PR 正文模板](.github/pull_request_template.md) 提交 Pull Request，CI 自动检查，审核合并后网站自动更新。

具体字段与图片要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。也可以在 [projects/](projects/) 浏览已收录的 YAML。

初始正式目录为空。`examples/demo/` 的四个虚构项目只用于本地演示，**不会进入正式构建或 Pages 部署**。

## 本地运行

需要 Node.js 22 或更新版本，推荐 Node.js 24 LTS。

```sh
npm ci
npm run dev
```

访问终端打印的地址，默认为 `http://127.0.0.1:4173/xgoduck_community/`。修改文件后自动重新构建，刷新页面即可看到变化。按 `Ctrl+C` 停止。

需要查看有作品时的页面效果：

```sh
npm run dev:demo
```

演示页面顶部、卡片与详情页均有示例标识，作者仓库按钮禁用，页面禁止搜索引擎索引。修改 `site.config.json` 后需重启预览。

| 命令 | 用途 |
| --- | --- |
| `npm run validate` | 校验正式项目元数据与图片 |
| `npm test` | 元数据校验、转义与路径等回归测试 |
| `npm run build` | 构建正式网站至 `dist/` |
| `npm run build:demo` | 构建虚构演示至 `dist-demo/` |
| `npm run check` | 元数据校验 + 测试 + 正式构建 + 内部链接校验 |
| `npm run check:links` | 检查正式项目的外部链接可达性 |
| `npm run preview` | 预览已经生成的正式 `dist/` |

端口占用时可运行 `npm run dev:demo -- --port 4174`。本地服务只监听 `127.0.0.1`。

## 发布到 GitHub Pages

1. 将本目录内容作为独立仓库根目录上传至 `LuwuDynamics/xgoduck_community`，默认分支为 `main`。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 向 `main` 推送，或手动运行 **Deploy GitHub Pages** 工作流。
4. 部署成功后访问 `https://luwudynamics.github.io/xgoduck_community/`。

工作流使用 GitHub 官方 [自定义 Pages 部署流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)，无需服务器、数据库或个人访问令牌。

如果组织名、仓库名、分支或域名不同，请修改 `site.config.json`，并同步 README 的徽章与入口、`.github/ISSUE_TEMPLATE/config.yml` 的地址，以及两个工作流里的 `main` 分支条件。

建议在仓库设置中启用 **Discussions**，并通过分支保护 / Rulesets 将 `Validate projects / validate` 设为合并必需检查。自动部署只在 `main` 执行，PR 不拥有 Pages 部署权限。

## 仓库结构

```text
xgoduck_community/
├── projects/                  # 正式项目，一份 YAML 对应一个作品
├── examples/
│   ├── project-template.yaml  # 提交模板
│   └── demo/                  # 虚构项目，仅用于演示
├── schemas/                   # JSON Schema
├── website/
│   ├── templates.mjs          # 静态页面模板
│   └── public/assets/         # CSS、浏览器 JS、图片
├── scripts/                   # 校验、构建、链接检查、本地预览
├── test/                      # 回归测试
├── .github/                   # PR 模板与 Actions
├── site.config.json
└── CONTRIBUTING.md
```

页面在构建时生成完整 HTML；关闭 JavaScript 仍可浏览作品、详情与贡献指南。JavaScript 增强搜索、分类、硬件筛选、排序和可复制的筛选链接。使用相对静态资源路径，适配 GitHub Pages 仓库子路径。每次构建重新生成目录，移除 YAML 会同步移除详情页；`projects.json` 提供同一批元数据的公开 JSON 索引。

投稿页提供可复制和下载的 YAML 与 PR 正文模板，与仓库中的模板保持同步。界面配色、品牌字标、黑色按钮、黄色标题标记和灰绿分区参考 [XGORobot Duck 页面](https://www.xgorobot.com/duck.html)，阅读文字使用更深的颜色与更大的字号。

## 项目维护与责任边界

- 社区维护者负责目录审核与网站维护；第三方项目的代码、版本和 Issue 由原作者维护。
- 项目条目说明兼容性，不代表官方认证或跨项目兼容保证。
- 原项目许可证适用于原项目及其素材；在条目中注明许可证不会改变其授权。
- 更新信息或下架作品，提交 PR 修改或删除对应 YAML 即可，并清理不再使用的图片。
- 外部链接可能被限流或禁止自动访问。CI 对 404 / 410 判定失败；403、429、超时和其他不确定结果提示维护者人工复核。

维护者操作与审核建议见 [docs/MAINTAINERS.md](docs/MAINTAINERS.md)。
