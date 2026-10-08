# 不是贱贱的私密小窝

一个极简的静态小站：读小说章节、下载共享文件。零后端、零构建，仓库即内容，Push 即发布。
站点托管在 **Cloudflare Pages**，源码在 **GitHub**。

## 本地预览

```bash
# 任选其一（必须用本地服务器，不能直接双击 html，否则浏览器禁止读取内容文件）
python3 -m http.server 8000
# 然后浏览器打开 http://127.0.0.1:8000
```

## 目录结构

```
├─ index.html          首页（最新章节 / 文件 / 图片）
├─ novel.html          小说阅读（目录 + 正文 + 上下章 + 字号/主题）
├─ files.html          文件下载（搜索 / 类型筛选 / 图片灯箱）
├─ assets/
│  ├─ css/style.css    主题变量（明暗可切换，纯色背景）
│  ├─ js/app.js        主题、数据加载、灯箱
│  ├─ js/markdown.js   零依赖 Markdown 渲染（够用就好）
│  └─ img/             封面 / 配图（SVG）
├─ content/
│  ├─ novels.json      小说与章节清单（一改即发布）
│  ├─ files.json       文件清单（一改即发布）
│  └─ chapters/        章节正文（.md / .txt / 图片）
├─ files/              可直接下载的文件（csv / zip / md …）
└─ _headers            Cloudflare Pages 缓存与响应头
```

## 怎么加一篇小说 / 一个章节

1. 在 `content/chapters/<书目录>/` 放正文文件：
   - `.md`：支持标题、引用、列表、加粗、图片等（Markdown 渲染）
   - `.txt`：按纯文本展示
   - `.png/.jpg/.svg/...`：整篇当作一张图展示（如扫描稿、长图）
   - `.doc/.docx`：用浏览器内嵌预览（Office Online），也可直接下载
2. 在 `content/novels.json` 里登记：

```json
{
  "slug": "shanyu",
  "title": "山雨来时",
  "author": "佚名",
  "desc": "连载中",
  "cover": "assets/img/cover-shanyu.svg",
  "chapters": [
    { "id": "001", "title": "第一章 · 渡口", "file": "chapters/shanyu/001.md", "date": "2026-09-28" },
    { "id": "004", "title": "番外（TXT）", "file": "chapters/shanyu/004.txt", "kind": "txt", "date": "2026-10-08" }
  ]
}
```

- `kind` 可省略（按扩展名自动识别：md / txt / image / doc / docx）。
- `file` 是相对 `content/` 的路径。

## 怎么加一个共享文件

把文件丢进 `files/`，并在 `content/files.json` 里登记：

```json
{
  "name": "仓储监测-样例数据.csv",
  "type": "doc",
  "url": "files/仓储监测-样例数据.csv",
  "size": 18432,
  "date": "2026-10-05",
  "desc": "温湿度采样示例"
}
```

`type` 决定图标与筛选分类：`image` / `doc` / `archive` / `code` / `audio` / `video` / `other`。
图片类会进首页图廊和文件页灯箱，建议同时给 `thumb` 字段（没有就用 `url`）。

## 部署（GitHub + Cloudflare Pages）

**方式 A：连 Git（推荐，最省事）**
1. 把本目录推到 GitHub 仓库。
2. Cloudflare 控制台 → Pages → 创建 → 连接到 Git → 选该仓库。
3. 构建设置：**构建命令留空**，**部署目录（Build output directory）= `/`**（根目录）。
4. 以后 `git push` 自动上线。

**方式 B：Wrangler 命令行**
```bash
npm i -g wrangler
wrangler pages deploy . --project-name=bushou-xiaowo
```

**自定义域名**：在 Cloudflare Pages 项目里绑一个域名（A/AAAA 或 CNAME），几分钟生效。

## 自定义

- **站点名**：搜索替换 `不是贱贱的私密小窝`（在 `index.html` / `novel.html` / `files.html` 的标题、导航、页脚）。
- **主题色 / 背景**：改 `assets/css/style.css` 顶部 `:root` 与 `[data-theme="dark"]` 的变量。当前为纯色背景。
- **GitHub / 源码链接**：把三个页面里的 `https://github.com/` 换成你的仓库地址。
