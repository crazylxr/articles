在 React 中创建更新的方式常用的有三种：

- ReactDOM.render
- setState
- forceUpdate

首先我们调用的就是  `ReactDOM.render` 方法，接下来就从这个方法开始解析源码：

> 我在贴源码分析的时候是删除了开发的时候的代码，也就是 `if(__DEV__)`里面的代码。

我们找到在 ReactDOM.js 找到 ReactDOM 对象，可以看到 ReactDOM 还是有挺多方法属性的，但是大部分 API 都是没有在文档里面体现，所以我们也不会用，我们直接进入到 ReactDOM 的 render 方法分析，这是 React 渲染的入口：

```javascript
/*** react-dom/src/client/ReactDOM.js ***/

const ReactDOM: Object = {
    // element: 传进来的 App 组件
    // container: 挂载的 DOM 节点
    // callback: 回调函数
    render(
    element: React$Element<any>,
    container: DOMContainer,
    callback: ?Function,
  ) {
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      false,
      callback,
    );
  },
}
```

render 方法直接返回的是 `legacyRenderSubtreeIntoContainer` 方法的返回值。

```javascript
/*** react-dom/src/client/ReactDOM.js ***/

// parentComponent 初次是 null
// children 就是 ReactDOM.render 传进来的第一个参数，就是根对象
// container 是需要挂载的 DOM 节点
// forceHydrate 我们讨论的浏览器端的，固定是 false，如果是服务端的就是 true
// callback 就是 调用 ReactDOM.render 传进来的第三个参数，callback
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function,
) {
      
  // 首次 render 的时候，肯定 container 下面是没有 _reactRootContainer 的，所以是 null
  let root: Root = (container._reactRootContainer: any);
  // 首次渲染 root 为 null，执行 if
  if (!root) {
    // Initial mount
    //  初始化渲染，没有 root，那么就通过 legacyCreateRootFromDOMContainer 创建一个 root
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    
    // 如果有 callback 就执行，做了一个简单的封装，把节点信息传递给回调函数
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    // 首次渲染不应该批量更新，这个方法暂时可以理解成会马上执行这个参数传递的函数就行，其实里面只是去设置了一个全局变量
    unbatchedUpdates(() => {
      if (parentComponent != null) {
        root.legacy_renderSubtreeIntoContainer(
          parentComponent,
          children,
          callback,
        );
      } else {
        root.render(children, callback);
      }
    });
  } else {
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(root._internalRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    if (parentComponent != null) {
      root.legacy_renderSubtreeIntoContainer(
        parentComponent,
        children,
        callback,
      );
    } else {
      root.render(children, callback);
    }
  }
  return getPublicRootInstance(root._internalRoot);
}
```

