# Navigation Directive

The `a-navigate` directive in asor.js allows you to implement client-side navigation in your application. This means you can load new pages or content without a full page reload, providing a smoother user experience.

## Syntax

```html
<a a-navigate[.modifier]="url">Link Text</a>
```

- `url`: The destination URL for navigation.
- `modifier` (optional): Additional behaviors for the navigation.

## Basic Usage

By adding `a-navigate` to each link in a navigation menu on each page, asor will prevent the standard handling of the link click and replace it with its own, faster version:

```html
<nav>
  <a href="/" a-navigate>Dashboard</a>
  <a href="/posts" a-navigate>Posts</a>
  <a href="/users" a-navigate>Users</a>
</nav>
```

Below is a breakdown of what happens when a `a-navigate` link is clicked:

- User clicks a link
- asor prevents the browser from visiting the new page
- Instead, asor requests the page in the background and shows a loading bar at the top of the page
- When the HTML for the new page has been received, asor replaces the current page's URL, `<title>` tag and `<body>` contents with the elements from the new page

This technique results in much faster page load times — often twice as fast — and makes the application "feel" like a JavaScript powered single page application.

## Modifiers

### .lazy

The `.lazy` modifier delays loading the page until the link is close to entering the viewport:

```html
<a href="/posts" a-navigate.lazy>Posts</a>
```

This is useful for links that are not immediately visible, reducing unnecessary prefetching.

### .hover

The `.hover` modifier instructs asor to prefetch the page after a user has hovered over the link for 60 milliseconds:

```html
<a href="/posts" a-navigate.hover>Posts</a>
```

> [!warning] Prefetching on hover increases server usage
> Because not all users will click a link they hover over, adding `.hover` will request pages that may not be needed, though asor attempts to mitigate some of this overhead by waiting 60 milliseconds before prefetching the page.

### .confirm

The `.confirm` modifier adds a confirmation dialog before navigating:

```html
<a
  href="/delete-account"
  a-navigate.confirm="Are you sure you want to delete your account?"
  >Delete Account</a
>
```

This is useful for potentially destructive actions or when you want to ensure the user's intent before navigation.

## Advanced Usage

### Combining with other directives

You can combine `a-navigate` with other asor.js directives for more complex behavior:

```html
<a
  a-navigate="/important-action"
  a-confirm="Are you sure you want to perform this action?"
  a-loading.class="is-loading"
>
  Perform Important Action
</a>
```

This example will show a confirmation dialog before navigating, and add a loading class while the navigation is in progress.

## Important Notes

- The `a-navigate` directive works on any clickable element, not just `<a>` tags.
- Navigation is only performed for URLs within the same origin as the current page.
- You can use `a-navigate` with query parameters and hash fragments.
- The browser's back and forward buttons will work seamlessly with `a-navigate`.
- Prefetching strategies can significantly improve perceived performance but may increase server load.

By using the `a-navigate` directive with its various modifiers, you can create smooth, app-like navigation experiences in your web application, enhancing user interaction and perceived performance while maintaining control over resource usage.
