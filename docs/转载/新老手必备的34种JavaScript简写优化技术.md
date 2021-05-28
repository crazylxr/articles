开发者的生活总是在学习新的东西，跟上变化不应该比现在更难，我的动机是介绍所有 JavaScript 的最佳实践，比如简写功能，作为一个前端开发者，我们必须知道，让我们的生活在 2021 年变得更轻松。

你可能做了很长时间的 JavaScript 开发，但有时你可能没有更新最新的特性，这些特性可以解决你的问题，而不需要做或编写一些额外的代码。这些技术可以帮助您编写干净和优化的 JavaScript 代码。此外，这些主题可以帮助你为 2021 年的 JavaScript 面试做准备。

## 1.如果有多个条件

我们可以在数组中存储多个值，并且可以使用数组 `include` 方法。

```javascript
//Longhand
if (x === 'abc' || x === 'def' || x === 'ghi' || x ==='jkl') {
  //logic
}

//Shorthand
if (['abc', 'def', 'ghi', 'jkl'].includes(x)) {
  //logic
}
```

## 2.如果为真…否则简写

这对于我们有 `if-else` 条件，里面不包含更大的逻辑时，是一个较大的捷径。我们可以简单的使用三元运算符来实现这个简写。

```javascript
// Longhand
let test: boolean;
if (x > 100) {
  test = true;
} else {
  test = false;
}

// Shorthand
let test = (x > 10) ? true : false;
//or we can use directly
let test = x > 10;
console.log(test);
```

当我们有嵌套条件时，我们可以采用这种方式。

```javascript
let x = 300,
test2 = (x > 100) ? 'greater 100' : (x < 50) ? 'less 50' : 'between 50 and 100';
console.log(test2); // "greater than 100"
```

## 3.声明变量

当我们要声明两个具有共同值或共同类型的变量时，可以使用此简写形式。

```javascript
//Longhand
let test1;
let test2 = 1;

//Shorthand
let test1, test2 = 1;
```

## 4.Null, Undefined，空检查

当我们创建新的变量时，有时我们想检查我们引用的变量的值是否为空或 undefined。JavaScript 确实有一个非常好的简写工具来实现这些功能。

```javascript
// Longhand
if (test1 !== null || test1 !== undefined || test1 !== '') {
    let test2 = test1;
}

// Shorthand
let test2 = test1 || '';
```

## 5.null 值检查和分配默认值

```javascript
let test1 = null,
    test2 = test1 || '';

console.log("null check", test2); // output will be ""
```

## 6.undefined 值检查和分配默认值

```javascript
let test1 = undefined,
    test2 = test1 || '';

console.log("undefined check", test2); // output will be ""
```

正常值检查

```javascript
let test1 = 'test',
    test2 = test1 || '';

console.log(test2); // output: 'test'
```

## 7.将值分配给多个变量

当我们处理多个变量并希望将不同的值分配给不同的变量时，此简写技术非常有用。

```javascript
//Longhand
let test1, test2, test3;
test1 = 1;
test2 = 2;
test3 = 3;

//Shorthand
let [test1, test2, test3] = [1, 2, 3];
```

## 8.赋值运算符简写

我们在编程中处理很多算术运算符，这是将运算符分配给 JavaScript 变量的有用技术之一。

```javascript
// Longhand
test1 = test1 + 1;
test2 = test2 - 1;
test3 = test3 * 20;

// Shorthand
test1++;
test2--;
test3 *= 20;
```

## 9.如果存在简写

这是我们大家都在使用的常用简写之一，但仍然值得一提。

```javascript
// Longhand
if (test1 === true) or if (test1 !== "") or if (test1 !== null)

// Shorthand //it will check empty string,null and undefined too
if (test1)
```

注意：如果 test1 有任何值，它将在 if 循环后进入逻辑，该运算符主要用于 `null` 或 `undefined` 的检查。

## 10.多个条件的 AND（\&\&）运算符

如果仅在变量为 `true` 的情况下才调用函数，则可以使用 `&&` 运算符。

```javascript
//Longhand
if (test1) {
 callMethod();
}

//Shorthand
test1 && callMethod();
```

## 11.foreach 循环简写

这是迭代的常用简写技术之一。

```javascript
// Longhand
for (var i = 0; i < testData.length; i++)

// Shorthand
for (let i in testData) or  for (let i of testData)
```

