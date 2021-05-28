

## 24、说说你对proxy的理解？

Proxy用于修改某些操作的默认行为，也可以理解为在目标对象之前架设一层拦截，外部所有的访问都必须先通过这层拦截，因此提供了一种机制，可以对外部的访问进行过滤和修改。

    var target = {
       name: 'zhangsan',
       age:20,
       sex:'男'
     }
    var logHandler = {
      get(target, key) {
        console.log(`${key}被读取`)
        return target[key]
       },
      set(target, key, value) {
        console.log(`${key}被设置为${value}`)
        target[key] = value
      }
    }
    var demo = new Proxy(target, logHandler)
    demo.name  //name被读取

var proxy = new Proxy(target, handler);

Proxy对象的所有用法，都是上面的这种形式。不同的只是handle参数的写法。其中new Proxy用来生成Proxy实例，target是表示所要拦截的对象，handle是用来定制拦截行为的对象。

我们可以将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用。

    var object = { proxy: new Proxy(target, handler) };

Proxy对象也可以作为其它对象的原型对象。

    var proxy = new Proxy({}, {
      get: function(target, property) {
        return 35;
      }
    });
    let obj = Object.create(proxy);
    obj.time // 35

上面代码中，proxy对象是obj的原型对象，obj本身并没有time属性，所以根据原型链，会在proxy对象上读取属性，从而被拦截。

同一个拦截函数，可以设置多个操作。

    var handler = {
      get: function (target, name) {
        if (name === 'prototype') {
           return Object.prototype;
        }
        return 'Hello, ' + name;
      },
     
      apply: function (target, thisBinding, args) {
        return args[0];
      },
     
      construct: function (target, args) {
        return { value: args[1] };
      }
    };
     
    var fproxy = new Proxy(function (x, y) {
        return x + y;
    }, handler);
     
    fproxy(1, 2) // 1
    new fproxy(1, 2) // {value: 2}
    fproxy.prototype === Object.prototype // true
    fproxy.foo === "Hello, foo" // true

## 25、怎么缓存当前的组件？缓存后怎么更新？

    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    <!-- 这里是需要keepalive的 -->
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <!-- 这里不会被keepalive -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    {
      path: '',
      name: '',
      component: ,
      meta: {keepAlive: true} // 这个是需要keepalive的
    },
    {
      path: '',
      name: '',
      component: ,
      meta: {keepAlive: false} // 这是不会被keepalive的
    }

如果缓存的组件想要清空数据或者执行初始化方法，在加载组件的时候调用activated钩子函数，如下：

    activated: function () {
        this.data = '';
    }

## 26、axios怎么解决跨域的问题？

使用axios直接进行跨域访问不可行，我们需要配置代理

代理可以解决的原因：

因为客户端请求服务端的数据是存在跨域问题的，而服务器和服务器之间可以相互请求数据，是没有跨域的概念（如果服务器没有设置禁止跨域的权限问题），也就是说，我们可以配置一个代理的服务器可以请求另一个服务器中的数据，然后把请求出来的数据返回到我们的代理服务器中，代理服务器再返回数据给我们的客户端，这样我们就可以实现跨域访问数据

1.配置BaseUrl

    import axios from 'axios'
    Vue.prototype.$axios = axios
    axios.defaults.baseURL = '/api'  //关键代码

2.配置代理

在config文件夹下的index.js文件中的proxyTable字段中，作如下处理：

    proxyTable: {
     '/api': {
       target:'http://api.douban.com/v2', // 你请求的第三方接口
       changeOrigin:true, 
    // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，
    //这样服务端和服务端进行数据的交互就不会有跨域问题
       pathRewrite:{  // 路径重写，
        '^/api': ''  
    // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX
    //这个地址的时候直接写成/api即可。
       }
      }
    }

1. 在具体使用axios的地方，修改url如下即可

   axios.get("/movie/top250").then((res) => {
     res = res.data
     if (res.errno === ERR_OK) {
       this.themeList=res.data;
     }
    }).catch((error) => {
     console.warn(error)
   })

原理：

因为我们给url加上了前缀/api，我们访问/movie/top250就当于访问了：localhost:8080/api/movie/top250（其中localhost:8080是默认的IP和端口）。

