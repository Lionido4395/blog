---
title: （五）Cocos Creator 框架封装之事件管理器
date: 2025-02-23
updated: 2025-02-23
categories: 游戏框架封装实战
tags:
  - 游戏开发
  - 框架封装
  - 实战
---

### Cocos Creator 框架封装之事件管理器
在游戏开发中，事件驱动架构能够帮助我们实现**松耦合**的逻辑，使不同模块之间的通信更加灵活。Cocos Creator 提供了 `EventTarget` 作为内置事件系统，我们可以基于它封装一个全局事件系统，让游戏逻辑更加清晰、可维护，并且易于扩展。

---

## 1. 设计目标
+ **全局事件管理**：所有模块都可以订阅和触发事件，实现模块解耦。
+ **支持自定义事件**：不同系统（如输入、UI、网络等）可以使用自定义事件进行通信。
+ **性能优化**：避免事件回调泄漏，提供自动移除监听的方法。

---

## 2. 设计思路
+ 我们使用 Cocos Creator 内置的 `EventTarget` 作为事件管理核心。
+ 设计 `EventSystem` 作为全局事件总线，所有模块均可使用它来注册和触发事件。
+ 提供简单的 API，如 `on`（监听事件）、`off`（移除监听）、`emit`（触发事件）。

---

## 3. 代码实现
### 3.1 创建事件系统
在 `scripts/managers` 目录下创建 `EventSystem.ts`：

```typescript
import { EventTarget } from 'cc';

/**
 * 全局事件系统，基于 Cocos Creator 的 EventTarget 进行封装
 */
class EventSystemClass {
    private eventTarget: EventTarget = new EventTarget();

    /**
     * 监听事件
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 绑定的目标对象（可选）
     */
    on(eventName: string, callback: Function, target?: any) {
        this.eventTarget.on(eventName, callback, target);
    }

    /**
     * 监听事件（仅触发一次）
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 绑定的目标对象（可选）
     */
    once(eventName: string, callback: Function, target?: any) {
        this.eventTarget.once(eventName, callback, target);
    }

    /**
     * 取消监听事件
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 绑定的目标对象（可选）
     */
    off(eventName: string, callback: Function, target?: any) {
        this.eventTarget.off(eventName, callback, target);
    }

    /**
     * 触发事件
     * @param eventName 事件名称
     * @param args 传递的参数
     */
    emit(eventName: string, ...args: any[]) {
        this.eventTarget.emit(eventName, ...args);
    }

    /**
     * 移除所有事件监听
     * @param eventName 事件名称（可选），如果不传则移除所有监听
     */
    removeAll(eventName?: string) {
        if (eventName) {
            this.eventTarget.removeAll(eventName);
        } else {
            this.eventTarget.clear();
        }
    }
}

// 使用单例模式，确保全局唯一
export const EventSystem = new EventSystemClass();
```

---

## 4. 使用事件系统
### 4.1 监听和触发事件
在游戏的不同模块中，我们可以使用 `EventSystem` 进行模块间通信。例如，我们的输入管理模块可以向其他模块广播输入事件。

#### **输入管理模块**
修改 `InputManager.ts`，在 `onKeyDown` 事件中触发 `KEY_DOWN` 事件：

```typescript
import { EventSystem } from './EventSystem';

private onKeyDown(event: EventKeyboard) {
    console.log(`按键按下: ${event.keyCode}`);
    EventSystem.emit('KEY_DOWN', event.keyCode);
}
```

#### **游戏管理模块**
在 `GameManager.ts` 中监听 `KEY_DOWN` 事件：

```typescript
import { EventSystem } from './managers/EventSystem';
import { KeyCode } from 'cc';

EventSystem.on('KEY_DOWN', (keyCode: KeyCode) => {
    console.log(`收到按键事件: ${keyCode}`);
});
```

---

### 4.2 事件只监听一次（`once`）
有些情况下，我们希望事件只触发一次，例如游戏初始化后只监听一次 `GAME_START` 事件：

```typescript
EventSystem.once('GAME_START', () => {
    console.log('游戏开始了！');
});
```

在游戏逻辑中触发事件：

```typescript
EventSystem.emit('GAME_START');
```

---

### 4.3 取消事件监听（`off`）
如果某个对象不再需要监听事件，可以使用 `off` 取消监听，避免不必要的性能开销或回调泄漏：

```typescript
const onKeyDown = (keyCode: KeyCode) => {
    console.log(`玩家按下键: ${keyCode}`);
};

// 监听事件
EventSystem.on('KEY_DOWN', onKeyDown);

// 取消监听
EventSystem.off('KEY_DOWN', onKeyDown);
```

---

### 4.4 移除所有监听（`removeAll`）
如果我们要在某个场景卸载时移除所有事件，可以使用 `removeAll`：

```typescript
EventSystem.removeAll('KEY_DOWN'); // 只移除 'KEY_DOWN' 事件的监听
EventSystem.removeAll(); // 移除所有监听
```

---

## 5. 事件系统的优势
+ **模块解耦**：输入、UI、游戏逻辑等模块可以通过事件通信，避免相互引用。
+ **代码清晰**：比起在多个模块中调用 `GameManager` 方法，事件系统更直观。
+ **灵活扩展**：可以随时添加新事件，不影响已有代码。
+ **自动管理**：支持 `once` 只监听一次的事件，避免手动清理不必要的回调。

---

## 6. 示例：结合 UI 事件
假设我们有一个 UI 按钮，点击时触发 `BUTTON_CLICKED` 事件。

#### **UI 模块**
```typescript
import { EventSystem } from './managers/EventSystem';

const onButtonClick = () => {
    console.log('按钮被点击');
    EventSystem.emit('BUTTON_CLICKED', 'start');
};

// 绑定 UI 按钮事件
this.button.node.on('click', onButtonClick, this);
```

#### **游戏逻辑监听 UI 事件**
```typescript
EventSystem.on('BUTTON_CLICKED', (buttonName: string) => {
    if (buttonName === 'start') {
        console.log('开始游戏');
    }
});
```

---

## 7. 总结
本教程介绍了 Cocos Creator 3.8 的事件系统：

+ **封装 **`EventSystem`**，提供 **`on`**、**`off`**、**`emit`**、**`once`**、**`removeAll`** 方法**。
+ **让输入管理、UI 组件、游戏逻辑等模块可以解耦通信**。
+ **支持全局事件系统，避免模块之间直接耦合**。
+ **提供示例，包括键盘输入、UI 按钮事件等**。

通过使用 `EventSystem`，我们可以构建一个**更清晰、可扩展**的游戏架构，方便未来扩展新的功能模块。

