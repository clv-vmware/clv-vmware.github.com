---
layout: post
title: Redux CombineReducers
date: 2017-02-01
categories: translation
---

## combineReducers(reducers)

Q: 如何实现的？

随着你的应用变的越来越复杂，你可能想把reducing function 拆分成独立的functions, 每一个独立管理state的一部分。

combineReducers helper function 把一个由不容reducing functions 构成的obj 转化成一个reducing function，这样就可以传入createStore

```
// 单一reducer function 
let rootReducer = combineReducers({reducer1, reducer2, ...})

createStore(rootReducer)

```
root reducer 会调用每个child reducer, 然后收集他们的结果并合并成一个 state obj. **state的形状会match 传入reducers的keys**
也就是说

```
const reducer1 = ...
const reducer2 = ...

let rootReducer = combineReducers({
	reducer1: ...
	reducer2: ...
})

// state tree 就会像这样
{
	reducer1: ...,
	reducer2: ...
}
```
你也可以