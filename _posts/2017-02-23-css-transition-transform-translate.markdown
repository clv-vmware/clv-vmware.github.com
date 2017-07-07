---
layout: post
title: css transition transofrm
date: 2017-02-23
categories: CSS
---

transition: transition 是transition-property（需要过渡的属性） transition-duration, transition-timing-function transition-delay 的简写。它允许定义elem 的两个状态之间的过渡效果。不同的状态可能是使用伪类： hover :active 或者是用js动态设置css实现的。

## Using CSS trnasitions

css transitions 提供一种方法在改变css属性时去控制animation speed。而不是修改property之后立刻生效.你可以让某个属性的更改持续一段时间。例如，你改变了某个ele的color 从白色到黑色，通常改变是即时发生的。如果开启css transitiosn, 改变会在一个时间段内发生，遵循某种acceleration curve.

**transition 表示两个状态之间加时间去过渡，transition属性写在start state上，transition-property 需要是在start state 和final state 之间发生变化的属性**

？？ animations involve 两个状态之间的过度通常叫做 隐式transitions ,因为start final states 都是由browser定义的。

## CSS properties used to define transitions



## Detecting the start and completion of a transition

你可以使用transitionend 事件去检测animation是否完成。这是一个TransitionEvent obj在典型的Event时间之上多了两个属性

* propertyName: string表明哪一个属性的transition 执行完了
* elapsedTime: float transition执行时间，这个值与transition-delay无关

## when property value lists are of different lengths

如果某项property 长度比其他短，就会循环重复为了match

```
div {
  transition-property: opacity, left, top, height;
  transition-duration: 3s, 5s;
}
```
