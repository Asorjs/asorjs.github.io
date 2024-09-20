# Offline Directive

In real-time applications, it can be helpful to provide a visual indication that the user's device is no longer connected to the internet.

asor provides the `a-offline` directive for such cases.

By adding `a-offline` to an element inside a asor component, it will be hidden by default and become visible when the user loses connection:

```html
<div a-offline>This device is currently offline.</div>
```

## Toggling classes

Adding the `class` modifier allows you to add a class to an element when the user loses their connection. The class will be removed again, once the user is back online:

```html
<div a-offline.class="bg-red-300"></div>
```

Or, using the `.remove` modifier, you can remove a class when a user loses their connection. In this example, the `bg-green-300` class will be removed from the `<div>` while the user has lost their connection:

```html
<div class="bg-green-300" a-offline.class.remove="bg-green-300"></div>
```

## Toggling attributes

The `.attr` modifier allows you to add an attribute to an element when the user loses their connection. In this example, the "Save" button will be disabled while the user has lost their connection:

```html
<button a-offline.attr="disabled">Save</button>
```