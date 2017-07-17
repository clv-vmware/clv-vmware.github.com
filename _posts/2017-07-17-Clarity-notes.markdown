---
layout: post
title: Clarity Notes
date: 2017-07-17
categories: ANGULAR2 
---
## Clarity Notes

### Datagrid
Datagrids 用来组织用户需要scan, compare, 施加操作的大量数据。
我们提供了17 个demo ,每一个都展示了dg 的一个feature.

**Basic structure**

使用dg 你不需要向每个item传入data或者配置。像angular 其他组件一样使用 `*ngFor` 或者 `*clrDgItems` 在row上，创建一个table 骨架.

**Usage**

 * 适用于结构化内容，也就是说array of 。。。，对于混合text images data visualizations 的mixed formatting, 我们推荐card component.
 * 适用于大量data.对于 < 20 条数据的visualization 我们推荐table component.

 **Binding model properties to columns**
 