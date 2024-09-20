# Getting Started with Asor

Welcome to Asor! This guide will help you quickly get started with the framework. We will cover how to install Asor, create a simple application, and understand the basic concepts.

## Installation

There are two main ways to include Asor in your project:

### 1. Via CDN

The quickest way to start is to include Asor directly from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/asor@latest/dist/asor.min.js"></script>
```

### 2. Via npm

For larger projects, we recommend installing Asor via npm:

```bash
npm install asor
```

Then, you can import it into your project:

```javascript
import Asor from "asor";
```

## Creating Your First Application

Let's create a simple counter application to demonstrate how Asor works.

### HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My First App with Asor</title>
    <script src="https://cdn.jsdelivr.net/npm/asor@latest/dist/asor.min.js"></script>
  </head>
  <body>
    <div id="app">
      <h1>Asor Counter</h1>
      <div a-def="{ count: 0 }">
        <p>The count is: <span :text="count"></span></p>
        <button @click="count++">Increment</button>
        <button @click="count--">Decrement</button>
      </div>
    </div>
  </body>
</html>
```

### Explanation

1. **Defining Data**: We use `a-def` to define the local state of our component.
2. **Data Binding**: `:text="count"` binds the value of `count` to the text content of the `<span>`.
3. **Event Handling**: `@click` (or `a-on:click`) is used to handle the button clicks.

## Core Concepts

### Directives

Directives are special attributes that extend HTML. Some key directives in Asor include:

- `a-def`: Defines reactive data.
- `:` or `a-bind`: Binds data to attributes or content.
- `@` or `a-on`: Handles events.
- `a-for`: Renders lists.
- `a-if`: Conditional rendering.

### Reactivity

Asor automatically handles DOM updates when data changes, thanks to its efficient reactivity system.

### Template Syntax

Asor uses a simple and expressive template syntax, allowing you to write dynamic components with ease.