# Bind Directive

## Introduction

The `a-bind` directive in asor.js provides an easy way to create two-way bindings between DOM elements and component properties. This enables automatic synchronization between the user interface and the component state.

## Basic Syntax

The basic syntax of the `a-bind` directive is as follows:

```html
<element :text="property"></element>
```

Where `property` is the name of the component property that the element will be bound to.

## Basic Usage

### Binding with Text Inputs

```html
<div a-def="{ message: '' }">
  <input :value="message" />
  <p :text="message"></p>
</div>
```

In this example, the value of the input will automatically synchronize with the `message` property.

### Binding with Checkboxes

```html
<div a-def="{ accepted: false }">
  <input type="checkbox" :checked="accepted" @checked="accepted = !accepted"/>
  <p>Terms accepted: <span :text="accepted"></span></p>
</div>
```

### Binding with Selects

```html
<div a-def="{ color: '' }">
  <select :value="color">
    <option value="">Select a color</option>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
  </select>
  <p>Selected color: <span :text="color"></span></p>
</div>
```

## Advanced Features

### Binding with Object Properties

```html
<div a-def="{ user: { name: '', email: '' } }">
  <input :value="user.name" placeholder="Name" />
  <input :value="user.email" placeholder="Email" />
  <p>Name: <span :text="user.name"></span></p>
  <p>Email: <span :text="user.email"></span></p>
</div>
```

### Binding with Arrays

```html
<div a-def="{ tasks: [], newTask: '' }">
  <input
    :text="newTask"
    a-on:keyup.enter="tasks.push(newTask); newTask = ''"
  />
  <ul>
    <li @for="task in tasks" :text="task"></li>
  </ul>
</div>
```

## Modifiers

### .lazy

The `.lazy` modifier updates the binding after a "change" event rather than on every input:

```html
<input a-bind.lazy="message" />
```

### .number

The `.number` modifier automatically converts the input to a number:

```html
<input type="number" a-bind.number="age" />
```

### .trim

The `.trim` modifier automatically trims whitespace from the beginning and end of the input:

```html
<input a-bind.trim="name" />
```

## Best Practices

1. **Property Initialization**: Ensure that properties are initialized in `a-def` before using them with `a-bind`.
2. **Avoid Infinite Loops**: Be careful when combining `a-bind` with other events that may modify the same property.
3. **Use Modifiers Appropriately**: Choose the correct modifier to enhance user experience and data accuracy.

## Common Errors

1. **Binding to Non-Existent Properties**:
   Ensure the property is defined in `a-def` before using `a-bind`.

2. **Using Interpolation Syntax**:
   Incorrect: `<p>{{ counter }}</p>`
   Correct: `<p :text="counter"></p>`

## Conclusion

The `a-bind` directive is a powerful tool in asor.js for creating reactive user interfaces. It facilitates synchronization between the DOM and the component state, allowing you to build interactive applications with less code and in a more declarative way.