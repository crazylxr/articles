

原文作者：东起

原文链接：https://zhuanlan.zhihu.com/p/103763164

## 0.前言

原文有 36 到 vue 常用面试题，考虑到太多一次也看不完，所以分为 **上、中、下**三篇，如果你能读完这三篇文章，相信你在面试中 vue 的问题你不会怕了。

## 11、怎么在vue中点击别的区域输入框不会失去焦点？

 答：阻止事件的默认行为

具体操作：监听你想点击后不会丢失 input 焦点的那个元素的 mousedown 事件，回调里面调用 event.preventDefault()，会阻止使当前焦点丢失这一默认行为。

## 12、vue中data的属性可以和methods中的方法同名吗？为什么？

答：不可以

因为，Vue会把methods和data的东西，全部代理到Vue生成的对象中，会产生覆盖所以最好不要同名

## 13、怎么给vue定义全局的方法？

Vue.prototype.方法名称

## 14、Vue 2.0 不再支持在 v-html 中使用过滤器怎么办？

解决方法：

①全局方法（推荐）

```javascript
Vue.prototype.msg = function（msg）{ 
  return msg.replace（"\n"，"<br>"）
 }
 <div v-html="msg(content)"></div>
```

②computed方法

```javascript
computed：{ 
 content：function(msg){
  return msg.replace("\n"，"<br>")
 }
}
<div>{{content}}</div>
```

③$options.filters(推荐)

```javascript
filters：{ 
 msg：function(msg){
  return msg.replace(/\n/g，"<br>")
 }
}，  　　
data：{ 
 content："XXXX"
}
<div v-html="$options.filters.msg(content)"></div>
```

## 14、怎么解决vue打包后静态资源图片失效的问题？

答：将静态资源的存放位置放在src目录下

## 16、怎么解决vue动态设置img的src不生效的问题？

```javascript
<img class="logo" :src="logo" alt="公司logo">
data() {
  return {
    logo:require("./../assets/images/logo.png"),
  };
}
```

因为动态添加src被当做静态资源处理了，没有进行编译，所以要加上require

## 17、跟keep-alive有关的生命周期是哪些？描述下这些生命周期

activated和deactivated两个生命周期函数

1.activated：当组件激活时，钩子触发的顺序是created->mounted->activated

2.deactivated: 组件停用时会触发deactivated，当再次前进或者后退的时候只触发activated

## 18、你知道vue中key的原理吗？说说你对它的理解

暂时没弄明白，等会儿写

## 19、vue中怎么重置data？

答：Object.assign()

Object.assign（）方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

```javascript
var o1 = { a: 1 };
var o2 = { b: 2 };
var o3 = { c: 3 };
var obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1); // { a: 1, b: 2, c: 3 }, 注意目标对象自身也会改变。
```

注意，具有相同属性的对象，同名属性，后边的会覆盖前边的。

由于Object.assign()有上述特性，所以我们在Vue中可以这样使用：

Vue组件可能会有这样的需求：在某种情况下，需要重置Vue组件的data数据。此时，我们可以通过this.$data获取当前状态下的data，通过this.$options.data()获取该组件初始状态下的data。

然后只要使用Object.assign(this.$data, this.$options.data())就可以将当前状态的data重置为初始状态。

## 20、vue怎么实现强制刷新组件？

答：① v-if      ② this.$forceUpdate

v-if

```javascript
当v-if的值发生变化时，组件都会被重新渲染一遍。因此，利用v-if指令的特性，可以达到强制
<comp v-if="update"></comp>
<button @click="reload()">刷新comp组件</button>
data() {
 return {
   update: true
  }
 },
 methods: {
  reload() {
     // 移除组件
    this.update = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
    this.$nextTick(() => {
      this.update = true
    })
  }
 }
```

this.$forceUpdate

```javascript
<button @click="reload()">刷新当前组件</button>
methods: {
  reload() {
    this.$forceUpdate()
  }
}
```

## 21、vue如何优化首页的加载速度？

① 第三方js库按CDN引入（一、cdn引入 二、去掉第三方库引入的import 三、把第三方库的js文件从打包文件里去掉）

② vue-router路由懒加载

③ 压缩图片资源

④ 静态文件本地缓存

http缓存：推荐网站：[https://www.cnblogs.com/chinajava/p/5705169.html](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/chinajava/p/5705169.html)

service worker离线缓存:，缺点：需要在HTTPS站点下，推荐：[http://lzw.me/a/pwa-service-worker.html](https://link.zhihu.com/?target=http%3A//lzw.me/a/pwa-service-worker.html)

⑤ 服务器端SSR渲染

除了上面的方案以外，另一种方案也不容小视

我们先说说通常项目中是如何加载页面数据：Vue组件生命周期中请求异步接口，在mounted之前应该都可以，据我了解绝大部分同学是在mounted的时候执行异步请求。但是我们可以把页面需要的请求放到Vue-Router的守卫中执行，意思是在路由beforeEnter之前就可以请求待加载页面中所有组件需要的数据，此时待加载页面的Vue组件还没开始渲染，而Vue组件开始渲染的时候我们就可以用Vuex里面的数据了。

以上方法的实现思路：
![](https://pic4.zhimg.com/v2-e50f50b5bacfe047d6f77e35ccecc227_b.jpg)
图意：每个页面（Page）中都会有很多个Vue组件，可以在Vue组件中添加自定义属性fetchData，fetchData里面可以执行异步请求（图中执行Vuex的Action），但是我们怎么获取到所有组件的fetchData方法并执行呢？如图所示，在router.beforeResolve守卫中，我们看看router.beforeResolve的定义，所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用，意思是即使页面中有异步组件，它会等待异步组件解析之后执行，并且解析守卫在beforeEnter之前执行。那我们怎么在解析守卫中获取到待加载页面的所有组件呢？通过router.getMatchedComponents方法。
![](https://pic4.zhimg.com/v2-e7a0ab9ba52eed170186fb1bf72cdbe3_b.jpg)![](https://pic1.zhimg.com/v2-1625817e26fb7959c3b65e8d8cc0846c_b.jpg)
这样我们就可以在解析守卫中获取到所有待加载组件的fetchData方法并执行，这样无疑会在组件开始渲染之后获取到所有数据，提高页面加载速度。

很多人可能有个疑问，如果异步请求放在beforeCreate和created不是一样吗？答案是否定的，因为这种方式可以将异步请求放到beforeCreate之前！

## 22、你了解vue的diff算法吗？

推荐网站：[https://www.cnblogs.com/wind-lanyan/p/9061684.html](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/wind-lanyan/p/9061684.html)

## 23、vue能监听到数组变化的方法有哪些？为什么这些方法能监听到呢？

Vue.js观察数组变化主要通过以下7个方法（push、pop、shift、unshift、splice、sort、reverse）

大家知道，通过Object.defineProperty()劫持数组为其设置getter和setter后，调用的数组的push、splice、pop等方法改变数组元素时并不会触发数组的setter，继而数组的数据变化并不是响应式的，但是vue实际开发中却是实时响应的，是因为vue重写了数组的push、splice、pop等方法

从源码中可以看出，ob.dep.notify()将当前数组的变更通知给其订阅者，这样当使用重写后方法改变数组后，数组订阅者会将这边变化更新到页面中