在index.js中的proxyTable中拦截了/api,并把/api及其前面的所有替换成了target中的内容，因此实际访问Url是[http://api.douban.com/v2/movie/top250](https://link.zhihu.com/?target=http%3A//api.douban.com/v2/movie/top250)。

至此，纯前端配置代理解决axios跨域得到解决

## 27、怎么实现路由懒加载呢？

第一种（最常用）：

    const Foo = () => import('./Foo.vue')
    const router = new VueRouter({
      routes: [
        { path: '/foo', component: Foo }
      ]
    })

第二种：

    const router = new Router({
      routes: [
       {
         path: '/index',
         component: (resolve) => {
            require(['../components/index'], resolve) // 这里是你的模块 不用import去引入了
         }
        }
      ]
    })

第三种（官方推荐）：

    // r就是resolve
    const list = r => require.ensure([], () => r(require('../components/list/list')), 'list');
    // 路由也是正常的写法  这种是官方推荐的写的 按模块划分懒加载 
    const router = new Router({
      routes: [
      {
        path: '/list/blog',
        component: list,
        name: 'blog'
      }
     ]
    })

## 28、怎样动态加载路由？

一、思路

① 在vue-router对象中首先初始化公共路由，比如（首页，404，login）等

② 用户登陆成功后，根据用户的角色信息，获取对应权限菜单信息menuList，并将后台返回的menuList转换成我们需要的router数据结构

③ 通过router.addRouter(routes)方法，同时我们可以将转后的路由信息保存于vuex，这样我们可以在我们的SideBar组件中获取我们的全部路由信息，并且渲染我们的左侧菜单栏，让动态路由实现。

二、实现

① 初始化公共路由

    //只显示主要代码
    export const routes= [
     { path: '/login', component: () => import('@/views/login/index'), hidden: true },
     { path: '/404', component: () => import('@/views/404'), hidden: true }
    ]
    export default new Router({
     scrollBehavior: () => ({ y: 0 }),
     routes: routes
    })

② 登陆成功后，获取菜单信息 menuList，并转换成router数组的结构

    router.beforeEach((to, from, next) => {
     NProgress.start()//进度条包 npm安装
     if (getToken()) { 
      /*有 token，已经登录成功*/
      if (to.path === '/login') {
       next({ path: '/' })
       NProgress.done() 
      } else {
       if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
         const roles = res.roles
         store.dispatch("GetMenu").then(data => {
          initMenu(router, data);
         });
         next()
        }).catch((err) => {
         store.dispatch('FedLogOut').then(() => {
          Message.error(err || 'Verification failed, please login again')
          next({ path: '/' })
         })
        })
       } else {
        next()
       }
      }
     } else {
      /* 无 token*/
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
       next()
      } else {
       next('/login') // 否则全部重定向到登录页
       NProgress.done() 
      }
     }
    })
    router.afterEach(() => {
     NProgress.done() 
    })

③ 动态加载路由

    import store from '../store'
    export const initMenu = (router, menu) => {
     if (menu.length === 0) {
      return
     }
     let menus = formatRoutes(menu);
     
     let unfound = { path: '*', redirect: '/404', hidden: true }
     menus.push(unfound) //404组件最后添加
     router.addRoutes(menus)
     store.commit('ADD_ROUTERS',menus)
    }
    export const formatRoutes = (aMenu) => {
     const aRouter = []
     aMenu.forEach(oMenu => {
      const {
       path,
       component,
       name,
       icon,
       childrens
      } = oMenu
      if (!validatenull(component)) {
       let filePath;
       const oRouter = {
        path: path,
        component(resolve) {
         let componentPath = ''
         if (component === 'Layout') {
          require(['../views/layout/Layout'], resolve)
          return
         } else {
          componentPath = component
         }
         require([`../${componentPath}.vue`], resolve)
        },
        name: name,
        icon: icon,
        children: validatenull(childrens) ? [] : formatRoutes(childrens)
       }
       aRouter.push(oRouter)
      }
     })
     return aRouter
    }

④ 渲染菜单

    <template>
     <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu
       mode="vertical"
       :show-timeout="200"
       :default-active="$route.path"
       :collapse="isCollapse"
       background-color="#304156"
       text-color="#bfcbd9"
       active-text-color="#409EFF"
      >
       <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
      </el-menu>
     </el-scrollbar>
    </template>
     
    <script>
    import { mapGetters } from 'vuex'
    import SidebarItem from './SidebarItem'
    import { validatenull } from "@/utils/validate";
    import { initMenu } from "@/utils/util";
     
    export default {
     components: { SidebarItem },
     created() {
     },
     computed: {
      ...mapGetters([
       'permission_routers',
       'sidebar',
       'addRouters'
      ]),
      isCollapse() {
       return !this.sidebar.opened
      }
     }
    }
    </script>

