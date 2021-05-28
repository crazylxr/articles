> 原文链接：https://zhuanlan.zhihu.com/p/109633620

## 引言

我们在 SEE Conf 之际发布了 `4.0 rc`  版本。经过 1 个多月的反馈收集和调整之后，我们终于迎来了 4.0 的正式版！感谢在此期间每一位提供反馈、建议以及贡献的人。我们会结合 `rc`  版本已经涉及的更新以及一些比较重要的新增内容于此进行列举。完整的更新文档可以[点击此处](https://link.zhihu.com/?target=https%3A//ant.design/changelog-cn)。v4 文档地址：[https://ant.design](https://link.zhihu.com/?target=https%3A//ant.design/)

需要注意的是，v3 版本于 2019 年 12 月合入 `3.x-stable`  分支并进入维护状态。我们仍然会为 v3 版本进行半年的维护工作。维护截止日期为 2020 年 5 月。

## 设计规范升级

我们将基础圆角由 `4px` 调整为 `2px`。中后台产品以效率为第一优先级，圆角样式作为 UI 上的重要细节，更小的圆角从视觉上减少界面细节，提升了信息阅读效率。此外，我们对阴影进行了调整，使其更符合真实阴影，也同时将信息层级更好体现。
![](https://pic1.zhimg.com/v2-7d957174002d6a89f657b66c4f549fe0_b.jpg)![](https://pic1.zhimg.com/80/v2-7d957174002d6a89f657b66c4f549fe0_1440w.jpg)
### 暗色主题

我们基于 v3 版本的色彩系统进行了升级，v4 提供了暗色主题。你可以在页面中点击切换主题功能查看暗色主题效果：
![](https://pic4.zhimg.com/v2-5106bcb73cacfc22c767f829f97782bb_b.gif)

![](https://pic4.zhimg.com/v2-5106bcb73cacfc22c767f829f97782bb_b.webp)

### 无边框组件

在业务中，我们发现有些场景会存在轻量级的选择组件。因而我们提供了一种新的无边框样式，让开发者可以更简单的嵌入这些组件而不用额外覆盖样式。
![](https://pic3.zhimg.com/v2-0454434889473f9b287609f93278832a_b.jpg)![](https://pic3.zhimg.com/80/v2-0454434889473f9b287609f93278832a_1440w.jpg)
## 兼容性调整

Ant Design 3.0 为了兼容旧版 IE 做出了非常多的努力。然而根据业界统计，IE9/10 浏览器无论是在全球还是在国内份额都在随着 Windows 系统更新而在不断缩减。我们在 4.0 版本，停止对 IE 9/10 的支持工作（但仍然会支持 IE 11）。因而过去一些低性能的组件，也会随着新的 css 特性而获得性能提升。

与此同时，我们也将 v4 依赖的 React 最低版本要求升级到了 React 16.9。这意味着，v4 版本将会提供更多的 hooks 以简化你的代码。

此外，我们也将在 v3 版本警告的一些废弃 API 进行了移除。我们强烈建议你将当前项目升级到 v3 的最后一个版本，并根据 warning 信息将废弃 API 进行更新。

## 更小的尺寸

在 `antd@3.9.0` 中，我们引入了 svg 图标（[为何使用 svg 图标？](https://link.zhihu.com/?target=https%3A//github.com/ant-design/ant-design/issues/10353)）。使用了字符串命名的图标 API 无法做到按需加载，因而全量引入了 svg 图标文件，这大大增加了打包产物的尺寸。在 4.0 中，我们调整了图标的使用 API 从而支持 tree shaking，减少 antd 默认包体积约 150 KB(Gzipped)。

旧版 Icon 使用方式将被废弃：

    import{Icon,Button}from'antd';constDemo=()=>(<div><Icontype="smile"/><Buttonicon="smile"/></div>);

4.0 中会采用按需引入的方式：

![image-20200229105726668](http://imgs.taoweng.site/2020-02-29-025729.png)


此外，我们也对相关依赖进行了精简，从而降低打包尺寸（Gzipped）：
![](https://pic2.zhimg.com/v2-bb0c3d4891edecbed827bd73a76b6cc9_b.jpg)![](https://pic2.zhimg.com/80/v2-bb0c3d4891edecbed827bd73a76b6cc9_1440w.jpg)
## 组件重做

### Form 重做

Form 作为高频使用的组件，其 API 略显冗余。用户需要通过 `Form.create` 的 HOC 方式获得表单实例，而通过 `form.getFieldDecorator` 来对组件进行数据绑定。此外，每次数据变更便会进行整个表单的重新渲染，这使得在大数据表单中性能堪忧。在 v4 版本中，Form 将自带表单实例，你可以直接通过 Form.Item 的 `name` 属性进行数据绑定，从而简化你的代码：

![image-20200229105758698](http://imgs.taoweng.site/2020-02-29-025800.png)    

我们发现大多数场景下，开发者其实只关注表单提交成功的值。因而我们提供了 `onFinish` ，其只会在表单验证通过后触发，而 `validateFields`  不在需要。

此外，Form 提供了 hooks 方法 `Form.useForm` 允许你对表单示例进行控制：

    const[form]=Form.useForm();React.useEffect(()=>{form.setFieldValues({...});});<Formform={form}/>

同时，我们提供了 Form.List 组件，使你可以非常方便的实现列表字段的控制：

    <Form.Listname="names">{(fields,{add,remove})=>(<div>{fields.map(field)=><Form.Item{...field}><Input/></Form.Item>}<ButtononClick={()=>add(initialValue)}>Add</Button></div>}</Form.List>

### Table 重做

由于我们提升了兼容性的最低要求，我们改成使用 `sticky` 样式进行固定列的实现，因而大大减少了表单拥有固定列时的性能消耗。而对于不支持 `sticky` 的 IE 11，我们采取降级处理。

同时，我们提供了新的 `summary` API 用于实现总结行的效果：
![](https://pic4.zhimg.com/v2-4f1081c1162eba23897d5b6de6108833_b.jpg)![](https://pic4.zhimg.com/80/v2-4f1081c1162eba23897d5b6de6108833_1440w.jpg)
对于 sorter 提供了多列排序的功能：
![](https://pic3.zhimg.com/v2-2b4e0202ca6a52614f6cdb8c0fb5156a_b.jpg)![](https://pic3.zhimg.com/80/v2-2b4e0202ca6a52614f6cdb8c0fb5156a_1440w.jpg)
此外，我们调整了底层逻辑，现在 `fixedColumn`、`expandable`、`scroll` 可以混合使用。提供了 `body` API 用于自定义表格内容实现，你可以由此实现诸如虚拟滚动的效果。

### 全新 DatePicker、 TimePicker 与 Calendar

我们对日期组件进行了整体重写，因而将其与 `moment` 进行解耦。你可以通过我们提供的 `generate` 方法生成自定义日期库的 Picker 组件。为了保持兼容，默认的 Picker 组件仍然使用 `moment` 作为日期库。自定义日期库请参考[此处](https://link.zhihu.com/?target=https%3A//ant.design/docs/react/replace-moment-cn)。

此外，我们提供了全套的时间、日期、周、月、年选择器以及对应的范围选择器。你可以通过 `picker` 属性进行设置，不再需要通过 `mode` 的受控方法来实现特地的选择器：

    <RangePicker />
    <RangePicker showTime />
    <RangePicker picker="week" />
    <RangePicker picker="month" />
    <RangePicker picker="year" />

在范围选择器上，我们也对交互进行了优化。你现在可以单独的选择开始或结束时间，并且完美优化了手动输入日期的体验。
![](https://pic2.zhimg.com/v2-54992da793db29450cd50673bcc0fc1d_b.gif)

![](https://pic2.zhimg.com/v2-54992da793db29450cd50673bcc0fc1d_b.jpg)

### Notification/Modal 提供 Hooks

在过去版本，你或许会遇到 `Modal.xxx`  和 `Notification.xxx`  调用方法无法获得 Context 的问题。这是由于我们对于这些语法糖会额外通过 `ReactDOM.render`  创建一个 React 实例，这也导致了 context 丢失的问题。在新版中，我们提供了 hooks 方法，让你可以将节点注入到需要获得 context 的地方：

    const [api, contextHolder] = notification.useNotification();
    
    return (
      <Context1.Provider value="Ant">
        {/* contextHolder is in Context1 which mean api will not get context of Context1 */}
        {contextHolder}
        <Context2.Provider value="Design">
          {/* contextHolder is out of Context2 which mean api will not get context of Context2 */}
        </Context2.Provider>
      </Context1.Provider>
    );

### 虚拟滚动

v4 中，我们将 Tree、TreeSelect、Select 进行了改造，其默认使用虚拟滚动技术进行性能优化以承载大数据量的选项渲染。

[Living demo](https://link.zhihu.com/?target=https%3A//ant.design/components/select-cn/%23components-select-demo-big-data)

此外，也对键盘交互以及无障碍进行了优化。

### 更多新功能/特性/优化部分

- ConfigProvider 提供 `direction` 配置以支持 `rtl` 语言国际化。
- Form 与 ConfigProvider 支持 `size` 设置包含组件尺寸。
- Typography 增加 `suffix` 属性。
- Progress 增加 `steps` 子组件。
- TextArea 支持 `onResize`。
- Grid 使用 `flex` 布局。
- ......

你可以点击[此处](https://link.zhihu.com/?target=https%3A//ant.design/changelog-cn)查看完整更新日志。

## 如何升级

为了尽可能简化升级，我们保持了最大兼容。但是仍然有一部分 breaking change 需要注意。你可以首先尝试使用我们提供的 codemod 工具进行迁移，对部分无法迁移的内容进行手工迁移。升级请参考[该文档](https://link.zhihu.com/?target=https%3A//ant.design/docs/react/migration-v4-cn)。

## 以上

Ant Design 4.0 的诞生离不开社区志愿者的贡献与支持，感谢 [@saeedrahimi](https://link.zhihu.com/?target=https%3A//github.com/saeedrahimi) 实现了 `rtl` 的国际化功能，[@shaodahong](https://link.zhihu.com/?target=https%3A//github.com/shaodahong) 对于兼容包的贡献，以及每个参与帮助开发的人。是你们为开源的贡献让 Ant Design 变得更加美好！
![](https://pic1.zhimg.com/v2-8c299c909ddbcdb0dd8e9d45d55ffcd8_b.jpg)![](https://pic1.zhimg.com/80/v2-8c299c909ddbcdb0dd8e9d45d55ffcd8_1440w.jpg)
- Ant Design 4.0 设计体系进阶！设计资产不断丰富，设计工具层出不穷，来[新版官网](https://link.zhihu.com/?target=https%3A//ant.design/)看看吧 ^_^ 
- 欢迎到 [知乎问答](https://www.zhihu.com/question/33629737) 与我们互动。