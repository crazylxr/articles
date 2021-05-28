SOLID 是一套原则。它们主要是关心代码质量和可维护性的软件专业人员的指导方针。

React 不是面向对象，但这些原则背后的主要思想可能是有帮助的。在本文中，我将尝试演示如何应用这些原则来编写更好的代码。

在前一篇文章中，我们讨论了单一责任原则。今天，我们将讨论 SOLID 的第二个原则: 开闭原则。

## 本系列其他文章

- [如何应用 SOLID 原则在 React 中整理代码之单一原则](https://mp.weixin.qq.com/s/oOcoy5rJwqH939MIOrgaiA)

## 什么是开闭原则？

> Robert c. Martin 认为这个原则是面向对象设计最重要的原则。但他不是第一个定义这个概念的人。Bertrand Meyer 于1988年在他的《面向对象软件构造》一书中写到了这一点。他解释了开放/封闭原则:
>
> 软件实体(类、模块、功能等)应该对扩展开放，但对修改关闭。

这个原则告诉您以这样一种方式来编写代码，即您**能够在不更改现有代码的情况下添加其他功能。**

让我们看看我们在哪里可以应用这个原则。

## 让我们从一个例子开始

假设我们有一个 `User` 组件，其中我们传递用户的详细信息，这个类的主要目的是显示该特定用户的详细信息。

这是一个很简单的开始。但是我们的生活并不是那么简单。几天后，我们的经理告诉我们系统中有三种类型的用户: `SuperAdmin`、 `Admin` 等等。

它们每个都有不同的信息和功能。

## 一个糟糕的解决方案

第一个也是显而易见的解决方案：在组件中包含一个条件，并根据不同的用户类型呈现不同的信息。

```javascript
import React from 'react';

export const User = ({user}) => {

    return <>
        <div> Name: {user.name}</div>
        <div> Email: {user.email}</div>
        {
            user.type === 'SUPER_ADMIN' &&
            <div> Details about super admin</div>
        }
        {
            user.type === 'ADMIN' &&
            <div> Details about admin</div>
        }
    </>
}
```

你知道这里出了什么问题吗？

首先，我们的代码现在是凌乱的。

其次，如果我们需要其他类型的用户怎么办？

然后，我们需要进入 User.js，为特定类型的用户添加另一个条件。

这明显违反了开闭原则，因为我们不允许更改 User 组件内部的代码。

## 解决方案是什么？

在这个场景中我们可以应用两种主要的技术:

1. 高阶组件(HOC)
2. 组件组合(Component composition)

在可能的情况下，最好采用第二种方法，但是在某些情况下，有必要使用 HOC。

现在，我们将使用 Facebook 推荐的一种技术，称为**组件组合**。

## 让我们创建单独的用户组件

现在，我们需要以这样一种方式设计代码，即不需要在 `User.js` 组件中添加条件。让我们为 `SuperAdmin` 创建一个单独的组件:

```javascript
import React from 'react';
import {User} from "./User";

export const SuperAdmin = ({user}) => {

    return <>
        <User user={user} />
        <div> This is super admin user details</div>
    </>
}
```

类似地，另一个是针对 `Admin` 用户的:

```javascript
import React from 'react';
import {User} from "./User";

export const Admin = ({user}) => {

    return <>
        <User user={user} />
        <div> This is admin user details</div>
    </>
}
```

现在我们的 App.js 文件变成了:

```javascript
import React from 'react';
import Admin from './Admin'
import SuperAdmin from './SuperAdmin'


export default function App = () =>{
  
  const user = {}
  
  const userByTypes = {
    'admin' : <Admin /> ,
    'superadmin' : <SuperAdmin />
  }
  
  return <div>
    {userByTypes[`${user.type}`]}
  <div/>
}
```

现在我们可以根据需要创建尽可能多的用户类型。我们针对特定用户的逻辑是封装的，因此我们不需要为了任何额外的修改而重新检查代码。

有些人可能会说，我们正在不必要地增加文件数量。当然，您可以暂时保持原样，但是随着应用程序的复杂性增加，您肯定会感到痛苦。

## 注意

SOLID 是一套原则。它们并不是强制性的，您必须应用于每个场景。作为一个经验丰富的开发人员，您应该在代码长度和可读性之间找到一个很好的平衡。

要过分执着于这些原则。事实上，有一句名言可以解释这些情况:

> Too Much SOLID

所以知道这些原则是好的，但是你必须保持平衡。对于一个或两个额外的字段，您可能不需要这些组合，但是将它们分开肯定会有长远的帮助。

## 总结

了解这些原则会让你走很长的路，因为在一天结束的时候，一段好的代码才是最重要的，而且没有单一的方法来做事情。

> 本文为译文，原文链接：https://betterprogramming.pub/applying-the-open-closed-principle-to-write-clean-react-components-4e4514963e40



