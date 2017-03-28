---
layout: post
title: web socket
date: 2017-03-006
categories: translation
---
## Writing WebSocket client applications

websockets 是一项建立在ws协议上的技术，它可以在client server上建立全双工的持续通信stream. 一个典型的websocket client是用户的浏览器，但是协议是与平台相关的。

## Creating a WebSocket object

为了能使用websocket 协议来通讯，需要先创建一个websocket对象，它会自动尝试去打开与server的连接。

```
WebSocket WebSocket(
	in DOMString url,
	in optional DOMString protocols
)
```

**url**

连接的server url

**protocols 可选** 

一个或一组protocols strings. 多个strings 用来说明子协议，为了一个server可以支持多个websocket sub-protocols

构造函数可能会抛出exceptions
**SECURITY_ERR**
port 被block 掉

## Connection errors
如果尝试连接时一个error抛出，首先一个‘error’ 事件会被发送到Websocket 对象（同时出发它的onerror handler）,然后CloseEvent会发送给websocket obj(并触发onclose handler) 去说明connection close 的reason

## examples

```
var exapleSocket = new WebSocket("ws://www.example.com/socketserver", "protocolOne");
```
在返回的时候，exampleSocket.readyState 值是CONNECTING. readyState 会变成OPEN一旦connection就绪能够transfer data
如果想灵活的支持多个协议，可以这样

```
var exampleSocket = new WebSocket("ws://www.example.com/socketserver", ["protocolOne", "protocolTwo"]);
```

一旦connection建立了（readySstate == OPEN)， exampleSocket.protocol 就会告诉server 选择的是哪个protocol

? In the above examples ws has replaced http, similarly wss replaces https. Establishing a WebSocket relies on the HTTP Upgrade mechanism, so the request for the protocol upgrade is implicit when we address the HTTP server as ws://www.example.com or wss://www.example.com.

## Sending data to the server

一旦connection opened, 就可以传data给server了。用WebSocket.send()

```
exampleSocket.send("Here 's some text that the server is urgently, awaiting!");

```
可以发string, Blob ArrayBuffer

由于建立connection是个异步过程，而且有可能会失败，也就是说在new完websocket之后调用send 不能保证会成功，所以我们至少需要在onopen的handler中调用send

```
exampleSocket.onopen = function (event) {
	exampleSocket.send('hahah');
}
```
## Using JSON to transmit objects

一种好用的方法就是使用JSON 来发送复杂的数据给server, 下面是一个chat server的例子

```
function sendText () {
	var msg = {
		type: "message",
		text: docuemnt.getElementById("text").value,
		id: clientID,
		date: Date.now()
	};
	
	examleSocket.send(JSON.stringify(msg));
	
	document.getElementById("text").value = "";
}
```

## Receiving messages from the server

websocket 是一个event-driven API;当message 被接受， 一个“message” 事件会被传送到onmessage function， 为了监听incoming data 可以这样写

```
exampleSocket.onmessage = function (event) {
	console.log(event.data);
}
```

## Closing the connection

当要关闭websocket 连接时，使用close()

```
exampleSocket.close()
```

在关闭之前去检验一下socket 的bufferAmount 属性是很有用的，防止有data 仍然在传输







