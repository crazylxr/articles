SOLID 原则的主要目的是作为关心自己工作的软件专业人员的指导方针。那些以构建经得起时间考验的设计精美的代码库为荣的人。

今天，我们将从一个糟糕的代码示例开始，应用 SOLID 的第一个原则，看看它如何帮助我们编写小巧、漂亮、干净的 React 组件，并明确责任。

## 什么是单一责任原则？

单一责任原则告诉我们的是，每个类或组件应该有一个单一的存在目的。

组件应该只做一件事，并且做得很好。

让我们重构一段糟糕但正常工作的代码，并使用这个原则使其更加清晰和完善。

## 让我们从一个糟糕的例子开始

首先让我们看看一些违反这一原则的代码，添加注释是为了更好地理解:

```javascript
import React, {useEffect, useReducer, useState} from "react";

const initialState = {
    isLoading: true
};

// COMPLEX STATE MANAGEMENT
function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {isLoading: true};
        case 'FINISHED':
            return {isLoading: false};
        default:
            return state;
    }
}

export const SingleResponsibilityPrinciple = () => {

    const [users , setUsers] = useState([])
    const [filteredUsers , setFilteredUsers] = useState([])
    const [state, dispatch] = useReducer(reducer, initialState);

    const showDetails = (userId) => {
        const user = filteredUsers.find(user => user.id===userId);
        alert(user.contact)
    }

    // REMOTE DATA FETCHING
    useEffect(() => {
        dispatch({type:'LOADING'})
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => {
                dispatch({type:'FINISHED'})
                setUsers(json)
            })
    },[])

    // PROCESSING DATA
    useEffect(() => {
        const filteredUsers = users.map(user => {
            return {
                id: user.id,
                name: user.name,
                contact: `${user.phone} , ${user.email}`
            };
        });
        setFilteredUsers(filteredUsers)
    },[users])

    // COMPLEX UI RENDERING
    return <>
        <div> Users List</div>
        <div> Loading state: {state.isLoading? 'Loading': 'Success'}</div>
        {users.map(user => {
            return <div key={user.id} onClick={() => showDetails(user.id)}>
                <div>{user.name}</div>
                <div>{user.email}</div>
            </div>
        })}
    </>
}
```

### 这段代码的作用

这是一个函数式组件，我们从远程数据源获取数据，过滤数据，然后在 UI 中显示数据。我们还检测 API 调用的加载状态。

为了更好地理解这个例子，我把它简化了。但是你几乎可以在任何地方的同一个组件中找到它们！这里发生了很多事情:

1. 远程数据的获取
2. 数据过滤
3. 复杂的状态管理
4. 复杂的 UI 功能

因此，让我们探索如何改进代码的设计并使其紧凑。

## 1. 移动数据处理逻辑

不要将 HTTP 调用保留在组件中。这是经验之谈。您可以采用几种策略从组件中删除这些代码。

您至少应该创建一个自定义 Hook 并将数据获取逻辑移动到那里。例如，我们可以创建一个名为 usegetemotedata 的 Hook，如下所示:

```javascript
import {useEffect, useReducer, useState} from "react";

const initialState = {
    isLoading: true
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {isLoading: true};
        case 'FINISHED':
            return {isLoading: false};
        default:
            return state;
    }
}

export const useGetRemoteData = (url) => {

    const [users , setUsers] = useState([])
    const [state, dispatch] = useReducer(reducer, initialState);

    const [filteredUsers , setFilteredUsers] = useState([])


    useEffect(() => {
        dispatch({type:'LOADING'})
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(json => {
                dispatch({type:'FINISHED'})
                setUsers(json)
            })
    },[])

    useEffect(() => {
        const filteredUsers = users.map(user => {
            return {
                id: user.id,
                name: user.name,
                contact: `${user.phone} , ${user.email}`
            };
        });
        setFilteredUsers(filteredUsers)
    },[users])

    return {filteredUsers , isLoading: state.isLoading}
}
view rawuseGetRemoteData.js hosted with ❤ by GitHub
```

现在我们的主要组件看起来像这样:

