# $root Method

## Introduction

The `$root` method in Asor provides access to the root component or top-level scope, allowing components to share data and methods globally.

## Syntax

```javascript
$root
```

`$root` refers to the highest-level reactive scope.

## Example

```html
<div a-def="{ globalMessage: 'Hello from the root!' }">
  <p :text="$root.globalMessage"></p>
  <button @click="$root.globalMessage = 'Updated from child'">Update Message</button>
</div>
```

A child component accesses and modifies `globalMessage` from the root component.

## Accessing Methods

You can also access root-level methods:

```html
<div a-def="{
  globalMessage: 'Welcome!',
  changeMessage() { this.globalMessage = 'Updated!' }
}">
  <button @click="$root.changeMessage()">Update Message</button>
</div>
```

## Use Cases

- **Global State**: Manage shared state across components.
- **Invoke Root Methods**: Trigger actions from any component.
- **Cross-Component Communication**: Access root data and methods from deeply nested components.