# $dispatch Method

## Introduction

The `$dispatch` method in Asor allows you to trigger custom events on an element. It facilitates communication between components by dispatching events that other parts of your application can listen to. You can also pass additional data through the event, accessible via the event’s `detail` property.

## Basic Syntax

```javascript
$dispatch(eventName, detail)
```

- `eventName`: The custom event name to dispatch.
- `detail`: (Optional) Data to pass along with the event, accessible via `event.detail`.

## Example: Basic Event Dispatch

Here's an example where a button dispatches a `notify` event, and another element listens for it:

```html
<div @notify="alert('Notification Received!')">
  <button @click="$dispatch('notify')">Send Notification</button>
</div>
```

When the button is clicked, the `notify` event is dispatched, triggering the alert.

## Example: Passing Data with Events

You can pass additional data through the event’s `detail` property:

```html
<div @notify="alert($event.detail.message)">
  <button @click="$dispatch('notify', { message: 'Hello Asor!' })">
    Send Message
  </button>
</div>
```

Here, clicking the button dispatches a `notify` event with a message, which is accessed via `$event.detail.message`.

## Event Propagation

By default, events dispatched with `$dispatch` bubble up through the DOM. This means parent components or elements can listen to events triggered by their children.

### Example: Using `.window` for Event Bubbling

If you need to capture events from sibling elements or across different parts of your application, use the `.window` modifier:

```html
<!-- This won't work as the event only bubbles to the parent -->
<div>
  <span @notify="console.log('Event caught')"></span>
  <button @click="$dispatch('notify')">Dispatch Event</button>
</div>

<!-- This works as the event bubbles to the window -->
<div>
  <span @notify.window="console.log('Event caught at window level')"></span>
  <button @click="$dispatch('notify')">Dispatch Event</button>
</div>
```

In the second example, the event is captured at the window level, making sibling communication possible.

## Example: Component Communication

You can also use `$dispatch` to send data between components:

```html
<div a-def="{ title: 'Initial Title' }" @set-title.window="title = $event.detail">
  <h1 :text="title"></h1>
</div>

<div>
  <button @click="$dispatch('set-title', 'New Title')">Set New Title</button>
</div>
```

Clicking the button dispatches the `set-title` event, updating the title in a different component.

## Example: Dispatching to a Custom Input Component

You can use `$dispatch` to trigger updates for data bindings. Here's an example with a custom input component:

```html
<div a-def="{ title: 'Hello' }">
  <span a-bind="title">
    <button @click="$dispatch('input', 'New Title')">Update Title</button>
  </span>
</div>
```

When the button is clicked, the `input` event is dispatched, updating the `title` via Asor's reactivity system.

## Conclusion

The `$dispatch` method is a versatile tool for triggering custom events and facilitating communication between components in Asor. It simplifies managing event-driven interactions and data flows in your application, from basic notifications to more complex cross-component communication.