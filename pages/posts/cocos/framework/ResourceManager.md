---
title: （二）Cocos Creator 框架封装之资源管理器教程
date: 2025-02-20
updated: 2025-02-20
categories: 游戏框架封装实战
tags:
  - 游戏开发
  - 框架封装
  - 实战
---

### Cocos Creator 框架封装之资源管理器教程

在使用Cocos Creator进行游戏开发时，资源管理是一个至关重要的环节。有效的资源管理不仅可以提高游戏的加载速度，还能优化内存使用，提升整体的游戏性能。本文将介绍如何封装一个资源管理器（ResourceManager），以便于更高效地管理和加载游戏资源。


#### 创建ResourceManager类

首先，我们创建一个`ResourceManager`类，该类将继承自一个单例模式的基础类`Singleton`。单例模式确保我们的资源管理器在整个应用程序生命周期中只有一个实例，这有助于全局访问和管理资源。

```typescript

export class ResourceManager extends Singleton {
    // 省略类定义...
}
```

#### 定义属性

在`ResourceManager`类中，我们定义两个私有属性：

- `_bundles`: 用于存储已加载的资源包（Bundle）。
- `_cache`: 用于缓存已加载的资源，避免重复加载。

```typescript
private _bundles: Map<string, AssetManager.Bundle> = new Map();
private _cache: Map<string, Asset> = new Map();
```

#### 加载资源

`loadRes`方法用于加载单个资源。它接受三个参数：资源的路径`path`、资源的类型`type`，以及资源所属的包名`bundleName`。如果资源已经存在于缓存中，则直接返回缓存的资源；否则，从指定的包或默认资源包中加载资源，并将其缓存。

```typescript
public async loadRes<T extends Asset>(
    path: string, 
    type?: typeof Asset,
    bundleName?: string
): Promise<T | null> {
    if (this._cache.has(path)) {
        return this._cache.get(path) as T;
    }
    const bundle = this.getBundle(bundleName) || resources;
    try {
        const asset = await new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (err: Error, res: T) => {
                err ? reject(err) : resolve(res);
            });
        });
        this._cache.set(path, asset);
        return asset;
    } catch (error) {
        console.error(`[ResourceManager] 加载资源失败: ${path}`, error);
        return null;
    }
}
```


#### 加载分包

`loadBundle`方法用于加载指定的资源包。如果资源包已经加载，则直接返回`true`；否则，从`assetManager`加载资源包，并将其存储在`_bundles`映射中。

```typescript
public async loadBundle(bundleName: string): Promise<boolean> {
    if (this._bundles.has(bundleName)) return true;
    
    try {
        const bundle = await new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(bundleName, (err, bundle) => {
                err ? reject(err) : resolve(bundle);
            });
        });
        console.log('Bundle加载成功:', bundleName);
        this._bundles.set(bundleName, bundle);
        return true;
    } catch (error) {
        console.error(`Bundle加载失败: ${bundleName}`, error);
        return false;
    }
}
```

#### 释放分包

`releaseBundle`方法用于释放指定的资源包。如果资源包存在，则调用其`releaseAll`方法释放所有资源，并从`_bundles`映射中删除该资源包。

```typescript
public releaseBundle(bundleName: string) {
    if (this._bundles.has(bundleName)) {
        const bundle = this._bundles.get(bundleName);
        bundle?.releaseAll();
        this._bundles.delete(bundleName);
    }
}
```

#### 使用示例

现在，你可以在你的游戏代码中使用`ResourceManager`来加载和管理资源。例如：

```typescript
const resourceManager = ResourceManager.Instance();

// 加载单个资源
resourceManager.loadRes('textures/my_texture', Asset).then(texture => {
    if (texture) {
        // 使用纹理资源
    }
});

// 加载资源包
resourceManager.loadBundle('my_bundle').then(success => {
    if (success) {
        // 加载包中的资源
        resourceManager.loadRes('my_asset', Asset, 'my_bundle').then(asset => {
            // 使用资源
        });
    }
});

// 释放资源包
resourceManager.releaseBundle('my_bundle');
```

#### 总结

通过封装`ResourceManager`类，我们可以更方便地管理和加载Cocos Creator中的资源。这个资源管理器不仅提供了缓存机制以避免重复加载，还允许我们加载和释放资源包，从而优化内存使用和提高加载速度。希望这篇教程能帮助你在Cocos Creator项目中更好地管理资源。
