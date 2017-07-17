---
layout: post
title: Tunnel Effect for Your Demo
date: 2017-07-13
categories: LEARNTHREE.JS TRANSLATION 
---



## Building a server-side app with asynv functions and koa2

js 即将有的一个新feature 就是对 [异步函数](https://tc39.github.io/ecmascript-asyncawait/)的支持。在这篇post i will show you a practical example, 使用Koa2 来建立一个server-side app, koa2 是一个以async functions 为特点的framework。

js 的一个old problem就是怎么样处理callbacks,以及怎样组织code 避免‘callback hell’，已经有一些解决方案promises, generators,我们来比较一下callbacks, generators, promises 的使用在一个fetch JSON in sequence 的场景。

```
// fetch 2 files with callbacks

function doWork (cb) {
	fetch('data1.json', (err1, result1) => {
		if (err1) {
			return cb(err1);
		}
		fetch('data2.json', (err2, result2) => {
			if (err2) {
				return cb(err2);
			}
			cb(null, {
				result1, result2
			})
		})
	})
}
```
嵌套的callback 是cb hell 的开始，你可以重新组织一下code 把它拆分成modules ,但是实际上还是要依赖callbacks

```
// fetch with promises

function doWork () {
	fetch('data1.json')
		.then(result1 => 
			fetch('data2.json')
				.then(result2 => cb(null, {
					result1,
					result2
				})))
			.catch(cb);
}
```

promise based version 看起来好一点点，但是calls 仍然是nested. 如果想再sequential 一点的话，还需要reorganize.

```
// fetch with generators

	function* doWork () {
		var result1 = yield fetch(data1.json);
		var result2 = yield fetch('data2.json');
		return { result1, result2 };
	}
```

generators 的写法看起来非常简洁，很像同步code, 前两种看起来非常async style. 然而，generator solution 要求我们把function type 改成 function* , 这是一种special way 触发doWork.这看起来有点反直觉，`async/await` 语法可以提供better abstraction, 看一下async function 的写法

```
	async function doWork () {
		var result1 = await fetch('data1.json');
		var result2 = await fetch('data2.json');
		
		return { result1, result2 };
	}
```

async 语法是这样的，用async 标记的functions 允许使用await 关键字，await 会pause function 的执行来等待async operation 完成。异步操作可以用generator , promise, 或者其他的async function 来实现，你可以用try/catch 来做await 的错误处理，同样的error handle 在generator-based control flw 也适用。

### What is Koa?

koa 的作者跟express 是一个人。koa 非常lightweight and modular. 它允许writing code without callbacks.koa app 就是**an array of  middleware functions that run in sequence  processing incoming requests and providing a response**. 每个middleware function 能够access the context object包裹了native node request and response obj, 这个context obj 也提供了improved API 。basic koa app looks like this.

```
// Koa 1
var koa = require('koa');
var app = koa();

app.use(function *() {
	this.body = 'hello world';	
});

app.listen(3000);
```

这里是koa core 的一些，koa 很轻量，所以advanced functionality 需要一些3rd-party modules.

## Koa2 & Koa1

koa1 因为它很早的采用了generators 并且支持generator-based control.下面是一段典型的koa1 code 使用cascading middleware 改善一下error handling

```
	app.use(function *(next) {
		try {
			yield next;
		} catch (err) {
			this.body = {
				message: err.message
			};
			this.status = err.status || 500;
		}
	})
	
	app.use(function *(next) {
		const user = yield User.getById(this.session.id);
		this.body = user;
	});
	
```

koa2 移除了对generators 的支持改用async functions。middleware 的形式也改成了支持async arrow functions. 跟上面同样功能的code in Koa2 是这样的

```
	app.use(async (ctx, next) => {
		try {
			await next();
		} catch (err) {
			ctx.body = {
				message: err.message
			};
			ctx.status = err.status || 500;
		}
	})
	
	app.use(async ctx => {
		const user = await User.getById(ctx.session.id);
		
		ctx.body = user;
	});
```

在koa2 中使用normal functions promises generator function 仍然是支持的。

## koa & express

koa 是一个比express 更简单轻量的framework，是在node.js http module 之上build 的。express 提供了built-in features for routing , templating, sending files 和其他features.

## status of koa2

koa2 将会在nodejs 的async/await feature availabel的时候release.

## demo app

这里要build 的是一个track page view 的simple app. sth lke Google Analytics 但是much simpler.app 会有两个endpoints:

* 一个store 关于event 的information 
* 一个get the total number of events
* 额外的，endpoints 需要be secured with an API key

Redis 用于store events data.功能会被tested by unit and API tests.full code is [here](https://github.com/OrKoN/koa2-example-app)

## APP DEPENDENCIES

## NPM Scripts as a task runner

在使用gulp grunt 作为task runner 之后， 我觉得在server-side project npm scripts 比separate tools更好.其中一个优点是它允许invoke locally installed modules as if there were globally installed.我用了如下package.json 

```
	"scripts": {
		"start": "node index.js",
		"watch": "nodemon --exec npm run start",
		"build": "babel src -d build",
		"test": "npm run build; mocha --require 'babel-polyfill' --compilers js:babel-register"
	}
```

start script simply runs index.js.`watch` script 使用nodemon tool  runs start script, 它会自动restarts server 当你change sth in app. 注意nodemon 作为local development dependency 安装的，所以不需要installed globally.
build script 使用babel 编译files in the src 把结果输出到build folder. test script 首先会runs build,然后使用mocha runs tests.Mocha 需要两个modules: babel-polyfill, 为compiled code 提供runtime dependencies, babel-register, 在执行之前编译test files。
还有，presets for Babel 需要被加到package.json.这样你就不需要在cmd 提供这些

```
	{
		"babel": {
			"presets": [
				"es2015",
				"stage-3"
			] 
		}
	}
``` 

preset enable 所有的ECMAScript 2015 features, 还包括一些stage-3 上的feature.当这些配置好之后，开始develop app.

## app code

这个 module 会 read 两个环境变量： PORT , NODE_ENV. NODE_ENV 可能是development / proudction. 在development mode, babel-register 会加载进来用来编译modules at runtime. babel-register 也会cache results of compilation, 减少了server 启动时间。这个module 不推荐在proeuction use。build folder 下的precompiled version will be used in production mode.
index.js 是唯一一个不会被babel 编译，并且必须要使用native module 语法的（ie CommonJS）因此，app 的实例located in 导出的app module 的default property.

```
	export default app;
```

这对于混用ECMAScript 6 和CommonJS module 很重要。
app.js: 这个file 和后面讨论的file 都是要compiled by Babel in both dev and product environments.

```
	
```

## Persistence layer

在api.js 我们在 context ctx 中拿到了collecions ,这个属性我们是在app.js 从config 中初始化的。这些colletion objs负责storing retrieving data 从Redis。COLLECTION class 像下面这样。

```
	const redis = require('promise-redis')();
	const db = redis.createClient();
	
	class Collection {
		
	}
```


