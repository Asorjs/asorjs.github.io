# Target Directive

## Basic usage

The `@target` attribute allows you to specify where the response from an XHR request should be loaded. It uses a CSS selector to identify the target element.

### Simple example

```html
<button a-xhr="/message" @target="#message-container">Get Message</button>
<div id="message-container"></div>
```

In this example:

Clicking the button sends a GET request to /message
The response is loaded into the `<div>` with id="message-container"

### Advanced example: Live Search

Let's look at a more complex example using live search:

```html
<input
  type="text"
  name="firstName"
  a-xhr="/first-name"
  @trigger.500ms="keyup, changed"
  @target="#search-results"
  placeholder="Search..."
/>
<div id="search-results"></div>
```

In this advanced example:

- `a-xhr="/first-name"`: Specifies the endpoint for the XHR request
- `@trigger.500ms="keyup, changed"`: Triggers the request 500ms after a keyup or change event
- `@target="#search-results"` : Loads the response into the element with `id="search-results"`

Important notes

If the `@target` selector doesn't match any elements, the response won't be displayed. Always ensure your target element exists.

The `@target` attribute works with all types of XHR requests (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
You can use any valid CSS selector with `@target`, not just IDs.