# 卡牌背景包

在这个目录下新建任意子文件夹，每个子文件夹就是一套可切换的卡牌背景包。

示例：

```text
assets/cards/cartoon/offense.webp
assets/cards/cartoon/reactive.png
assets/cards/cartoon/tactic.jpg
assets/cards/china/offense.png
assets/cards/dark/equip.webp
```

支持的文件名：

- `offense`
- `reactive`
- `tactic`
- `heal`
- `equip`
- `utility`

支持的格式：

- `.png`
- `.webp`
- `.jpg`
- `.jpeg`

新增或删除文件后重启 `npm start`，游戏设置里的“卡牌背景”会自动刷新。缺少某一类背景时会自动回退到默认 CSS 卡面。
