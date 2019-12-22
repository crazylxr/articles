在 v 站上看一个自己非常喜欢的博客主题：[阿星Plus](https://meowv.com/)，但是由于是用 .Net 写的，自己完全不熟悉 .Net，所以就准备自己按照他的博客风格写一份 typecho的主题。

我也没接触过 PHP，在安装环境这一步就把我难住了，历经磨难，最终选择了 XAMPP 来搭建 PHP 环境，在这里记下搭建的过程和遇到的坑。

我刚开始去搜索 「XAMPP 搭建 typecho」，然而由于 typecho 资料太少，根本搜不到，所以选择了搜索「XAMPP 搭建 wordpress」，然后才一步一步的安装好了 XAMPP。

## 什么是 XAMPP

XAMPP（Apache+MySQL+PHP+PERL）是一个功能强大的建站集成软件包。

## 安装 XAMPP

首先要知道 XAMPP 有两中安装方式：

- 第一种：OS X的XAMPP是OS X的本地安装程序。它将Apache，PHP和其他XAMPP组件直接安装在OS X系统的 `/Applications/XAMPP` 文件夹中。
- 第二种：XAMPP-VM是OS X的虚拟机，它包括Apache，PHP和其他XAMPP组件，并在OS X系统上的基于Linux的虚拟机中运行它们。

这两种方式我都试过，相信我，采用第一种安装方式。

值得提醒的是在 [XMAPP 首页](https://www.apachefriends.org/index.html)下载的是 OS X 的虚拟机的，下载的时候文件名称会有 vm ，要下载安装程序的，要去 [Download 里面下载](https://www.apachefriends.org/download.html)，文件名称会有 installer 的字样。

## 使用 XAMPP

这里我写的会比较简单，自己随便看看就知道怎么用了。

![image-20191114210816014](http://imgs.taoweng.site/2019-11-14-130817.png)

安装好了进入界面，直接点 **Start All**就行，如果上图中花框的灯是像我图中的绿色就代表启动成功，失败了就会是红色。

## 安装 typecho

1. 将官网下载的 typecho 安装包下载下来。
2. 将安装包移动到 htdocs 文件夹下并解压，htdocs 文件夹路径如图，在应用程序 -> XAMPP->htdocs

![image-20191114211202385](http://imgs.taoweng.site/2019-11-14-131204.png)

3. 访问 localhost/build 即可进入安装页面进行 typecho 的安装。

## 遇到的问题

### 1. XAMPP mysql 无法启动的问题

我这里遇到问题是由于端口和我本地的 mysql 端口(3306)冲突了，解决的方法就是修改端口号：

![image-20191114213915631](http://imgs.taoweng.site/2019-11-14-133917.png)

选中 mysql，然后再点击 configure，然后再将弹窗里面的 port 将 3306 改成其他的。

### 2. 安装 typecho 报：对不起,无法连接数据库,请先检查数据库配置再继续进行安装。

问题肯定就是数据库的问题，需要在数据库里建立一个名为 **typecho**  的数据库，步骤如下：

1. 打开 phpmyadmin，地址是：http://localhost/phpmyadmin。
2. 新建数据库 名为 typecho 的数据库。
3. 在安装界面数据库的密码不填，因为默认 phpmyadmin 的数据库是没有密码。

经过上面三个步骤应该就可以安装成功了！

做完笔记我就要开始写我的主题了！