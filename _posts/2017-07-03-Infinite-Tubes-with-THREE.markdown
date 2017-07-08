---
layout: post
title: Infinite Tubes
date: 2017-06-24
categories: THREE.JS
---

## Infinite Tubes with THREE.JS



![logo](./test.jpg)
### Getting Started

在这个demo 中我们使用THREE.JS 它是一个方便写webgl应用的框架，在开始写tube之前我们先setup a scene, 包含了renderer, camera. 如果你对three.js 不熟悉，我建议你先找一个tutorial读一下。这里有一份[reference](https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene)

建立scene ready之后我们将会按照以下几步进行

1. 创建决定tube shape 的curve
2. 根据curve 产生tube
3. move everything formard
4. 添加交互

### The curve

幸亏有了three.js 我们才可以使用path来创建curve. 我们要计算出描绘一个path的一些点，下面是创建curve 的code

```

	var points = [];
	for () {
		points.push(new THREE.Vector3(0, 0, 2.5 * i / 4));
	}
	
	var curve = new THREE.CatmullRomCurve3(points)
```
我们在后续会实时的更新curve 以改变curve的形状。由于path上所有的点都有相同的xy 坐标，现在curve 还只是一条直线

### The tube

现在我们已经有了curve(虽然现在还是个假curve) 我们就能用它来创建tube. 需要三个parts: geometry(tube 的形状), material (how it looks) ,mesh (geometry material 的结合)


```
// Create the geometry of the tube based on the curve
// The other values are respectively : 
// 70 : the number of segments along the tube
// 0.02 : its radius (yeah it's a tiny tube)
// 50 : the number of segments that make up the cross-section
// false : a value to set if the tube is closed or not

	var tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 50, false);
	var tubeMaterial = new THREE.MeshStandardMaterial({
		side: THREE.BackSide,
		map: rockPattern // textureLoader 载入的texture
	})
	
	tubeMaterial.map.wrapS = THREE.RepeatWrapping;
	tubeMaterial.map.wrapT = THREE.RepeatWrapping;
	tubeMaterial.map.repeat.set(30, 6);
	
	var tube = new THREE.Mesh(tubeGeotry, tubeMaterial);
	scene.add(tubeMesh);
``` 

### Move the tube forward

这个部分是我最喜欢的部分因为一开始animation 并没有想我预想那样。一开始我想tube是朝着camera 的方向运动。但是这么想是不对的
solution是这样的：没有东西在“物理上”向前移动， 只有texture 在沿着tube translated .
为了实现这个，我们先给texture定义一个offset 为了每帧创造一种移动的 illusion。
```
	function updateMaterialOffset () {
		tubeMaterial.map.offset.x += speed;
	}
```

### User interactions

demo 如果有user interaction 就更好了，当user 移动鼠标就可以控制tube shape. 这里的 trick 是更新我们在第一部创建的 curve 的points。一旦curve changed, tube 就能相应的改变

```
	curve.points[2].x = -mouse.position.x * 0.1;
	curve.points[2].y = mouse.position.y * 0.1;

	curve.points[4].x = -mouse.position.x * 0.1;

```

### That's it?

真实的code 会比这篇post 解释的复杂一点，但是如果你理解了这些keys, 你应该会有一个大体的思路。如果有兴趣，就去check 一下第一个deom的 source code，我加了一些comments。有任何问题，feel free to [twitter](https://twitter.com/Mamboleoo) me:)

