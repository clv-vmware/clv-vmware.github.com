---
layout: post
title: HTTP COOKIE 
date: 2017-02-012
categories: translation
---

transition: transition 是transition-property（需要过渡的属性） transition-duration, transition-timing-function transition-delay 的简写。它允许定义elem 的两个状态之间的过渡效果。不同的状态可能是使用伪类： hover :active 或者是用js动态设置css实现的。

## Using CSS trnasitions

css transitions 提供一种方法在改变css属性时去控制animation speed。而不是修改property之后立刻生效.你可以让某个属性的更改持续一段时间。例如，你改变了某个ele的color 从白色到黑色，通常改变是即时发生的。如果开启css transitiosn, 改变会在一个时间段内发生，遵循某种acceleration curve.

**transition 表示两个状态之间加时间去过渡，transition属性写在start state上，transition-property 需要是在start state 和final state 之间发生变化的属性**

？？ animations involve 两个状态之间的过度通常叫做 隐式transitions ,因为start final states 都是由browser定义的。
