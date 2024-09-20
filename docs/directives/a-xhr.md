# XHR Directive

The `a-xhr` directive is a powerful feature in asor.js that enables you to make AJAX requests directly from your HTML elements. It simplifies the process of sending data to and receiving data from your server without the need for writing JavaScript, making your code more declarative and easier to maintain.

## Basic Syntax

```html
<element a-xhr[.method]="url">Content</element>
```

element: Any HTML element that can trigger an event (e.g., button, form, div)
method (optional): The HTTP method (`get`, `post`, `put`, `patch`, `delete`). If omitted, defaults to `GET`.
url: The endpoint URL to which the request will be sent

### Example

1. Simple GET Request
   Fetch data from the server when a button is clicked:

```html
<button a-xhr="/url">Content</button>
```

This will launch a `GET` request to the server when you click on the `<button>` tag to the address in this case `/url`.

2. POST Request
   Send data to the server when a button is clicked:

```html
<button a-xhr:post="/api/users">Create User</button>
```

- method: The HTTP method (get, post, put, patch, delete)
- url: The endpoint URL

### Submit a form:

```html
<form a-xhr:post="/api/register">
  <input type="text" name="username" />
  <input type="email" name="email" />
  <input type="password" name="password" />
  <button type="submit">Register</button>
</form>
```

### With Confirmation

Add a confirmation before sending the request:

```html
<button
  a-xhr:delete="/api/user/789"
  a-confirm="Are you sure you want to delete this user?"
>
  Delete User
</button>
```

### Targeting Specific Elements

Update a specific element with the response:

```html
<button a-xhr="/api/weather" @target="#weather-info">Get Weather</button>

<div id="weather-info"></div>
```

### Important Notes

- The `a-xhr` directive automatically prevents the default action of forms and links.
- You can combine `a-xhr` with other directives like `a-loading` to show loading states.
- For file uploads, asor.js automatically handles `multipart/form-data` encoding.