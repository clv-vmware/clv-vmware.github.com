---
layout: post
title: flux architecture 
date: 2017-03-005
categories: translation
---
## Dissection of Flux architecture or how to write your own
http://krasimirtsonev.com/blog/article/dissection-of-flux-architecture-or-how-to-write-your-own-react
## my two cents
## the dispatcher
在大部分场景下，我们需要一个单例的dispatcher。因为它起到了一个胶水的作用去连接sys其他的部分。dispatcher有两个输入，actions 和 stores. actions 只是要被转发到stores里所以我们不需要保存它们。stores 在dispatcher 内部应该被跟踪。

```
var Dispatcher = function () {
	return {
		_stores: [],
		register: function () {
			
		}
	}
}
```