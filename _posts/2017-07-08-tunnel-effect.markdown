---
layout: post
title: Tunnel Effect for Your Demo
date: 2017-07-08
categories: LEARNTHREE.JS TRANSLATION 
---

## Tunnel Effect for Your Demo

这篇blog 会实现tunnel effect.这是一个经典的3D效果,它看起来很有意思并且code很简单。[doctor who](https://en.wikipedia.org/wiki/Doctor_Who)和 [stargate](https://en.wikipedia.org/wiki/Stargate) 也用到过这个很trendy 的效果。
[Try the demo](http://jeromeetienne.github.io/tunnelgl/) 它是用之前[post](http://learningthreejs.com/blog/2011/12/20/boilerplate-for-three-js/) 的boilerplate 写的，code is simple and small.我们只是在boilerplate 基础上加了20 行code.我们会创建一个[THREE.Geometry](https://github.com/mrdoob/three.js/blob/master/src/core/Geometry.js) 来作为 tunnel，然后用一点texture trick 实现moving 的[visual illusion](https://en.wikipedia.org/wiki/Optical_illusion)

### Let's build the walls

第一步是创建tunnel. 别担心，比你想象的要容易。一个tunnel 可以被看做一个camera 在内部的圆柱体。这个idea 很重要。很方便的，three.js 内置了圆柱体geometry 对象，叫做[CylinderGeometry](). 我们的tunnel/cylinder 还有两个要注意的地方。


1. 它是open-ended. 所以我们不能封闭top 和 bottom。这是由CylinderGeometry 的一个参数`openended`	控制的，把它设置为true.

2. 通常情况下，camera 都是放在obj外面，但是这个demo camera 需要放在tunnel 内部。为了让我们的obj 可以从内部被camera 观察到，需要设置mesh.flipSided = true.

### Let's go forward

现在我们要在tunnel 里 go forward.我们并不会移动tunnel , 而是会在texture上面做一点trick.我们也不会移动textures的actual pixels ，只会移动他的coordinates,而且， 我们希望texture repeat on the cylinder，这样会有看起来continuous 的效果。webgl texture is powerfull and flexible tool.有很多有意思的features.
首先，让texture move.假设我们想让texture loop once per 10 seconds.所以坐标`.offset.y` 需要在10s 内 go from 0 to 1。

```
	texture.offset.y += 0.1 * seconds;
```

然后texture repetition.为了这个效果，我们使用texture 的一个param 叫做wrap.它表明how gpu repeat the texture on a face.这里有一些[tutorial on opengl wrap](http://lucera-project.blogspot.jp/2010/06/opengl-wrap.html). 默认的， wrapS/wrapT会被设置为THREE.ClamToEdgeWrapping，也就是texture会被scale 去match face实际的size. 这个🌰，我们希望texture repeat ,not scale, 所以这样设置

```
	texture.wrapT = THREE.RepeatWrapping;
```


### Conclusion

// 这里是一些寒暄的话就不翻译了o(╯□╰)o

[code 在这里](https://github.com/jeromeetienne/tunnelgl)

[source 在这里](http://learningthreejs.com/blog/2012/01/11/tunnel-effect/)