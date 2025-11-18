---
title: Cocos Creator 3.8 实现指定Node节点截图功能教程
date: 2025-11-18
updated: 2025-11-18
categories: 实战案例
tags:
  - 游戏开发
  - 实战
  - 案例
---

# Cocos Creator 3.8 实现指定Node节点截图功能教程

## 一、前言
在游戏开发中，截图功能是一项常见且实用的需求，它可以用于生成分享图片、保存游戏成就或创建预览图等。本教程将详细介绍如何在 Cocos Creator 3.8 中实现指定 Node 节点的截图功能，并将结果渲染到 Sprite 上。

---

## 二、功能实现原理

截图功能的核心原理是利用 Cocos Creator 的 Camera 组件和 RenderTexture（渲染纹理）。Camera 会将指定节点的内容渲染到 RenderTexture 上，然后我们可以从 RenderTexture 中读取像素数据，最终将其转换为图片或显示在 UI 上

### 关键组件：
- **Camera**：负责捕获节点视觉内容
- **RenderTexture**：作为渲染目标，存储图像数据
- **SpriteFrame**：将渲染纹理转换为可显示的精灵帧

---

## 三、场景配置步骤

### 1. 配置目标节点
- 将需要截图的节点连接到脚本的targetNode属性
- 自定义一个`capture`layer, 并将目标节点的layer设置为`capture`，同时主相机的`Visibility`也需要添加该layer
- 确保节点在相机范围内可见
- 
![](https://cdn.stacklodge.com/cocos/node2image1.png)
### 2. 设置预览节点：
- 创建一个UI节点并添加Sprite组件
- 将这个节点连接到脚本的previewNode属性

### 3. 创建截图专用相机：
- 在目标节点中添加一个新Camera节点，创建到目标节点可以保证节点移动的时候相机会跟随移动
- 调整相机位置和参数，使其能完整看到目标节点
- 将相机组件的Target Texture属性留空（代码中动态设置）
- 并将相机组件的`Visibility`设置为`capture`这一个，保证最终截图的只显示想要的内容


### 节点截图预览
![](https://cdn.stacklodge.com/cocos/node2image2.png)

### 相机参数截图预览
![](https://cdn.stacklodge.com/cocos/node2image3.png)
---

## 四、核心代码
![](https://cdn.stacklodge.com/cocos/node2image4.png)

### 需要注意的问题
1. **图像缩放问题**
   - 最终的宽高计算需要注意缩放的问题
1. **截图空白或不全的问题**
   - 相机的orthoHeight 设置为高度的一半(截图代码写的是宽度一半只有正方形的才不会有问题，已更正)

## 五、注意事项与优化建议


1. **图像翻转问题**
   - Cocos Creator渲染的图像数据是倒置的，需要通过代码手动翻转

2. **渲染时机**
   - 使用scheduleOnce延迟读取像素数据，确保渲染完成后再进行读取操作
---
