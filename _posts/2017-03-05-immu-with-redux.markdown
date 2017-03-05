---
layout: post
title: HTTP COOKIE 
date: 2017-02-012
categories: translation
---
## using immutable with Redux
http://redux.js.org/docs/recipes/UsingImmutableJS.html


## Why should I use an immutable-focused library such as Immutable.JS?

immu-focused 库像imm.js 是为了解决js对象与生俱来mutable 问题的，并提供良好的immutable性能
是否采用这样的lib或者你也可以坚持使用原声js 取决于你是否在意添加另外的依赖或者是你自己对使用原生 js 的隐患能控制的程度。
不论你选择了哪一种，都请确定你要熟悉immutable，mutation副作用这些概念。尤其是，要确定你对js 在更新和复制values的时候做了什么，以免会出现mutation引起的意外。

[Recipes: immutability, side effects and mutation](http://redux.js.org/docs/recipes/reducers/PrerequisiteConcepts.html#note-on-immutability-side-effects-and-mutation)

[Introduction to Immutable.js and Functional Programming Concepts](https://auth0.com/blog/intro-to-immutable-js/)

[Pros and Cons of using immutability with React.js](http://reactkungfu.com/2015/08/pros-and-cons-of-using-immutability-with-react-js/)
## What are the issues with using Immutable.JS?

尽管很强大，但immu 需要被小心的使用，由于它自身的一些原因。别担心，所有问题认真对待都可以被容易客服

**Difficult to interoperate with**

js 没有提供immutable 的数据结构。因为这样，你的data一定要被一个immu.js obj 包裹（例如 Map List ,etc)一旦被这种方式包裹，data再去和其他plain js object 交互就很难了。
例如，你将不能使用标准js 的点号方括号来访问对象属性。你必须通过IMMU 的get() getIn() 方法，getIn需要传入数组，用起来可能会不太适应。例如，普通js写法是 myObj.prop1.prop2.prop3, 使用Immu 可能要这样写 myImmutableMap.getIn(['prop1', 'prop2', 'prop3'])
这种写法不光使你和你自己的代码交互困难，在和其他lib交互的时候也很不方便，像lodash, ramda 这些都需要plain js
注意，immu obj 有一个toJS() 方法，它可以返回plain js data structure, 但是这个方法非常慢，使用这个方法就浪费了immu 带来的性能改善

## Once used, Immutable.JS will spread throughout your codebase

一旦你使用immu 包裹了你的data, 就需要使用accessors 去取得属性。
这会使得immu 蔓延到你整个codebase ，包括潜在的compnents ,可能你并不想在这里有immu 这样的依赖，你的整个codebase 一定要知道immu 是什么 不是什么。覆盖整个项目使得以后的移除也很困难，如果以后需要的话。
这个side effects 可以通过 [uncoupling your application logic from your data structures](https://medium.com/@dtinth/immutable-js-persistent-data-structures-and-structural-sharing-6d163fbd73d2#.z1g1ofrsi) 就像下文中 best practice 列出的那样

## No Destructuring or Spread Operators

由于你必须通过get() / getIn() 来access data， 你就不能再使用js 解构操作或者是obj 扩展了

## Not suitable for small values that change often

immu 适合在较大数据量下使用。如果你的数据是由一堆小的简单的js obj组成的data 它就比较慢
注意，然而immu并没有应用到redux 的state tree 上

## Difficult to Debug

immu obj 像Map List 很难调试。打印出来的immu 包裹了很多层， 不太容易看到里面结构，这个可以暗转插件 而且，当某一层有undefined 时，immu 并不会抛出错误，而是静默的处理掉， 

## Breaks object references, causing poor performance

immu 一个关键的优势是它支持shallow equality checking ,可以极大改善性能。
如果两个不同的变量引用了相同的immu obj，一个简单的 等号判等就可以足够判断他们是否equal，equality check 不需要去检查两个对象的 values是否完全相等。
然而，当immu 包裹的本身就是个对象时 shallow checking 不会work, 这是因为 immu 中的toJS() 方法

