---
title: （六）Cocos Creator 框架封装之加载场景
date: 2025-02-24
updated: 2025-02-24
categories: 游戏框架封装实战
tags:
  - 游戏开发
  - 框架封装
  - 实战
---

### **Cocos Creator 框架封装之加载场景**

在 Cocos Creator 3.8 游戏开发中，**Loading 启动页** 是游戏进入主菜单或主场景前的重要环节。它通常用于：
- **预加载资源**（如纹理、音频、预制体等），确保后续场景的流畅运行。
- **显示进度条**，提升用户体验，避免黑屏等待。
- **初始化游戏逻辑**，如加载配置文件、网络请求、SDK 初始化等。

本教程将封装一个 **Loading**，统一管理 Loading 逻辑，使游戏启动更加流畅和可扩展。

---

## **1. 设计目标**
1. **支持资源预加载**：在进入主场景前预加载关键资源，提高加载效率。
2. **可视化加载进度**：支持 UI 显示加载进度（进度条、百分比等）。
3. **支持异步初始化任务**：如 SDK 登录、网络请求、游戏配置加载等。

---

## **2. 设计思路**
1. **封装 `Loading.ts`**，加载逻辑。
2. **创建 `LoadingScene`**，包含进度 UI 和动画效果。
3. **结合 `loadScene`**，在加载完成后切换到主场景。

---

## **3. 代码实现**

### **3.1 创建 `Loading.ts`**
在Loading场景启动时，加载所有需要加载的资源并进入主场景。
```typescript
const bundles = ['resources', 'bundles'];
Promise.all(bundles.map(bundleName => ResourceManager.Instance().loadBundle(bundleName))).then(() => {
    console.log('加载完成');
    director.loadScene('Main');
})
```

---

### **3.2 创建 `LoadingScene`**
在 `scenes` 目录下创建 `LoadingScene`，包含：
- **背景** (`Sprite`)
- **进度条** (`ProgressBar`)
- **进度文本** (`Label`)

在 `Loading.ts` 中编写 UI 控制逻辑：

在场景的 `updateProgress` 方法里更新进度条
```typescript
this.progressBar.progress = Math.min(progress, 1);
```

---


## **4. 添加 Loading 过渡动画**

为了提升 Loading 页的视觉体验，可以添加 **Loading 动画**，例如：
- **Loading 图标旋转**
- **背景渐变**
- **进度条动画**

---

## **5. 总结**
本教程封装了 **Loading 启动页**，实现：
- 资源加载逻辑。
- 提供进度 UI。
- 自动加载游戏场景。

通过这些优化，我们可以提高游戏加载速度，提升用户体验！ 🚀