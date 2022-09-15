<!--
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
-->

## 示例

#### 默认

:::demo

```html
<yp-dan title="默认" />
```

:::

#### 自定义纯色 + 左边标题

:::demo

```html
<yp-dan title="客户" :value="23" :target="79" active-color="#ca731a" back-color="#f9dfc5" />
```

:::

#### 自定义文字

:::demo

```html
<yp-dan title="客户" :value="80" :target="12" target-color="red" />
```

:::

#### 自定义滑块背景色渐变

:::demo

```html
<yp-dan title="默认" active-color="-webkit-linear-gradient(right, rgb(236, 112, 149), rgb(51, 66, 231), rgb(18, 173, 162), rgb(236, 112, 149))" back-color="-webkit-linear-gradient(right, rgb(255, 255, 255), rgb(245, 215, 237), rgb(255, 255, 255), rgb(245, 215, 237))" stip-text="示例1" target-color="yellow" target-text="示例2" />
```

:::

## 参数

| 表头 1     | 表头 2     | 表头 3     |
| ---------- | ---------- | ---------- |
| 单元格信息 | 单元格信息 | 单元格信息 |
| 单元格信息 | 单元格信息 | 单元格信息 |
| 单元格信息 | 单元格信息 | 单元格信息 |

| 参数名      | 必填  |   默认值 |               描述 |
| ----------- | :---: | -------: | -----------------: |
| title       | false |     标题 |               标题 |
| value       | false |       80 |         当前完成值 |
| animate     | false |     true |       是否带有动画 |
| target      | false |      100 |             目标值 |
| showTip     | false |     true | 是否显示底部的图例 |
| targetColor | false |          |       进度文字颜色 |
| activeColor | false |          |       进度条背景色 |
| backColor   | false |          |         组建背景色 |
| stipText    | false | 实际进度 |      左边示例 文字 |
| targetText  | false | 目标进度 |      目标文字 文字 |
