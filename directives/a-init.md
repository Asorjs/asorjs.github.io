# Init Directive

## Introduction

The `a-init` directive in asor.js is used to initialize the behavior of a component or execute code when the component is mounted to the DOM. This directive is useful when you need to run specific logic once the component is available on the page.

## Basic Syntax

The basic syntax of the `a-init` directive is as follows:

```html
<element a-init="handler()"></element>
```

Where:

- `handler()` is a function that runs when the component is mounted.
- Inside the function, you can access component properties or run any necessary initial logic.

## Basic Usage

```html
    <div a-def="{ message: '' }" a-init="message = 'Hello World'">
        <p :text="message"></p>
    </div>
```

Here, the initial value of the input field and the paragraph is set to "Hello World!" when the component is mounted.

### With a-for

```html
<div
  a-def="{ 
    users: [],
    async getUsers() { 
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        this.users = await response.json();
        console.log(this.users);
    }
}"
  a-init="getUsers()"
>
  <h2>User List</h2>
  <ul a-for="user in users">
    <li :text="user.name"></li>
  </ul>
</div>
```

## Conclusion

The `a-init` directive is essential for running initialization logic in asor.js. When used correctly, it allows you to set the initial state of components or execute specific code when they are mounted. Its integration with other directives like `a-def` and `a-bind` facilitates the creation of dynamically and reactively initialized components.