# Introduction to Asor

Welcome to Asor, a modern and progressive JavaScript framework designed to create dynamic, high-performance web applications.

## What is Asor?

Asor is a JavaScript framework that simplifies the creation of interactive and reactive user interfaces. Designed with the philosophy of being intuitive and easy to learn, Asor is inspired by the brilliance of libraries and frameworks such as `Alpine.js`, `Livewire`, and `Htmx`. You could say it’s a combination of powerful features from each, focusing primarily on the easy, pleasant, and intuitive syntax of `Alpine.js` and its powerful directives. It’s not a direct replacement for any of these, but rather a lightweight, simple, and powerful alternative. It also has its own unique features and characteristics.

::: warning
Asor is in version: <Badge type="warning" text="beta" />, use it wisely, it is not yet ready for production.
:::

## Why Asor?

By using a single CDN link, you can access everything you need to build SPA applications. Asor can work with the backend language of your choice, as it only requires you to return HTML. Ideal for small to medium-sized projects, but it can also be used in larger projects due to its lightweight nature and ease of learning. It facilitates the creation of real-time web applications with minimal JavaScript.

It uses directives with an API similar to `Alpine.js` and `Vue`, allowing for quick interactions with very little code.

Asor is compatible with most modern browsers.

## Key Features

### 1. Intuitive Directive System

Asor uses a directive system that extends HTML, allowing you to add dynamic functionality to your elements declaratively. For example:

```html
<div a-def="{ count: 0 }">
  <p :text="count"></p>
  <button @click="count++">Increment</button>
</div>
```

### 2. Efficient Reactivity

Asor’s reactivity system ensures your views automatically update when the underlying data changes, without manual DOM manipulation and without a virtual DOM.

### 3. Conditional Rendering and Lists

Asor provides powerful directives for handling conditional rendering and dynamic lists:

```html
<ul a-for="item in items">
  <li a-if="item" :text="item"></li>
</ul>
```

### 4. Simplified Event Handling

The `a-on` directive allows for clean, declarative event handling:

```html
<button @click="handleClick()">Click here</button>
or
<div a-on:click="handleClick()">Click here</div>
```

### 5. Transitions and Animations

Asor includes built-in support for transitions and animations, enhancing the user experience:

```html
<div a-transition="fade">Content with transition</div>
```

### 6. State Management

State management in Asor is simple and straightforward, allowing you to create complex applications in an organized manner.

### 7. Optimized Performance

Asor is designed with performance in mind, with efficient DOM updates and a lightweight footprint.

## Why Choose Asor?

- **Easy Learning Curve**: If you know basic HTML, CSS, and JavaScript, you can start building with Asor quickly.
- **Flexibility**: Asor easily integrates with other libraries and existing projects.
- **Scalability**: From small applications to complex enterprise projects, Asor scales with you.
- **Community and Ecosystem**: Join a growing community of developers and take advantage of an expanding ecosystem.

## Getting Started

Ready to get started with Asor? Head over to our [Quick Start Guide](/guide/getting-started) to set up your first project in minutes.

## A Quick Look at the Code

Here’s a small example of what an Asor application looks like:

```html
<div
  a-def="{
    tasks: [],
    newTask: '',
    addTask(task) {
        if(!task) return;
        this.tasks.push({ text: task, done: false });
        this.newTask = '';
    }
  }"
>
  <input
    @keyup.enter="addTask($event.target.value)"
    placeholder="Press Enter to add tasks"
  />
  <ul a-for="task in tasks">
    <li>
      <input type="checkbox" />
      <span :class="{ 'done': task.done }" :text="task.text"></span>
    </li>
  </ul>
</div>
```

This simple example shows how Asor can handle user input, list manipulation, and UI updates with very little code.

We’re excited to see what you build with Asor!