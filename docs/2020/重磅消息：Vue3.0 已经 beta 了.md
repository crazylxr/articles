就在今天凌晨 4点 56，尤大发了条微博，Vue3.0 已经 beta 了，桃翁我赶紧去看看目前 beta 的东西。



## Beta 版

- 所有计划的 RFCs 已经合并
- 所有的
- Vue CLI 现在通过 Vue-CLI-plugin-Vue-next 获得了实验支持。
- 还有一个简单的基于 webpack 的设置，它支持单文件组件。

##  新增异步组件 API

### 简介

引入用于定义异步组件的专用API。在 Vue 3中 普通函数现在被视为函数式组件，必须通过 API 方法显式定义异步组件。

### 例子

```javascript
import { defineAsyncComponent } from "vue"

// simple usage
const AsyncFoo = defineAsyncComponent(() => import("./Foo.vue"))

// with options
const AsyncFooWithOptions = defineAsyncComponent({
  loader: () => import("./Foo.vue"),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
})
```

### 与 2.x 的不同

在2.x 中，带有选项的异步组件定义为

```javascript
() => ({
  component: Promise<Component>
  // ...other options
})
```

而在3. x 中，它现在是:

```javascript
defineAsyncComponent({
  loader: () => Promise<Component>
  // ...other options
})
```

这个新增的 API 令我最兴奋的是可以开启 `Suspense` ，如果熟悉 React 的都知道 `Suspense` 是用来处理异步渲染的方式，可以在一些极端情况提高性能。

> 详细可见*[active-rfcs/0026-async-component-api.md](https://github.com/vuejs/rfcs/blob/async-component/active-rfcs/0026-async-component-api.md)*

## 事件 API 的改变

### 简介

删除 `$on`, `$off` and `$once` 实例方法， Vue 实例不再实现事件 emitter 接口。

## 新增 teleport 组件

### 简介

