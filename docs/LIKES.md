# 页面内点赞

## 评估与方案

使用 [giscus](https://giscus.app/zh-CN) 的 GitHub Discussions 反应功能。无需自建服务器、数据库或登录服务。只在正式作品详情页加载一个组件，不在每张目录卡片里加载 iframe。演示数据不会创建实际讨论或点赞。

用户首次需要登录并授权 GitHub，默认会跳转到 GitHub 再回到原页面；登录后，可在详情页点赞，再次点击已添加的 👍 取消。初次没有点赞时，从「点赞」菜单选择 👍。同一账号的同类反应不重复累加；不限制多账号。

计数和登录状态由 GitHub／giscus 提供，不使用本地伪造计数。组件的自定义主题隐藏评论区，并在反应选择菜单中只显示 👍。通过 GitHub 直接添加的其他反应仍可能出现在组件中。

## 一次性启用

目前 `site.config.json` 中的 `reactions.enabled` 保持 `false`，避免仓库未授权时在网站显示错误组件。

1. 仓库管理员打开 [giscus GitHub App](https://github.com/apps/giscus)，安装时只选择 `LuwuDynamics/xgoduck_community`。这一授权需要管理员在 GitHub 完成，不在仓库中保存访问令牌。
2. 本仓库已启用 Discussions，并已核对 `Announcements` 分类及公开 ID。安装完成后访问 [配置检查接口](https://giscus.app/api/discussions/categories?repo=LuwuDynamics%2Fxgoduck_community)，应返回 HTTP 200，且仓库与分类 ID 匹配 `site.config.json`。不要把 403 或安装未完成当成已启用。
3. 把 `reactions.enabled` 改为 `true`，构建、提交并等待 Pages 部署成功。`giscus.json` 仅允许本网站来源加载。
4. 用已获准的真实投稿详情页验证：未登录可见登录入口；完成 GitHub 授权；选择 👍 后计数增加；再次点击后恢复；刷新页面确认状态一致。测试点赞后应取消，不要为了测试擅自恢复已下架作品。

## 维护与限制

## 权限与安全评估

2026-11-20 通过 GitHub 的 `GET /apps/giscus` 核对，当前 App 请求 `discussions: write` 与 `metadata: read`，没有请求源代码写入权限。这不是永久保证，安装时应以 GitHub 权限确认页为准，并只选择本社区仓库。

权限并非只限点赞，而是 Discussions 写入。若第三方 App 或服务受损，已授予范围内的讨论内容可能受到影响。只选择一个公开社区仓库，可以缩小影响范围；不要选择所有公司仓库。

根据[隐私政策](https://github.com/giscus/giscus/blob/main/PRIVACY-POLICY.md)，登录后浏览器保存服务器加密的授权令牌，giscus 服务器会解密它以向 GitHub 发起认证请求。因此需要信任第三方服务；「数据存放在 GitHub」不等于登录凭据完全不经过 giscus。

页面会加载 `giscus.app/client.js` 及其 iframe。远程脚本的更新和供应链属于额外信任边界，内嵌 iframe 不能隔离最初加载到父页面的脚本。限制来源或隐藏评论仅是配置与展示，不是防止第三方脚本受损的安全隔离。

点赞与 GitHub 身份相关，并非匿名；服务或网络故障时，点赞可能无法加载。用于公开社区时风险可控，但不应称为零风险。目前该功能保持关闭，待管理员决定是否授权后再启用。

- 不添加 npm 依赖，不给投稿者增加字段。讨论使用固定的 `xgoduck-community/文件名` 映射，不会因为标题改名而丢失点赞；不要随意修改已发布文件名。
- giscus 是外部托管服务，无法保证永不故障。组件失败不影响作品介绍、图片和外部作品链接。
- 自定义主题位于 `website/public/assets/reactions.css`，通过官方支持的主题 URL 加载。若上游更改组件样式，需要检查评论隐藏与 👍 菜单；不自行维护 giscus 的分叉版本。
- 不自动删除 GitHub Discussions 历史。下架作品时删除介绍文件即可；原讨论的反应不会让作品重新出现。
- 不想继续使用时，把 `reactions.enabled` 改回 `false` 后部署，页面便停止加载组件。无需迁移网站数据。
