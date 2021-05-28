> 声明：本文为译文，原文链接：https://www.robinwieruch.de/react-libraries

React 已经诞生很久了，自从它诞生开始，围绕组件驱动形成了一个非常全面的生态，但是来自其他编程语言或者框架的开发人员很难找到要构建一个 React 系统的所有组件。如果你是来自于像 Angular 这样的框架的开发者，你可能已经习惯了框架包含了所需要的所有功能，

然而对于 React 来说，它的核心并不是完善所有的可选库。 这是优势还是劣势取决于你自己。 [当我从 Angular 切换到 React](https://www.robinwieruch.de/reasons-why-i-moved-from-angular-to-react/)，我绝对经历了它作为 React 的优势。

只有通过 React，您才能使用[函数组件](https://www.robinwieruch.de/react-function-component)和 [props](https://www.robinwieruch.de/react-pass-props-to-component) 构建组件驱动的用户界面。 它带有一些内置的解决方案，例如，用于本地状态和副作用的 React Hooks。

下面的文章将向您提供一些自己总结的方法，以便从补充库中进行选择，从而构建一个全面的 React 应用程序。 

## 如何开始 React

如果你是一个完全不熟悉 React 的初学者想创建一个 React 项目，加入 React 的世界。有许多工具包项目可以选择，每个项目都试图满足不同的需求。 React 社区的现状是通过 Facebook 的 [create-react-app(CRA)](https://github.com/facebookincubator/create-react-app)。 它提供了一个零配置的设置，并给你一个开箱即用并且简单的启动和运行的 React 应用程序。 所有的工具都对您隐藏起来了，但是最终要由您来更改这些工具。

如果你已经熟悉 React，你可以选择它流行的入门工具包之一: Next.js 和 Gatsby.js。 这两个框架都建立在 React 之上，因此你应该已经熟悉 React 的基本原理。 Next.js  用于服务器端渲染(如动态 web 应用程序) ，Gatsby.js 用于静态站点生成(如博客、登陆页面)。

如果您只是想了解这些初学者工具包是如何工作的，那么可以尝试[从头开始设置 React 项目](https://www.robinwieruch.de/minimal-react-webpack-babel-setup)。 你将从一个基本的 HTML 和 JavaScript 项目开始，然后自己添加 React 和它的支持工具。

如果你想选择一个自定义样板项目，试着缩小你的要求。 样板文件应该是最小的，不要试图解决所有问题。 它应该针对你的问题。 例如，[gatsby-Firebase-authentication](https://github.com/rwieruch/gatsby-firebase-authentication) 样板文件只在 Gatsby.js 中为您提供了完整的 Firebase 身份验证机制，但是其他所有内容都被省略了。

**建议：**

- create-react-app for React beginners/advanced 
- Gatsby.js for static websites in React
- Next.js for server-side rendered React
- custom React project to understand the underlying tools

## React 状态管理

React 带有内置的 hooks 来管理局部状态: useState、 useReducer 和 useContext。 所有这些都可以在 React 中用于复杂的本地状态管理。 它甚至可以模拟 Redux(Redux 是 React 的一个流行的状态管理库)。

所有 React 的内置 hooks 都非常适合本地状态管理。 当涉及到远程数据的状态管理时，如果远程数据带有 GraphQL 端点，我建议使用 Apollo Client。Apollo Client 的替代方案是 [urql](https://github.com/FormidableLabs/urql) 和 [Relay](https://relay.dev/)。

如果远程数据不是来自 GraphQL 端点，请尝试使用 React 的 Hooks 来管理它。 如果不行，像  [Redux](https://www.robinwieruch.de/react-redux-tutorial) 或者 [MobX](https://mobx.js.org/)/[Mobx State tree](https://mobx-state-tree.js.org/) 这样的解决方案可能会有所帮助。

如果你想了解更多细节，请访问我的[综合状态管理反应教程](https://www.robinwieruch.de/react-state)。

**推荐：**

- 局部状态: React 的 useState, useReducer, useContext Hooks 
- 通过 Graph QL 的远程状态: Apollo Client 
- 通过 REST 的远程状态: React Hooks or Redux/MobX/Mobx State Tree 

## 使用 React 路由

路由在 React 中起着重要作用。 毕竟，React 可以帮助您实现在客户端处理路由的单页应用程序。 当介绍一个复杂的路由 的时候，有好几个路由解决方案。 最值得推荐的解决方案是 [React Router](https://github.com/ReactTraining/react-router)。

在您引入路由以前，您可以先尝试 [React 的条件渲染](https://www.robinwieruch.de/conditional-rendering-react)，它虽然不是路由的合理替代，但是小型应用中以及足够用了。

**建议:**

- React Router 

## React 中的样式库

虽然关于 React 样式处理有很多解决方法，但是作为一个 React 初学者，刚开始使用内联样式和基本 CSS 是很好的。

```javascript
import './Headline.css';
const Headline = ({ title }) =>
<h1 className="headline" style={{ color: 'blue' }}>
  {title}
</h1>
```

虽然内联样式可以用 JavaScript 在 React 中动态地添加样式，但是一个外部的 CSS 文件可以拥有 React 应用程序的所有剩余样式。 一旦您的应用程序增长，还有许多其他样式方案选择。

首先，我建议您研究一下 CSS Modules，将其作为 CSS-in-CSS 解决方案之一。 CSS Modules 受到 create-react-app 的支持，并为您提供了将 CSS 封装到模块中的方法。 这样，它就不会意外地泄漏到其他人的样式中。 尽管应用程序的某些部分仍然可以共享样式，但其他部分不必访问它。 在 React 中，CSS Modules 通常将 CSS 文件与 React 组件文件共存。

```javascript
import styles from './style.css';
const Headline = ({ title }) =>
  <h1 className={styles.headline}>
    {title}
  </h1>
```

其次，我想推荐的是被称作为 styled components，作为 React 的 CSS-in-JS 解决方案之一。 这个方法是由一个名为 [styled-components](https://www.robinwieruch.de/react-styled-components)  的库提供的，它将样式与 JavaScript 共享到 React 组件的旁边:

```javascript
import styled from 'styled-components';
const BlueHeadline = styled.h1`
  color: blue;
`;
const Headline = ({ title }) =>
  <BlueHeadline>
    {title}
  </BlueHeadline>
```

第三，我想推荐 [Tailwind CSS](https://tailwindcss.com/) 作为一个函数式的 CSS 解决方案:

```javascript
const Headline = ({ title }) =>
  <h1 className="text-blue-700">
    {title}
  </h1>
```

是否选择 CSS in CSS、 CSS in js 或函数式 CSS 取决于您。 所有的策略都适用于大型的 React 应用程序。

**建议:**

- CSS-in-CSS with CSS Modules 
- CSS-in-JS with Styled Components 
- Functional CSS with Tailwind CSS 

## React UI 库

如果您不想从头开始构建所有必要的 React UI 组件，您可以选择 React UI Library 来完成这项工作。 所有这些都有一些基本的组件，比如按钮，下拉菜单，对话框和列表。 有很多 UI 库可供 React 选择:

- [Ant Design](https://ant.design/)
- [Chakra UI](https://chakra-ui.com/)
- [Tailwind UI ](https://www.tailwindui.com/)
- [Semantic UI ](https://www.robinwieruch.de/react-semantic-ui-tutorial)
- [Material UI ](https://material-ui.com/)
- [React Bootstrap 1. React Bootstrap](https://react-bootstrap.github.io/)

## React 动画

任何 web 应用程序中的动画都是从 CSS 开始的。 最终你会发现 CSS 动画并不能满足你的需求。 通常开发人员会检查 [React Transition Group](https://reactcommunity.org/react-transition-group/)，这样他们就可以使用 React 组件执行动画。 其他著名的 React 动画库有:

- [react-motion ](https://github.com/chenglou/react-motion)
- [react-spring ](https://github.com/react-spring/react-spring)
- [Framer Motion](https://www.framer.com/motion/)
- [Animated ](https://facebook.github.io/react-native/docs/animated) (React Native)

**建议:**

- React Transition Group

## React 可视化和图表库

如果你真的想自己从头开始构建图表，你没办法不去学习 [D3](https://d3js.org/) 。 这是一个底层的可视化库，它为你提供了创建令人惊叹的图表所需的一切。 然而，学习 D3 是一个完全不同的冒险，因此许多开发人员只是想选择一个 React 图表库，它可以为他们做任何事情，以换取灵活性。 以下是一些流行的解决方案:

- [nivo](https://nivo.rocks/)
- [Victory ](https://formidable.com/open-source/victory/)
- [react-vis](https://uber.github.io/react-vis/)
- [Recharts](http://recharts.org/)
- [Chart Parts ](https://microsoft.github.io/chart-parts/)

## React 中的表单库

在 React 中最流行的表单库是 [Formik](https://github.com/jaredpalmer/)。 它提供了从验证到提交到形成状态管理所需的一切。另外一个选择是 [React Hook Form](https://react-hook-form.com/)。 如果您开始使用更复杂的表单，这两种方法对于 React 应用程序都是有效的解决方案。

**建议:**

- Formik
- React Hook Form 

## React 中的数据获取库

很快，您就必须向远程 API 发出请求，以便在 React 中获取数据。 现代浏览器带有本地获取 API 来执行异步数据请求:

```javascript
function App() {
  React.useEffect(() => {
    const result = fetch(my/api/domain)
      .then(response => response.json())
      .then(result => {
        // do success handling
        // e.g. store in local state
      });
    setData(result.data);
  });
  return (
    ...
  );
}
```

基本上，你不需要添加任何其他库来完成这项工作。 但是，有时候不仅需要提供复杂的异步请求，还需要它们具有更强大的功能，而且只是一个轻量级的库。 我推荐的这些库之一称为 axios。 当您的应用程序增大时，可以使用它来代替本地获取 API。

如果您有足够的时间来处理 GraphQL API，我建议您使用 Apollo Client。 可供选择的 GraphQL 客户端将是 urql 或 Relay。

**建议:**

- 浏览器的本地 fetch API
- axios
- Apollo Client 

## React 类型检查

幸运的是 React 有自己的类型检查能力。 使用 PropTypes，你可以为你的 React 组件定义传入的 props。 无论何时向组件传递了错误的类型，在运行应用程序时都会收到错误消息。 但是这种形式的类型检查只应该用于较小的应用程序。

```javascript
import PropTypes from 'prop-types';
const List = ({ list }) =>
  <div>
    {list.map(item => <div key={item.id}>{item.title}</div>)}
  </div>
List.propTypes = {
  list: PropTypes.array.isRequired,
};
```

在较大的 React 应用程序中，TypeScript 为整个应用程序增加了类型安全性，而不是使用 React PropTypes。 当使用这样的类型检查器时，您可以在开发期间获得错误。 您不必启动应用程序就可以找到本可以通过这种类型检查防止的 bug。 这样一来，类型检查器就可以提高您的开发人员体验，避免首先引入 bug。

**建议:**

- TypeScript

## React 代码风格

对于代码风格，基本上有三个选项可以用的。

第一种方法是遵循一个被社区所接受的风格指南。 一个流行的 Airbnb 开源的[React style guide](https://github.com/airbnb/javascript/tree/master/react) 。 即使你没有刻意遵循这些样式指南，但是读一读它们，在 React 中获得常见代码样式的要点是有意义的。

第二种方法是使用 linter，比如 ESLint。 虽然样式指南只给出建议，但是 linter 在应用程序中强制执行这个建议。 例如，你可以要求遵循流行的 Airbnb 样式指南，你的 IED/编辑器会告诉你每一个错误。

第三种也是最流行的方法是使用 Prettier。 它是一个强制的代码格式化程序。 您可以将其集成到编辑器或 IDE 中，使其在每次保存文件时格式化您的代码。 也许它并不总是符合您的口味，但至少您不必再担心自己或团队代码库中的代码格式。 虽然 Prettier 不能取代 ESLint，但是它与 ESLint 的集成非常好。

**建议:**

- ESLint
- Prettier 

## React 认证

在较大的 React 应用程序中，您可能希望引入具有注册、登录和退出功能的身份验证。 此外，密码重置和密码更改功能往往是需要的。 这些特性远远超出了 React，因为后端应用程序为您管理这些事情。 

通常的方法是使用自定义身份验证实现自己的自定义后端应用程序。 如果您不想启动自己的身份验证，可以考虑类似 [Passport.js](http://www.passportjs.org/) 的东西。

如果你根本不想关心后端，以下三种解决方案可能适合你:

- [Firebase](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/)
- [Auth0](https://auth0.com/)
- [AWS Cognito ](https://aws.amazon.com/cognito/)

如果您正在寻找身份验证 + 数据库的一体化解决方案，请坚持使用 Firebase 或 AWS。

建议:

- DIY: Custom Backend 
- Get it off the shelf: Firebase 

## React 主机

您可以像其他 web 应用程序一样部署和托管 React 应用程序。 如果你想拥有完全的控制权，选择像[Digital Ocean](https://m.do.co/c/fb27c90322f3)这样的。 如果你希望有人来处理所有的事情，如果你已经在使用第三方的身份验证/数据库，Netlify 是一个很受欢迎的解决方案，比如 Firebase，你可以检查他们是否也提供主机服务(比如 Firebase Hosting)。 您还可以使用 S3的静态站点与 Cloudfront 一起托管。

## React 测试

如果您想深入了解 React 中的测试，请阅读以下内容: [How to test components in React](https://www.robinwieruch.de/react-testing-tutorial)。 要点如下: 测试 React 应用程序的主干是 Jest。 它提供了测试运行程序、断言库和监视(spying)/模拟(mocking)/stubbing 功能， 一个全面的测试框架中需要的所有东西。

至少，您可以使用 [React-test-renderer](https://reactjs.org/docs/test-renderer.html) 在 Jest 测试中渲染 React 组件。 这已经足以用 jest 来执行所谓的[快照测试](https://www.robinwieruch.de/react-testing-jest)了。 快照测试的工作方式如下: 运行测试之后，将创建 React 组件中渲染的 DOM 元素的快照。 当您在某个时间点再次运行测试时，将创建另一个快照，用作前一个快照的差异。 如果 diff 不完全相同，则 Jest 将报错，您要么必须接受快照，要么必须更改组件的实现。

最终，您会发现自己在使用 Enzyme 或 React Testing Library (这两个都在 Jest 测试环境中使用)来进行更详细的测试功能集。 这两个库使得在 HTML 元素上呈现组件和模拟事件成为可能。 然后，Jest 用于 DOM 节点上的断言。

如果您正在为 React-to-end (E2E)测试寻找测试工具，Cypress 是最受欢迎的选择。

建议:

- Unit/Integration/Snapshot Tests: Jest + React Testing Library
- E2E Tests: Cypress 2e test: Cypress

## 用于 React 的工具库

Javascript 为处理数组、对象、数字、对象和字符串提供了大量内置功能。 React 中最常用的 JavaScript 内置功能之一是内置 `map()` 数组。 为什么？ 因为您总是必须呈现组件中的列表。 由于 JSX 是 HTML 和 JavaScript 的混合物，所以您可以使用 JavaScript 在数组上进行映射并返回 JSX。 使用 React 创建列表组件变得简单:

```js
const List = ({ list }) =>
  <div>
    {list.map(item => <div key={item.id}>{item.title}</div>)}
  </div>
```

但是，您可能需要选择一个实用程序库来提供更详细的功能。 您甚至可能希望在将这些实用函数链接起来时更加灵活，甚至可以将它们动态地组合在一起。 这时，您将引入一个实用程序库: Lodash 或 Ramda。 对于每一个 JavaScript 开发者来说，Lodash 是一个更加实际的库，而 Ramda 在函数式编程中有一个强大的核心。 请记住，现代 JavaScript 提供了很多开箱即用的特性，现在使用实用程序库的必要性已经降低了。

**建议:**

- JavaScript
- Lodash 

## react 和不可变的数据机构

原生 JavaScript 提供了大量内置工具来处理数据结构，就像它们是不可变的一样。 但是，如果您和您的团队认为有必要实施不可变的数据结构，最流行的选择之一是 Immer。 就我个人而言，我不使用它，但是任何时候有人问到 JS 中的不变性(immutability)，大家都会指出 Immer，并且这可以加上 redux 或 React hooks。

## React 国际化

当涉及到 [React 应用程序的国际化](https://www.robinwieruch.de/react-internationalization)  时，您不仅需要考虑翻译，还需要考虑多元化、日期和货币的格式化，以及其他一些事项。 以下是最受欢迎的处理该问题的库:

- [react-i18next](https://github.com/i18next/react-i18next)
- [react-intl](https://github.com/formatjs/react-intl)
- [LinguiJS](https://lingui.js.org/index.html)
- [FBT](https://github.com/facebookincubator/fbt)

**建议:**

- react-i18next 

## React 富文本编辑器

当涉及到在 React 中的富文本编辑器时，我只能想到以下内容，因为我没有在 React 中使用任何其他内容:

- [Draft.js](https://draftjs.org/)
- [Slate](https://github.com/ianstormtaylor/slate)

## React 中的支付

和其他网络应用一样，最常见的支付提供商是 Stripe 和 PayPal。 两者都可以整齐地集成到 React 中。 

- [PayPal ](https://developer.paypal.com/docs/checkout/)
- [Stripe Elements ](https://github.com/stripe/react-stripe-elements) 或 [Stripe Checkout](https://stripe.com/docs/payments/checkout)

## React 中的时间

如果你的 React 应用程序正在处理大量的日期和时区，你应该引入一个库来为你管理这些事情。 最受欢迎的库是 [moment.js](https://momentjs.com/)。 更轻量级的替代品是 [date-fns](https://github.com/date-fns/date-fns) 和 [Day.js](https://github.com/iamkun/dayjs)。

## Reac 桌面应用

Electron 是跨平台桌面应用程序的首选框架。 不过，也有其他选择，例如:

- [NW.js](https://nwjs.io/)
- [Neutralino.js](https://github.com/neutralinojs/neutralinojs)

## React 的移动开发

我想把 React 从网络带到移动设备的首选解决方案仍然是 React Native。 如果您是 React Native 开发人员，想要创建一个 Web 应用程序，您应该查看 [React Native Web](https://github.com/necolas/react-native-web)。

## REACT VR/AR

实话说，我们很有可能用 React 深入虚拟现实或者增强现实中，我没有使用过这些库中的任何一个，但是它们是我在谈到 React AR/VR 时从大脑闪过的就是：

- [React 360](https://facebook.github.io/react-360/)
- [react-viro](https://www.npmjs.com/package/react-viro)
- [react-native-arkit](https://github.com/react-native-ar/react-native-arkit)

## 为 React 设计原型

如果您来自 UI/UX 背景，那么您可能希望使用一个工具为新的 React 组件、布局或 UI/UX 概念进行快速原型设计。 我以前用过 Sketch，但最近转到了 [Figma](https://www.framer.com/)。 尽管我两者都喜欢，但我现在并不后悔使用 Figma。 另一个流行的工具是 Framer。

## 为 React 书写文档

如果你负责为你的软件、 UI 库或者其他东西编写文档，那么你可以使用一些简洁的 React 文档工具。 我已经广泛地使用了 Storybook，我可以说他非常好用，但是我也听说了其他解决方案的好处:

- [Styleguidist](https://react-styleguidist.js.org/)
- [docz](https://www.docz.site/)
- [Docusaurus](https://docusaurus.io/)

## 总结

所以最终，React 生态系统可以看作是一个 React 的框架，但它保持灵活性。 它是一个灵活的框架，您可以自己决定选择哪些库。 您可以从小型开始，只添加库来解决特定的问题。 当应用程序增长时，您可以沿途扩展构建块。 否则你可以通过使用普通的 React 来保持轻量级。 因此，这里再次列出了可以补充 React 作为应用程序关于不同项目大小的核心的库。 请记住，这个列表是我的个人看法，我也渴望得到你的反馈。

### 小型应用程式

- **样板**: create-react-app
- **样式库:** basic CSS and inline style
- **异步请求**: fetch or axios 
- **代码风格:** 无
- **类型检查:** 无
- **状态管理:**  React Hooks 
- **路由:** 无 or React Router
- **身份验证:** Firebase
- **数据库:** Firebase
- **UI 库:** none
- **表单库:** 无
- **测试库:** Jest
- **实用程序库:** JavaScript
- **国际化:** react-i18next
- **React 桌面:** Electron

### 中型应用

- **样板文件:** Next.js or Gatsby.js
- **样式库:** CSS Modules or Styled Components
- **异步请求:** fetch or axios
- **代码风格:** Prettier，ESLint
- **类型检查:** 无 或 TypeScript
- **状态管理:** React Hooks and/or Apollo 
- **路由:** React Router 
- **身份验证:** Firebase
- **数据库:** Firebase
- **Ui 库:** none 或 UI 组件库
- **表单库:** none 或 Formik 或 React Hook Form
- **测试库:** Jest with React Testing Library
- **实用程序库:** JavaScript
- **国际化:** react-i18next
- **React 桌面:** Electron

### 大型应用程序

- **样板文件:** Next.js, Gatsby.js, custom setup
- **样式库:**  CSS Modules or Styled Components
- **异步请求:** axios 或 Apollo Client
- **代码风格:** Prettier，ESLint
- **类型检查:** TypeScript
- **状态管理:** React Hooks and/或者 Apollo/Redux/MobX 
- **路由:** React Router
- **认证:**  Node.js 服务 + Passport.js
- **数据库:** 自己用SQL/NoSQL DB 提供 Node.js 服务
- **Ui 库:** UI 组件库或者您自己的 UI 组件
- **表单库:**none 或者 Formik 或者 React Hook Form
- **测试库:** Jest with React Testing Library and Cypress
- **实用程序库:** JavaScript 的 api，Lodash
- **国际化:** react-i18next
- **React 桌面:** Electron

以前的建议是个人的。 您可以为理想的 React 应用程序选择自己的灵活框架。 每一个“理想”的 React 设置都是主观的，取决于开发人员和项目的需求。 毕竟，没有理想的 React 应用程序设置。