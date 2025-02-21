---
title: （一）Cocos Creator 框架封装之单例模式
date: 2025-02-19
updated: 2025-02-19
categories: 游戏框架封装实战
tags:
  - 游戏开发
  - 框架封装
  - 实战
# top: 1
---

### Cocos Creator 框架封装之单例模式

在 Cocos Creator 中，单例模式的主要目的是确保在整个应用程序生命周期中某个类的实例只有一个，并提供全局访问点。使用单例模式时，尤其是在切换场景的情况下，需要注意单例对象的生命周期管理和作用范围。

### 单例模式在实战场景中的使用
当切换场景时，Cocos Creator 会销毁当前场景的所有节点并加载新场景。由于单例通常不应随场景销毁而销毁，所以单例实例的数据应该跨场景保持持久性。为此，单例模式的脚本不应该直接挂载到某个具体场景中的节点，而是应该存放在代码逻辑中，或者将它与一个“全局”节点关联。

### 单例的脚本放置和使用
单例脚本的两种常见放置方式：

#### 1. **不依赖节点的单例类（推荐）**
   如果你的单例类只是管理数据或逻辑，而不需要与场景中的节点关联，那么你可以将其放在 `scripts` 文件夹中，作为一个独立的逻辑类使用，不与任何节点绑定。


```typescript
// Singleton.ts
export default class Singleton{
    static Instance<T extends {}>(this: new () => T): T {
        if(!(<any>this).instance){
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }
}
```

```typescript
// ResourceManager.ts
export default class ResourceManager extends Singleton {

    // 示例方法
    public loadResource(path: string, onComplete: (resource: any) => void): void {
        // 资源加载逻辑...
    }
}
```

   **使用方法：**  
   无论在哪个场景中，只需通过 `ResourceManager.Instance()` 获取实例，而不必担心场景切换导致单例失效。

```typescript
const resourceManager = ResourceManager.Instance();
resourceManager.loadResource('images/sprite', (resource) => {
    console.log('资源加载成功', resource);
});
```

   这种方式的优势在于，单例完全独立于场景和节点，场景切换时也不会影响单例的存在和数据。

#### 2. **挂载在常驻节点的单例类**
   如果你的单例管理类需要与场景中的一些节点进行交互（如管理 UI 或者音效），可以将其挂载到一个“常驻节点”上，并设置该节点在场景切换时不被销毁。

   **步骤如下：**

1. **创建常驻节点**  
在场景中创建一个全局的空节点，命名为“GlobalNode”或其他名字。
2. **设置常驻节点**  
在脚本中设置该节点为常驻节点，使其不会在场景切换时被销毁。

```typescript
// GlobalManager.ts
const { ccclass, property } = _decorator;

@ccclass('GlobalManager')
export class GlobalManager extends Component {
    private static instance: GlobalManager;

    onLoad() {
        // 保持该节点在场景切换时不被销毁
        if (GlobalManager.instance === undefined) {
            GlobalManager.instance = this;
            director.addPersistRootNode(this.node);
        } else {
            this.node.destroy(); // 如果已有实例，则销毁该节点
        }
    }

    // 获取实例
    public static getInstance(): GlobalManager {
        return GlobalManager.instance;
    }

    // 其他逻辑
    public someGlobalLogic() {
        console.log('执行全局逻辑');
    }
}
```

3. **挂载脚本到 GlobalNode**  
将 `GlobalManager` 脚本挂载到“GlobalNode”节点，并确保该节点在初始场景中已经存在。
4. **使用全局节点的单例**  
之后，场景切换时，`GlobalNode` 会继续存在，可以在不同场景中通过 `GlobalManager.getInstance()` 访问。

```typescript
// 在不同的脚本中使用
GlobalManager.getInstance().someGlobalLogic();
```

   这种方法适用于需要和游戏中的节点（如 UI、音效）紧密交互的全局管理类。

---

### 常见问题
1. **为什么要使用单例模式？**
    - **全局访问**：单例类可以提供全局唯一的实例，方便在不同的场景或脚本中访问。例如，管理音效、资源、游戏状态等。
    - **资源共享**：多个场景或组件共享某个类的状态时，使用单例避免数据重复和不一致。
    - **性能优化**：避免反复创建对象实例，减少内存开销。
2. **如何避免单例在场景切换时被销毁？**
    - **不依赖场景**：单例类设计为与场景无关的纯逻辑类。
    - **常驻节点**：通过 `director.addPersistRootNode()` 保证节点在场景切换时不被销毁。

---

### 总结
+ **不依赖节点的单例类** 是一种更加通用且灵活的实现方式，适用于逻辑层面的管理。
+ **常驻节点单例类** 则适用于需要与场景中的节点交互时使用。
+ 无论哪种方式，单例模式都能帮助你管理跨场景的全局数据和逻辑，确保资源和状态的一致性。

根据游戏需求选择合适的单例实现方式，有助于提高游戏的性能和代码结构的清晰度。

