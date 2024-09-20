# If Directives

## a-if

The `a-if` directive is used to conditionally render an element based on an expression.

### Basic Syntax

```html
<element a-if="condition">
    <!-- Content -->
</element>
```

### Usage Example

```html
<div a-def="{ isLoggedIn: false }">
    <button a-if="!isLoggedIn">Log In</button>
    <p a-if="isLoggedIn">Welcome, User</p>
</div>
```