就这样我们动态加载路由就是实现了，关键点就是router.addRoute方法

⑤ 防坑

点击刷新的时候页面空白 控制台也不报错？

点击刷新，vue-router会重新初始化，那么我们之前的动态addRoute就不存在了，此时访问一个不存在的页面，所以我们的sidebar组件也就不会被访问，那么也无法获取菜单信息，就导致页面空白。所以我们需要把加载菜单信息这一步放在router的全局守卫beforeEach中就可以了。

    export const initMenu = (router, menu) => {
     if (menu.length === 0) {
      return
     }
     let menus = formatRoutes(menu);
     // 最后添加
     let unfound = { path: '*', redirect: '/404', hidden: true }
     menus.push(unfound)
     router.addRoutes(menus)
     store.commit('ADD_ROUTERS',menus)
    }
    //404组件一定要放在动态路由组件的最后，不然你刷新动态加载的页面，会跳转到404页面的

## 29、切换到新路由时，页面要滚动到顶部或保持原先的滚动位置怎么做呢？

当创建一个 Router 实例，可以提供一个 scrollBehavior 方法：

    注意: 这个功能只在 HTML5 history 模式下可用。
    const router = new VueRouter({
     routes: [...],
     scrollBehavior (to, from, savedPosition) {
      // return 期望滚动到哪个的位置
     }
    })

scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

    scrollBehavior (to, from, savedPosition) {
     return { x: 0, y: 0 }
    }
    对于所有路由导航，简单地让页面滚动到顶部。
    
    返回 savedPosition，在按下 后退/前进 按钮时，在滚动条位置，就会像浏览器的原生表现那样：
    scrollBehavior (to, from, savedPosition) {
     if (savedPosition) {
      return savedPosition
     } else {
      return { x: 0, y: 0 }
     }
    }
    
    模拟『滚动到锚点』的行为
    scrollBehavior (to, from, savedPosition) {
     if (to.hash) {
      return {
       selector: to.hash
      }
     }
    }

还可以利用路由元信息更细颗粒度地控制滚动。

    routes: [
     { path: '/', component: Home, meta: { scrollToTop: true }},
     { path: '/foo', component: Foo },
     { path: '/bar', component: Bar, meta: { scrollToTop: true }}
    ]
    const scrollBehavior = (to, from, savedPosition) => {
     if (savedPosition) {
      return savedPosition
     } else {
      const position = {}
      if (to.hash) {
       position.selector = to.hash
      }
       if (to.matched.some(m => m.meta.scrollToTop)) {
       position.x = 0
       position.y = 0
      }
      return position
     }
    }

还可以在main.js入口文件配合vue-router写这个

    router.afterEach((to,from,next) => {
      window.scrollTo(0,0);
    });

## 30、vue-router如何响应路由参数的变化？

当使用路由参数时，比如：

    {path:’/list/:id’component:Foo}

从 /list/aside导航到 /list/foo，原来的组件实例会被复用。

因为两个路由都渲染同个组件Foo，比起销毁再创建，复用则更加高效。

不过，这也意味着组件的生命周期钩子不会再被调用。