每个变量的数组

```javascript
function testData(element, index, array) {
  console.log('test[' + index + '] = ' + element);
}

[11, 24, 32].forEach(testData);
// logs: test[0] = 11, test[1] = 24, test[2] = 32
```

## 12.return 中比较

我们也可以在 return 语句中使用比较。它将避免我们的 5 行代码，并将它们减少到 1 行。

```javascript
// Longhand
let test;
function checkReturn() {
  if (!(test === undefined)) {
    return test;
  } else {
    return callMe('test');
  }
}
var data = checkReturn();
console.log(data); //output test
function callMe(val) {
    console.log(val);
}

// Shorthand
function checkReturn() {
    return test || callMe('test');
}
```

## 13.箭头函数

```javascript
//Longhand
function add(a, b) {
   return a + b;
}

//Shorthand
const add = (a, b) => a + b;
```

更多示例。

```javascript
function callMe(name) {
  console.log('Hello', name);
}
callMe = name => console.log('Hello', name);
```

## 14.短函数调用

我们可以使用三元运算符来实现这些功能。

```javascript
// Longhand
function test1() {
  console.log('test1');
};
function test2() {
  console.log('test2');
};
var test3 = 1;
if (test3 == 1) {
  test1();
} else {
  test2();
}

// Shorthand
(test3 === 1? test1:test2)();
```

## 15\. Switch 简写

我们可以将条件保存在键值对象中，并可以根据条件使用。

```javascript
// Longhand
switch (data) {
  case 1:
    test1();
  break;

  case 2:
    test2();
  break;

  case 3:
    test();
  break;
  // And so on...
}

// Shorthand
var data = {
  1: test1,
  2: test2,
  3: test
};

data[something] && data[something]();
```

## 16.隐式返回简写

使用箭头函数，我们可以直接返回值，而不必编写 return 语句。

```javascript
//longhand
function calculate(diameter) {
  return Math.PI * diameter
}

//shorthand
calculate = diameter => (
  Math.PI * diameter;
)
```

## 17.小数基数指数

```javascript
// Longhand
for (var i = 0; i < 10000; i++) { ... }

// Shorthand
for (var i = 0; i < 1e4; i++) {
```

## 18.默认参数值

```javascript
//Longhand
function add(test1, test2) {
  if (test1 === undefined)
    test1 = 1;
  if (test2 === undefined)
    test2 = 2;
  return test1 + test2;
}

//shorthand
add = (test1 = 1, test2 = 2) => (test1 + test2);
add() //output: 3
```

## 19.扩展运算符简写

```javascript
//longhand

// joining arrays using concat
const data = [1, 2, 3];
const test = [4 ,5 , 6].concat(data);

//shorthand

// joining arrays
const data = [1, 2, 3];
const test = [4 ,5 , 6, ...data];
console.log(test); // [ 4, 5, 6, 1, 2, 3]
```

对于克隆，我们也可以使用扩展运算符。

```javascript
//longhand

// cloning arrays
const test1 = [1, 2, 3];
const test2 = test1.slice()

//shorthand

// cloning arrays
const test1 = [1, 2, 3];
const test2 = [...test1];
```

## 20.模板文字

如果您厌倦了在单个字符串中使用 `+` 来连接多个变量，那么这种简写可以消除您的头痛。

```javascript
//longhand
const welcome = 'Hi ' + test1 + ' ' + test2 + '.'

//shorthand
const welcome = `Hi ${test1} ${test2}`;
```

## 21.多行字符串简写

当我们在代码中处理多行字符串时，可以使用以下功能：

```javascript
//longhand
const data = 'abc abc abc abc abc abc\n\t'
    + 'test test,test test test test\n\t'

//shorthand
const data = `abc abc abc abc abc abc
         test test,test test test test`
```

## 22.对象属性分配

```javascript
let test1 = 'a';
let test2 = 'b';

//Longhand
let obj = {test1: test1, test2: test2};

//Shorthand
let obj = {test1, test2};
```

## 23.将字符串转换成数字

```javascript
//Longhand
let test1 = parseInt('123');
let test2 = parseFloat('12.3');

//Shorthand
let test1 = +'123';
let test2 = +'12.3';
```

## 24.用解构简写

