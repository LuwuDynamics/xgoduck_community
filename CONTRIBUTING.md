# 分享你的 XGO-Duck 项目

目录分为结构、整机固件、动作模型、音视频交互四个板块。项目保留在你自己的仓库或发布平台。

## 提交流程

1. Fork 本仓库，并从 `main` 新建分支。
2. 将 `examples/project-template.yaml` 复制到 `projects/your-project.yaml`。
3. 填写真实信息，将可选截图放入 `website/public/assets/projects/`。
4. 运行 `npm ci`、`npm run check` 和 `npm run check:links`。
5. 可用 `npm run dev` 本地预览，然后提交 PR，填写 [PR 正文模板](.github/pull_request_template.md)。网站投稿页也提供这份模板的一键复制与下载。
6. 维护者审核合并，GitHub Actions 自动发布更新后的目录。

无需把源码、固件、训练权重或模型文件上传到社区仓库。项目主页应包含访问者实际需要的内容。

## 文件与字段

文件名使用小写英文、数字与连字符，如 `duck-roller.yaml`，最多 80 字符。它决定详情页地址 `/projects/duck-roller/`，已上线条目应尽量保持文件名稳定。

| 字段 | 必填 | 内容 |
| --- | --- | --- |
| `name` | 是 | 项目名，2–70 字符 |
| `summary` | 是 | 卡片介绍，5–150 字符 |
| `description` | 是 | 详情介绍，20–12000 字符；YAML `\|` 支持多段纯文本 |
| `author.name` / `author.url` | 是 | 作者名与公开主页 |
| `category` | 是 | 四个板块值之一，见下表 |
| `repository` | 是 | 作者自己的公开项目地址，GitHub / MakerWorld 等均可 |
| `compatibility.hardware` | 是 | 已验证硬件列表，注明实际型号或版本 |
| `compatibility.firmware` | 是 | 固件 / 软件版本；独立固件也应明确说明 |
| `compatibility.notes` | 是 | 依赖、改装要求、未验证部分等，至少 5 字符 |
| `installation` | 是 | 安装步骤数组，每步至少 5 字符 |
| `updated` | 是 | 真实更新时间，格式 `'YYYY-MM-DD'`，建议加引号 |
| `image` / `image_alt` | 否 | 封面图与文字描述；填写图片时必须填写 alt |
| `gallery` | 否 | 最多 6 项，每项含 `image` 和 `alt` |
| `video` | 否 | 演示视频的 HTTPS 页面链接 |
| `documentation` | 否 | 完整文档的 HTTPS 链接 |
| `issues` | 否 | 原项目的问题反馈链接 |
| `license` | 否 | 原项目许可证名称；强烈建议填写 |
| `tags` | 否 | 最多 8 个关键词，每个最多 30 字符 |

| 分类 | 值 |
| --- | --- |
| 结构 | `structure` |
| 整机固件 | `firmware` |
| 动作模型 | `motion-model` |
| 音视频交互 | `av-interaction` |

一个项目选择一个主要分类，其他方向可放入 `tags`。所有文本以纯文本展示，不执行 HTML、不解析 Markdown。安装步骤可包含命令文本，详情页按原文显示。

## 图片与视频

推荐 3:2 的 WebP / JPEG / PNG 封面。没有图片也可以提交，网站会显示对应分类的插画。

```yaml
image: assets/projects/duck-roller.webp
image_alt: 轮足结构安装完成后的侧视图
gallery:
  - image: assets/projects/duck-roller-assembly.jpg
    alt: 轮足组件的装配细节
video: https://www.youtube.com/watch?v=实际视频ID
```

- 上述本地图片实际存放于 `website/public/assets/projects/`，文件名使用英文、数字、连字符或下划线。
- 每张本地图片最多 5 MB，支持 PNG、JPEG、WebP、GIF；不接受贡献者上传 SVG。
- 可以直接使用公开的 HTTPS 图片地址；请确保作者允许引用，且图片可以直接加载。
- 视频通过链接跳转原平台，不下载、不重新托管；截图和图集只使用有权发布的素材。

## 自动校验做什么

- 检查 YAML、必填字段、字段类型、分类、日期、文件名、重复仓库和重复 slug。
- 检查本地图片存在、路径位于允许目录、格式和大小符合要求。
- 只接受公开 HTTPS 链接，不接受凭据、IP、内网地址或示例域名。
- 检查外部链接可达性。404 / 410 阻止通过；反爬、限流或网络异常产生警告，交由维护者人工复核。
- 构建正式静态网站，执行元数据和 HTML 转义等回归测试。

CI 不自动判断原创性、素材授权、项目实际功能、硬件适配或安装安全性。维护者会结合项目主页审核。

## 更新与下架

修改现有 YAML 即可更新介绍和链接，同时更新 `updated`。删除 YAML 即可从目录下架，随后删除仅该项目使用的本地图片。请在 PR 中说明原因。项目功能问题请直接反馈到作者自己的仓库。
