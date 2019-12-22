## Css in modules

**1. 使用require写法**

```
const styles = require('./index.scss')
复制代码
```

require默认的定义 

**2. 添加全局声明**

```typescript
declare module '*.less'
```

修改import

```
import styles from './index.scss'
```

**3. 为index.scss生成index.scss.d.ts**

具体见：[CSS in Typescript](https://juejin.im/post/5a7803335188257a5d2b0fed)

##  Page

### 编写 props 和 state

```javascript
interface IProps {
}

interface IState {
}

class RootIndex extends Component<IProps, IState > {
  
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }
  
  // 其他代码
}
```

### 需要用到 react-router 的属性

如果需要用的 react-router 的 location 等属性，IProps 是需要继承 RouteComponentProps 的，否则就会是有问题的，泛型的第一个参数是 match 的时候 params 那个对象的类型。

```javascript
interface IProps extends RouteComponentProps<{}> {
}

interface IState {
}

class RootIndex extends Component<IProps, IState > {
  
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }
  
  // 其他代码
}
```

## Model

### 定义 model 接口

可以从 api 里面拿到实体

```javascript
export interface DataInterpritionModel {
    table: Table,
    queryParam: any,
}
```

### StoreState 

```javascript
export interface StoreState {
    customerAnalysis: {},
		dataInterprition: DataInterpritionModel,
		liveTime: LiveTimeModel
}
```



