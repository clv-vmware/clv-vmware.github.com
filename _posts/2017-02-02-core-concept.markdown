---
layout: post
title: Redux Core Concept
date: 2017-02-02
categories: translation
---
http://redux.js.org/docs/Glossary.html#async-action
### Action Creator

### Async Action

一个异步的action是发送给即将要dispatch方法，但是它并不会立即被reducer消耗，它在发送给base dispatch() 方法之前会被middleware转化为一个或者多个actions。
异步的actions 可能会有多种类型，取决于你所使用的mw.它们通常是异步的基本元素，像promise， thunk.它们通常并不会立即传给reducer而是等待一个操作完成再触发action dispatch

### Store enhancer

store enhancer 是一个由store creator 得到一个新的加强版的store creator的高阶函数。某种程度上它hemw 相似因为它们都能让你用可组合的方法修改store 接口。
store enhancer概念上与react 的高阶组件类似，也有叫做“component enhancers”
Because a store is not an instance, but rather a plain-object collection of functions, copies can be easily created and modified without mutating the original store. There is an example in compose documentation demonstrating that.
你可能不会去写一个 store enhancer,但是可能会用到developer tools里提供的一个完成时间旅行的enhancer.有趣的是，redux mw 扩展本身就是一个store enhancer