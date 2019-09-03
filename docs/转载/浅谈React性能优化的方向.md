

本文来源于公司内部的一次闪电分享，稍作润色分享出来。主要讨论 React 性能优化的主要方向和一些小技巧。如果你觉得可以，请多点赞，鼓励我写出更精彩的文章🙏。

React 渲染性能优化的三个方向，其实也适用于其他软件开发领域，这三个方向分别是:

- 减少计算的量。 -> 对应到 React 中就是减少渲染的节点 或者 降低组件渲染的复杂度
- 利用缓存。-> 对应到 React 中就是如何避免重新渲染，利用函数式编程的 memo 方式来避免组件重新渲染
- 精确重新计算的范围。 对应到 React 中就是绑定组件和状态关系, 精确判断更新的'时机'和'范围'. 只重新渲染'脏'的组件，或者说降低渲染范围

目录

- [减少渲染的节点/降低渲染计算量(复杂度)](https://zhuanlan.zhihu.com/write#%E5%87%8F%E5%B0%91%E6%B8%B2%E6%9F%93%E7%9A%84%E8%8A%82%E7%82%B9%E9%99%8D%E4%BD%8E%E6%B8%B2%E6%9F%93%E8%AE%A1%E7%AE%97%E9%87%8F%E5%A4%8D%E6%9D%82%E5%BA%A6)

- [0️⃣ 不要在渲染函数都进行不必要的计算](https://zhuanlan.zhihu.com/write#0%EF%B8%8F%E2%83%A3-%E4%B8%8D%E8%A6%81%E5%9C%A8%E6%B8%B2%E6%9F%93%E5%87%BD%E6%95%B0%E9%83%BD%E8%BF%9B%E8%A1%8C%E4%B8%8D%E5%BF%85%E8%A6%81%E7%9A%84%E8%AE%A1%E7%AE%97)
- [1️⃣ 减少不必要的嵌套](https://zhuanlan.zhihu.com/write#1%EF%B8%8F%E2%83%A3-%E5%87%8F%E5%B0%91%E4%B8%8D%E5%BF%85%E8%A6%81%E7%9A%84%E5%B5%8C%E5%A5%97)
- [2️⃣ 虚拟列表](https://zhuanlan.zhihu.com/write#2%EF%B8%8F%E2%83%A3-%E8%99%9A%E6%8B%9F%E5%88%97%E8%A1%A8)
- [3️⃣ 惰性渲染](https://zhuanlan.zhihu.com/write#3%EF%B8%8F%E2%83%A3-%E6%83%B0%E6%80%A7%E6%B8%B2%E6%9F%93)
- [4️⃣ 选择合适的样式方案](https://zhuanlan.zhihu.com/write#4%EF%B8%8F%E2%83%A3-%E9%80%89%E6%8B%A9%E5%90%88%E9%80%82%E7%9A%84%E6%A0%B7%E5%BC%8F%E6%96%B9%E6%A1%88)

- [避免重新渲染](https://zhuanlan.zhihu.com/write#%E9%81%BF%E5%85%8D%E9%87%8D%E6%96%B0%E6%B8%B2%E6%9F%93)

- [0️⃣ 简化 props](https://zhuanlan.zhihu.com/write#0%EF%B8%8F%E2%83%A3-%E7%AE%80%E5%8C%96-props)
- [1️⃣ 不变的事件处理器](https://zhuanlan.zhihu.com/write#1%EF%B8%8F%E2%83%A3-%E4%B8%8D%E5%8F%98%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E5%99%A8)
- [2️⃣ 不可变数据](https://zhuanlan.zhihu.com/write#2%EF%B8%8F%E2%83%A3-%E4%B8%8D%E5%8F%AF%E5%8F%98%E6%95%B0%E6%8D%AE)
- [3️⃣ 简化 state](https://zhuanlan.zhihu.com/write#3%EF%B8%8F%E2%83%A3-%E7%AE%80%E5%8C%96-state)
- [4️⃣ 使用 recompose 精细化比对](https://zhuanlan.zhihu.com/write#4%EF%B8%8F%E2%83%A3-%E4%BD%BF%E7%94%A8-recompose-%E7%B2%BE%E7%BB%86%E5%8C%96%E6%AF%94%E5%AF%B9)

- [精细化渲染](https://zhuanlan.zhihu.com/write#%E7%B2%BE%E7%BB%86%E5%8C%96%E6%B8%B2%E6%9F%93)

- [0️⃣ 响应式数据的精细化渲染](https://zhuanlan.zhihu.com/write#0%EF%B8%8F%E2%83%A3-%E5%93%8D%E5%BA%94%E5%BC%8F%E6%95%B0%E6%8D%AE%E7%9A%84%E7%B2%BE%E7%BB%86%E5%8C%96%E6%B8%B2%E6%9F%93)
- [1️⃣ 不要滥用 Context](https://zhuanlan.zhihu.com/write#1%EF%B8%8F%E2%83%A3-%E4%B8%8D%E8%A6%81%E6%BB%A5%E7%94%A8-context)

- [扩展](https://zhuanlan.zhihu.com/write#%E6%89%A9%E5%B1%95)

## 减少渲染的节点/降低渲染计算量(复杂度)

首先从计算的量上下功夫，减少节点渲染的数量或者降低渲染的计算量可以显著的提高组件渲染性能。

### 0️⃣ 不要在渲染函数都进行不必要的计算

比如不要在渲染函数(render)中进行数组排序、数据转换、订阅事件、创建事件处理器等等. 渲染函数中不应该放置太多副作用

### 1️⃣ 减少不必要的嵌套

![](https://pic3.zhimg.com/v2-feb4a476151ee5f56a1a31d4294d62e2_b.jpg)![](https://pic3.zhimg.com/80/v2-feb4a476151ee5f56a1a31d4294d62e2_hd.jpg)

我们团队是重度的 `styled-components` 用户，其实大部分情况下我们都不需要这个玩意，比如纯静态的样式规则，以及需要重度性能优化的场景。除了性能问题，另外一个困扰我们的是它带来的节点嵌套地狱(如上图)。

所以我们需要理性地选择一些工具，比如使用原生的 CSS，减少 React 运行时的负担.

一般不必要的节点嵌套都是滥用高阶组件/RenderProps 导致的。所以还是那句话‘只有在必要时才使用 xxx’。 有很多种方式来代替高阶组件/RenderProps，例如优先使用 props、React Hooks

### 2️⃣ 虚拟列表

虚拟列表是常见的‘长列表'和'复杂组件树'优化方式，它优化的本质就是减少渲染的节点。

虚拟列表只渲染当前视口可见元素:

![](https://pic1.zhimg.com/v2-dadad69fc233a6110302aa79f5bed13c_b.jpg)

虚拟列表渲染性能对比:

![](https://pic1.zhimg.com/v2-25dfac341a9652a31bed3a15b10626c0_b.jpg)

虚拟列表常用于以下组件场景:

- 无限滚动列表，grid, 表格，下拉列表，spreadsheets
- 无限切换的日历或轮播图
- 大数据量或无限嵌套的树
- 聊天窗，数据流(feed), 时间轴
- 等等

相关组件方案:

- [react-virtualized](https://link.zhihu.com/?target=https%3A//github.com/bvaughn/react-virtualized)
- [react-window](https://link.zhihu.com/?target=https%3A//github.com/bvaughn/react-window) 更轻量的 react-virtualized, 同出一个作者
- [更多](https://link.zhihu.com/?target=https%3A//github.com/bvaughn/react-virtualized%23friends)

扩展：

- [Creating more efficient React views with windowing](https://link.zhihu.com/?target=https%3A//bvaughn.github.io/forward-js-2017/%23/0/0)
- [Rendering large lists with react-window](https://link.zhihu.com/?target=https%3A//addyosmani.com/blog/react-window/)

### 3️⃣ 惰性渲染

惰性渲染的初衷本质上和虚表一样，也就是说我们只在必要时才去渲染对应的节点。

举个典型的例子，我们常用 Tab 组件，我们没有必要一开始就将所有 Tab 的 panel 都渲染出来，而是等到该 Tab 被激活时才去惰性渲染。

还有很多场景会用到惰性渲染，例如树形选择器，模态弹窗，下拉列表，折叠组件等等。

这里就不举具体的代码例子了，留给读者去思考.

### 4️⃣ 选择合适的样式方案

![](https://pic1.zhimg.com/v2-119c336b929d57652d0ae7fcbb7bfa78_b.jpg)

如图(图片来源于[THE PERFORMANCE OF STYLED REACT COMPONENTS](https://link.zhihu.com/?target=https%3A//blog.primehammer.com/the-performance-of-styled-react-components/)), 这个图片是17年的了，但是大抵的趋势还是这样。

所以在样式运行时性能方面大概可以总结为：`CSS > 大部分CSS-in-js > inline style`

---

## 避免重新渲染

减少不必要的重新渲染也是 React 组件性能优化的重要方向. 为了避免不必要的组件重新渲染需要在做到两点:

1. 保证组件纯粹性。即控制组件的副作用，如果组件有副作用则无法安全地缓存渲染结果
2. 通过`shouldComponentUpdate`生命周期函数来比对 state 和 props, 确定是否要重新渲染。对于函数组件可以使用`React.memo`包装

另外这些措施也可以帮助你更容易地优化组件重新渲染:

### 0️⃣ 简化 props

① 如果一个组件的 props 太复杂一般意味着这个组件已经违背了‘单一职责’，首先应该尝试对组件进行拆解. ② 另外复杂的 props 也会变得难以维护, 比如会影响`shallowCompare`效率, 还会让组件的变动变得难以预测和调试.

下面是一个典型的例子, 为了判断列表项是否处于激活状态，这里传入了一个当前激活的 id:

![](https://pic2.zhimg.com/v2-d074a77bf2e242e23670b29c20d9b76d_b.jpg)

这是一个非常糟糕的设计，一旦激活 id 变动，所有列表项都会重新刷新. 更好的解决办法是使用类似`actived`这样的布尔值 prop. actived 现在只有两种变动情况，也就是说激活 id 的变动，最多只有两个组件需要重新渲染.

简化的 props 更容易理解, 且可以提高组件缓存的命中率

### 1️⃣ 不变的事件处理器

①避免使用箭头函数形式的事件处理器, 例如:

```javascript
<ComplexComponentonClick={evt=>onClick(evt.id)}otherProps={values}/>
```

假设 ComplexComponent 是一个复杂的 PureComponent, 这里使用箭头函数，其实每次渲染时都会创建一个新的事件处理器，这会导致 ComplexComponent 始终会被重新渲染.

更好的方式是使用实例方法:

    class MyComponent extends Component {
      render() {
        <ComplexComponent onClick={this.handleClick} otherProps={values} />;
      }
      handleClick = () => {
        /*...*/
      };
    }

② 即使现在使用`hooks`，我依然会使用`useCallback`来包装事件处理器，尽量给下级组件暴露一个静态的函数:

    const handleClick = useCallback(() => {
      /*...*/
    }, []);
    
    return <ComplexComponent onClick={handleClick} otherProps={values} />;

但是如果`useCallback`依赖于很多状态，你的`useCallback`可能会变成这样:

    const handleClick = useCallback(() => {
      /*...*/
      // 🤭
    }, [foo, bar, baz, bazz, bazzzz]);

这种写法实在让人难以接受，这时候谁还管什么函数式非函数式的。我是这样处理的:

    function useRefProps<T>(props: T) {
      const ref = useRef < T > props;
      // 每次渲染更新props
      useEffect(() => {
        ref.current = props;
      });
    }
    
    function MyComp(props) {
      const propsRef = useRefProps(props);
    
      // 现在handleClick是始终不变的
      const handleClick = useCallback(() => {
        const { foo, bar, baz, bazz, bazzzz } = propsRef.current;
        // do something
      }, []);
    }

③设计更方便处理的 Event Props. 有时候我们会被逼的不得不使用箭头函数来作为事件处理器：

    <List>
      {list.map(i => (
        <Item key={i.id} onClick={() => handleDelete(i.id)} value={i.value} />
      ))}
    </List>

上面的 onClick 是一个糟糕的实现，它没有携带任何信息来标识事件来源，所以这里只能使用闭包形式，更好的设计可能是这样的:

    // onClick传递事件来源信息
    const handleDelete = useCallback((id: string) => {
      /*删除操作*/
    }, []);
    
    return (
      <List>
        {list.map(i => (
          <Item key={i.id} id={i.id} onClick={handleDelete} value={i.value} />
        ))}
      </List>
    );

如果是第三方组件或者 DOM 组件呢? 实在不行，看能不能传递`data-*`属性:

    const handleDelete = useCallback(event => {
      const id = event.dataset.id;
      /*删除操作*/
    }, []);
    
    return (
      <ul>
        {list.map(i => (
          <li key={i.id} data-id={i.id} onClick={handleDelete} value={i.value} />
        ))}
      </ul>
    );

### 2️⃣ 不可变数据

不可变数据可以让状态变得可预测，也让 shouldComponentUpdate '浅比较'变得更可靠和高效. 笔者在[React 组件设计实践总结 04 - 组件的思维](https://link.zhihu.com/?target=https%3A//juejin.im/post/5cdc2f54e51d453b0c35930d%23heading-8)介绍过不可变数据，有兴趣读者可以看看.

相关的工具有[Immutable.js](https://link.zhihu.com/?target=https%3A//github.com/facebook/immutable-js)、[Immer](https://link.zhihu.com/?target=https%3A//github.com/mweststrate/immer)、immutability-helper 以及 seamless-immutable。

### 3️⃣ 简化 state

不是所有状态都应该放在组件的 state 中. 例如缓存数据。按照我的原则是：如果需要组件响应它的变动, 或者需要渲染到视图中的数据才应该放到 state 中。这样可以避免不必要的数据变动导致组件重新渲染.

### 4️⃣ 使用 recompose 精细化比对

尽管 hooks 出来后，recompose 宣称不再更新了，但还是不影响我们使用 recompose 来控制`shouldComponentUpdate`方法, 比如它提供了以下方法来精细控制应该比较哪些 props:

    /* 相当于React.memo */
     pure()
     /* 自定义比较 */
     shouldUpdate(test: (props: Object, nextProps: Object) => boolean): HigherOrderComponent
     /* 只比较指定key */
     onlyUpdateForKeys( propKeys: Array<string>): HigherOrderComponent

其实还可以再扩展一下，比如`omitUpdateForKeys`忽略比对某些 key.

## 精细化渲染

所谓精细化渲染指的是只有一个数据来源导致组件重新渲染, 比如说 A 只依赖于 a 数据，那么只有在 a 数据变动时才渲染 A, 其他状态变化不应该影响组件 A。

Vue 和 Mobx 宣称自己性能好的一部分原因是它们的'响应式系统', 它允许我们定义一些‘响应式数据’，当这些响应数据变动时，依赖这些响应式数据视图就会重新渲染. 来看看 Vue 官方是如何描述的:

![](https://pic2.zhimg.com/v2-898d9a873ecbbdaed7be7d0e19a56099_b.jpg)

### 0️⃣ 响应式数据的精细化渲染

大部分情况下，响应式数据可以实现视图精细化的渲染, 但它还是不能避免开发者写出低效的程序. 本质上还是因为组件违背‘单一职责’.

举个例子，现在有一个 MyComponent 组件，依赖于 A、B、C 三个数据源，来构建一个 vdom 树。现在的问题是什么呢？现在只要 A、B、C 任意一个变动，那么 MyComponent 整个就会重新渲染:

![](https://pic3.zhimg.com/v2-ad6af357800e0abee789880a43c5d732_b.jpg)

更好的做法是让组件的职责更单一，精细化地依赖响应式数据，或者说对响应式数据进行‘隔离’. 如下图, A、B、C 都抽取各自的组件中了，现在 A 变动只会渲染 A 组件本身，而不会影响父组件和 B、C 组件:

![](https://pic3.zhimg.com/v2-1f95b2ed3aed34993276f94d2a651c56_b.jpg)

举一个典型的例子，列表渲染:

    import React from 'react';
    import { observable } from 'mobx';
    import { observer } from 'mobx-react-lite';
    
    const initialList = [];
    for (let i = 0; i < 10; i++) {
      initialList.push({ id: i, name: `name-${i}`, value: 0 });
    }
    
    const store = observable({
      list: initialList,
    });
    
    export const List = observer(() => {
      const list = store.list;
      console.log('List渲染');
      return (
        <div className="list-container">
          <ul>
            {list.map((i, idx) => (
              <div className="list-item" key={i.id}>
                {/* 假设这是一个复杂的组件 */}
                {console.log('render', i.id)}
                <span className="list-item-name">{i.name} </span>
                <span className="list-item-value">{i.value} </span>
                <button
                  className="list-item-increment"
                  onClick={() => {
                    i.value++;
                    console.log('递增');
                  }}
                >
                  递增
                </button>
                <button
                  className="list-item-increment"
                  onClick={() => {
                    if (idx < list.length - 1) {
                      console.log('移位');
                      let t = list[idx];
                      list[idx] = list[idx + 1];
                      list[idx + 1] = t;
                    }
                  }}
                >
                  下移
                </button>
              </div>
            ))}
          </ul>
        </div>
      );
    });

上述的例子是存在性能问题的，单个 list-item 的递增和移位都会导致整个列表的重新渲染:

![](https://pic1.zhimg.com/v2-ddf37ce31f3ca4fcb8925b7f21004d2c_b.jpg)

原因大概能猜出来吧? 对于 Vue 或者 Mobx 来说，一个组件的渲染函数就是一个依赖收集的上下文。上面 List 组件渲染函数内'访问'了所有的列表项数据，那么 Vue 或 Mobx 就会认为你这个组件依赖于所有的列表项，这样就导致，只要任意一个列表项的属性值变动就会重新渲染整个 List 组件。

解决办法也很简单，就是将数据隔离抽取到单一职责的组件中。对于 Vue 或 Mobx 来说，越细粒度的组件，可以收获更高的性能优化效果:

    export const ListItem = observer(props => {
      const { item, onShiftDown } = props;
      return (
        <div className="list-item">
          {console.log('render', item.id)}
          {/* 假设这是一个复杂的组件 */}
          <span className="list-item-name">{item.name} </span>
          <span className="list-item-value">{item.value} </span>
          <button
            className="list-item-increment"
            onClick={() => {
              item.value++;
              console.log('递增');
            }}
          >
            递增
          </button>
          <button className="list-item-increment" onClick={() => onShiftDown(item)}>
            下移
          </button>
        </div>
      );
    });
    
    export const List = observer(() => {
      const list = store.list;
      const handleShiftDown = useCallback(item => {
        const idx = list.findIndex(i => i.id === item.id);
        if (idx !== -1 && idx < list.length - 1) {
          console.log('移位');
          let t = list[idx];
          list[idx] = list[idx + 1];
          list[idx + 1] = t;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      console.log('List 渲染');
    
      return (
        <div className="list-container">
          <ul>
            {list.map((i, idx) => (
              <ListItem key={i.id} item={i} onShiftDown={handleShiftDown} />
            ))}
          </ul>
        </div>
      );
    });

效果很明显, list-item 递增只会重新渲染本身; 而移位只会重新渲染 List， 因为列表项没有变动, 所以下级 list-item 也不需要重新渲染:

![](https://pic3.zhimg.com/v2-333f01475326dc9fcaef0fa43943c2c2_b.jpg)

### 1️⃣ 不要滥用 Context

其实 Context 的用法和响应式数据正好相反。笔者也看过不少滥用 Context API 的例子, 说到底还是没有处理好‘状态的作用域问题’.

首先要理解 Context API 的更新特点，它是可以穿透`React.memo`或者`shouldComponentUpdate`的比对的，也就是说，一旦 Context 的 Value 变动，所有依赖该 Context 的组件会全部 forceUpdate.

这个和 Mobx 和 Vue 的响应式系统不同，Context API 并不能细粒度地检测哪些组件依赖哪些状态，所以说上节提到的‘精细化渲染’组件模式，在 Context 这里就成为了‘反模式’.

总结一下使用 Context API 要遵循一下原则:

- 明确状态作用域, Context 只放置必要的，关键的，被大多数组件所共享的状态。比较典型的是鉴权状态

举一个简单的例子:

![](https://pic2.zhimg.com/v2-faa0ff82c71776cb5de2800cc4860d25_b.jpg)

![](https://pic4.zhimg.com/v2-a08109845217510e3be79625179aebef_b.jpg)

扩展：Context其实有个实验性或者说非公开的选项`observedBits`, 可以用于控制ContextConsumer是否需要更新. 详细可以看这篇文章<[ObservedBits: React Context的秘密功能](https://zhuanlan.zhihu.com/p/51073183)>. 不过不推荐在实际项目中使用，而且这个API也比较难用，不如直接上mobx。

- 粗粒度地订阅 Context

如下图. 细粒度的 Context 订阅会导致不必要的重新渲染, 所以这里推荐粗粒度的订阅. 比如在父级订阅 Context，然后再通过 props 传递给下级。

![](https://pic2.zhimg.com/v2-a922e5057a3d5c92ae93a2eb864afcf9_b.jpg)

另外程墨 Morgan 在[避免 React Context 导致的重复渲染](https://zhuanlan.zhihu.com/p/50336226)一文中也提到 ContextAPI 的一个陷阱:

    <Context.Provider
      value={{ theme: this.state.theme, switchTheme: this.switchTheme }}
    >
      <div className="App">
        <Header />
        <Content />
      </div>
    </Context.Provider>

上面的组件会在 state 变化时重新渲染整个组件树，至于为什么留给读者去思考。

所以我们一般都不会裸露地使用 Context.Provider, 而是封装为独立的 Provider 组件:

    export function ThemeProvider(props) {
      const [theme, switchTheme] = useState(redTheme);
      return (
        <Context.Provider value={{ theme, switchTheme }}>
          {props.children}
        </Context.Provider>
      );
    }
    
    // 顺便暴露useTheme, 让外部必须直接使用Context
    export function useTheme() {
      return useContext(Context);
    }

现在 theme 变动就不会重新渲染整个组件树，因为 props.children 由外部传递进来，并没有发生变动。

其实上面的代码还有另外一个比较难发现的陷阱(官方文档也有[提到](https://link.zhihu.com/?target=https%3A//zh-hans.reactjs.org/docs/context.html%23caveats)):

    export function ThemeProvider(props) {
      const [theme, switchTheme] = useState(redTheme);
      return (
        {/* 👇 💣这里每一次渲染ThemeProvider, 都会创建一个新的value(即使theme和switchTheme没有变动),
            从而导致强制渲染所有依赖该Context的组件 */}
        <Context.Provider value={{ theme, switchTheme }}>
          {props.children}
        </Context.Provider>
      );
    }

所以传递给 Context 的 value 最好做一下缓存:

    export function ThemeProvider(props) {
      const [theme, switchTheme] = useState(redTheme);
      const value = useMemo(() => ({ theme, switchTheme }), [theme]);
      return <Context.Provider value={value}>{props.children}</Context.Provider>;
    }

## 扩展

- [Optimizing Performance](https://link.zhihu.com/?target=https%3A//react.docschina.org/docs/optimizing-performance.html) React 官方文档，最好的教程, 利用好 React 的性能分析工具。
- [Twitter Lite and High Performance React Progressive Web Apps at Scale](https://link.zhihu.com/?target=https%3A//medium.com/%40paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3) 看看 Twitter 如何优化的