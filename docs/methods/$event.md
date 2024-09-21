# $event Method

## Introduction

The `$event` method in Asor gives you access to the native JavaScript event object within event handlers. This is useful when you need detailed information about the event, such as the target element, key presses, mouse positions, or to prevent default behaviors.

## Basic Syntax

```javascript
$event
```

`$event` provides access to the native event object within any event listener in Asor.

## Usage Example

Here’s a simple example where we use `$event` to get the value of an input field when a button is clicked:

```html
<div a-def="{ inputValue: '' }">
  <input type="text" @input="inputValue = $event.target.value" />
  <p>Input value: <span :text="inputValue"></span></p>
</div>
```

In this example, `$event.target.value` gives us the value from the input field whenever the input event is triggered. This value is then bound to `inputValue` and displayed in the paragraph below.

## Accessing Event Properties

The `$event` object contains all the standard properties and methods of a JavaScript event, such as:

- `target`: The DOM element that triggered the event.
- `type`: The type of the event (e.g., `click`, `input`).
- `preventDefault()`: Prevents the default action for the event.
- `stopPropagation()`: Stops the event from bubbling up the DOM.

Example: Preventing Form Submission

```html
<div a-def="{ submitForm() { alert('Form submitted'); } }">
  <form @submit="submitForm(); $event.preventDefault()">
    <input type="text" />
    <button type="submit">Submit</button>
  </form>
</div>
```

In this example, `$event.preventDefault()` is used to prevent the form from being submitted when the button is clicked, but we still call the `submitForm()` method.

## Use Cases

- **Form Handling**: Use `$event` to prevent default behaviors (e.g., form submission) or to access form values.
- **Keyboard Events**: Capture specific key presses using `$event.key` or `$event.code` in keyboard event handlers.
- **Mouse Events**: Get the mouse position using `$event.clientX` and `$event.clientY`.
- **Touch Events**: Access touch-specific properties like `$event.touches` or `$event.changedTouches` for mobile interactions.

## Example: Handling Key Presses

Here’s an example where we use `$event` to detect when the Enter key is pressed:

```html
<div a-def="{ message: '' }">
  <input type="text" @keydown="if ($event.key === 'Enter') { message = 'Enter pressed!' }" />
  <p :text="message"></p>
</div>
```

In this case, when the Enter key is pressed, the `message` is updated to notify the user.

## Example: Stopping Event Propagation

```html
<div a-def="{}">
  <div @click="alert('Outer div clicked')">
    <button @click="$event.stopPropagation(); alert('Button clicked')">Click me</button>
  </div>
</div>
```

In this example, clicking the button will trigger the button’s alert but prevent the click event from bubbling up to the outer div, thanks to `$event.stopPropagation()`.

## Conclusion

The `$event` method in Asor provides full access to the native JavaScript event object, allowing you to handle complex event interactions in your application. It is especially useful for cases where you need fine-grained control over event behavior or need to access detailed event data.