如果跳转到相同的路由还会报以下错误
![](https://pic4.zhimg.com/v2-7a910b8e923f450d5e19b173a80cc073_b.png)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='476' height='51'></svg>)
这个时候我们需要重写push方法，在src/router/index.js 里面import VueRouter from 'vue-router'下面写入下面方法即可

    const routerPush = VueRouter.prototype.push
    VueRouter.prototype.push = function push(location) {
      return routerPush.call(this, location).catch(error=> error)
    }

如何响应不同的数据呢？

① 复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象：

    const User = {
      template: '...',
      watch: {
        '$route' (to, from) {
          // 对路由变化作出响应...
        }
      }
    }

② 使用beforeRouteUpdate 

    const User = {
      template: '...',
      beforeRouteUpdate (to, from, next) {
        // react to route changes...
        // don't forget to call next()
      }
    }

注意：

（1）从同一个组件跳转到同一个组件。

（2）生命周期钩子created和mounted都不会调用。

## 31、vue模板中为什么以_、$开始的变量无法渲染？

名字以 _ 或 $开始的属性不会被 Vue 实例代理，因为它们可能与 Vue 的内置属性与 API 方法冲突。用 vm.$data._property 访问它们。

## 32、vue中，如何监听一个对象内部的变化？

方法①：对整个obj深层监听

    watch:{
     obj:{
      handler(newValue,oldValue){
       console.log('obj changed')
      },
      deep: true,//深度遍历
      immediate: true 
    //默认第一次绑定的时候不会触发watch监听，值为true时可以在最初绑定的时候执行
     }
    }

方法② ：指定key

    watch: {
        "dataobj.name": {
          handler(newValue, oldValue) {
            console.log("obj changed");
          }
        }
      }

方法③：computed

    computed(){
     ar(){
      return this.obj.name
     }
    }

## 33、v-for循环时为什么要加key？

key的作用主要是为了高效的更新虚拟DOM，是因为Virtual DOM 使用Diff算法实现的原因。

当某一层有很多相同的节点时，也就是列表节点时，Diff算法的更新过程默认情况下也是遵循以上原则。

比如一下这个情况
![](https://pic1.zhimg.com/v2-4c9826b151235aec26c17c3e3f960fb4_b.jpg)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='477' height='191'></svg>)
我们希望可以在B和C之间加一个F，Diff算法默认执行起来是这样的：
![](https://pic3.zhimg.com/v2-9c568b34de2ae6badcf816a941dc529e_b.jpg)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='572' height='215'></svg>)
即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？

所以我们需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。
![](https://pic1.zhimg.com/v2-ddb40a0343904dda17c258f1a33df204_b.jpg)![](data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='452' height='130'></svg>)

## 34、$nextTick用过吗，有什么作用？

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

解决的问题：有些时候在改变数据后立即要对dom进行操作，此时获取到的dom仍是获取到的是数据刷新前的dom，无法满足需要，这个时候就用到了$nextTick。

## 35、vue和react的区别是什么？

① React严格上只针对MVC的view层,Vue则是MVVM模式

② virtual DOM不一样,vue会跟踪每一个组件的依赖关系,不需要重新渲染整个组件树.而对于React而言,每当应用的状态被改变时,全部组件都会重新渲染,所以react中会需要shouldComponentUpdate这个生命周期函数方法来进行控制

③ 组件写法不一样, React推荐的做法是 JSX + inline style, 也就是把HTML和CSS全都写进JavaScript了,即'all in js'; Vue推荐的做法是webpack+vue-loader的单文件组件格式,即html,css,jd写在同一个文件;

④ 数据绑定: vue实现了数据的双向绑定,react数据流动是单向的

⑤ state对象在react应用中不可变的,需要使用setState方法更新状态;在vue中,state对象不是必须的,数据由data属性在vue对象中管理1.页面中定义一个定时器，在哪个阶段清除？

答案：在 beforeDestroy 中销毁定时器。

①为什么销毁它：

在页面a中写了一个定时器，比如每隔一秒钟打印一次1，当我点击按钮进入页面b的时候，会发现定时器依然在执行，这是非常消耗性能的。

②解决方案1：

    mounted(){
     this.timer = setInterval(()=>{
        console.log(1)
     },1000)
    },
    beforeDestroy(){
     clearInterval(this.timer)
    }

方案1有两点不好的地方，引用尤大的话来说就是：

它需要在这个组件实例中保存这个 timer，如果可以的话最好只有生命周期钩子可以访问到它。这并不算严重的问题，但是它可以被视为杂物。

我们的建立代码独立于我们的清理代码，这使得我们比较难于程序化的清理我们建立的所有东西。

方案2（推荐）：该方法是通过$once这个事件侦听器在定义完定时器之后的位置来清除定时器

    mounted(){
     const timer = setInterval(()=>{
        console.log(1)
     },1000)
     this.$once('hook:beforeDestroy',()=>{
      clearInterval(timer)
     })
    }

官网参考链接:[https://cn.vuejs.org/v2/guide/components-edge-cases.html](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/components-edge-cases.html)
![](https://pic2.zhimg.com/v2-645c07156d898b930ee13a4831afe67d_b.jpg)![](https://pic2.zhimg.com/80/v2-645c07156d898b930ee13a4831afe67d_1440w.jpg)

