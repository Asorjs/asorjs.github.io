# Swapping Directive

asor.js provides flexible methods to insert HTML returned from server responses into the DOM. This feature, known as "swapping", allows you to precisely control how and where the new content is placed in your webpage.

## The @swap Directive

By default, asor.js replaces the `innerHTML` of the target element with the returned content. However, you can modify this behavior using the `@swap` directive, which accepts various values to control the insertion method.

## Swap Methods

| Method        | Description                                                                         | Example                                                                          |
| ------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `innerHTML`   | Default. Replaces the entire content inside the target element.                     | `<div @swap="innerHTML">New content goes here</div>`                             |
| `outerHTML`   | Replaces the entire target element, including its tags.                             | `<div @swap="outerHTML">This div and its content are replaced</div>`             |
| `afterbegin`  | Inserts content as the first child inside the target element.                       | `<ul @swap="afterbegin"><li>This will be the first item</li></ul>`               |
| `beforebegin` | Inserts content immediately before the target element in its parent.                | `<p @swap="beforebegin">Content inserted before this paragraph</p>`              |
| `beforeend`   | Appends content as the last child inside the target element.                        | `<ul @swap="beforeend"><li>This will be the last item</li></ul>`                 |
| `afterend`    | Inserts content immediately after the target element in its parent.                 | `<p @swap="afterend">Content inserted after this paragraph</p>`                  |
| `delete`      | Removes the target element, regardless of the response.                             | `<div @swap="delete">This element will be removed</div>`                         |
| `none`        | Doesn't insert content, but still processes Out of Band Swaps and Response Headers. | `<div @swap="none">Content here won't change, but other actions may occur</div>` |

## Basic Usage

Here's an example of how to use the `@swap` directive:

```html
<button a-xhr="/api/content" @swap="afterend">Load Content</button>
```