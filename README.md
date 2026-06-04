# demo.karaithy.com — 需求原型演示站

捷安高科各项目的需求评审原型 Demo 统一展示站。

## 结构

```
demo/
├── index.html              # 落地页（列出所有Demo）
├── shenyang-panorama/      # 沈阳2.1.1 全景管控（4车厢分块/摄像头点位/热区排序）
│   ├── index.html
│   └── base-1f.png         # 真实1F基地3D俯视图
└── shenyang-data-screen/   # 沈阳2.1.3 设备利用率（横向图/名称拆分/低利用率高亮）
    └── index.html
```

## 发布

Pages 项目：`demo` ｜ 域名：demo.karaithy.com ｜ 部署：wrangler 手动

```bash
cd ~/Desktop/karaithy/demo
npx wrangler pages deploy . --project-name=demo
# 首次需绑定域名 demo.karaithy.com（见 SITE-REGISTRY.md 流程）
```

## 工作目录

Demo 源在 `~/Desktop/ja_project/260506-shenyang/projects/prd-demos/`，
本目录是发布镜像。更新时从源 rsync 过来再 deploy。
