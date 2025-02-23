---
title: （四）Cocos Creator 框架封装之窗口管理器
date: 2025-02-22
updated: 2025-02-22
categories: 游戏框架封装实战
tags:
  - 游戏开发
  - 框架封装
  - 实战
---

# Cocos Creator 框架封装之窗口管理器

## 一、前言
在游戏开发中，窗口管理器是一个非常重要的模块，它负责管理游戏中的各种窗口（如菜单、弹窗框等）和页面场景。本文将介绍如何在 Cocos Creator 中封装一个窗口管理器，并结合项目中的代码进行详细讲解。

## 二、核心功能设计
#### 1. **单例模式管理** 

  全局唯一实例控制所有窗口生命周期：

  在 `Singleton.ts` 文件中，我们封装了一个单例模式的基类。单例模式确保一个类只有一个实例，并提供一个全局访问点。

  接下来，我们在 `WinManager.ts` 文件中实现窗口管理器。窗口管理器继承自 Singleton 基类。

#### 2. **层级控制**  
  窗口层级管理：
  窗口管理器通过设置容器节点来管理窗口的层级关系。
  窗口管理器提供了 `setContainer` 方法，用于设置容器节点。
  WIN_TYPE 枚举定义了窗口的类型，包括页面和弹窗。(后续可以扩展)
  ```typescript
  enum WIN_TYPE {
    PAGE
    POPUP
  }
  ```
  WIN_CONFIG 枚举定义了窗口的配置信息，包括窗口类型、路径。
  如果是页面类型，窗口管理器会清空容器中的所有子节点，然后加载窗口的预制体，并将其添加到容器中。
  如果是弹窗类型，窗口管理器会直接加载窗口的预制体，并将其添加到容器中。后添加的弹窗会显示在该容器最上层。

  如需更复杂的层级管理场景，可以定义多级UI容器（参考oops-framework的层级设计）

## 三、核心实现步骤
#### 1. **窗口基类封装**
```typescript
export class WinManager extends Singleton {
  private container: Node = null;

    setContainer(container: Node) {
        this.container = container;
    }
    open(win: WIN_CONFIG, cb = null) {
    }
}
```
#### 2. **动态加载**

缓存窗口节点，如果已经打开了窗口节点，直接移到最上层，避免重复加载

结合ResourceManager实现资源加载

```typescript
private winMap: Map<string, Node> = new Map();
open(win: WIN_CONFIG, cb = null) {
    if (win.type === WIN_TYPE.PAGE) {
        this.container.removeAllChildren();
        this.winMap.clear();
    }
    if (this.winMap.has(win.layerPath)) {
        // 判断当前窗口是否在最上层
        const index = this.container.children.findIndex((node) => node === this.winMap.get(win.layerPath));
        if (index !== this.container.children.length - 1) {
            this.winMap.get(win.layerPath).setSiblingIndex(this.container.children.length - 1);
        }
        return;
    }
    ResourceManager.Instance().loadRes(win.layerPath, Prefab, 'bundles').then((prefab: Prefab) => {
        let winNode = instantiate(prefab);
        cb && cb(winNode);
        this.container.addChild(winNode);
        winNode.addComponent(GlobalButtonEffect);
    });
}
```


## 四、使用示例
在入口文件初始化时，我们可以设置窗口管理器的容器，并打开一个页面。

```typescript
WinManager.Instance().setContainer(container);
WinManager.Instance().open(WIN_CONFIG.HOME);
```

## 五、总结
通过以上步骤，我们实现了一个简单的窗口管理器。窗口管理器通过单例模式确保只有一个实例，并提供了设置容器和打开窗口的方法。后续还可以根据自己使用场景扩展其他功能。