```javascript
//longhand
const test1 = this.data.test1;
const test2 = this.data.test2;
const test2 = this.data.test3;

//shorthand
const { test1, test2, test3 } = this.data;
```

## 25.用 Array.find 简写

当我们确实有一个对象数组并且我们想要根据对象属性查找特定对象时，find 方法确实很有用。

```javascript
const data = [
  {
    type: 'test1',
    name: 'abc'
  },
  {
    type: 'test2',
    name: 'cde'
  },
  {
    type: 'test1',
    name: 'fgh'
  },
]
function findtest1(name) {
  for (let i = 0; i < data.length; ++i) {
    if (data[i].type === 'test1' && data[i].name === name) {
      return data[i];
    }
  }
}

//Shorthand
filteredData = data.find(data => data.type === 'test1' && data.name === 'fgh');
console.log(filteredData); // { type: 'test1', name: 'fgh' }
```

## 26.查找条件简写

如果我们有代码来检查类型，根据类型需要调用不同的方法，我们可以选择使用多个 else ifs 或者 switch，但是如果我们有比这更好的简写方法呢？

```javascript
// Longhand
if (type === 'test1') {
  test1();
}
else if (type === 'test2') {
  test2();
}
else if (type === 'test3') {
  test3();
}
else if (type === 'test4') {
  test4();
} else {
  throw new Error('Invalid value ' + type);
}

// Shorthand
var types = {
  test1: test1,
  test2: test2,
  test3: test3,
  test4: test4
};

var func = types[type];
(!func) && throw new Error('Invalid value ' + type); func();
```

## 27.按位索引简写

当我们遍历数组以查找特定值时，我们确实使用 `indexOf()` 方法，如果找到更好的方法该怎么办？让我们看看这个例子。

```javascript
//longhand
if(arr.indexOf(item) > -1) { // item found
}
if(arr.indexOf(item) === -1) { // item not found
}

//shorthand
if(~arr.indexOf(item)) { // item found
}
if(!~arr.indexOf(item)) { // item not found
}
```

按位（`〜`）运算符将返回除-1 以外的任何值的真实值。否定它就像做 `~~` 一样简单。另外，我们也可以使用 `include()` 函数：

```javascript
if (arr.includes(item)) {
    // true if the item found
}
```

## 28.Object.entries\(\)

此函数有助于将对象转换为对象数组。

```javascript
const data = { test1: 'abc', test2: 'cde', test3: 'efg' };
const arr = Object.entries(data);
console.log(arr);
/** Output:
[ [ 'test1', 'abc' ],
  [ 'test2', 'cde' ],
  [ 'test3', 'efg' ]
]
**/
```

## 29.Object.values\(\)

这也是 ES8 中引入的一项新功能，该功能执行与 `Object.entries()` 类似的功能，但没有关键部分：

```javascript
const data = { test1: 'abc', test2: 'cde' };
const arr = Object.values(data);
console.log(arr);
/** Output:
[ 'abc', 'cde']
**/
```

## 30.双按位简写

双重 NOT 按位运算符方法仅适用于 32 位整数）

```javascript
// Longhand
Math.floor(1.9) === 1 // true

// Shorthand
~~1.9 === 1 // true
```

## 31.重复一个字符串多次

要一次又一次地重复相同的字符，我们可以使用 for 循环并将它们添加到同一循环中，但是如果我们有一个简写方法呢？

```javascript
//longhand
let test = '';
for(let i = 0; i < 5; i ++) {
  test += 'test ';
}
console.log(str); // test test test test test

//shorthand
'test '.repeat(5);
```

## 32.在数组中查找最大值和最小值

```javascript
const arr = [1, 2, 3];
Math.max(…arr); // 3
Math.min(…arr); // 1
```

## 33.从字符串中获取字符

```javascript
let str = 'abc';

//Longhand
str.charAt(2); // c

//Shorthand
Note: If we know the index of the array then we can directly use index insted of character.If we are not sure about index it can throw undefined
str[2]; // c
```

## 34.数学指数幂函数的简写

```javascript
//longhand
Math.pow(2,3); // 8

//shorthand
2**3 // 8
```

>  文章作者: 张张

> 文章链接: https://blog.zhangbing.site/2021/03/09/34-javascript-optimization-techniques-to-know-in-2021/