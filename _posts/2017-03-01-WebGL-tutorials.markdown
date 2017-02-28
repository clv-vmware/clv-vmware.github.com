---
layout: post
title: HTTP COOKIE 
date: 2017-02-012
categories: translation
---
## get started with webgl

## preparing to render in 3d

使用webgl渲染3D 第一个事情就是canvas.下面这个代码片段就建立canvas 然后使用onload handler来初始化一个webgl context

```
<body onload="start()">
	<canvas id="glCanvas" width="64" height="48">
		your browser doesn't supprt canvas
	</canvas>
</body>
```

## prepare the webgl context

start() function在这里是用来建立webgl context并且开始render

```
var gl;

function start () {
	var canvas = document.getElementbyId('glCanvas');
	gl = initWebGL(canvas);
	if (!gl) {
		return ;
	}
	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Enable depth testing
	gl.enable(gl.DEPTH_TEST);
	// Near thins obscure far things
	gl.depthFunc(gl.LEQUAL);
	// Clear the color as well as the depth buffer.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
```

```
funciton initWebGL () {
	gl = null;
	
	gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	
	if (!gl) {
		alert('unable init webgl');
	}
	return gl;
}
```

## Resizing the webgl context
一个新的webgl context 会把它的viewport resolution设置成canvas 元素的宽和高在context 实例刚被获得的时候。修改canvas 元素的style 会修改它的显示size 但是修改不了它的render resolution。在context 被创建之后再去修改canvas 的eles 也不会改变被绘制的pixel number.为了能够修改resolution 需要调用webgl 的viewport() 

```
gl.viewport(0, 0, canvas.width, canvas.height)
``` 

当canvas 改变分辨率渲染时，它会经理scaling than its CSS style makes it occupy on the display. ? 使用css进行resize 大部分用于低分辨率场景并且要允许浏览器去做优化。downsacling 是可以的，并且会产生一个抗锯齿效果。最好可以依赖 MSAA and texture filtering implementations of the user's browser，而不是去强制更新并期待browser会有一个清晰的结果。