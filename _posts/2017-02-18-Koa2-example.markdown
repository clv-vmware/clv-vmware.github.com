---
layout: post
title: koa2 example
date: 2017-02-012
categories: translation
---

## Building A Server-Side Application With Async Functions and Koa 2

## Async Functions

一个古老的js问题就是如何处理回调和如何避免callback-hell.一些方法仍然是基于回调的，另一些是基于js的promise generators特性。我们用一个异步读取两个JSON files的例子来比较一下。

```
// with callback
function doWork (cb) {
	fetch('data1.json', (er1, result1) => {
		if (er1) {
			return cb(er1);
		}
		fetch('data2.json', (er2, result2) => {
			if (er2) {
				return cb(er2);
			}
			cb(null, {
				result1,
				result2
			});
		});
	});
}
```

```
// promise

function doWork () {
	fetch('data1.json')
		.then((result1) => {
			fetch('data2.json')
				.then((result2) => {
					cb(null, {
						result1,
						result2
					})
				})
		}).catch(cb);
}
```

promise-based version 看起来好一点，但是仍然嵌套，我们需要重新组织一下，让code 看起来sequential一点

```
// generators

function* doWork () {
	var result1 = yield fetch('data1.json');
	var result2 = yield fetch('data1.json');
	return {
		reuslt1,
		result2
	}
}
```

generators 给出了最剪短的solution, 而且这看起来像同步的代码，而callback和promise 明显是异步代码并且带有嵌套。尽管如此，generator solution 改变了function type 成了generator function 通过在function 关键字后面加上*，它也有着特殊的触发doWork的方式。这看起来有一些反直觉，async/await syntax addresses this drawback by providing better abstraction？. 看一下使用async function 的例子

```
async function doWork () {
	var result1 = await fetch('data1.json');
	var result2 = await fetch('data2.json');
	return {
		result1,
		result2
	}
}

```
这个语法可以被这样解释：带async关键字的functions 允许我们在函数内部使用await 关键字，这可能会中断函数的执行去等待异步操作完成。异步的操作被表示成 generator ， promise 或者是其他异步函数。而且， 你可以使用 try/catch 去处理error or rejections 发生在await 的异步操作之中。同样的错误处理也可以用于generator-based control flow.

## Koa

Koa 非常轻量和模块化，支持不使用回调。Koa application 是一些列的middleware function that run in sequence processing incoming requests and providing a response. 每个mw function 都能够access to the context object that wraps native node request and response objects 然后提供改进的API。basic Koa application 看起来像这样

```
// this is Koa1
var koa = require('koa');
var app = koa();

app.use(function* () {
	this.body = 'hello world';
});

app.listen(3000);
```
这就是Koa core. advanced funcitonality 被第三方modules提供

## Koa 2 & Koa1

Koa1 因采用了generators 并且支持generator-based control 而著名。下面是一段Koa1 使用mw cascading 改善error处理的code piece

```
app.use(function* (next) {
	try {
		yield next;
	} catch () {
		this.body = {message: err.message}
		this.status = err.status || 500
	}
})


app.use(function * () {
	const user = yield User.getById(this.session.id);
	this.body = user;
})
```

Koa2 移除了内置的对generators的支持并使用async function instead.mw的函数签名e也改成了支持async arrow functions.下面是same code in Koa2

```
app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.body = {message: err.message};
		ctx.status = err.status || 500;
	}
});

app.use(async ctx => {
	const user = await User.getById(ctx.session.id);
	ctx.body = user;
});
```

## Koa & Express

Koa 是一个更轻量的framework than EX. 建立在Node.jsHTTP module之上。EX 提供了内置功能像 routing, templating sending files 还有其他，然而Koa只提供了非常少的功能，generator-based（async/await-based） control flow. 其他的routing, templating 还有其他功能都是以第三方库的形式提供的。而且都有好几种选择。[differenes between Koa and EX](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md)

## Status of Koa2

一旦async/await feature 在原生Node.js available Koa2 将会被发布。幸运的是，我们现在可以使用Babel, 现在，来看一个小🌰

## Demo App

目标是构建一个simple app 像google Analytics 追踪页面views 的东西，不过简单得多。app 有两个endpoints:

* one to store the information about an event (for example, a page view);
* and one to get the total number of events;
* additionally, the endpoints have to be secured with an API key.

Redis 会被用来存储events data.functionality 将会被tested by unit and API tests.[Source Code](https://github.com/OrKoN/koa2-example-app)

## APP DEPENDENCIES

## organize the app

在尝试过一些组织app的结构之后，对于small app我建议如下结构：

* index.js: main entry point
* ecosystem.json: PM2 ecosystem, 用来描述如何启动app
* src
* config
* build
* api.js
* app.js
* config.js


## The APP code



在这里， 我们使用es6 的import 来引入依赖的modules.然后我们创建Koa实例并使用use方法绑定几个mw functions 。最后导出app 给index.js使用。
第二个mw function是一个async function 和arrow function 

```
app.use(async (ctx, next) => {
  // Set up the request context
  ctx..state.collections = config.collections;
  ctx..state.authorizationHeader = `Key ${config.key}`;
  await next();
  // The execution will reach here only when
  // the next function returns and finishes all async tasks
  // console.log('Request is done');
})
```

在Koa2 ,next 参数是一个async function 会触发下一个mw function in the list.就像Koa1 你可以通过在当前function的 begin 或者是end 放置对next 方法的调用来控制当前mw 是在其他mw之前（之后）执行。你也可以在下游的mw function catch 所有的errors 通过包裹await next（）；不论在哪里的try/catch 都make sense。

## Defining the API

api.js 是core logic .由于Koa 没有提供routing ，所以我们引入koa-router module

koa-router 对指定的HTTP methods and paths 提供了可以定义mw functions, 例如，存储events到database 的route

```
```

每个method都可以有多个handlers, 序列执行，跟app.js 里定义的mw functions 有一样的格式。例如， validateKey 和validateCollection 都是async functions 去校验incoming request 如果提供的event collection 不存在或者API key 不合法就返回404 或者401

```
const validateCollection = async (ctx, next) => {
  const { collection } = ctx.params;
  if (!(collection in ctx.state.collections)) {
    return ctx.throw(404);
  }
  await next();
}

const validateKey = async (ctx, next) => {
  const { authorization } = ctx.request.headers;
  if (authorization !== ctx.state.authorizationHeader) {
    return ctx.throw(401);
  }
  await next();
}

```

注意，arrow mw 无法通过this 拿到当前request 的context(this 通常是undefined).因此，request and response 对象还有一些Koa的helpers 都通过 提供的ctx参数获得。在Koa1 中没有分离出来的context obj，this 就代表了当前请求的上下文。

定义好其他的API methods ,最后导出API 供app.js 使用

## Persistence Layer

https://www.smashingmagazine.com/2016/08/getting-started-koa-2-async-functions/







