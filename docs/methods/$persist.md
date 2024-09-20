# $persist Method

## Introduction

The `$persist` method in Asor allows you to persist reactive data across page reloads by saving it to `localStorage`. This is useful for maintaining the state of your application, such as user preferences, form data, or any other data that needs to survive a page refresh or navigation.

## Basic Syntax

```javascript
$persist(key, value)
```

- `key`: A string that identifies the data you want to persist.
- `value`: The reactive data you want to store in `localStorage`.

Alternatively, you can retrieve persisted data using:

```javascript
$persist(key)
```

This will return the value stored in `localStorage` for the specified key.

## Usage Example

Here’s an example where we persist the count of a counter, so the value is saved even after the page is refreshed:

```html
<div a-def="{ $persist('counter', 0) }">
  <p>Count: <span :text="count"></span></p>
  <button @click="count++">Increment</button>
</div>
```

In this example, the initial value of `count` is either loaded from `localStorage` (if it exists) or set to `0` if no previous value is found. As the user clicks the button to increment the count, the updated value is saved automatically.

## Persisting Complex Data

You can also persist more complex data structures like objects and arrays. The `$persist` method automatically handles serialization and deserialization:

```html
<div a-def="{ count: { foo: $persist(0) , car: $persist(0)} }">
    <button @click="count.foo++"> Incrementar foo ++</button>
    <button @click="count.foo--"> Decrementar foo--</button>

    <button @click="count.car++"> Incrementar car ++</button>
    <button @click="count.car--"> Decrementar car --</button>

    <p :text="count.foo"></p>
    <p :text="count.car"></p>
</div>
```

In this example, the `user` object is stored in `localStorage` and will persist across page reloads. When the user’s age is incremented, the change is saved.

## Use Cases

- **User Preferences**: Store user preferences such as theme settings, language choices, or layout configurations.
- **Form Data**: Save form input data to ensure the user’s progress is maintained even if the page is refreshed.
- **Cart Data in E-commerce**: Persist the contents of a shopping cart between sessions or page reloads.
- **Authentication Tokens**: Keep a user’s login session alive by saving authentication tokens (be mindful of security concerns).

## Example: Storing and Retrieving Data

Here’s an example where `$persist` is used to save and load a to-do list:

```html
<div a-def="{ tasks: $persist('tasks', []), newTask: '' }">
  <input :value="newTask" @input="newTask = $event.target.value" placeholder="Add a task" />
  <button @click="tasks.push(newTask); newTask = ''">Add Task</button>

  <ul a-for="task in tasks">
    <li :text="task"></li>
  </ul>
</div>
```

In this example, tasks added by the user are saved in `localStorage`, so they will persist even after the page is refreshed.

## Removing Persisted Data

To remove data from `localStorage`, you can manually call `localStorage.removeItem()` with the key:

```javascript
localStorage.removeItem('counter');
```

Or, you can clear all persisted data by using:

```javascript
localStorage.clear();
```

## Limitations

- **Storage Limits**: `localStorage` has a size limit (usually around 5MB), so be mindful of the amount of data you store.
- **Cross-Browser Support**: While `localStorage` is widely supported in modern browsers, be sure to test its availability and performance in different environments.
- **Data Persistence**: Data stored in `localStorage` persists until it is manually removed, so consider implementing strategies for clearing outdated data.

## Conclusion

The `$persist` method in Asor provides a simple and powerful way to persist reactive data across page reloads using `localStorage`. It’s ideal for saving user preferences, form data, and other information that needs to survive between sessions or page navigations.