## 前言

最近一段时间在做 `H5` 聊天项目，踩过其中一大坑：输入框获取焦点，软键盘弹起，要求输入框吸附（或顶）在输入法框上。需求很明确，看似很简单，其实不然。从实验过一些机型上看，发现主要存在以下问题：

*   在 `Android` 和 `IOS` 上，获知软键盘弹起和收起状态存在差异，且页面 `webview` 表现不同。
*   在`IOS12` 上，微信版本 `v6.7.4` 及以上，输入框获取焦点，键盘弹起，页面（`webview`）整体往上滚动，当键盘收起后，不回到原位，导致键盘原来所在位置是空白的。
*   在 `IOS` 上，使用第三方输入法，高度计算存在偏差，导致在有些输入法弹起，将输入框挡住一部分。
*   在有些浏览器上使用一些操作技巧，还是存在输入框被输入法遮挡。

下面就上述发现的问题，逐个探索一下解决方案。

## 获知软键盘弹起和收起状态

获知软键盘的弹起还是收起状态很重要，后面的兼容处理都要以此为前提。然而，`H5` 并没有直接监听软键盘的原生事件，只能通过软键盘弹起或收起，引发页面其他方面的表现间接监听，曲线救国。并且，在 `IOS` 和 `Android` 上的表现不尽相同。

## IOS 软键盘弹起表现

在 `IOS` 上，输入框（`input`、`textarea` 或 富文本）获取焦点，键盘弹起，页面（`webview`）并没有被压缩，或者说高度（`height`）没有改变，只是页面（`webview`）整体往上滚了，且最大滚动高度（`scrollTop`）为软键盘高度。

## Android 软键盘弹起表现

同样，在 `Android` 上，输入框获取焦点，键盘弹起，但是页面（`webview`）高度会发生改变，一般来说，高度为可视区高度（原高度减去软键盘高度），除了因为页面内容被撑开可以产生滚动，`webview` 本身不能滚动。

## IOS 软键盘收起表现

触发软键盘上的“收起”按钮键盘或者输入框以外的页面区域时，输入框失去焦点，软键盘收起。

## Android 软键盘收起表现

触发输入框以外的区域时，输入框失去焦点，软键盘收起。但是，触发键盘上的收起按钮键盘时，输入框并不会失去焦点，同样软键盘收起。

