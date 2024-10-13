# For Directive

## a-for

The `a-for` directive is used to render a list of elements based on an array.

### Basic Syntax

```html
<template a-for="item in items"></template>
```

### Usage Example

```html
<ul a-def="{ fruits: ['Apple', 'Banana', 'Cherry'] }">
    <template a-for="fruit in fruits">
      <li :text="fruit"></li>
    </template>
</ul>
```

### Accessing the Index

You can access the index of the current item using the following syntax:

```html
<ul a-def="{ users: [{name: 'Anna'}, {name: 'Bob'}, {name: 'Charlie'}] }">
  <template a-for="(user, index) in users">
    <li>
      <span :text="index"></span>:
      <span :text="user.name"></span>
    </li>
  </template>
</ul>
```

### Example with Array

```html
<ul a-def="{ fruits: ['Manzana', 'Banana', 'Cereza'] }">
  <template a-for="fruit in fruits">
    <li :text="fruit"></li>
  </template>
</ul>
```

This example will generate an unordered list with one element for each fruit in the array.

## Access to the Index

You can access the index of the current element in the iteration:

```html
<ul a-def="{ users: ['Alice', 'Bob', 'Charlie'] }">
  <template a-for="(user, index) in users">
    <li :text="`${index + 1}. ${user}`"></li>
  </template>
</ul>
```

or directly, index is a constant in the direct a-for:

```html
<ul a-def="{ users: ['Alice', 'Bob', 'Charlie'] }">
  <template a-for="user in users">
    <li :text="`${index + 1}. ${user}`"></li>
  </template>
</ul>
```

## Iteration on Objects

`a-for` can also iterate over the properties of an object:

```html
<ul a-def="{ user: { name: 'Juan', age: 30, city: 'Madrid' } }">
  <template a-for="(value, key) in user">
    <li :text="`${key}: ${value}`"></li>
  </template>
</ul>
```

## Conditional Rendering in Lists

You can combine `a-for` with `a-if` to filter elements:

```html
<ul
  a-def="{ tasks: [
  { id: 1, text: 'Tarea 1', completed: false },
  { id: 2, text: 'Tarea 2', completed: true },
  { id: 3, text: 'Tarea 3', completed: false } ] 
  }"
>
  <template a-for="task in tasks">
    <li a-if="!task.completed" :text="task.text"></li>
  </template>
</ul>
```

This example will only show uncompleted tasks.

## List Event Management

You can attach event handlers to elements within a loop:

```html
<ul
  a-def="{
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    removeItem(index) {
        this.items = this.items.filter((_, i) => i !== index);
    }
}"
>
  <template a-for="(item, index) in items">
    <li>
      <span :text="item"></span>
      <button @click="removeItem(index)">Eliminar</button>
    </li>
  </template>
</ul>
```

### Iterating over a range

If you need to simply loop n number of times, rather than iterate through an array, Alpine offers a short syntax.

```html
<ul>
    <template a-for="i in 10">
        <li :text="i"></li>
    </template>
</ul>
```

i in this case can be named anything you like.

### Contents of a `<template>`

As mentioned above, a `<template>` tag must contain only one root element.

For example, the following code will not work:

```html
<template a-for="color in colors">
    <span>The next color is </span><span :text="color"></span>
</template>
```

but this code will work:

```html
<template a-for="color in colors">
    <p>
        <span>The next color is </span><span :text="color"></span>
    </p>
</template>
```

### Considerations

- Ensure that the array is defined in `a-def` before using it with `a-for`.