## 遇到问题

今天遇到一个 `useEffect` 的问题，遇到一个问题：在 useEffect 里面发异步请求，然后第二个参数的依赖也是异步请求之后得到的结果，然后就导致最终结果会请求两次 useEffect 里的函数。

```js
 const [metaKey, setMetaKey] = useState<string[]>([])

 // useEffect1
 useEffect(() => {
   getServiceCoreIndexParam().then((res: IResult) => {
     setMetaKey(res.data.defaultValue)
     return res.data
   })
 }, [])

 // useEffect2
useEffect(() => {
  getAdvisorIndexTable({
    visitdate: props.visitdate,
    advisorSupervisor: props.advisorSupervisor,
    comparevisitdate: props.comparevisitdate,
    metaKeys: metaKey || []
  }).then((res: IResult) => {
    res.success && setTable(res.data)
  })
}, [props.visitdate, props.advisorSupervisor, metaKey, props.comparevisitdate])
```

分析一下这段代码，首先在组件 mount 的时候，`useEffect2` 会调用一次 `getAdvisorIndexTable`，当 useEffect1 执行完毕之后 `setMetaKey` 后，由于 metaKey 发生改变，导致 `getAdvisorIndexTable` 还会调用一次，这很明显是我们不想看到的结果，因为这只是一个默认请求，然而发了两次请求。

其实最开始我以为 useEffect 如果有了第二个参数，在 mount 的时候并不会去调用回调，而仅仅是在依赖变化后才调用回调，后来发现我的依赖没有变，也调用了，所以我就写了个 demo 试了下，发现 useEffect 在 mount 的时候就会默认调用一次回调。

## 解决办法

那么遇到这种情况应该怎么才能让 useEffect 在只有依赖变化的时候才去执行呢？或者说如何让我这个代码只请求一次呢？

**方法一**

通过增加一个 mount 的一个 state，默认为 false，当 mount 过后就把这个 state 设置为 true，然后在 useEffect 内部去判断 mount 的逻辑和依赖更新的逻辑。

上面的代码就可以改成这样：

```js
const [metaKey, setMetaKey] = useState<string[]>([])
const [status, setStatus] = useState(false) // 是否 mount 过的状态

useEffect(() => {
  getServiceCoreIndexParam().then((res: IResult) => {
    setStatus(true)
    setMetaKey(res.data.defaultValue)
    return res.data
  })
}, [])

useEffect(() => {
  if(status) {
    getAdvisorIndexTable({
      visitdate: props.visitdate,
      advisorSupervisor: props.advisorSupervisor,
      comparevisitdate: props.comparevisitdate,
      metaKeys: metaKey || []
    }).then((res: IResult) => {
      res.success && setTable(res.data)
    })
  }

}, [props.visitdate, props.advisorSupervisor, metaKey, props.comparevisitdate])
```

新增了一个 status 状态，用来标识是否 mount 过，在第一个 useEffect 里当异步方法请求完了之后回来再把 status 设置为 true，那么当第一次渲染的时候第二个 useEffect 里 status 是 false，里面的逻辑不会执行，当第一个 useEffect 异步请求回调回来的时候 setMetaKey 会更新组件，那么这个时候第二个 useEffect 里也会去再次调用 effect，而且这个时候 status 是 true 了，这样就达到了我们想要的效果。

**方法二**

可以写一个 mount 的时候不执行的 hooks。

```js
function useUpdateEffect(cb: () => void, depend: any[]) {
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if(status) {
            cb()
        } else {
            setStatus(true)
        }
    }, depend)
}

 const [metaKey, setMetaKey] = useState<string[]>([])

 useEffect(() => {
   getServiceCoreIndexParam().then((res: IResult) => {
     setMetaKey(res.data.defaultValue)
     return res.data
   })
 }, [])

useUpdateEffect(() => {
  getAdvisorIndexTable({
    visitdate: props.visitdate,
    advisorSupervisor: props.advisorSupervisor,
    comparevisitdate: props.comparevisitdate,
    metaKeys: metaKey || []
  }).then((res: IResult) => {
    res.success && setTable(res.data)
  })
}, [props.visitdate, props.advisorSupervisor, metaKey, props.comparevisitdate])

```

`useUpdateEffect` 就是相当于第一次调用 useEffect 的回调的时候不执行，第二次的时候才执行，基本上达到要求。