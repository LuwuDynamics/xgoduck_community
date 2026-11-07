# 维护社区目录

## 审核网页投稿

1. 打开原作品链接，确认与 XGO-Duck 相关、介绍和素材可用于展示。
2. 审核通过后，复制 Issue 正文，在 `projects/` 新建一份 `作品名.md`。Issue 表单的标题格式与投稿文件相同，可以直接复制。
3. 提交或合并该文件，网站自动更新。随后在原投稿中告知作者收录结果。

收到 PR 时直接审核 Markdown 介绍与原作品即可。作者无需提供代码仓库、兼容性表格或本地构建结果；安装与适配信息以原作品页面为准。

## 数据格式

每份 Markdown 使用六个三级标题：项目名称、所属板块、作品链接、项目说明、图片、视频链接。前四项必填，图片与视频可留空。可选添加「作者」三级标题署名。

四个板块：结构、整机固件、动作模型、音视频交互。项目文件名可以用中文或英文，也支持空格、数字、下划线和连字符，最多 80 字符。

图片可直接复制 GitHub 附件的 Markdown 或 HTML 标签，构建程序只读取其中的 HTTPS 图片链接，不执行 HTML。说明作为纯文本展示。不要放入私人信息、访问令牌、模型权重或固件包。

## 构建与部署

只有一份 GitHub 工作流：PR 自动检查，合并到 `main` 后自动部署。没有第三方构建依赖，不需要安装包。

```sh
node --test
node scripts/build.mjs
node scripts/check-build.mjs
node scripts/check-links.mjs
```

前两项验证说明格式并生成网站，第三项检查站内链接，最后一项检查原作品、图片与视频的外部链接。404 / 410 判失败，403 / 429、超时等结果提示人工复核。

如需分支保护，将工作流的 `build` 检查设为必需。如果此前设置过已移除的 `validate` 检查，请改用 `build`。

GitHub Pages 的 Source 使用 GitHub Actions；部署目录为 `dist/`。`dist-demo/` 的四个虚构作品只供本地预览，不参与正式部署。构建失败时，上一次已部署的网站仍然可用。

## 修改网站

- 作品数据：`projects/*.md`。
- 网站身份：`site.config.json`。
- 页面：`website/templates.mjs`。
- 样式与浏览器脚本：`website/public/assets/`。
- 投稿表单：`.github/ISSUE_TEMPLATE/share-project.yml`。
- 投稿与 PR 模板：`.github/pull_request_template.md`，网站复制和下载使用同一文件。

配色参考 [XGORobot Duck 官网](https://www.xgorobot.com/duck.html)。本地查看：`node scripts/serve.mjs --build --watch`；演示加 `--demo`。
