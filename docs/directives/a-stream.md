# Streaming Directive

The `a-stream` directive in asor.js allows you to implement server-sent events (SSE) for real-time, one-way communication from the server to the client. This is particularly useful for scenarios where you need to push updates to the client without the overhead of WebSockets.

## Syntax

```html
<element a-stream[.modifier]="url">Initial Content</element>
```

- `url`: The endpoint URL for the SSE stream.
- `modifier` (optional): Additional behaviors for the stream.

## Basic Usage

Here's a simple example of how to use the `a-stream` directive:

```html
<div a-stream="/events">
  Waiting for updates...
</div>
```

This div will be updated in real-time with events sent from the "/events" endpoint.

## Modifiers

### .keep-alive

The `.keep-alive` modifier keeps the connection open even when the browser tab is not active:

```html
<div a-stream.keep-alive="/important-updates">
  Critical information will be displayed here.
</div>
```

### .replay

The `.replay` modifier instructs the server to send any missed events when reconnecting:

```html
<div a-stream.replay="/event-log">
  Event log will be displayed here.
</div>
```

## Advanced Usage

### Combining with other directives

You can combine `a-stream` with other asor.js directives for more complex behavior:

```html
<div a-stream="/live-feed" a-loading.class="is-loading" @transition>
  <h3>Live Feed</h3>
  <!-- Live content will be streamed here -->
</div>
```

This example will show a loading indicator while connecting to the stream and apply a transition effect when new content arrives.

### Custom Event Handling

You can also handle specific event types:

```html
<div a-stream="/custom-events">
  <!-- Custom event content will be handled here -->
</div>
```

## Important Notes

- The server must be configured to send Server-Sent Events (SSE) for the `a-stream` directive to work.
- Streams are unidirectional - from server to client. For bidirectional communication, consider using WebSockets.
- Browsers automatically handle reconnection for SSE, but you can customize this behavior.
- Be mindful of server resources when using streaming, especially with many concurrent clients.
- Not all browsers support SSE. Consider providing a fallback mechanism for incompatible browsers.

By using the `a-stream` directive, you can create responsive, real-time experiences in your web application, allowing for immediate updates without the need for polling or full page reloads.