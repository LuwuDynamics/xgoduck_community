# 分享你的作品

[English submission guide](CONTRIBUTING.en.md)

中文或英文任选一种即可，不要求双语，也不代译。切换网站界面语言不会翻译作品内容。

## 直接填表，推荐

打开[投稿表单](https://github.com/LuwuDynamics/xgoduck_community/issues/new?template=share-project.yml)，填写：

- 项目名称、所属板块和作品链接。
- 项目说明。
- 图片：可以拖入表单上传，也可以粘贴图片链接。
- 视频链接：可选。

MakerWorld、GitHub 等平台都可以。无需创建自己的代码仓库、下载社区仓库或安装软件。维护者会在投稿中沟通并审核收录。

## 晒晒小鸭

想分享自己的小鸭照片、日常或视频，打开[小鸭分享表单](https://github.com/LuwuDynamics/xgoduck_community/issues/new?template=share-duck.yml)。填分享标题与说明，直接拖入图片上传，或粘贴视频链接。图片与视频至少提供一项，昵称可选，不需要作品链接或代码仓库。

也可以复制[小鸭分享模板](docs/DUCK_SHARE_TEMPLATE.md)，在 `projects/` 新建介绍并提 PR。所属板块填「晒晒小鸭」。维护者审核收录后，这些分享会与其他分类一起显示在[作品目录](https://luwudynamics.github.io/xgoduck_community/?category=duck-life#explore)。

## 使用 AI Agent

复制 [Agent 投稿提示词](docs/AGENT_SUBMISSION_PROMPT.md)，填入作品链接和现有资料，发给你的 AI Agent 即可。[网页投稿页](https://luwudynamics.github.io/xgoduck_community/contribute/#agent)支持一键复制和下载。

提示词默认整理并创建投稿 Issue，也可以指定 PR 或只整理材料。缺少必需资料时，Agent 应先向作者确认；没有提交权限时，应返回可粘贴的正文和投稿链接。

## 通过 PR 投稿

如果已经熟悉 GitHub，也可以直接提交一份介绍：

1. 在网页[新建项目介绍](https://github.com/LuwuDynamics/xgoduck_community/new/main/projects)，文件名可用 `我的轮足.md`。
2. 复制[投稿模板](.github/pull_request_template.md)，填好说明、图片和链接。板块选择「结构」「整机固件」「动作模型」或「音视频交互」。
3. 按 GitHub 提示提交 Pull Request，合并后网站自动更新。

GitHub 可能提示创建社区仓库的副本，用来提交 PR；原作品仍可以只发布在 MakerWorld。全程可以在网页完成。

图片支持 GitHub 上传后生成的 Markdown、HTML 图片标签或直接的 HTTPS 图片地址。视频可以粘贴 B 站、YouTube 等 HTTPS 链接，没有视频留空即可。可选的图片最多 7 张，第一张作为封面。

## 更新或下架

在原投稿下留言说明，或提 PR 修改、删除相应介绍。维护者也可让管理员 Agent 按[维护指南](docs/MAINTAINERS.md#给管理员-agent-的下架删除提示词)处理。

删除进入主分支并部署后，网站移除卡片和详情页。原平台的作品不受影响。
