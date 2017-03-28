---
layout: post
title: table pivot
date: 2017-02-016
categories: translation
---
## 表格转置总结

## 功能场景

## 实现方式

## Aggregators

**pivot() : aggregator parameter**

pivot()的aggregator参数定义了table中cell 的最终内容。它应该是pivot 表格中每个cell都会调用的一个function，这个function 会返回带有如下keys的obj.

* push: 处理每一条record 的function， 每条record 会调用一次
* value: 返回cell 存储value的function
* format（function）： 输入value， 返回格式化的string
* numInputs: (略，for UI)

Aggregator function 接收3 个参数： 一个PivotData 对象， 一个rowKey, 一个colKey


## The PivotData object

PivotData obj ,传入renderer function, 是PivotTable.js 的数据模型。它本质上包裹了a tree of aggregator objs and 提供了一些accessors 能够list all the rowKey and colKey in the tree, 还有一些其他有用的信息。

* getAggregator(rowKey, colKey): 返回tree上当前节点（由rowKey, colKey确定）的aggregator object.任意一个参数或者两个都传入空数组[] 将会返回一个total aggregator; rowTotal 通过在colKey 传入[]； colTotal 通过在rowKey闯入 []， overrall 两个都传入 [].
* getColKeys(),getRowKeys():产生row和col的 Keys 用于传入上面的getAggregator() 方法。这些values 是从underlying data set 提取出来的attribute-values(通过对象提取？)所以这些方法返回字符串的二维数组。
* colVars, rowVars: 这些是从underlying data set提取出的属性名的数组定义了PivotData 的结构，例如，传入pivot（）方法的options.cols options.rows
* forEachMatchingRecord(criteria, callback):







 
