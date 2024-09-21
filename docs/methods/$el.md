# $el Method

## Introduction

The `$el` method in Asor provides direct access to the current DOM element, allowing for direct manipulation.

## Syntax

```javascript
$el
```

`$el` references the element where it's used.

## Example

```html
<div a-def="{}">
  <button @click="$el.style.backgroundColor = 'blue'">Change Color</button>
</div>
```

In this example, `$el` changes the button's background color.

## Use Cases

- **Direct DOM Manipulation**: Modify styles or attributes.
- **Initialization**: Focus inputs or set values when the component mounts.

### Example: Focus an Input

```html
<button @click="$el.innerHTML = 'Hello Word!'"> click me</button>
```

## Conclusion

Use `$el` for direct DOM interaction when needed, but rely on Asor's reactivity for most cases.