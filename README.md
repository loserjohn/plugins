<!--
 * @Author       : xh
 * @Date         : 2022-06-21 19:45:09
 * @LastEditors  : xh
 * @FileName     :
-->

## 组件目录

> 子弹图组件

> element 月份多选组件

> element 超级 城市筛选组件

> skulist 编辑器

## 插件的使用

```
 npm i yl_plugins
```

在自己项目的 main.js 里面引用

```
import yl_plugins from 'yl_plugins'
import 'yl_plugins/lib/yl.css'
Vue.use(yl_plugins)
```

## 简介和参考

基于 vue2+ element 的二次开发

- 项目 demo 采用的使用 vuecli 的 库构建模式编写插件
  [vuecli](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93)
- 使用 vuepress 快速形成库文档
  [vuepress](https://www.vuepress.cn/guide/directory-structure.html#%E9%BB%98%E8%AE%A4%E7%9A%84%E9%A1%B5%E9%9D%A2%E8%B7%AF%E7%94%B1)
- npm 市场 可以发布插件
  [npm 市场](https://www.npmjs.com/)

## 项目结构和目录

## 参考链接

> [手把手做一个基于 vue-cli 的组件库（上篇）](http://www.wjhsh.net/sq-blogs-p-12822206.html)

> [手把手做一个基于 vue-cli 的组件库（下篇）](https://www.cnblogs.com/sq-blogs/p/12822328.html)

> [vuepress](https://www.vuepress.cn/guide/using-vue.html#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84-api-%E8%AE%BF%E9%97%AE%E9%99%90%E5%88%B6)

> [markdown-it-container](https://zhuanlan.zhihu.com/p/355855990)

> [markdown-it ](https://blog.csdn.net/qq_31254489/article/details/120326897)

> [GitHub Markdown CSS](https://sindresorhus.com/github-markdown-css/)

> [G【Vue】解析渲染 markdown 文件](https://blog.csdn.net/See_Star/article/details/125487803)

> [yuan-ui](https://github.com/xiaolannuoyi/yuan-ui)

> [VV-UI](https://github.com/VV-UI/VV-UI)

## 发布与开发

- 本地开发

```
  npm run docs:dev
```

- 打包 本地 lib 插件库 (先打包后再上传 npm 插件库)

```
  npm run lib
```

- 上传 npm 插件市场
  [npm 市场发布参考](https://cloud.tencent.com/developer/article/1976261)

- 疑难杂症参考
  [肖小涵的疑难杂症](https://www.yuque.com/xiaoxiaohan-tal62/mbg5bk/ombmw8)

## 不足及待优化项

- 基础版本只是实现了 markdown 文件编写文档，并且引入 vue 组件,并没有继续完善下去

- 如果是专门的文档静态站点 可以使用 vuepress

### npm 插件指令

```
npm  adduser

npm config set registry https://registry.npmjs.org/

npm login

npm  publish --access publish




```
