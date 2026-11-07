# XGO-Duck Community

结构 · 整机固件 · 动作模型 · 音视频交互

[社区作品](https://luwudynamics.github.io/xgoduck_community/) · [填表投稿](https://github.com/LuwuDynamics/xgoduck_community/issues/new?template=share-project.yml) · [社区讨论](https://github.com/LuwuDynamics/xgoduck_community/discussions)

分享 XGO-Duck 的作品介绍、图片和视频。原作品可以放在 MakerWorld、GitHub 或其他平台，由作者自己维护。

## 分享作品

**推荐直接[填写投稿表单](https://github.com/LuwuDynamics/xgoduck_community/issues/new?template=share-project.yml)。** 登录 GitHub，填介绍、拖入图片、粘贴作品链接和可选视频链接。维护者审核后收录。

MakerWorld 作者不需要另外建立代码仓库，也不需要安装任何软件。

熟悉 GitHub 的作者，也可以在 `projects/` 新建一份 Markdown 介绍并提 PR，全部在网页完成。直接复制[简单投稿模板](.github/pull_request_template.md)即可，步骤见[投稿说明](CONTRIBUTING.md)。

使用 AI Agent 的作者可直接复制 [Agent 投稿提示词](docs/AGENT_SUBMISSION_PROMPT.md)，或在[投稿页](https://luwudynamics.github.io/xgoduck_community/contribute/#agent)一键复制。提供作品链接与现有资料，Agent 即可帮助整理介绍并投稿。

## 四个板块

| 板块 | 内容 |
| --- | --- |
| 结构 | 打印件、机械结构、轮足改装 |
| 整机固件 | 整机运行与控制固件 |
| 动作模型 | 运动策略、训练与模型 |
| 音视频交互 | 视觉、语音、音频与视频交互 |

## 网站维护

网站使用原生 HTML、CSS、JavaScript，构建只依赖 Node.js 22+，没有第三方依赖，也没有安装步骤。投稿人不需要运行以下命令。

```sh
node scripts/build.mjs
```

合并到 `main` 后，GitHub Actions 自动检查并部署到 GitHub Pages。首次设置 Pages 时，Source 选择 **GitHub Actions**。

维护者本地预览：

```sh
node scripts/serve.mjs --build --watch
```

查看四个虚构演示作品时加 `--demo`。演示不会发布到正式网站。

```sh
node scripts/serve.mjs --build --watch --demo
```

默认地址：`http://127.0.0.1:4173/xgoduck_community/`。数据位于 `projects/*.md`，网站身份配置位于 `site.config.json`。

## 项目维护与责任边界

社区仓库保存作品介绍和展示链接。下载、安装和问题反馈请到原作品页面。更新或下架可以在原投稿中说明，也可以提交 PR 修改或删除相应 Markdown 文件。

维护者审核步骤见 [docs/MAINTAINERS.md](docs/MAINTAINERS.md)。
