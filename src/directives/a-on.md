# On Directive

## Introduction

The `a-on` directive in Asor.js provides a declarative and powerful way to handle events in your components. It allows you to associate actions or methods with DOM events, offering concise syntax and a wide range of customization options.

## Basic Usage

The basic syntax of the `a-on` directive is as follows:

```html
<element @[event][modifiers]="[expression]"></element>
```

or

```html
<element a-on:[event][modifiers]="[expression]"></element>
```

Where:

-   `[event]` is the name of the DOM event (e.g., click, submit, keydown, etc.)
-   `[expression]` is the action or method to execute when the event occurs

Basic usage examples:

```html
<button @click="increment()">Increment</button>
<form @submit="submitForm()">
    <input @input="updateSearch()" />
</form>
```

## Modifiers

The `a-on` directive supports several modifiers to customize event behavior:

| Modifier   | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| `.prevent` | Calls `event.preventDefault()`                                       |
| `.stop`    | Calls `event.stopPropagation()`                                      |
| `.once`    | The event will fire only once                                        |
| `.capture` | Uses the event's capture phase                                       |
| `.self`    | Fires only if the event occurred exactly on this element             |
| `.passive` | Improves performance for scroll events                               |
| `.outside` | Fires the event only if it occurs outside the element                |
| `.window`  | Attaches the listener to the window object                           |
| `.document`| Attaches the listener to the document object                         |
| `.debounce`| Delays the execution of the handler                                  |
| `.throttle`| Limits the frequency of handler execution                            |

Modifier usage examples:

```html
<button @click.once="showWelcomeMessage()">Welcome</button>
<button @click.prevent.stop="processClick()">Process</button>
<div @mousemove.throttle.100="updatePosition()"></div>
<div @click.outside="closeMenu()">Menu</div>
<div @touchstart.passive="startSwipe()"></div>
```

### Keyboard Modifiers

For keyboard events, you can specify specific keys:

| Modifier   | Key                                     |
| ---------- | --------------------------------------- |
| `.enter`   | Enter                                   |
| `.tab`     | Tab                                     |
| `.delete`  | Delete (and Backspace)                  |
| `.esc`     | Escape                                  |
| `.space`   | Space                                   |
| `.up`      | Arrow up                                |
| `.down`    | Arrow down                              |
| `.left`    | Arrow left                              |
| `.right`   | Arrow right                             |
| `.ctrl`    | Control                                 |
| `.alt`     | Alt                                     |
| `.shift`   | Shift                                   |
| `.meta`    | Meta key (Cmd on Mac, Windows on Windows)|

Example:

```html
<input @keydown.enter="search()" />
```

## Events

The `a-on` directive can handle any standard DOM event. Here is a list of the most common events:

| Category   | Events                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| Mouse      | `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseenter`, `mouseleave`, `mouseover`, `mouseout`|
| Keyboard   | `keydown`, `keyup`, `keypress`                                                                               |
| Form       | `submit`, `change`, `input`, `focus`, `blur`                                                                 |
| Document   | `DOMContentLoaded`, `load`, `unload`, `resize`, `scroll`                                                     |
| Drag       | `drag`, `dragstart`, `dragend`, `dragenter`, `dragleave`, `dragover`, `drop`                                 |
| Touch      | `touchstart`, `touchmove`, `touchend`, `touchcancel`                                                         |
| Media      | `play`, `pause`, `ended`, `volumechange`, `timeupdate`                                                       |

Example of handling multiple events:

```html
<input a-on="keyup, change, blur" a-xhr="/update" />
```

## Advanced Examples

1. Using the `outside` modifier to close a dropdown:

```html
<div @click.outside="closeDropdown()">
    <button @click="toggleDropdown()">Open Dropdown</button>
    <ul a-if="dropdownOpen()">
        <!-- Dropdown options -->
    </ul>
</div>
```

2. Combining modifiers:

```html
<input
    @input.throttle-300="realTimeSearch(event.target.value)"
    @keydown.enter="performSearch()"
/>
```

3. Using custom events:

```html
<button @customEvent="handleCustomEvent()"></button>
```

## Common Errors

1. **Forgetting the `@` prefix**
   Incorrect: `<button click="doSomething()">`
   Correct: `<button @click="doSomething()">` or `<button a-on:click="doSomething()">`

2. **Using single instead of double quotes for the expression**
   Incorrect: `<button @click='doSomething()'>`
   Correct: `<button @click="doSomething()">` or `<button a-on:click="doSomething()">`

3. **Attempting to use non-existent modifiers**
   Incorrect: `<button @click.nonexistent="doSomething()">`
   Correct: Ensure you're using only documented modifiers

4. **Forgetting the parentheses when calling a method**
   Incorrect: `<button @click="doSomething">`
   Correct: `<button @click="doSomething()">`

## Additional Notes

-   The `a-on` directive integrates seamlessly with other Asor.js features like state management and computed properties.
-   For events that are not native to the DOM, ensure they are properly emitted by the respective component or element.
-   Overusing modifiers like `.throttle` or `.debounce` can impact perceived responsiveness. Use them cautiously and perform performance testing when necessary.
-   Remember that expressions in `a-on` are executed in the context of the component, meaning you have direct access to the component’s properties and methods in the event handler expression.