---
layout: post
title: Tunnel Effect for Your Demo
date: 2017-07-13
categories: LEARNTHREE.JS TRANSLATION 
---

## 5 Rookie mistakes to avoid with Angular 2

这篇blog是一些common mistakes 汇总，当你第一次写ang2  app 需要注意的。

以下假定你对angu2 有一些基础，如果你之前完全没有接触过ang2, 这里有一些材料
https://vsavkin.com/
https://blog.thoughtram.io/categories/angular-2/

### Mistake 1 Binding to the native "hidden" property ？？

### calling DOM API directly

有少量一些场合需要操作dom。ang2 提供了一些high-level api 可以使用。使用这些api 会有一些独到的优势：

* 方便unit test ，而不去要去touching DOM
* 让code 与浏览器解耦，使你的app可以在任何context 运行，例如在的 web workers 中运行（例如，在server 端的Electron）

不管是使用过angu1 或者是没有ang 背景，有一些直接操作DOM 组要注意的。

scenario1: 你需要对一个element 的引用在component template
想象这样一个场景：你有一个text input 你需要当component load 的时候auto-focus

你可能已经听过`@ViewChild/@ViewChildren` queries 能提供access to 欠在componenttemplate component instances .但是在这里，你需要的并不只是某个特定component 实例的ref, 第一个想法一定是inject component 的 ElementRef 

```
// 直接使用ElementRef (not recommended)

@Component({
	selector: 'my-comp',
	template: 
		`<input text="text"/>
		<div> some other </div>`
})
export class MyComp {
	
}
```
