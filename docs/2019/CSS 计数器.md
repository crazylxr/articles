## 前言

CSS 里面的伪元素其实是非常好用的，但是经常容易被大家忽略，伪元素里面常用到的 `content` 属性，可能现在很多人仅仅以为 `content` 属性的值只支持字符串，除了字符串外常用到的还有 `uri`、`counter` ，今天所要介绍的就是 conter(计数器)。

先看如下的例子：

![905B9F15-6D46-463D-812C-17545A17516C](http://imgs.taoweng.site/2019-12-09-133936.jpg)

```html
<div>
  <h3>桃翁</h3>
  <h3>介绍</h3>
  <h3>css 计数器</h3>
</div>
```

根据如上的 HTML 你是否有办法不通过 JavaScript ，仅仅用 CSS 在 title 前面增加 `Title number:` 呢？

## CSS 计数器基本概念

如果仅仅增加一个 **Title**，大家都知道通过伪元素(:before或者:after)，设置 content 为 Title，但是如何自动根据 h3 出现的顺序来展示自动编号可能很多人就不知道了。

自动编号在 CSS 2.1 中是通过两个属性控制的，['counter-increment'](http://www.ayqy.net/doc/css2-1/generate.html#propdef-counter-increment)和['counter-reset'](http://www.ayqy.net/doc/css2-1/generate.html#propdef-counter-reset)。通过这些属性定义的计数器用于['content’](http://www.ayqy.net/doc/css2-1/generate.html#propdef-content)属性的 counter() 和 counters() 函数

### 初始化计数器

在使用计数器的时候需要先初始化这个计数器，并且设置一个计数器的名字(变量)。下面是例子，title 就是名字，conter-reset 就是用来初始化的，这个属性是必须设置的，否则没办法用计数器。

['counter-reset'](http://www.ayqy.net/doc/css2-1/generate.html#propdef-counter-reset)属性也含有一列一个或多个计数器，每个后面可以跟一个可选的整数。该整数给定了每次出现该元素时给计数器设置的值，默认为 0

```css
counter-reset: 计数器名称[, 默认值number];           /* 重置计数器成0 */
```

### 计数器自增

有了一个计数器的变量后，然后可以让这个变量进行自增：

['counter-increment'](http://www.ayqy.net/doc/css2-1/generate.html#propdef-counter-increment)属性接受一个或多个计数器名（标识符），每个后面都可以跟一个可选的整数。这个整数表示每次出现该元素时计数器递增几。默认增量是 1，可以接受 0 和负数

```css
counter-increment: 计数器名称[, 增量];      /* 增加计数器值 */
```

### 显示计数器

最后就是现实计数器的值，获取计数器的值有两个函数：counter() 和 counters() ，如上面的例子：

```css
content: counter(计数器名称[, 显示的风格]) /* 显示计数器 */
```

或者

```css
counters(计数器名称, 嵌套时拼接字符串[, 可选的显示风格])
```

## 基本使用

学完了基本概念，然后就可以解决上面的问题了。按照步骤来，三步：

1. 初始化计时器

```css
div {
  counter-reset: title;           /* 重置计数器成0 */
}
```

2. 计数器自增

```css
h3:before {
  counter-increment: title;      /* 增加计数器值 */
}
```

3. 显示计数器

```css
h3:before {
  content: "Title " counter(title) ": "; /* 显示计数器 */
}
```

合起来的解决方案如下：

```css
div {
  counter-reset: title;           /* 重置计数器成0 */
}
h3:before {
  counter-increment: title;      /* 增加计数器值 */
  content: "Title " counter(title) ": "; /* 显示计数器 */
}
```

## 高级用法

### 嵌套计数器与作用域

计数器是“自嵌套的（self-nesting）”，如果重置一个位于后代元素或者伪元素中的计数器，会自动创建一个新的计数器实例。这对 HTML 中的列表之类的场景来说很重要，这种场景下，元素自身可以嵌套任意深度，不用为每一层定义唯一命名的计数器

> 计数器的作用域从文档中具有['counter-reset'](http://www.ayqy.net/doc/css2-1/generate.html#propdef-counter-reset)该计数器的第一个元素开始，包括该元素的后代、后续兄弟及其后代。

官方套话比较难懂，用大白话说就是设置了 `counter-reset` ，那么这个元素的的子元素都属于这个作用域下。

想要完全理解作用域，就得把下面这个 图看懂：

<img src="http://imgs.taoweng.site/2019-12-09-142219.png" style="zoom:50%;" />

上面的这个 HTML 代码，再加上这段 CSS 代码：

```css
OL { counter-reset: item }
LI { display: block }
LI:before { 
  counter-increment: item 
}
```

OL 将会创建一个计数器，并且 OL 的所有子级将引用该计数器，如果我们用item[n]表示"item"计数器的第 n个实例，用"{"和"}"表示一个作用域的开始和结束，那么上面 HTML 片段将使用标注的计数器。

注意看 2.3.1 的两个元素，由于他们都在 2.3 下面，有两个同名的计数器，那么这两个同名计数器会分别创建实例，所有会得到两个 2.3.1。

如果懂了作用域的关系，接下来就可以通过 `counter()` 或者 `counters()` 函数进行展示。

**counter**

Counter 显示代码如下：

```css
OL { counter-reset: item }
LI { display: block }
LI:before { 
  content: counter(item) ". "; 
  counter-increment: item 
}
```

效果如下：

![image-20191209223410101](http://imgs.taoweng.site/2019-12-09-143411.png)

可以看到 counter 只会显示当前作用域下计数器的值，如果要生成嵌套作用域的计数器就得用 counters 函数。

**counters**

```css
OL { counter-reset: item }
LI { display: block }
LI:before { 
  content: counters(item, '.') " "; 
  counter-increment: item;
}
```

![image-20191209223516878](http://imgs.taoweng.site/2019-12-09-143518.png)

### 更换格式

在显示计数器部分 counter 和 counters 都有一个可选参数，显示风格，这个显示风格跟 [list-style-type](https://www.w3school.com.cn/cssref/pr_list-style-type.asp) 是一样的，比如我们将文章开头的例子拿来举例，默认是 decimal 风格，比如换成字母(type 是 lower-latin)形式，css 如下：

```css
div {
  counter-reset: title;           /* 重置计数器成0 */
}
h3:before {
  counter-increment: title;      /* 增加计数器值 */
  content: "Title " counter(title, lower-latin) ": "; /* 显示计数器 */
}
```

效果如下，list-style-type 有很多种，甚至还有中文(list-style-type 是 cjk-ideographic)的。

![image-20191210220952021](http://imgs.taoweng.site/2019-12-10-140955.png)

### 自定义起始值

起始值订为 5

```css
div {
  counter-reset: title 5;           /*起始值订为 5 */
}
h3:before {
  counter-increment: title;      
  content: "Title " counter(title) ": "; 
}
```

![image-20191210231857008](http://imgs.taoweng.site/2019-12-10-151858.png)

### 自定义每次递增的值

每次递增的值为 2

```css
div {
  counter-reset: title 5;       
}
h3:before {
  counter-increment: title 2;      /* 每次递增的值为 2 */
  content: "Title " counter(title) ": "; 
}
```

![D94591E0-4122-4212-957E-348ED5D0CBDA](http://imgs.taoweng.site/2019-12-10-152028.jpg)

## 使用场景

### 场景 1： 嵌套列表

比如要生成一个文章的大纲：

![image-20191210233643948](http://imgs.taoweng.site/2019-12-10-153647.png)

### 场景2： 计算已经勾选的复选框

使用输入框的：checked 伪类，我们可以检查复选框是否被选中，选中的话，我们计数器的数值就会增加。

下面的这个 2 种菜系直接就是可以通过计数器来实现的，不需要使用 js

![image-20191210234026403](http://imgs.taoweng.site/2019-12-10-154028.png)

### 场景3： 自动追踪文档条目

当你需要处理一些重复元素的时候，并且你同样想统计他们的数量，那么这个方案会很好用。

![image-20191210234338534](http://imgs.taoweng.site/2019-12-10-154341.png)

## 参考文章

- [css计数器详解](https://www.cnblogs.com/liuxianan/p/css-counters.html)

