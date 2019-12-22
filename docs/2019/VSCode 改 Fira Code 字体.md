## 简介

推荐一款号称程序员的字体 [Fira Code](https://github.com/tonsky/FiraCode)，Fira 是 Mozilla 主推的字体系列，Fira Code 是基于 Fira Mono 等宽字体的一个扩展，主要特点是加入了编程连字特性（ligatures）。

Fira Code 就是利用这个特性对编程中的常用符号进行优化，比如把输入的「!=」直接显示成「≠」或者把「>=」变成「≥ 」等等，以此来提高代码的可读性。

效果如下：

![](http://imgs.taoweng.site/2019-12-19-130213.png)

经过我体验一周来看，这款字体还是不错的。

更多请前往[GitHub地址](https://github.com/tonsky/FiraCode)查看。

## 设置步骤

### Step 1. 下载

前往 Fira Code 字体的 GitHub 地址，clone 或者 download字体文件，主要有 5 个 .ttf 字体文件，地址[https://github.com/tonsky/FiraCode/tree/master/distr/ttf](https://github.com/tonsky/FiraCode/tree/master/distr/ttf)

### Step 2. 安装

安装刚刚下载的 5 个字体文件：选择文件后点击鼠标右键，点击安装命令即可安装字体。

### Step 3. 修改设置

打开 VS Code，如果在安装字体之前已经打开了，**一定要重启 **VS Code，否则识别不到新字体。

打开菜单File > Preferences > Settings，或者点击 File 后使用快捷键 `Ctrl+,`即可打开，然后打开 **settings.json**  文件，找到 `editor.fontFamily`字段，然后再把 Fira Code 添加到第一个，并且加上 `"editor.fontLigatures": true` 。

```json
"editor.fontFamily": "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
"editor.fontLigatures": true, //这个控制是否启用字体连字，true 启用，false 不启用，这里选择启用 
```

## 完成

来一个我最常用的 JavaScript 代码演示：

![image-20191219211400669](http://imgs.taoweng.site/2019-12-19-131402.png)