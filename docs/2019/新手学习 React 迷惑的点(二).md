没看第一篇的朋友可以移步先去看第一篇：[新手学习 react 迷惑的点(一)](http://www.taoweng.site/index.php/archives/314/)

第一篇反响也还不错，很多新手都觉得很有帮助，解答了他们很久以来的疑惑，其实第一篇里面的还算基础的，主要是 ES6 语法和 JSX 没有深刻理解。

这第二篇稍微要难一点，有的需要了解 React 的原理才能搞明白的，不过你放心，我都用了最简单最简单的语言，即使你是个新手，如果产生了这些疑问，你也能看懂。

下面开始吧！

## 为什么调用方法要 bind this

**前提知识：**深刻的理解 JavaScript 中的 this

相信刚写 React 的时候，很多朋友可能会写类似这样的代码：

```js
class Foo extends React.Component {
  handleClick () {
    this.setState({ xxx: aaa })
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    )
  }
}
```

发现会报 `this` 是 `undefined` 的错，然后可能对事件处理比较疑惑，然后去看官网的[事件处理](https://zh-hans.reactjs.org/docs/handling-events.html)有下面一段话：

> 你必须谨慎对待 JSX 回调函数中的 `this`，在 JavaScript 中，class 的方法默认不会[绑定](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind)`this`。如果你忘记绑定 `this.handleClick` 并把它传入了 `onClick`，当你调用这个函数的时候 `this` 的值为 `undefined`。
>
> 这并不是 React 特有的行为；这其实与 [JavaScript 函数工作原理](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)有关。通常情况下，如果你没有在方法后面添加 `()`，例如 `onClick={this.handleClick}`，你应该为这个方法绑定 `this`。

然后你看了官网的例子和建议之后，知道需要为事件处理函数绑定 `this`就能解决，想下面这样：

```js
class Foo extends React.Component {
  handleClick () {
    this.setState({ xxx: aaa })
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>
        Click me
      </button>
    )
  }
}
```

但是可能你没有去思考过为什么需要 bind this？如果你不能理解的话，还是 js 的基础没有打好。

**React 是如何处理事件的？**

咱们先来了解一下 React 是如何处理事件的。

React 的事件是合成事件， 内部原理非常复杂，我这里只把关键性，可以用来解答这个问题的原理部分进行介绍即可(后面应该会写一篇 react 的事件原理，敬请期待)。

上篇文章已经说过，jsx 实际上是 `React.createElement(component, props, …children)` 函数提供的语法糖，那么这段 jsx 代码：

```js
 <button onClick={this.handleClick}>
     Click me
 </button>
```

会被转化为：

```js
React.createElement("button", {
     onClick: this.handleClick
}, "Click me")
```

了解了上面的，然后简单的理解 react 如何处理事件的，React 在组件加载(`mount`)和更新(`update`)时，将事件通过 `addEventListener`  统一注册到 `document` 上，然后会有一个事件池存储了所有的事件，当事件触发的时候，通过 `dispatchEvent` 进行事件分发。

所以你可以简单的理解为，最终 `this.handleClick` 会作为一个回调函数调用。

理解了这个，然后再来看看回调函数为什么就会丢失 `this`。

**this 简单回顾**

> 在函数内部，`this`的值取决于函数被调用的方式。

如果你不能理解上面那句话，那么你可能需要停下来阅读文章，去查一下相关资料，否则你可能看不懂下面的，如果你懒的话，就看为你准备好的 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this) 吧。

通过上面对事件处理的介绍，来模拟一下在类组件的 render 函数中， 有点类似于做了这样的操作:

```js
class Foo {
	sayThis () {
 		console.log(this); // 这里的 `this` 指向谁？
 	}

 	exec (cb) {
 		cb();
 	}

	render () {
 		this.exec(this.sayThis);
  }
}

var foo = new Foo();
foo.render(); // 输出结果是什么？
```

你会发现最终结果输出的是 `undefined`，如果你不理解为什么输出的是 `undefined`，那么还是上面说的，需要去深刻的理解 this 的原理。如果你能理解输出的是 `undefined`，那么我觉得你就可以理解为什么需要 bind this 了。

那么你可能会问：**为什么React没有自动的把 bind 集成到 render 方法中呢?**在 exec 调用回调的时候绑定进去，像这样：

```js
class Foo {
	sayThis () {
 		console.log(this); // 这里的 `this` 指向谁？
 	}

 	exec (cb) {
 		cb().bind(this);
 	}

	render () {
 		this.exec(this.sayThis);
  }
}

var foo = new Foo();
foo.render(); // 输出结果是什么？
```

**因为 render 多次调用每次都要 bind 会影响性能，所以官方建议你自己在 constructor 中手动 bind 达到性能优化。**

### 四种事件处理对比

对于事件处理的写法也有好几种，咱们来进行对比一下：

**1. 直接 bind this 型**

就是像文章开始的那样，直接在事件那里 bind this

```js
class Foo extends React.Component {
  handleClick () {
    this.setState({ xxx: aaa })
  }

  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>
        Click me
      </button>
    )
  }
}
```

**优点**：写起来顺手，一口气就能把这个逻辑写完，不用移动光标到其他地方。

**缺点**：性能不太好，这种方式跟 react 内部帮你 bind 一样的，每次 render 都会进行 bind，而且如果有两个元素的事件处理函数式同一个，也还是要进行 bind，这样会多写点代码，而且进行两次 bind，性能不是太好。(其实这点性能往往不会是性能瓶颈的地方，如果你觉得顺手，这样写完全没问题)

**2. constuctor 手动 bind 型**

```js
class Foo extends React.Component {
  constuctor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.setState({ xxx: aaa })
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    )
  }
}
```

**优点：**相比于第一种性能更好，因为构造函数只执行一次，那么只会 bind 一次，而且如果有多个元素都需要调用这个函数，也不需要重复 bind，基本上解决了第一种的两个缺点。

**缺点：**没有明显缺点，硬要说的话就是太丑了，然后不顺手(我觉得丑，你觉得不丑就这么写就行了)。

**3. 箭头函数型**

```js
class Foo extends React.Component {
  handleClick () {
    this.setState({ xxx: aaa })
  }

  render() {
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    )
  }
}
```

**优点：**顺手，好看。

**缺点：**每次 render 都会重复创建函数，性能会差一点。

**4. public class fields 型**

这种 `class fields `还处于实验阶段，据我所知目前还没有被纳入标准，具体可见[这里](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)。

```js
class Foo extends React.Component {
  handleClick = () => {
    this.setState({ xxx: aaa })
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    )
  }
}
```

**优点：**好看，性能好。

**缺点：**没有明显缺点，如果硬要说可能就是要多装一个 [babel 插件](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)来支持这种语法。

#### 总结

我平时用的就这四种写法，我这边从代码的美观性、性能以及是否顺手方便对各种写法做了简单的对比。其实每种方法在项目里用都是没什么问题的，性能方面基本上可以忽略，对于美观性和顺手比较主观，所以总体来说就是看大家的偏好咯，如果硬要推荐的话，我还是比较推荐第四种写法，美观而且不影响性能。

## 为什么要 setState，而不是直接 this.state.xx = oo

这个问题是我们公司后端写 React 的时候提出的问题，为啥不能直接修改 state，要 setState 一下。我在想，从 vue 转到 React 可能也会有这种疑问，因为 vue 修改状态都是直接改的。

如果我们了解 setState 的原理的话，可能就能解答这个问题了，setState 做的事情不仅仅只是修改了 `this.state` 的值，另外最重要的是它会触发 React 的更新机制，会进行 diff ，然后将 patch 部分更新到真实 dom 里。

如果你直接 `this.state.xx == oo` 的话，state 的值确实会改，但是改了不会触发 UI 的更新，那就不是数据驱动了。

那为什么 Vue 直接修改 data 可以触发 UI 的更新呢？因为 Vue 在创建 UI 的时候会把这些 data 给收集起来，并且在这些 data 的访问器属性 setter 进行了重写，在这个重写的方法里会去触发 UI 的更新。如果你想更多的了解 vue 的原理，可以去购买染陌大佬的[剖析 Vue.js 内部运行机制](https://juejin.im/book/5a36661851882538e2259c0f)。

> 不明白访问器属性的可以看这篇文章：[深入理解JS里的对象](https://rainzhaojy.github.io/2015/js_object.html)

##  setState 是同步还是异步相关问题

**1. setState 是同步还是异步？**

我的回答是执行过程代码同步的，**只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”**，所以**表现出来**有时是同步，有时是“异步”。

**2. 何时是同步，何时是异步呢？**

只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout/setInterval等原生 API 中都是同步的。简单的可以理解为被 React 控制的函数里面就会表现出“异步”，反之表现为同步。

**3. 那为什么会出现异步的情况呢？**

为了做性能优化，将 state 的更新延缓到最后批量合并再去渲染对于应用的性能优化是有极大好处的，如果每次的状态改变都去重新渲染真实 dom，那么它将带来巨大的性能消耗。

**4. 那如何在表现出异步的函数里可以准确拿到更新后的 state 呢？**

通过第二个参数 `setState(partialState, callback)` 中的 callback 拿到更新后的结果。

或者可以通过给 setState 传递函数来表现出同步的情况：

```js
this.setState((state) => {
	return { val: newVal }
})
```

**5. 那表现出异步的原理是怎么样的呢？**

直接讲源码肯定篇幅不够，可以看这篇文章：[你真的理解setState吗？](https://juejin.im/post/5b45c57c51882519790c7441#heading-0)。

我这里还是用最简单的语言让你理解：在 React 的 setState 函数实现中，会根据 isBatchingUpdates(默认是 false) 变量判断是否直接更新 this.state 还是放到队列中稍后更新。然后有一个 batchedUpdate 函数，可以修改 isBatchingUpdates 为 true，当 React 调用事件处理函数之前，或者生命周期函数之前就会调用 batchedUpdate 函数，这样的话，setState 就不会同步更新 this.state，而是放到更新队列里面后续更新。

这样你就可以理解为什么原生事件和 setTimeout/setinterval 里面调用 this.state 会同步更新了吧，因为通过这些函数调用的 React 没办法去调用 batchedUpdate 函数将 isBatchingUpdates 设置为 true，那么这个时候 setState 的时候默认就是 false，那么就会同步更新。

**最后**

setState 是 React 非常重要的一个方法，值得大家好好去研究一下他的原理。

## 后记

上一篇发出之后，有很多小伙伴留言说想看关于 hooks 相关的问题，毕竟 hooks 出来没多久，有很多疑问很正常，下一篇估计就专门写 hooks 相关的吧。

## 参考文章

- [React 中为什么要 bind this](https://www.cnblogs.com/eret9616/p/9944224.html)
- 《React 状态管理与同构实践》