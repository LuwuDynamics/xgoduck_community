# 维护社区目录

## 首次上线

本地文件夹已经具备完整源码与 GitHub 工作流；它本身不会创建远程仓库或启用 GitHub Pages。

1. 建立公开仓库 `LuwuDynamics/xgoduck_community`，以本目录为仓库根目录，默认分支使用 `main`。
2. 检查 `site.config.json` 中组织、仓库名与最终网站 URL。
3. 推送源码与 `package-lock.json`，不要上传 `node_modules/`、`dist/` 或 `dist-demo/`。
4. 在 Settings → Pages 中将 Source 设为 GitHub Actions。
5. 启用 Discussions，设置合适的讨论分类（例如项目交流、开发问答、想法）。
6. 开启 `main` 的合并保护，将 `Validate projects / validate` 设为必需检查。
7. 在 Actions 确认校验与部署完成，检查首页与贡献指南。

如尚未添加真实项目，正式网站会显示邀请首位贡献者的空目录。不要为了填满页面将演示 YAML 复制到 `projects/`。

## 审核 PR

- 打开项目主页，确认是真实的 XGO-Duck 相关作品，作者身份或授权清晰。
- 检查介绍、图片、许可证、安装步骤与已验证兼容范围；兼容性未知应明确写出。
- 确认下载和问题反馈链接回到原作者的平台。
- 浏览 CI 警告。403 / 429 或超时不代表链接失效，需人工打开复核；不存在的链接应修正。
- 仅收录 YAML 与必要的展示图片。拒绝二进制固件包、大型模型、训练权重、整份源码与敏感信息。
- YAML 被视为不可信输入：网站对文本转义，不执行条目中的 HTML、Markdown 或命令。贡献者的 SVG 不作为本地图片接受。
- PR 使用只读校验工作流；不使用 `pull_request_target`，不向第三方链接发送 GitHub Token。链接检查解析公开 DNS 并验证每次重定向。

如果 PR 修改了工作流、构建脚本或依赖，应按代码变更单独审阅。纯条目 PR 通常只需要审阅 `projects/` 和 `website/public/assets/projects/`。

## 合并与故障

合并到 `main` 后，Pages 工作流先校验、测试并构建 `dist/`，再通过独立部署 job 发布。部署权限只授予部署 job。演示目录不会上传。

构建失败时上一版本的网站继续提供服务；修正 YAML、图片或构建错误后重新推送。首次部署失败时，先确认 Pages Source 已选择 GitHub Actions，仓库组织策略允许对应 Actions，并检查工作流日志。

外部链接检查在 `Validate projects` 工作流中执行。Pages 构建不依赖第三方服务器实时可达性，避免某个作者平台临时限流阻塞整个网站。通过分支保护确保 PR 的校验已经完成再合并。

## 配置与扩展

- 网站身份：`site.config.json`。更换仓库时，也修改 README、Issue 入口与工作流分支条件。
- 数据规则：`schemas/project.schema.json` 和 `scripts/lib/catalog.mjs`。
- 页面与样式：`website/templates.mjs` 与 `website/public/assets/`。
- 分类：`CATEGORIES` 与 Schema 的枚举需同步修改。
- 排序：默认按 `updated` 降序；页面支持名称排序、分类、关键词和硬件筛选，并将状态保存在 URL。
- 资源路径：详情页两层相对路径、贡献指南一层相对路径；404 使用 `siteUrl` 的 Pages 前缀。
- `projects.json` 是公开的构建产物，不应在项目 YAML 放入非公开联系方式或其他私密信息。

网站仅为公开项目索引，不需要后台数据库、账号系统、API Key 或安装服务。
