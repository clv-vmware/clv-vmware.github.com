---
layout: post
title: Redux Store
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
`action` 一个描述app 变化的obj.actions是向store传入数据的唯一方法，所以任何数据，UI事件，网络callback, 或者websockets最终都会作为actions为dispatch。actions 一定要有type字段，types需要被定义为常量并且作为独立module 导出使用。使用strings 来定义type 比Symbols好，因为strings是序列化的。
返回： 返回被dispatch的action

#### notes

使用createStore 创建的普通的store只支持plain obj actions并且会立即调用reducer进行处理。
然而，如果你用applyMiddleware包装了createStore, middleware 就会用不同的方式解析actions, 为异步actions提供支持。异步actions 经常是异步的元素像Promises, Observables, thunks.
middleware 是由社区开发并不是跟Redux 天生就在一块的。需要显式的安装包像redux-thunk redux-promise，你也可以创建你自己的middleware 

#### subscribe(listener)

添加一个变化监听器。它发生在一个action被分发后，state tree 的某一部分变化了。你可以在监听器的回调里调用getState() 来读取当前state tree。
可以在change listener 里调用dispatch， 但有以下几个tip注意

* 调用dispatch 最好是有特定条件，要不然会执行死循环
* The subscriptions are snapshotted just before every dispatch() call. If you subscribe or unsubscribe while the listeners are being invoked, this will not have any effect on the dispatch() that is currently in progress. However, the next dispatch() call, whether nested or not, will use a more recent snapshot of the subscription list.
* The listener should not expect to see all state changes, as the state might have been updated multiple times during a nested dispatch() before the listener is called. It is, however, guaranteed that all subscribers registered before the dispatch() started will be called with the latest state by the time it exits.

这是一个low-level API 通常，我们都会使用React bindings而不是去直接调用subscribe。如果你只是使用callback 作为响应state change的hook , 你可以维护一个observeStore utility。store也是一个Observable，所以你可以使用RxJS这样的库来注册变化。
解绑change listener, 触发subscribe 返回的function
#### Arguments
`listener` callback 会在一个action 被dispatch之后触发，state tree 就会变化。你可以在callback 内部调用getState读取当前state tree. store 里的reducer 是纯函数，所以你可以比较state tree 里某些引用是否变化来判断value 是否变化。
`returns` 返回解绑函数

```javascript
function select(state) {
    return state.some.deep.property
}

let currentValue
function handleChange() {
    let previousValue = currentValue
    currentValue = select(store.getState())

    if (previousValue !== currentValue) {
    console.log('Some deep nested property changed from', previousValue, 'to',
        currentValue)
    }
}

let unsubscribe = store.subscribe(handleChange)
unsubscribe()
```
#### replaceReducer(nextReducer)

替换目前使用的reducer。这是一个高级API。在需要动态载入reducer时会用到，或者是需要完成hot reloading 机制的时候。

## applyMiddleware(...middlewares)

middleware 是实现 redux扩展功能的建议方式。middleware 让你根据你的需求包装store 的dispatch。middleware关键特征是可组合。多个middleware 在不知道chain 上其他mw 的情况下组合成一个mw chain.
最常见的使用场景是不安装其他依赖库像RxJS的情况下支持异步action。让你像其他normal actions一样dispatch 异步actions.
例如，redux-thunk 通过让action creators dispatch function 来实现。接收dispatch作为参数然后异步的调用它。这样的functions 叫做thunks.另一个mw是 redux-promise. 它支持dispatch 一个promise 异步action，并且当promise resolve时dispatch 一个普通的action.
middleware 没有被集成进createStore 也不是redux 架构的基础部分，但是它是很重要的。This way, there is a single standard way to extend dispatch in the ecosystem, and different middleware may compete in expressiveness and utility.

### Arguments

...middlewares(arguments): 遵守reudx middleware api 的函数。每个mw接收Store's dispatch 和getState 作为命名参数，并返回一个function。这个函数将被给下一个mw的dispatch 方法，并期望去返回一个

### Returns
返回一个应用mw 的 store enhancer。 store enhancer 签名是 `createStore => createStore'`但是最简单的方式是把mw当做createStore（）的最后一个参数传入





