## 1. 数组
数组是平时使用最常用的数据结构，在JavaScript中数组是动态的分配大小,在这里我不会介绍JavaScript里面数组的所有的方法，而是针对数据结构这个方向谈谈所用到的方法。
### 1.1 创建和初始化数组

```javascript
//创建空数组
var array = new Array();
//[]

//初始化数组
var array = new Array(1,2,3); 
var array = Array.of(1,2,3);//ES6的方法
//[1,2,3]

//创建大小为5的数组
var array = new Array();//ES6的方法
//[undefined,undefined,undefined,undefined,undefined]

//给数组赋值
var array = new Array();
array[0] = 1 ;
array[1] = 2 ;
array[2] = 3 ;
//[1,2,3]
```
### 1.2 添加元素

#### 1.2.1往数组后添加元素
```javascript
var number = [1,2,3];
number[number.length] = 4;
//[1,2,3,4]

//或者
var number = [1,2,3];
number.push(4);
//[1,2,3,4]
```
#### 1.2.2往数组前面添加元素

```javascript
var number = [1,2,3];
number.unshift(0);
//[0,1,2,3]
number.unshift(-2,-1);
//[-2,-1,0,1,2,3]

```
#### 1.2.3往数组的任意位置插入元素
运用splice方法

```javascript
//在索引1后面添加2，3，4
var number = [1,5,6];
number.splice(1,0,2,3,4);
//[1,2,3,4,5,6]
```

### 1.3 删除元素
#### 1.3.1 删除第一位

```javascript
var number = [1,2,3];
number.shift();
//[2,3]
```
#### 1.3.2 删除任意位置
使用splice方法删除数组任意位置的元素

```javascript
var numebr = [1,2,3,4,5,6];
//如果想删除元素3
number.splice(2,1);
//[1,2,4,5,6]

//如果想删除元素4，5
number.splice(3,2);
```
### 1.4 排序

#### 1.4.1 反序
```javascript
var number = [3,2,1];
number.reverse();
//[1,2,3]

```
#### 1.4.2 自然排序

```javascript
var numebr = [2,3,4,1,3,7];
number.sort();
//[1,2,3,3,4,7]
```
#### 1.4.3 自定义排序
这个自定义排序跟java里面实现comparator接口一个意思。用处可大了。

```javascript
var number = [4,5,6,7,1,2,3,8,9,10,11,12,13];
number.sort();
//[1, 10, 11, 12, 13, 2, 3, 4, 5, 6, 7, 8, 9]
```
仿佛看起有点不对啊，我们应该想要的是
[1,2,3,4,5,6,7,8,9,10,11,12,13],这个时候我们就用自定义排序来解决这个问题


```javascript
var number = [4,5,6,7,1,2,3,8,9,10,11,12,13];

function compare(a,b){
    if(a < b){
        return -1;
    }
    if(a > b){
        return 1;
    }
    
    return 0;
}

number.sort(compare);
//[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
```
这还只是最简单的，也可以对任何对象类型进行数组排序。例如，对象Person有名字和年龄属性，我们希望根据年龄排序

```javascript
var friends = [{name:'李晨',age:40},{name:'范冰冰',age:35}];

function comparePerson(a,b){
    if(a.age < b.age){
        return  -1;
    }
    if(a.age > b.age){
        return 1;
    }
    return 0;
}

friends.sort(comparePerson);
//[{name:'范冰冰',age:35},{name:'李晨',age:40}]
```
### 1.5 搜索
搜索有两个方法：indexOf方法返回与参数匹配的第一个元素的索引，lastIndexOf返回与参数匹配的最后一个元素的索引。

```javascript
var number = [1,3,4,3,56,6,7,4];
number.indexOf(3);//1
number.lastIndexOf(3)//3
```
## 2. 栈
栈是一种遵循后进先出(LIFO)原则的有序集合。新添加的或待删除的元素都保存在栈的末尾，称作栈顶，另一端就叫栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。在JavaScript中变量保存和函数调用都是用栈存储的。

首先创建一个类来表示一个栈，需要一种数据结构来保存栈里的元素。这里我们就选择刚学的数组：var items = [];
接下来，为我们的栈声明一些方法：
* push(elements(s)):添加一个（或几个）新元素到栈顶
* pop():移除栈顶的元素，同时返回被移除的元素
* peek():获取栈顶的元素，不对栈做出任何修改
* isEmpty():如果栈里没有任何元素就返回true,否则返回false；
* clear():清空栈
* size():返回栈元素的个数

如果上一节数组认真看了，我相信用JavaScript实现一个栈是非常简单的。在这里就直接来代码了，不用一个方法一个方法去解释了。

```javascript
function Stack(){
    var items = [];
    
    this.push = function(element){
        items.push(element);
    }
    
    this.pop = function(){
        return items.pop();
    }
    
    this.peek = function(){
        return items[items.length-1];
    }
    
    this.isEmpty = function(){
        return items.length === 0;
    }
    
    this.size = function(){
        return items.length;
    }
    
    this.clear = function(){
        items = [];
    }
    
    this.print = funciton(){
        console.log(items.toString());
    }
}
```
## 3. 队列
队列是遵循先来先服务(FIFO)原则的一组有序的项。队列在尾部添加新元素，并从顶部移除元素。最新添加的元素排在队列的末尾。

在现实生活中常见的例子就是排队。
在计算机科学中，一个常见的例子就是打印队列，先点击打印的文档会被先打印。

### 3.1 创建队列
同样先创建一个类来表示一个队列。需要用到的数据结构同样是数组var items = [];
声明可用的方法：
* enqueue(element(s)):向队尾添加一个（或多个）新的项
* dequeue():移除队列的第一（即排在队列最前面的）项，并返回被移除的元素。
* front():返回队列中第一个元素
* isEmpty():如果队列中不包含元素返回true，否则返回false
* size():返回队列包含元素的个数
#### 完整的Queue类

```javascript
function Queue(){
    var items = [];
    
    this.enqueue = function(element){
        items.push(element);
    }
    
    this.dequeue = function(){
        return items.shift();
    }
    
    this.front = function(){
        return items[0];
    }
    
    this.isEmpty = function(){
        return items.length === 0;
    }
    
    this.clear = function(){
        items = [];
    }
    
    this.size = funciton(){
        return items.length;
    }
    
    this.print = function(){
        console.log(items.toString());
    }
}
```
### 3.2 优先队列
在优先队列中，元素被赋予优先级。当访问元素的时，具有最高优先级的元素先删除。优先队列具有最高进先出的行为特征。例如：医院的急救室为病人赋予优先级（这个优先级可以指病情严重的成程度），具有最高优先级的病人最先得到治疗。

实现一个优先队列有两种选项：
1. 设置优先级，然后在正确的位置添加元素；
2. 用入列操作添加元素，然后按照优先级移除它们。

我们这里采用第一种。

```javascript
function PriorityQueue(){
    var items = [];
    
    funciton QueueElement(element,priority){
        this.element = element;
        this.priority = priority;
    }
    
    function comparePriority(a,b){
        if(a.priority > b.priority){
            return 1;
        }
        
         if(a.priority < b.priority){
            return -1;
        }
        
        return 0;
    }
    
    this.enqueue = funciton(element,priority){
        var queueElement = new QueueElement(element,priority);
        
        items.push(queueElement);
        
        items.sort(comparePriority);
    }
    
    //其它方法和默认的Queue实现相同
}
```
当然，这个enqueue的实现方法很多种，我这效率不是最高的，但是容易理解。将插入的元素根据优先级排个序，那么先出去的就是优先级最高的了。

