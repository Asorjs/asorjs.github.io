# Effect Directive

The `a-effect` directive allows you to execute a function whenever the state or dependencies you are observing in the component change. It is useful for performing side effects or reacting to data changes.

## Basic Usage

```html
<div a-effect="handleEffect"></div>
```

In this example, the `handleEffect` function will automatically run when the component renders or when any relevant state changes.

### Example:

```html
<div a-def="{ label: 'Hello' }" a-effect="console.log(label)">
    <button @click="label += ' World!'">Change Message</button>
</div>
```

In this case, when the button is clicked and the value of the `label` variable changes, the effect will be triggered again, and “Hello World!” will be logged to the console.