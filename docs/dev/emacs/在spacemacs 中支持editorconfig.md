editorconfig 是在项目存储库中有一个名为 .editorconfig 的文件，这样参与的开发者的编辑和 ide 可以自动调整。

有一个 emacs/spacemacs 模式，可以很容易地在以下步骤中进行集成：

1. 将 editorconfig 添加到 dotspacemacs-additional-packages。
2. 将（editorconfig-mode 1）添加到 dotspacemacs/user-config。

更多的细节记录在插件库的 [README](https://github.com/editorconfig/editorconfig-emacs#readme)。

## 源码片段
第一步：添加插件到 additional packages:

```lisp
dotspacemacs-additional-packages
'(
  editorconfig
  )
```

第二步：从你的 user-config 激活插件：

```lisp
(defun dotspacemacs/user-config ()
  (editorconfig-mode 1)
)
```
