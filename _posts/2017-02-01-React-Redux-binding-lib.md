---
layout: post
title: React-Redux usage 
date: 2017-02-01
categories: translation
---
Usage with React

首先要明确一点，Redux 跟 React 没有关系。你可以使用Redux with React,Angular, Ember, jQuery, or vanilla JavaScript. 但是，redux 和react 或者Deku 这样的lib配合的更好，因为他们通过状态的函数来描述UI，而Redux 通过通知更新状态来响应actions.

展现组件与容器组件

React-Redux 绑定库借鉴了分离表现组件和容器组件的idea. 大部分的comp 都是展示组件，为了重用与解耦，但是我们仍然需要一些container 来将他们与Redux store 联系上。

API
主要有两个概念： 一个是Provider store；一个是connect