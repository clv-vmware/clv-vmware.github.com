---
layout: post
title: Redux store 2
date: 2017-02-01
categories: translation
---
###Store

store负责维护整个 state tree
改变store里state的唯一方法就是dispatch action

store 并不是一个class. 它是一个带有一些methods的对象。通过 传递 root reducing function 给createStore 方法来创建store.

#### a note for flux users

如果你使用flux, 那么有一点需要注意。redux 没有单独的dispatcher类也不支持多store

#### Store Methods

`getState()`
返回当前state tree。它等于store 里的reducer最后返回的value

`dispatch(action)` 分发一个action.这是触发state change 的唯一方法。store里的reducing function 会在当前getState()的结果上被同步调用， 结合穿进去的action。返回的value 将会被认为next state.然后会从getState()方法返回，并触发change listeners
#### a note for flux users
如果尝试从reducer 调用dispatch, 会抛出一个error "Reducers may not dispatch actions." 这和flux 的“Cannot dispatch in a middle of dispatch” 相似，但是它不会引起问题。在flux, 当store处理action，emit updates时，dispatch 是被禁止的。这就使得有一些时段是不能dispatch actions的。
在redux中，订阅者会在root reducer 返回new state之后被调用，所以可以在订阅方法中dispatch。只有在reducers内部是不允许dispatch 的，因为会有side effects. 如果在action 的response 中需要有side effect, 合适的地方是在异步的action creator中。
### arguments
`action` 一个描述app 变化的obj.actions是向store传入数据的唯一方法，所以任何数据，UI事件，网络callback, 或者websockets最终都会作为actions为dispatch。actions 一定会
