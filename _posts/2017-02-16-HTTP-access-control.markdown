---
layout: post
title: HTTP access control 
date: 2017-02-012
categories: translation
---
https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
## HTTP access control(CORS)

当一个资源去请求另一个跟它在不同domain的资源的时候会产生一个 **cross-origin HTTP**. 例如，一个在 http://domain-a.com域名下的页面请求了一个在 http://domain-b.com/image.jpg 下的img src. 今天互联网上会有许多需要去加载不同domain 资源的场景。
由于安全原因，浏览器会限制脚本发起的 cross-origin HTTP请求。例如 XMLHttpRequest Fetch 都需要遵循同源策略。
cors 机制给了web servers 跨域控制的能力，这可以支持安全的跨域数据交换。现代浏览器在API container 像XMLHttpRequest Fetch 中使用cors

## overview

cors 通过添加新的HTTP headers 来允许server 描述被允许读取信息的origins。另外，对于可能会引起side-effect 的HTTP request (POST), 浏览器应该预先发送一个 与请求（OPTIONS）去询问所支持的方法。然后，经过server 允许之后，发送实际的HTTP request 方法。server 也可以通知客户端是否要发送credentials(包括 Cookies 和 HTTP Authentication data)

## Example

我们呈现三种场景来说明cors 。所有例子都使用 XMLHttpRequest 
[栗子🌰](http://arunranga.com/examples/access-control/)
一篇从server 角度来讨论 cors 的文章 [ Server-Side Access Control (CORS) article](https://developer.mozilla.org/en-US/docs/Web/HTTP/Server-Side_Access_Control)

## simple request

一些请求不会触发 cors 预请求。这些请求叫做 simple request.以下是简单请求的条件

The only allowed methods are:

* GET
* HEAD
* POST
Apart from the headers set automatically by the user agent (for example, Connection, User-Agent, or any of the other headers with names defined in the Fetch spec as a “forbidden header name”), the only headers which are allowed to be manually set are those which the Fetch spec defines as being a “CORS-safelisted request-header”, which are:
* Accept
* Accept-Language
* Content-Language
* Content-Type (but note the additional requirements below)
* DPR
* Downlink
* Save-Data
* Viewport-Width
* Width
The only allowed values for the Content-Type header are:
* application/x-www-form-urlencoded
* multipart/form-data
* text/plain 

假设在domain http://foo.example 上的内容想要触发 domain http://bar.other 上的内容。domain foo 上的code 应该这样

```
var invocation = new XMLHttpRequest();
var url = 'http://bar.other/resources/public-data/';
   
function callOtherDomain() {
  if(invocation) {    
    invocation.open('GET', url, true);
    invocation.onreadystatechange = handler;
    invocation.send(); 
  }
}
```
以下是browser send 和server respond

```
GET /resources/public-data/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Referer: http://foo.example/examples/access-control/simpleXSInvocation.html
Origin: http://foo.example


HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 00:23:53 GMT
Server: Apache/2.0.61 
Access-Control-Allow-Origin: *
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: application/xml

[XML Data]
```
L1 ~ 10 是发送的headers.需要注意的是L10 的Origin header, 说明了请求的触发来自http://foo.example domain。
L13 ~22 显示了domain http://bar.other 的HTTP response。在返回中， server 反悔了一个Access-Control-Allow-Origin header, 以上关于Origin 和Access -Control-Allow-Origin(ACAO) 是最基本的使用方法。
request 中Origin header 中的value应该被 ACAO中 value包含

## Preglighted requests (预请求)

不像上面讨论的simple case， preflighted requests 首先会通过 OPTIONS 方法发送一个HTTP request，为了探测实际的request是否安全。cross-site requests 就是预请求因为他们可能会对user data产生影响，一个请求只要满足以下一条就是预请求

* 请求使用的方法除了下面几个
 - GET
 - HEAD
 - POST
 
* If, apart from the headers set automatically by the user agent (for example, Connection, User-Agent, or any of the other header with a name defined in the Fetch spec as a “forbidden header name”), the request includes any headers other than those which the Fetch spec defines as being a “CORS-safelisted request-header”, which are the following:
Accept
Accept-Language
Content-Language
Content-Type (but note the additional requirements below)
DPR
Downlink
Save-Data
Viewport-Width
Width
If the Content-Type header has a value other than the following:
application/x-www-form-urlencoded
multipart/form-data
text/plain

下面这个是一个Preflighted request;

```
var invocation = new XMLHttpRequest();
var url = 'http://bar.other/resources/post-here/';
var body = '<?xml version="1.0"?><person><name>Arun</name></person>';

function callOtherDomain () {
	if (invocation) {
		invocation.open('POST', url, true);
		invocation.setRequestHeader('X-PINGOTHER', 'pingpong');
		invocation.setRequestHeader('Content-Type', 'application/xml');
		invocation.onreadystatechange = handler;
		invocation.send(body);
	}
}
```

在上面的例子中，L3 创建了一个XML body，L8用POST 方法发送它。L9， 一个定制的HTTP request header 被设置（X-PINGOTHER: pingpong）. 这样的headers不是 HTTP/1.1协议，但是对web app是很有用的。**因为request使用了application/xml 的Content-Type，因为设置了一个定制的header,所以request 是preflighted**

下面是client 和 server 之间完整的交换过程。第一个交换是preflight request/response.

```
OPTIONS /resources/post-here/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Origin: http://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type


HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
一旦preflight request 完成了， 真实的request 就会被发送

```
POST /resources/post-here/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
X-PINGOTHER: pingpong
Content-Type: text/xml; charset=UTF-8
Referer: http://foo.example/examples/preflightInvocation.html
Content-Length: 55
Origin: http://foo.example
Pragma: no-cache
Cache-Control: no-cache

<?xml version="1.0"?><person><name>Arun</name></person>


HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:40 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://foo.example
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 235
Keep-Alive: timeout=2, max=99
Connection: Keep-Alive
Content-Type: text/plain

[Some GZIP'd payload]
```

L1~12 代表了用OPTIONS 方法发起的preflight request. browser 根据上面code 表示的 request 的参数决定要不要发preflight ，server可以回应该实际request 是否会被接收。OPTIONS 是一HTTP/1.1 的方法用来决定进一步信息从server, 是一个safe method ，不会修改resource, 注意跟OPTIONS request 一起发送的还有两个请求头

```
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

Access-Control-Request-Method header作为preflight request 的一部分通知server接下来要发送的实际request 是什么method的。
Access-Control-Request-Headers headers 通知server 当实际request 发送时，它会发送一个 X-PINGOTHER和Content-Type 自定制headers. server此时有一个机会去决定是否接收当前条件下的request.
上面的 L14 ~ 26 是server 返回的response表明request method(POST)和request headers(X-PINGOTHER)是可以接受的，特别注意下，L17 ~ 20

```
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
```
server返回Access-Control-Allow-Method header 然后说 POST GET OPTIONS 都是有望成功查询的方法。

server 也会返回Access-Control-Allow-Headers : "X-PINGOTHER, Content-Type"这样的header, 证明这些自定义头在真实请求中是被允许的。逗号分隔开不同头。
最后， Access-Content-Max-Age 给出了响应 preflight 请求的response能够被缓存的时间（秒为单位），86400 是24小时。注意，每个浏览器都有max internal value 会优先，当Acess-Control-Max-ge 更大的时候。 

## preflighted requests and redirects


## Requests with credentials

XMLHttpRequest (或者是Fetch) 和CORS 最有意思的地方在于可以产生意识到HTTP cookies 和HTTP Authentication 信息的 “credentialed” requests。默认的， 在跨域XMLHttpRequest (Fetch) 触发时，browser不会发送 credentials.一个指定的标记会被发送当XMLHttpRequest 或者是Request 构造函数被触发的时候。
在这个例子中，从 http://foo.example 加载的内容发起了一个带cookies 的 simple GET request 向http://bar.other 。foo.example上面的js内容像下面这样：

```
var invocation = new XMLHttpRequest();
var url = 'http://bar.other/resources/credentialed-content/';
    
function callOtherDomain(){
  if(invocation) {
    invocation.open('GET', url, true);
    invocation.withCredentials = true;
    invocation.onreadystatechange = handler;
    invocation.send(); 
  }
}
```

? L7 显示了XMLHttpRequest 上的为了触发时带上cookie 必须设置的标记withCredentials .默认的，触发时是不带cookie的，因为这是一个GET request 不是预请求，但是browser 可能会拒绝一切没有Access-Control-Allow-Credentials： true的resposne, 返回的response就不能变成web content
下面是一个client server交换的例子

```
GET /resources/access-control-with-credentials/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3pre) Gecko/20081130 Minefield/3.1b3pre
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Connection: keep-alive
Referer: http://foo.example/examples/credential.html
Origin: http://foo.example
Cookie: pageAccess=2


HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:34:52 GMT
Server: Apache/2.0.61 (Unix) PHP/4.4.7 mod_ssl/2.0.61 OpenSSL/0.9.7e mod_fastcgi/2.4.2 DAV/2 SVN/1.4.2
X-Powered-By: PHP/5.2.6
Access-Control-Allow-Origin: http://foo.example
Access-Control-Allow-Credentials: true
Cache-Control: no-cache
Pragma: no-cache
Set-Cookie: pageAccess=3; expires=Wed, 31-Dec-2008 01:34:53 GMT
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 106
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain


[text/plain payload]
```

尽管L11 包含了要发往http://bar.other domain 的cookie, 但是如果bar.other 给出的返回没有带Access-Control-Allow-Credentials: true的话，response 就会被忽略，web content 就没有内容

## Credentialed requests and wildcards

当对一个credentialed request 返回响应时，server 一定要指定 Access-Control-Allow-Origin 里面的value， 而不能用通配符*
注意 response里面的 Set-cookie header 会set  a further cookie? 在failure 的情况下，异常（取决于所用API）就应该被抛出

## The HTTP response headers

这一部分列出了server 对于access control requests 返回的 HTTP response headers.前一部分只是给出了一个overview

## Access-Control-Allow-Origin

一个返回的resource 可能会有一个 ACAO header, origin 参数指定了request可以 access的URI。

## Access-Control-Expose-Headers

ACEH header可以让server把白名单暴露出来？
例如

```
Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header
```

上面例子允许 X-My-Custom-Header, X-Another-Custom-Header headers 可以暴露给浏览器

## Access-Control-Max-Age

ACMA header 指定了一个preflight request 可以被缓存多长时间（seconds）

## Access-Control-Allow-Credentials







