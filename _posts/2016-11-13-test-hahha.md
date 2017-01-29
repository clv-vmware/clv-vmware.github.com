---
layout: post
title: jekyll posts trans
date: 2017-01-29
categories: translation
---

Writing posts

jekyll 一个最好的地方就是blog aware. 简单地说，blogging已经集成进jekyll的功能里。如果你想写文章发布文章，你只需要维护一个本地文件夹就ok。相比于配置使用CMS，这是非常友好的。

The Posts Folder

blog 文章存放在 _posts 文件夹。通常这些文件是Markdown 或者是THML，也可以是其他格式转换过来的。所有的posts 一定要遵循YAML front matter,这样它们就能被正确转换为你静态网站中的 HTML page。

Creating Post Files

创建一个新post, 只需要在_posts folder 下创建一个file. file命名是很关键的。jekyll要求以以下格式命名：

YEAR-MONTH-DAY-title.MARKUP