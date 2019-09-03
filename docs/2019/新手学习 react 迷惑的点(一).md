网上各种言论说 React 上手比 Vue 难，可能难就难不能深刻理解 JSX，或者对 ES6 的一些特性理解得不够深刻，导致觉得有些点难以理解，然后说 React 比较难上手，还反人类啥的，所以我打算写两篇文章来讲新手学习 React 的时候容易迷惑的点写出来，如果你还以其他的对于学习 React 很迷惑的点，可以在留言区里给我留言。

## 为什么要引入 React

在写 React 的时候，你可能会写类似这样的代码：

```javascript
import React from 'react'

function A() {
  // ...other code
  return <h1>前端桃园</h1>
}
```

你肯定疑惑过，下面的代码都没有用到 React，为什么要引入 React 呢？

如果你把 `import React from ‘react’` 删掉，还会报下面这样的错误：

![7F6E506E-3025-401D-A492-3B501F8081C6](http://imgs.taoweng.site/2019-09-01-150624.jpg)

那么究竟是哪里用到了这个 React，导致我们引入 React 会报错呢，不懂这个原因，那么就是 JSX 没有搞得太明白。

你可以讲上面的代码(忽略导入语句)放到[在线 babel](https://www.babeljs.cn/repl) 里进行转化一下，发现 babel 会把上面的代码转化成:

```javascript
function A() {
  // ...other code
  return React.createElement("h1", null, "前端桃园");
}
```

因为从本质上讲，JSX 只是为 `React.createElement(component, props, ...children)` 函数提供的语法糖。

## 为什么要用 className 而不用 class

1. React 一开始的理念是想与浏览器的 DOM API 保持一直而不是 HTML，因为 JSX 是 JS 的扩展，而不是用来代替 HTML 的，这样会和元素的创建更为接近。在元素上设置 `class` 需要使用 `className` 这个 API：

   ```javascript
   const element = document.createElement("div")
   element.className = "hello" 
   ```

2. 浏览器问题，ES5 之前，在对象中不能使用保留字。以下代码在 IE8 中将会抛出错误：

   ```javascript
   const element = {
     attributes: {
       class: "hello"
     }
   } 
   ```

3. 解构问题，当你在解构属性的时候，如果分配一个 `class` 变量会出问题：

   ```js
   const { class } = { class: 'foo' } // Uncaught SyntaxError: Unexpected token }
   const { className } = { className: 'foo' } 
   const { class: className } = { class: 'foo' } 
   ```

其他讨论可见：[有趣的话题，为什么jsx用className而不是class](https://www.jackpu.com/you-qu-de-hua-ti-wei-shi-yao-jsxyong-classnameer-bu-shi-class/)

##为什么属性要用小驼峰

因为 JSX 语法上更接近 JavaScript 而不是 HTML，所以 React DOM 使用 `camelCase`（小驼峰命名）来定义属性的名称，而不使用 HTML 属性名称的命名约定。

来自 [JSX 简介](https://zh-hans.reactjs.org/docs/introducing-jsx.html)

## 为什么 constructor 里要调用 super 和传递 props

这是官网的一段代码，具体见：[状态(State) 和 生命周期](http://react.html.cn/docs/state-and-lifecycle.html)

```js
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

而且有这么一段话，不仅让我们调用 `super` 还要把 `props` 传递进去，但是没有告诉我们为什么要这么做。![image-20190901222456704](http://imgs.taoweng.site/2019-09-01-150613.png)

不知道你有没有疑惑过为什么要调用 `super` 和传递 `props`，接下来我们来解开谜题吧。

**为什么要调用 super**

其实这不是 React 的限制，这是 JavaScript 的限制，在构造函数里如果要调用 this，那么提前就要调用 super，在 React 里，我们常常会在构造函数里初始化 state，`this.state = xxx` ，所以需要调用 super。

**为什么要传递 props**

你可能以为必须给 `super` 传入 `props`，否则 `React.Component` 就没法初始化 `this.props`：

```js
class Component {
  constructor(props) {
    this.props = props;
    // ...
  }
}
```

不过，如果你不小心漏传了 `props`，直接调用了 `super()`，你仍然可以在 `render` 和其他方法中访问 `this.props`（不信的话可以试试嘛）。

为啥这样也行？因为**React 会在构造函数被调用之后，会把 props 赋值给刚刚创建的实例对象：**

```js
const instance = new YourComponent(props);
instance.props = props;
```

`props` 不传也能用，是有原因的。

但这意味着你在使用 React 时，可以用 `super()` 代替 `super(props)` 了么？

那还是不行的，不然官网也不会建议你调用 props 了，虽然 React 会在构造函数运行之后，为 `this.props` 赋值，但在 `super()` 调用之后与构造函数结束之前， `this.props` 仍然是没法用的。

```js
// Inside React
class Component {
  constructor(props) {
    this.props = props;
    // ...
  }
}

// Inside your code
class Button extends React.Component {
  constructor(props) {
    super(); // 😬 忘了传入 props
    console.log(props); // ✅ {}
    console.log(this.props); // 😬 undefined
  }
  // ...
}
```

要是构造函数中调用了某个访问 `props` 的方法，那这个 bug 就更难定位了。**因此我强烈建议始终使用super(props)，即使这不是必须的：**

```js
class Button extends React.Component {
  constructor(props) {
    super(props); // ✅ We passed props
    console.log(props); // ✅ {}
    console.log(this.props); // ✅ {}
  }
  // ...
}
```

上面的代码确保 `this.props` 始终是有值的。

如果你想避免以上的问题，你可以通过[class 属性提案](https://github.com/tc39/proposal-class-fields) 来简化代码：

```js
class Clock extends React.Component {
  state = {date: new Date()};

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

更详细的内容可见[Dan 的博客](https://overreacted.io/why-do-we-write-super-props/)

## 为什么组件用大写开头

前面以及说过了，JSX 是 `React.createElement(component, props, …children)` 提供的语法糖，component 的类型是：`string/ReactClass type`，我们具体看一下在什么情况下会用到 string 类型，什么情况下用到 ReactClass type 类型

- string 类型react会觉得他是一个原生dom节点
- ReactClass type 类型 自定义组件

例如（string）：在 jsx 中我们写一个

```react
<div></div>
```

转换为js的时候就变成了

```js
React.createElement("div", null)
```

例如（ReactClass type）：在jsx中我们写一个

```react
function MyDiv() {
    return (<div><div>)
}
<MyDiv></MyDiv>
```

转换为js的时候就变成了

```react
function MyDiv() {
  return React.createElement("div", null);
}

React.createElement(MyDiv, null);
```

上边的例子中如果将MyDiv中的首字母小写，如下

```react
function myDiv() {
    return (<div><div>)
}
<myDiv></myDiv>
```

转换为 js 的时候就变成了

```react
function MyDiv() {
  return React.createElement("div", null);
}

React.createElement("myDiv", null);
```

由于找不到 myDiv 这个 dom，所以就会报错。

## 后记

这是这个系列的第一篇，这些问题也是在我的一个「React交流群」里大家提出来的一些他们刚学 react 的时候容易迷惑的点，下一篇不出意外就是解答以下迷惑的点，如果有其他的问题想知道的，欢迎在评论区留言。

- 为什么调用方法要 bind this

- 为什么要 setState，而不是直接 this.state.xx = oo

- 为什么setState不是同步

- 为什么render里面要用一个父级标签包裹(没有 Fragment 以前)