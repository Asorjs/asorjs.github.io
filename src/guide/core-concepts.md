# Key Concepts of Asor

Asor is built on several fundamental concepts that enable the creation of dynamic and efficient web applications. Understanding these concepts will help you make the most of the framework.

## Directives

Directives are the heart of Asor. They are special attributes that extend HTML and provide dynamic functionality to elements.

### Types of Directives

1. **a-def**: Defines a component’s state and methods.
   ```html
   <div a-def="count: 0, increment() { this.count++ } ">
   ```

2. **:bind** or **a-bind**: Binds data to element attributes or content.
   ```html
   <p :text="count"></p>
   ```

3. **@** or **a-on**: Handles DOM events.
   ```html
   <button @click="increment">Increment</button>
   ```

4. **a-for**: Renders lists of elements.
   ```html
   <ul a-for="item in items" >
     <li :text="item"></li>
   </ul>
   ```

5. **a-if**: Conditionally renders elements.
   ```html
   <p a-if="count > 0">The count is positive</p>
   ```

## Reactivity

Asor uses an efficient reactivity system that ensures the user interface automatically updates when the underlying data changes.

### How It Works

1. When you define data with `a-def`, Asor turns it into reactive properties.
2. Directives that use this data set up “subscriptions” to data changes.
3. When the data changes, Asor automatically updates only the affected parts of the DOM.

## State Management

Asor allows for simple and straightforward state management:

1. **Local State**: Defined with `a-def` in individual components.
2. **Shared State**: Can be implemented using reactive objects shared across components.

## Component Lifecycle

Although Asor doesn’t have components in the traditional sense, you can think of elements with `a-def` as mini-components:

1. **Initialization**: When the element is created and `a-def` is applied.
2. **Update**: When reactive data changes.
3. **Destruction**: When the element is removed from the DOM.

## Event Handling

Asor provides an easy way to handle DOM events:

1. Use `@` or `a-on` followed by the event name.
2. The value can be an expression or the name of a method defined in `a-def`.

```html
<button @click="handleClick">Click</button>
```