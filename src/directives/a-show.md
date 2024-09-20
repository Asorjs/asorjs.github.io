# Show Directive

## Introduction

The `a-show` directive is similar to `a-if`, but instead of removing the element, it only changes its visibility.

### Basic Syntax

```html
<element a-show="condition">
    <!-- Content -->
</element>
```

### Usage Example

```html
<div a-def="showMessage: true">
    <p a-show="showMessage">This message can be hidden</p>
</div>
```

### Considerations

-   `a-show` toggles between `display: none` and the element's original `display` value.
-   It is useful when you need to frequently hide/show elements without rebuilding the DOM.

## Combining Directives

These directives can be combined to create complex dynamic interfaces:

```html
<div
    a-def="tasks: [{text: 'Buy milk', completed: false}, {text: 'Walk the dog', completed: true}]"
>
    <ul @for="task in tasks">
        <li>
            <span a-show="!task.completed" :text="task.text"></span>
            <span a-if="task.completed"
                >Task completed: <span :text="task.text"></span
            ></span>
        </li>
    </ul>
</div>
```

## Best Practices

1. Use `a-if` for conditions that will not change frequently, and `a-show` for regularly toggling visibility.