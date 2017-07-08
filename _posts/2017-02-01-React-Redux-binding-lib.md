---
layout: post
title: React-Redux Binding Lib 
date: 2017-02-01
categories: TRANSLATION
---

## Usage with React

首先要明确一点，Redux 跟 React 没有关系。你可以使用Redux with React,Angular, Ember, jQuery, or vanilla JavaScript. 但是，redux 和react 或者Deku 这样的lib配合的更好，因为他们通过状态的函数来描述UI，而Redux 通过通知更新状态来响应actions.

展现组件与容器组件

React-Redux 绑定库借鉴了分离表现组件和容器组件的idea. 大部分的comp 都是展示组件，为了重用与解耦，但是我们仍然需要一些container 来将他们与Redux store 联系上。

API
主要有两个概念： 一个是Provider store；一个是connect

## React-Redux

## API <Provider store>
使Redux store能够通过connect（） 调用在下层组件获得被获得。通常，会采用<Provider>包裹根组件，然后在下层调用connect() 获得store的模式。
## props
* store: redux中唯一的store
* children: 被包裹的根组件

## ExamPle
```
ReactDOM.render(
  <Provider store={store}>
    <MyRootComponent />
  </Provider>,
  rootEl
)

```

## Connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

未完 TODO
http://taobaofed.org/blog/2016/08/18/react-redux-connect/
连接react component 和redux store.connect 是connectAdvanced的外观方法，对大多数场景提供通用方案。
它不修改传入的component class，而是会返回一个新的connected component class.

## Arguments

* [mapStateToProps(state, [ownProps]): stateProps]（Function）如果这个参数指定了的话，返回的新的component 会接受redux store updates.也就是说任何时候store更新了，`mapStateToProps`就会被调用，`mapStateToProps`返回的结果一定要是普通对象，它将会被merge进component's props.如果你不想订阅store的更新， 在`mapStateToProps` 的位置传入null 或者undefined. 如果`ownProps`作为作为第二个参数被指定，那它的值会被作为props传入component, mapStateToProps会被重新触发当comp收到新的props(例如，如果props从一个父comp传来，当props发生shallow change, 而你用了ownProps参数，mapStateToProps就会重新触发)
NOTE: 
* 






