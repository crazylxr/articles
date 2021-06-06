## 安装 emcas

## 安装 spacemcas

所有的操作都在用户目录，可以通过 `cd ~` 进入。

1. 备份原来的配置

   ```bash
   mv .emacs.d .emacs.d.bak
   mv .emacs .emacs.bak
   ```

2. 克隆仓库

   采用的是国内备份的站点，每天更新一次。

   ```bash
   git clone https://gitee.com/mirrors/spacemacs.git ~/.emacs.d
   ```

3. 更改包的镜像源

   >  这步国内同学强烈建议要改，不然很难安装成功。

   先打开spacemcas配置

   ```bash
   vi .spacemacs
   ```

   然后找到 `defun dotspacemacs/user-init ()` 函数，用 [清华大学的镜像](https://link.zhihu.com/?target=https%3A//mirrors.tuna.tsinghua.edu.cn/help/elpa/)的帮助进行添加：

   ```bash
   (defun dotspacemacs/user-init ()
    "Initialization for user code:
   This function is called immediately after `dotspacemacs/init', before layer
   configuration.
   It is mostly for variables that should be set before packages are loaded.
   If you are unsure, try setting them in `dotspacemacs/user-config' first."
       (setq configuration-layer-elpa-archives
          '(("melpa-cn" . "http://mirrors.tuna.tsinghua.edu.cn/elpa/melpa/")
           ("org-cn"   . "http://mirrors.tuna.tsinghua.edu.cn/elpa/org/")
           ("gnu-cn"   . "http://mirrors.tuna.tsinghua.edu.cn/elpa/gnu/")))
     )
   ```

修改镜像后，重新启动emacs，等待安装结束即可

## 克隆一些基础配置

