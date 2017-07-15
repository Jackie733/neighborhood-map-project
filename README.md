# 街区地图项目

### 项目介绍

该项目要求开发一个单一的地图页面应用程序，其特点是显示附近景点及其相关介绍，具有以下功能：

- 地图标记，显示热门景点
- 搜索功能，快速定位目的地
- 景点列表
- ​第三方API，提供每个景点的维基百科

### 使用指南

- 该项目显示北京部分景点（用到Google地图API）

  - 主界面显示北京市地图
  - 右上角选择框勾选则弹出搜索过滤窗口，取消勾选则隐藏窗口

- 通过在搜索框输入景点中文名称可以过滤出某一个景点以供选择
- 点击景点列表或者标记会弹出相应景点的信息窗口，显示维基连接（wiki API），点击会跳转到该景点维基百科界面


  ​

###  框架、库、API

本项目用到了以下框架和库：

- Knockout:[点击下载](http://knockoutjs.com/downloads/index.html)
- Bootstrap:[点击下载](http://getbootstrap.com/2.3.2/)
- jQuery:[点击下载](https://jquery.com/)
- Google Map API:[了解更多](https://developers.google.com/maps/)
- Wiki API:[了解更多](https://www.mediawiki.org/wiki/API:Main_page)