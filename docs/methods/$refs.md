# $refs Method

## Introduction

The `$refs` method in Asor allows you to access DOM elements or components that have been assigned a reference using the `a-ref` directive. It is useful for directly interacting with specific elements or components in your template, such as focusing an input, manipulating content, or invoking methods on components.

## Basic Syntax

```javascript
$refs.referenceName
```

- `referenceName`: The name you assigned to the element or component using `a-ref`.

## Usage Example

Here’s an example where we use `$refs` to focus on an input field when a button is clicked:

```html
<div a-def="{}">
  <input a-ref="nameInput" placeholder="Enter your name" />
  <button @click="$refs.nameInput.focus()">Focus Input</button>
</div>
```

In this example, the input element is assigned the reference `nameInput` using `a-ref="nameInput"`. When the button is clicked, `$refs.nameInput.focus()` is called to focus the input field.

## Accessing Element Properties

You can use `$refs` to access and modify any property or attribute of a referenced element. For example, to get the value of an input field:

```html
<div a-def="{}">
  <input a-ref="ageInput" type="number" placeholder="Enter your age" />
  <button @click="alert($refs.ageInput.value)">Show Age</button>
</div>
```

In this example, the button retrieves the value of the input field using `$refs.ageInput.value` and displays it in an alert.