![](http://imgs.taoweng.site/2019-06-18-144047.png)

## 监听软键盘弹起和收起

综合上面键盘弹起和收起在 `IOS` 和 `Android` 上的不同表现，我们可以分开进行如下处理来监听软键盘的弹起和收起：

*   在 `IOS` 上，监听输入框的 `focus` 事件来获知软键盘弹起，监听输入框的 `blur` 事件获知软键盘收起。
*   在 `Android` 上，监听 `webview` 高度会变化，高度变小获知软键盘弹起，否则软键盘收起。

```
// 判断设备类型
var judgeDeviceType = function () {
  var ua = window.navigator.userAgent.toLocaleLowerCase();
  var isIOS = /iphone|ipad|ipod/.test(ua);
  var isAndroid = /android/.test(ua);

  return {
    isIOS: isIOS,
    isAndroid: isAndroid
  }
}()

// 监听输入框的软键盘弹起和收起事件
function listenKeybord($input) {
  if (judgeDeviceType.isIOS) {
    // IOS 键盘弹起：IOS 和 Android 输入框获取焦点键盘弹起
    $input.addEventListener('focus', function () {
      console.log('IOS 键盘弹起啦！');
      // IOS 键盘弹起后操作
    }, false)

    // IOS 键盘收起：IOS 点击输入框以外区域或点击收起按钮，输入框都会失去焦点，键盘会收起，
    $input.addEventListener('blur', () => {
      console.log('IOS 键盘收起啦！');
      // IOS 键盘收起后操作
    })
  }

  // Andriod 键盘收起：Andriod 键盘弹起或收起页面高度会发生变化，以此为依据获知键盘收起
  if (judgeDeviceType.isAndroid) {
    var originHeight = document.documentElement.clientHeight || document.body.clientHeight;

    window.addEventListener('resize', function () {
      var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (originHeight < resizeHeight) {
        console.log('Android 键盘收起啦！');
        // Android 键盘收起后操作
      } else {
        console.log('Android 键盘弹起啦！');
        // Android 键盘弹起后操作
      }

      originHeight = resizeHeight;
    }, false)
  }
}

var $inputs = document.querySelectorAll('.input');

for (var i = 0; i < $inputs.length; i++) {
  listenKeybord($inputs[i]);
}
```

## 弹起软键盘始终让输入框滚动到可视区

有时我们会做一个输入表单，有很多输入项，输入框获取焦点，弹起软键盘。当输入框位于页面下部位置时，在 `IOS` 上，会将 `webview` 整体往上滚一段距离，使得该获取焦点的输入框自动处于可视区，而在 `Android` 则不会这样，它只会改变页面高度，而不会去滚动到当前焦点元素到可视区。
由于上面已经实现监听 `IOS` 和 `Android` 键盘弹起和收起，在这里，只需在 `Android` 键盘弹起后，将焦点元素滚动（`scrollIntoView()`）到可视区。查看效果，可以戳[这里](https://wuwhs.github.io/demo/keyboard-compatible/input.html)。

```
// 获取到焦点元素滚动到可视区
function activeElementScrollIntoView(activeElement, delay) {
  var editable = activeElement.getAttribute('contenteditable')

  // 输入框、textarea或富文本获取焦点后没有将该元素滚动到可视区
  if (activeElement.tagName == 'INPUT' || activeElement.tagName == 'TEXTAREA' || editable === '' || editable) {
    setTimeout(function () {
      activeElement.scrollIntoView();
    }, delay)
  }
}

// ...
// Android 键盘弹起后操作
activeElementScrollIntoView($input, 1000);
// ...
```

## 唤起纯数字软键盘

上面的表单输入框有要求输入电话号码，类似这样就要弹出一个数字软键盘了，既然说到了软键盘兼容，在这里就安插一下。比较好的解决方案如下：

```
<p>请输入手机号</p>
<input type="tel" novalidate="novalidate" pattern="[0-9]*" class="input">
```

*   `type="tel"`， 是 `HTML5` 的一个属性，表示输入框类型为电话号码，在 `Android` 和 `IOS` 上表现差不多，都会有数字键盘，但是也会有字母，略显多余。
*   `pattern="[0-9]"`， `pattern` 用于验证表单输入的内容，通常 `HTML5` 的 `type` 属性，比如 `email`、`tel`、`number`、`data` 类、`url` 等，已经自带了简单的数据格式验证功能了，加上 `pattern` 后，前端部分的验证更加简单高效了。`IOS` 中，只有 `[0-9]\*` 才可以调起九宫格数字键盘，`\d` 无效，`Android 4.4` 以下（包括X5内核），两者都调起数字键盘。
*   `novalidate="novalidate"`，`novalidate` 属性规定当提交表单时不对其进行验证，由于 `pattern` 校验[兼容性](https://www.caniuse.com/#search=pattern)不好，可以不让其校验，只让其唤起纯数字键盘，校验工作由 `js` 去做。

![软键盘弹起，IOS 和 Android 的 webview 不同表现](https://upload-images.jianshu.io/upload_images/2974893-bad581ab20caf00e.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "软键盘弹起，IOS 和 Android 的 webview 不同表现") 

# 兼容 `IOS12` + `V6.7.4+`

如果你在用 `IOS12` 和 `V6.7.4+`版本的微信浏览器打开上面表单输入的 `demo` ，就会惊奇的发现键盘收起后，原本被滚动顶起的页面并没有回到底部位置，导致原来键盘弹起的位置“空”了。

![](https://upload-images.jianshu.io/upload_images/2974893-ef89f51f050f247b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240 "兼容 codeIOS12/code + codeV6.7.4+/code") 

其实这是 `Apple` 在 `IOS` 的 `bug`，会出现在所有的 `Xcode10` 打包的 `IOS12` 的设备上。微信官方已给出[解决方案](https://developers.weixin.qq.com/community/develop/doc/00044ae90742f8c82fb78fcae56800)，只需在软键盘收起后，将页面（`webview`）滚回到窗口最底部位置（`clientHeight`位置）。修复后的上面表单输入 `demo` 可以戳[这里](https://wuwhs.github.io/demo/keyboard-compatible/input-fix-ios12-wx6.7.4.html)

```
console.log('IOS 键盘收起啦！');
// IOS 键盘收起后操作
// 微信浏览器版本6.7.4+IOS12会出现键盘收起后，视图被顶上去了没有下来
var wechatInfo = window.navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
if (!wechatInfo) return;

var wechatVersion = wechatInfo[1];
var version = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);

if (+wechatVersion.replace(/\./g, '') >= 674 && +version[1] >= 12) {
  setTimeout(function () {
    window.scrollTo(0, Math.max(document.body.clientHeight, document.documentElement.clientHeight));
  })
}

```

## 兼容第三方输入法

上面说了那么多，其实已经把 `H5` 聊天输入框的坑填了一大半了，接下来就先看下聊天输入框的基本HTML结构

```
<div class="chat__content">
  <div>
    <p>一些聊天内容1</p>
  </div>
  <!-- 省略几千行聊天内容 -->
</div>
<div class="input__content">
  <div class="input" contenteditable="true"></div>
  <button>发送</button>
</div>
```

样式

```
/* 省略一些样式 */
.chat__content {
  height: calc(100% - 40px);
  margin-bottom: 40px;
  overflow-y: auto;
  overflow-x: hidden;
}

.input__content {
  display: flex;
  height: 40px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
}
/* 省略一些样式 */
```

很简单，就是划分内容区和输入区，输入区是绝对定位，按照上面表单输入 `demo` 的做法，确实大部分 `Android` 浏览器是没问题的，但是测试在 `IOS` 上，`UC` 浏览器配合原生输入法和第三方输入法（比如搜狗输入法），输入框都会被完全挡住；`QQ` 浏览器或微信浏览器，配合第三方输入法，输入框会被遮住一半；百度浏览器配合第三方输入法输入框也会被完全遮住。查看效果可以用相应浏览器中访问[这里](https://wuwhs.github.io/demo/keyboard-compatible/chat.html)。

![](http://imgs.taoweng.site/2019-06-18-144107.png)


   在 `UC` 浏览器上，软键盘弹起后，浏览器上面的标题栏高度就有个高度变小延时动态效果，这样导致 `webview` 往下滚了一点，底部输入框滚到了非可视区。
   而对于第三方输入法，猜测本身是由于输入法面板弹起后高度计算有误，导致 `webview` 初始滚动定位有误。其实这两点都是 `webview` 滚动不到位造成的。可以让软键盘弹起后，让焦点元素再次滚到可视区，强迫 `webview` 滚到位。

   ```
   console.log('Android 键盘弹起啦！');
   // Android 键盘弹起后操作
   activeElementScrollIntoView($input, 1000);
   ```

   # 兼容 Android 小米浏览器的 Hack 方案

   在 `Android` 的小米浏览器上，应用上面的方案，发现聊天输入框还是被遮挡得严严实实，`scrollIntoView()` 仍然纹丝不动。所以猜测，其实是滚到底了，软键盘弹起，页面实现高度大于可视区高度，这样只能在软键盘弹起后，强行增加页面高度，使输入框可以显示出来。综合上面兼容第三方输入法，查看效果可以戳[这里](https://wuwhs.github.io/demo/keyboard-compatible/chat-fix-third-keyboard.html)

   ```
   // Andriod 键盘收起：Andriod 键盘弹起或收起页面高度会发生变化，以此为依据获知键盘收起
   if (judgeDeviceType.isAndroid) {
     var originHeight = document.documentElement.clientHeight || document.body.clientHeight;
   
     window.addEventListener('resize', function () {
       var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
       if (originHeight < resizeHeight) {
         console.log('Android 键盘收起啦！');
         // Android 键盘收起后操作
         // 修复小米浏览器下，输入框依旧被输入法遮挡问题
         if (judgeDeviceType.isMiuiBrowser) {
           document.body.style.marginBottom = '0px';
         }
       } else {
         console.log('Android 键盘弹起啦！');
         // Android 键盘弹起后操作
         // 修复小米浏览器下，输入框依旧被输入法遮挡问题
         if (judgeDeviceType.isMiuiBrowser) {
           document.body.style.marginBottom = '40px';
         }
         activeElementScrollIntoView($input, 1000);
       }
   
       originHeight = resizeHeight;
     }, false)
   }
   ```

   ## 总结

   `H5` 端前路漫漫，坑很多，需要不断尝试。了解软键盘弹起页面在 `IOS` 和 `Android` 上的表现差异是前提，其次是将焦点元素滚动到可视区，同时要考虑到第三方输入法和某些浏览器上的差别。总结肯定不全面，欢迎大家指正哈，完~

   > 作者：wuwhs
   > 来源：[https://segmentfault.com/a/1190000018959389](https://segmentfault.com/a/1190000018959389)