# Def Directive

## Introduction

The `a-def` directive in asor.js is used to declare the initial state of a component. It allows you to define properties directly in the HTML, which can then be used and modified by other Asor directives.

## Basic Syntax

The basic syntax of the `a-def` directive is as follows:

```html
<element a-def="{ properties: value }"></element>
```

Where:

- `property` is the name of the property
- `value` is the initial value of the property

## Basic Usage

### Declaring Simple Properties

```html
<div a-def="{ counter: 0 }">
  <p :text="counter"></p>
  <button @click="counter++">Increment</button>
</div>
```

### Declaring Multiple Properties

```html
<div a-def="{ name: 'John', age: 30 }">
  <p :text="name"></p>
  <p :text="age"></p>
</div>
```

## Advanced Features

### Objects and Arrays

```html
<div
  a-def="{ user: { name: 'Anna', age: 28 }, colors: ['red', 'green', 'blue'] }"
>
  <p :text="user.name"></p>
  <p :text="user.age"></p>
  <ul>
    <li @for="color in colors" :text="color"></li>
  </ul>
</div>
```

## Integration with Other Directives

### With a-bind

```html
<div a-def="{ message: '' }">
  <input :value="message" />
  <p :text="message"></p>
</div>
```

### With a-for

```html
<div a-def="{ show: true }">
  <button @click="show = !show">Toggle</button>
  <p a-show="show">This paragraph can be hidden</p>
</div>
```

## Best Practices

1. **Descriptive Names**: Use property names that are clear and descriptive.
2. **Avoid Complex Logic**: The `a-def` directive is for state declaration, not for complex logic.
3. **Modularity**: For large components, consider splitting the state across multiple elements with `a-def`.

## Common Errors

1. **Forgetting the Quotes**:
   Incorrect: `<div a-def=counter: 0>`
   Correct: `<div a-def="{ counter: 0 }">`
   
## Conclusion

The `a-def` directive is fundamental in asor.js for declaring the initial state of components. When used correctly, along with other directives like `a-bind`, `a-for`, `a-on`, and `a-if`, it allows you to build dynamic and reactive user interfaces in a declarative manner.