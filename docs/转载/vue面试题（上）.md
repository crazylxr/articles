## 1.页面中定义一个定时器，在哪个阶段清除？

答案：在 beforeDestroy 中销毁定时器。

①为什么销毁它：

在页面a中写了一个定时器，比如每隔一秒钟打印一次1，当我点击按钮进入页面b的时候，会发现定时器依然在执行，这是非常消耗性能的。

②解决方案1：

```javascript
mounted(){
 this.timer = setInterval(()=>{
    console.log(1)
 },1000)
},
beforeDestroy(){
 clearInterval(this.timer)
}
```

方案1有两点不好的地方，引用尤大的话来说就是：

它需要在这个组件实例中保存这个 timer，如果可以的话最好只有生命周期钩子可以访问到它。这并不算严重的问题，但是它可以被视为杂物。

我们的建立代码独立于我们的清理代码，这使得我们比较难于程序化的清理我们建立的所有东西。

方案2（推荐）：该方法是通过$once这个事件侦听器在定义完定时器之后的位置来清除定时器

```javascript
mounted(){
 const timer = setInterval(()=>{
    console.log(1)
 },1000)
 this.$once('hook:beforeDestroy',()=>{
  clearInterval(timer)
 })
}
```

官网参考链接:[https://cn.vuejs.org/v2/guide/components-edge-cases.html](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/components-edge-cases.html)
![](https://pic2.zhimg.com/v2-645c07156d898b930ee13a4831afe67d_b.jpg)![](https://pic2.zhimg.com/80/v2-645c07156d898b930ee13a4831afe67d_1440w.jpg)

### 2.父组件如何获取子组件的数据，子组件如何获取父组件的数据，父子组件如何传值？

① 先说，父组件如何主动获取子组件的数据？

方案1：$children

$children用来访问子组件实例，要知道一个组件的子组件可能是不唯一的，所以它的返回值是数组。

现在，我们定义Header，HelloWorld两个组件

```javascript
<template>
  <div class="index">
    <Header></Header>
    <HelloWorld :message="message"></HelloWorld>
    <button @click="goPro">跳转</button>
  </div>
</template>
mounted(){
 console.log(this.$children)
}
```

![](https://pic3.zhimg.com/v2-3de1818f8ae08faad262f18ae30a8d16_b.png)![](https://pic3.zhimg.com/80/v2-3de1818f8ae08faad262f18ae30a8d16_1440w.png)
 打印的是一个数组，可以用foreach分别得到所需要的的数据

缺点：

无法确定子组件的顺序，也不是响应式的。如果你确切的知道要访问子组件建议使用$refs。

方案2 ： $refs

```javascript
<HelloWorld ref="hello" :message="message"></HelloWorld>
```

调用helloworld子组件的时候直接定义一个ref，这样就可以通过this.$refs获取所需要的的数据。

```javascript
this.$refs.hello.属性
this.$refs.hello.方法
```

②子组件如何主动获取父组件中的数据？

通过 ： $parent

$parent用来访问父组件实例，通常父组件都是唯一确定的，跟$children类似

```javascript
this.$parent.属性
this.$parent.方法
```

父子组件通信除了以上三种，还有props 和$emit 这两种比较常用就不介绍了，除此之外，还有inheritAttrs和 $attrs

③inheritAttrs

这是@2.4新增的属性和接口。inheritAttrs属性控制子组件html属性上是否显示父组件的提供的属性。

如果我们将父组件Index中的属性desc、keysword、message三个数据传递到子组件HelloWorld中的话，如下

父组件Index部分

```javascript
<HelloWorld ref="hello" :desc="desc" :keysword="keysword" :message="message"></HelloWorld>
```

子组件：HelloWorld，props中只接受了message

```javascript
props: {
    message: String
},
```

实际情况，我们只需要message，那其他两个属性则会被当做普通的html元素插在子组件的根元素上。

如图
![](https://pic2.zhimg.com/v2-8688552a0ce86bd64f9528a0ad0be03d_b.jpg)![](https://pic2.zhimg.com/80/v2-8688552a0ce86bd64f9528a0ad0be03d_1440w.jpg)
这样做会使组件预期功能变得模糊不清，这个时候，在子组件中写入，inheritAttrs：false ，这些没用到的属性便会被去掉，true的话，就会显示。

如果，父组件中没被需要的属性，跟子组件本来的属性冲突的时候，则依据父组件

```javascript
<HelloWorld ref="hello" type="text" :message="message"></HelloWorld>
```

子组件：HelloWorld

```javascript
<template>
  <input type="number">
</template>
```

这个时候父组件中type=“text”，而子组件中type=”number”,而实际中最后显示的是type=”text”，这并不是我们想要的，所以只要设置：inheritAttrs：false，type便会成为number
![](https://pic3.zhimg.com/v2-9494fc77b08175b372e23f985bbfda1a_b.jpg)![](https://pic3.zhimg.com/80/v2-9494fc77b08175b372e23f985bbfda1a_1440w.jpg)
上述这些没被用到的属性，如何被获取呢？这就用到了$attrs

③$attrs

作用：可以获取到没有使用的注册属性，如果需要，我们在这也可以往下继续传递。

就上上述没有被用到的desc和keysword就能通过$attrs获取到。

通过$attrs的这个特性可以父组件传递到孙组件，免除父组件传递到子组件，再从子组件传递到孙组件的麻烦

代码如下
父组件Index部分

```javascript
<div class="index">
  <HelloWorld ref="hello" :desc="desc" :keysword="keysword" :message="message"></HelloWorld>
</div>
 data(){
  return{
   message:'首页',
   desc:'首页描述',
   keysword:'我是关键词key'
 }
},
```

子组件HelloWorld部分

```javascript
<div class="hello">
   <sunzi v-bind="$attrs"></sunzi>
   <button @click="aa">获取父组件的数据</button>
</div>
```

孙子组件sunzi部分

```javascript
<template>
  <div class="header">
    {{$attrs}}
    <br>
  </div>
</template>
```

可以看出通过 v-bind=”$attrs”将数据传到孙组件中

除了以上，provide / inject 也适用于 隔代组件通信，尤其是获取祖先组件的数据，非常方便。
![](https://pic2.zhimg.com/v2-116c7482d2ae370de13da0fd2d5c0f91_b.jpg)![](https://pic2.zhimg.com/80/v2-116c7482d2ae370de13da0fd2d5c0f91_1440w.jpg)
简单的说，当组件的引入层次过多，我们的子孙组件想要获取祖先组件的资源，那么怎么办呢，总不能一直取父级往上吧，而且这样代码结构容易混乱。这个就是provide / inject要干的事情。

```javascript
<template>
  <div>
<childOne></childOne>
  </div>
</template>

<script>
  import childOne from '../components/test/ChildOne'
  export default {
    name: "Parent",
    provide: {
      for: "demo"
    },
    components:{
      childOne
    }
  }
```

在这里我们在父组件中provide for这个变量，然后直接设置三个组件（childOne、childTwo 、childThird）并且一层层不断内嵌其中， 而在最深层的childThird组件中我们可以通过inject获取for这个变量

```javascript
<template>
  <div>
    {{demo}}
  </div>
</template>

<script>
  export default {
    name: "",
    inject: ['for'],
    data() {
      return {
        demo: this.for
      }
    }
  }
</script>
```

### 3.自定义指令如何定义，它的生命周期是什么？

通过Vue.directive() 来定义全局指令

有几个可用的钩子（生命周期）, 每个钩子可以选择一些参数. 钩子如下:

bind: 一旦指令附加到元素时触发

inserted: 一旦元素被添加到父元素时触发

update: 每当元素本身更新(但是子元素还未更新)时触发

componentUpdate: 每当组件和子组件被更新时触发

unbind: 一旦指令被移除时触发。

bind和update也许是这五个里面最有用的两个钩子了

每个钩子都有el, binding, 和vnode参数可用. 

update和componentUpdated钩子还暴露了oldVnode, 以区分传递的旧值和较新的值.

el就是所绑定的元素.

binding是一个保护传入钩子的参数的对象. 有很多可用的参数, 包括name, value, oldValue, expression, arguments, arg及修饰语. 

vnode有一个更不寻常的用例, 它可用于你需要直接引用到虚拟DOM中的节点.

binding和vnode都应该被视为只读.

现在，自定义一个指令，添加一些样式，表示定位的距离

```javascript
Vue.directive('tack',{
 bind(el,binding){
  el.style.position='fixed';
  el.style.top=binding.value + 'px'
 }
})
<div class="header" v-tack="10" >我是header</div>
```

假设我们想要区分从顶部或者左侧偏移70px, 我们可以通过传递一个参数来做到这一点

```javascript
Vue.directive('tack', {
 bind(el, binding, vnode) {
  el.style.position = 'fixed';
  const s = (binding.arg === 'left' ? 'left' : 'top');
  el.style[s] = binding.value + 'px';
 }
})
```

也可以同时传入不止一个值

```javascript
Vue.directive('tack', {
 bind(el, binding, vnode) {
 el.style.position = 'fixed';
 el.style.top = binding.value.top + 'px';
 el.style.left = binding.value.left + 'px';
 }
})
<div class="header" v-tack="{left:’20’,top:’20’}" >我是header</div>
```

## 4、vue生命周期，各个阶段简单讲一下？

breforeCreate（）：实例创建前，这个阶段实例的data和methods是读不到的。

created（）：实例创建后，这个阶段已经完成数据观测，属性和方法的运算，watch/event事件回调，mount挂载阶段还没有开始。$el属性目前不可见，数据并没有在DOM元素上进行渲染。

created完成之后，进行template编译等操作，将template编译为render函数，有了render函数后才会执行beforeMount（）

beforeMount（）：在挂载开始之前被调用：相关的 render 函数首次被调用

mounted（）：挂载之后调用，el选项的DOM节点被新创建的 vm.$el 替换，并挂载到实例上去之后调用此生命周期函数，此时实例的数据在DOM节点上进行渲染

后续的钩子函数执行的过程都是需要外部的触发才会执行

有数据的变化，会调用beforeUpdate，然后经过Virtual  Dom，最后updated更新完毕，当组件被销毁的时候，会调用beforeDestory，以及destoryed。

## 5、watch 和 computed的区别？

computed：

①有缓存机制；②不能接受参数；③可以依赖其他computed，甚至是其他组件的data；④不能与data中的属性重复

watch：

①可接受两个参数；②监听时可触发一个回调，并做一些事情；③监听的属性必须是存在的；④允许异步

watch配置：handler、deep（是否深度）、immeditate （是否立即执行）

总结：

当有一些数据需要随着另外一些数据变化时，建议使用computed

当有一个通用的响应数据变化的时候，要执行一些业务逻辑或异步操作的时候建议使用watch

## 6、请说一下computed中的getter和setter

① computed 中可以分成 getter（读取） 和 setter（设值）

② 一般情况下是没有 setter 的，computed 预设只有 getter ，也就是只能读取，不能改变设值。

一、默认只有 getter的写法

```javascript
<div id="demo">{{ fullName }}</div>
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
//其实fullName的完整写法应该是如下：
fullName: {
 get(){
   return this.firstName + ' ' + this.lastName
 }
}
```

注意：不是说我们更改了getter里使用的变量，就会触发computed的更新，前提是computed里的值必须要在模板里使用才行。如果将{{fullName}}去掉，get（）方法是不会触发的。

二、setter的写法，可以设值

```javascript
<template>
   <div id="demo">
       <p> {{ fullName }} </p>
       <input type="text" v-model="fullName">
       <input type="text" v-model="firstName">
       <input type="text" v-model="lastName">
   </div>
</template>

var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'zhang',
    lastName: 'san'
  },
  computed: {
    fullName: {
      //getter 方法
     get(){
       console.log('computed getter...')
        return this.firstName + ' ' + this.lastName
       }，
   //setter 方法
    set(newValue){
      console.log('computed setter...')
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
      return this.firstName + ' ' + this.lastName
     }
      
    }
  }
})
```

在这里，我们修改fullName的值，就会触发setter，同时也会触发getter。

注意：并不是触发了setter也就会触发getter，他们两个是相互独立的。我们这里修改了fullName会触发getter是因为setter函数里有改变firstName 和 lastName 值的代码，这两个值改变了，fullName依赖于这两个值，所以便会自动改变。

## 7、导航钩子有哪几种，分别如何用，如何将数据传入下一个点击的路由页面？

① 全局导航守卫

前置守卫

```javascript
router.beforeEach((to, from, next) => {
  // do someting
});
```

后置钩子（没有next参数）

```javascript
router.afterEach((to, from) => {
  // do someting
});
```

②路由独享守卫

```javascript
cont router = new  VueRouter({
 routes: [
  {
    path: '/file',
    component: File,
    beforeEnter: (to, from ,next) => {
       // do someting
    }
   }
 ]
});
```

顺便看一下路由里面的参数配置：
![](https://pic4.zhimg.com/v2-a8a592c0a3e41ad1d8d3a9a74b8a834b_b.jpg)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='515' height='163'></svg>)

③ 组件内的导航钩子

组件内的导航钩子主要有这三种：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave。他们是直接在路由组件内部直接进行定义的

beforeRouteEnter

```javascript
data(){
 return{
   pro:'产品'
 }
},
beforeRouteEnter:(to,from,next)=>{
  console.log(to)
  next(vm => {
   console.log(vm.pro)
  })
}
```

注：beforeRouteEnter 不能获取组件实例 this，因为当守卫执行前，组件实例被没有被创建出来，我们可以通过给 next 传入一个回调来访问组件实例。在导航被确认时，会执行这个回调，这时就可以访问组件实例了

仅仅是 beforRouteEnter 支持给 next 传递回调，其他两个并不支持，因为剩下两个钩子可以正常获取组件实例 this

如何通过路由将数据传入下一个跳转的页面呢？

答：  params 和 query

params

```javascript
传参
this.$router.push({
 name:"detail",
 params:{
   name:'xiaoming',
 }
});
接受
this.$route.params.name
```

query

```javascript
传参
this.$router.push({
  path:'/detail',
  query:{
    name:"xiaoming"
  }
 })
接受 //接收参数是this.$route
this.$route.query.id  
```

那query和params什么区别呢？

① params只能用name来引入路由，query既可以用name又可以用path（通常用path）

② params类似于post方法，参数不会再地址栏中显示
![](https://pic1.zhimg.com/v2-32a56c3878480d3ea03921d05051655c_b.png)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='333' height='35'></svg>)
query类似于get请求，页面跳转的时候，可以在地址栏看到请求参数
![](https://pic2.zhimg.com/v2-f2af54680c0cb540daf05104b926de41_b.png)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='312' height='26'></svg>)
那刚才提到的this.$router 和this.$route有何区别？

先打印出来看一下
![](https://pic2.zhimg.com/v2-89ad72c1d6e1e37069bb61b56f395b45_b.jpg)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='767' height='383'></svg>)
$router为VueRouter实例，想要导航到不同URL，则使用$router.push方法

$route为当前router跳转对象，里面可以获取name、path、query、params等

## 8、es6 的特有的类型， 常用的操作数组的方法都有哪些？

es6新增的主要的特性：

① let const 两者都有块级作用域

② 箭头函数

③ 模板字符串

④ 解构赋值

⑤ for of循环 

⑥ import 、export 导入导出

⑦ set数据结构

⑧ ...展开运算符

⑨ 修饰器 @

⑩ class类继承

⑪ async、await

⑫ promise

⑬ Symbol

⑭ Proxy代理

操作数组常用的方法：

es5：concat 、join 、push、pop、shift、unshift、slice、splice、substring和substr 、sort、 reverse、indexOf和lastIndexOf 、every、some、filter、map、forEach、reduce

es6：find、findIndex、fill、copyWithin、Array.from、Array.of、entries、values、key、includes

## 9、vue双向绑定原理？

通过Object.defineProperty()来劫持各个属性的setter,getter，在数据变动时发布消息给订阅者，触发相应的监听回调

## 10、vue-router的实现原理，history和hash模式有什么区别？

vue-router有两种模式，hash模式和history模式

hash模式

url中带有#的便是hash模式，#后面是hash值，它的变化会触发hashchange 这个事件。

通过这个事件我们就可以知道 hash 值发生了哪些变化。然后我们便可以监听hashchange来实现更新页面部分内容的操作：

    window.onhashchange = function(event){
      console.log(event.oldURL, event.newURL);
      let hash = location.hash.slice(1);
      document.body.style.color = hash;
    }

另外，hash 值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。

history模式

history api可以分为两大部分，切换和修改

① 切换历史状态

包括back,forward,go三个方法，对应浏览器的前进，后退，跳转操作

```javascript
history.go(-2);//后退两次
history.go(2);//前进两次
history.back(); //后退
hsitory.forward(); //前进
```

② 修改历史状态

包括了pushState,replaceState两个方法,这两个方法接收三个参数:stateObj,title,url

```javascript
history.pushState({color:'red'}, 'red', 'red'})
window.onpopstate = function(event){
  console.log(event.state)
  if(event.state && event.state.color === 'red'){
    document.body.style.color = 'red';
  }
}
history.back();
history.forward();
```

通过pushstate把页面的状态保存在state对象中，当页面的url再变回这个url时，可以通过event.state取到这个state对象，从而可以对页面状态进行还原，这里的页面状态就是页面字体颜色，其实滚动条的位置，阅读进度，组件的开关的这些页面状态都可以存储到state的里面。

history缺点：

1：hash 模式下，仅hash符号之前的内容会被包含在请求中，如[http://www.a12c.com](https://link.zhihu.com/?target=http%3A//www.a12c.com),因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回404错误。

2：history模式下，前端的URL必须和实际向后端发起请求的URL一致。如[http://www.a12c.com/book/a](https://link.zhihu.com/?target=http%3A//www.a12c.com/book/a)。如果后端缺少对/book/a 的路由处理，将返回404错误