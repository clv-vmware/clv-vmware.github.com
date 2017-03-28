---
layout: post
title: HTML sections and outlines
date: 2017-02-01
categories: translation
---

## using HTML sections and outlines

HTML5定义了一些新的语义化的标签用来描述页面结构。
## Structure of a document in HTML 4
document的结构， 例如<body>标签之间的语义化结构， 是呈献给用户页面的基础。HTML4使用document 的sections 和sub-sections来描述结构。一个section使用带heading的(<div>)元素来描述.这些元素之间的关系导致了页面的strcture 和outline
## problems solved by HTML5

HTML4 定义的document structure和outline 是比较rough的，导致以下问题：

1. Usage of <div> for defining semantic sections, without defining specific values for the class attributes makes the automation of the outlining algorithm impossible ("Is that <div> part of the outline of the page, defining a section or a subsection?" Or "is it only a presentational <div>, only used for styling?"). In other terms, the HTML4 spec is very imprecise on what is a section and how its scope is defined. Automatic generation of outlines is important, especially for assistive technology, that are likely to adapt the way they present information to the users according to the structure of the document. HTML5 removes the need for <div> elements from the outlining algorithm by introducing a new element, <section>, the HTML Section Element.
2. Merging several documents is hard: inclusion of a sub-document in a main document means changing the level of the HTML Headings Element so that the outline is kept. This is solved in HTML5 as the newly introduced sectioning elements (<article>, <section>, <nav> and <aside>) are always subsections of their nearest ancestor section, regardless of what sections are created by internal headings.
3. In HTML4, every section is part of the document outline. But documents are often not that linear. A document can have special sections containing information that is not part of, though it is related to, the main flow, like an advertisement block or an explanation box. HTML5 introduces the <aside> element allowing such sections to not be part of the main outline.
4. Again, in HTML4, because every section is part of the document outline, there is no way to have sections containing information related not to the document but to the whole site, like logos, menus, table of contents, or copyright information and legal notices. For that purpose, HTML5 introduces three new elements: <nav> for collections of links, such as a table of contents, <footer> and <header> for site-related information. Note that <header> and <footer> are not sectioning content like <section>, rather, they exist to semantically mark up parts of a section.

## The HTML5 outline algorithm

让我们考虑一下HTML 处理section outlines的算法
## Defining sections
所有的<body> 元素之间的内容都是section的一部分，sections 在HTML5中是可以嵌套的.section可以使隐式的或者显式的。显式的section 是被<body> <section> <article> <aside> <nav> 这些元素包裹的。

## defining headings

虽然HTML Sectioning elems定义了document的结构，但是outline 仍然需要headings.基本rule是这样的：第一个HTML heading ele（h1 ~ h6 中的任意一个）定义了当前section的heading
 
