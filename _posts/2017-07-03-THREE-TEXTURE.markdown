---
layout: post
title: THREE TEXTURE
date: 2017-07-03
categories: THREE.JS TRANSLATION
---

## Loading and Working with Textures

### Creating fake reflections using an environments map(cubemap)

计算environment relections 是非常CPU-intensive的，并且通常需要ray tracer approach. 如果你想在three.js中使用reflection 会以一种fake的方法来实现。You can do this by creating a texture of the environment the object is in and apply this to the specific object.

为了创建一个reflection environment 的demo， following steps:

1. create CubeMap object(material): 第一件事就是create a CubeMap obj.cubemap 是一组的将要被贴到cube 每个面的6个textures 
2. create a box with this CubeMap object(geometry):带有cubemap 的box是你能够移动camera的environment。它给出你一种错觉好像你站在environment中，你可以look around.事实上，你确实是在一个内部贴图的cube里，会有一种space 的错觉。
3. 把cubemp 座位texture 帖进去。The same CubeMap object we used to simulate the environment can be used as a texture on the meshes. Three.js will make sure it looks like a reflection of the environment.


创建一个cubemap 是很容易的只要你有素材。你要做的就是把6个images 一起变成complete environment。所以会需要一下的pics: looking forward(posz), looking fackward(negz), lookup(posy),looking down(negy), looking right(posx), look left(negx).three 会把它们打在一起创建一个seamless environment map. 你也可以用这个[site](http://www.humus.name/index.php?page=Textures)

一旦你准备好了6个imgages, 就可以这样加载它们

```
	function createCubeMap () {
		var path = "../assets/textures/cubemap/parliament";
		var format = ".jpg";
		
		var urls = [
			path + 'posx' + format, path + 'negx' + format,
       	path + 'posy' + format, path + 'negy' + format,
       	path + 'posz' + format, path + 'negz' + format		];
       
       var textureCube = THREE.ImageUtils.loadTextureCube( urls );
       return textureCube;
	}
```

我们又用到了THREE.ImageUtils 这个obj, 我们使用loadTextureCube 来创建Cubemp 如果你有一个360-degree panoramic pic， 也可以用这个[site](http://gonchar.me/panorama/) convert.

或者，你可以使用three.js 来处理全景照片。


```
	var textureCube = THREE.ImageUtils.loadTexture("360-de.png", new THREE.UVMapping());
	
	// 我们先create a box
	var textureCube = createCubeMap();
	var shader = THREE.ShaderLib["cube"];
	shader.uniforms["tCube"].value = textureCube;
	var material = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});
	
	cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);

```

three.js 提供了特殊的shader （shaderLib["cube"]）能够配合我们使用THREE.ShaderMaterial 创建一个基于cubemap 的 environment。我们配置好这个shader,然后将它用于shadermaterial 创建的cubemap，然后再create mesh, add it to the scene.这个scene, 从里面看，就代表了fake environment。
同样的cubemap 也可以应用到fake reflection 中。

```
	var sphere1 = createMesh(new THREE.SphereGeometry(10, 15, 15), "plaster.jpg");
	sphere1.material.envMap = textureCube;
	sphere1.rotation.y = -0.5;
	sphere1.position = 12;
	sphere1.position = 5;
	scene.add(sphere1);
	
	
```
这里的关键是我们设置了material 的 envMap 属性。效果就是我们好像在一个wide ourdoors environment， meshed可以反射周围环境。你也可以设置一个滑动条去控制material 的reflecitvity。决定environment 被反射多少
除了reflection, 也可以用cubemap 完成refraction （glass-like objs）我们只要把textureCube替换成以下这样

```
	var textureCube = THREE.ImageUtils.loadTextureCube(urls, new THREE.CubeRefractionMapping());
	
```

可以通过设置material.refraction 控制refraction ratio 就像reflection。

为了show scene里面其他objs 的reflections. 我们需要一些three.js 其他的components, 第一个是 一种特殊的camera， THREE.CubeCamera


```
	var cubeCamera = new THREE.CubeCamera(0.1, 20000, 256);
	scene.add(cubeCamera);
```

我们会用THREE.CubeCamera 去给场景里的all objects rendered take a snapshot , 用这个来构建CubeMap。你需要确认你把camera放在了合适的position。

我们仅仅应用了动态的 sphere的 reflection ，所以我们还需要两个materials

```
	var dynamicEnvMaterial = new THREE.MeshBasicMaterial({
		envMap: cubeCamera.renderTarget
	});
	var envMaterial = new THREE.MeshBasicMaterial({
		envMap: textureCube
	});

```
跟之前ex主要的不同是对于dynamic reflections，我们set the envMap to the cubeCamera.renderTarget 而不是textureCube。在这个例子，我们设置中心sphere 的 dynamicEnvMaterial 和其他objects 的envMaterial

```
```


## Advanced usage of textures

### Custom UV mapping
我们首先来看一下UV mapping。

TODO