```javascript
import React from "react";
import {useGetRemoteData} from "./useGetRemoteData";

export const SingleResponsibilityPrinciple = () => {

    const {filteredUsers , isLoading} = useGetRemoteData()

    const showDetails = (userId) => {
        const user = filteredUsers.find(user => user.id===userId);
        alert(user.contact)
    }

    return <>
        <div> Users List</div>
        <div> Loading state: {isLoading? 'Loading': 'Success'}</div>
        {filteredUsers.map(user => {
            return <div key={user.id} onClick={() => showDetails(user.id)}>
                <div>{user.name}</div>
                <div>{user.email}</div>
            </div>
        })}
    </>
}
```

看看我们的组件现在是多么的小，多么的容易理解！这是在错综复杂的代码库中所能做的最简单、最重要的事情。

但我们可以做得更好。

## 2. 可重用的数据获取钩子

现在，当我们看到我们使用 getemotedata Hook 时，我们看到这个 Hook 正在做两件事:

1. 从远程数据源获取数据
2. 过滤数据

让我们把获取远程数据的逻辑提取到一个单独的钩子，这个钩子的名字是 http/getrequest，它把 URL 作为一个组件:

```javascript
import {useEffect, useReducer, useState} from "react";
import {loadingReducer} from "./LoadingReducer";

const initialState = {
    isLoading: true
};

export const useHttpGetRequest = (URL) => {

    const [users , setUsers] = useState([])
    const [state, dispatch] = useReducer(loadingReducer, initialState);

    useEffect(() => {
        dispatch({type:'LOADING'})
        fetch(URL)
            .then(response => response.json())
            .then(json => {
                dispatch({type:'FINISHED'})
                setUsers(json)
            })
    },[])

    return {users , isLoading: state.isLoading}

}
```

我们还将 reducer 逻辑移除到一个单独的文件中:

```javascript
export function loadingReducer(state, action) {
    switch (action.type) {
        case 'LOADING':
            return {isLoading: true};
        case 'FINISHED':
            return {isLoading: false};
        default:
            return state;
    }
}
```

所以现在我们的 usetremotedata 变成了:

```javascript
import {useEffect, useState} from "react";
import {useHttpGetRequest} from "./useHttpGet";
const REMOTE_URL = 'https://jsonplaceholder.typicode.com/users'

export const useGetRemoteData = () => {
    const {users , isLoading} = useHttpGetRequest(REMOTE_URL)
    const [filteredUsers , setFilteredUsers] = useState([])

    useEffect(() => {
        const filteredUsers = users.map(user => {
            return {
                id: user.id,
                name: user.name,
                contact: `${user.phone} , ${user.email}`
            };
        });
        setFilteredUsers(filteredUsers)
    },[users])

    return {filteredUsers , isLoading}
}
```

干净多了，对吧? 我们能做得更好吗? 当然，为什么不呢？

## 3. 分解 UI 组件

看看我们的组件，其中显示了用户的详细信息。我们可以为此创建一个可重用的 UserDetails 组件:

```javascript
const UserDetails = (user) => {

    const showDetails = (user) => {
        alert(user.contact)
    }

    return <div key={user.id} onClick={() => showDetails(user)}>
        <div>{user.name}</div>
        <div>{user.email}</div>
    </div>
}
```

最后，我们的原始组件变成:

```javascript
import React from "react";
import {useGetRemoteData} from "./useGetRemoteData";

export const Users = () => {
    const {filteredUsers , isLoading} = useGetRemoteData()

    return <>
        <div> Users List</div>
        <div> Loading state: {isLoading? 'Loading': 'Success'}</div>
        {filteredUsers.map(user => <UserDetails user={user}/>)}
    </>
}
```

我们把代码从60行精简到了12行！我们创建了五个独立的组成部分，每个部分都有明确而单一的职责。

## 让我们回顾一下我们刚刚做了什么

让我们回顾一下我们的组件，看看我们是否实现了 SRP:

- `Users.js` - 负责显示用户列表
- `UserDetails.js` ー 负责显示用户的详细资料
- `useGetRemoteData.js` - 负责过滤远程数据
- `useHttpGetrequest.js` - 负责 HTTP 调用
- `LoadingReducer.js` - 复杂的状态管理

当然，我们可以改进很多其他的东西，但是这应该是一个很好的起点。

## 总结

这是一个简单的演示，演示如何减少每个文件中的代码量，并使用 SOLID 的强大功能创建漂亮的可重用组件。