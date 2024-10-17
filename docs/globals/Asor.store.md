# Asor.store

Asor offers global state management through the `Asor.store()` API.

## Registering a Store

You can define an Asor store inside an `asor:init` listener (in the case of including Asor via a `<script>` tag), OR you can define it before manually calling `Asor.start()` (in the case of importing Asor into a build):

### From a `<script>` tag.

```html
<script>
    document.addEventListener('asor:init', () => {
        Asor.store('darkMode', {
            on: false,

            toggle() {
                this.on = !this.on;
            }
        });
    });
</script>
```

### From a Bundle

```javascript
import Asor from 'asorjs';

Asor.store('darkMode', {
    on: false,

    toggle() {
        this.on = !this.on;
    }
});

Asor.start();
```

## Accessing Stores

You can access the data of any store within Asor expressions using the magic property `$store`:

```html
<div a-def :class="$store.darkMode.on && 'bg-black'">...</div>
```

You can also modify properties within the store and everything that depends on those properties will react automatically. For example:

```html
<button a-def @click="$store.darkMode.toggle()">Toggle Dark Mode</button>
```

In addition, you can access a store externally using `Asor.store()` by omitting the second parameter as follows:

```html
<script>
    Asor.store('darkMode').toggle();
</script>
```

## Initializing Stores

If you provide an `init()` method on an Asor store, it will be executed immediately after the store is registered. This is useful for initializing any state within the store with sensible initial values.

```html
<script>
    document.addEventListener('asor:init', () => {
        Asor.store('darkMode', {
            init() {
                this.on = window.matchMedia('(prefers-color-scheme: dark)').matches;
            },

            on: false,

            toggle() {
                this.on = !this.on;
            }
        });
    });
</script>
```

Note the new addition of the `init()` method in the above example. With this addition, the `on` variable of the store will be set to the browser's color scheme preference before Asor renders anything on the page.

## Single Value Stores

If you don't need a complete object for a store, you can set and use any data type as a store.

Here is the example above but using it more simply as a boolean value:

```html
<button a-def @click="$store.darkMode = ! $store.darkMode">Toggle Dark Mode</button>

...

<div a-def :class="$store.darkMode && 'bg-black'">
    ...
</div>

<script>
    document.addEventListener('asor:init', () => {
        Asor.store('darkMode', false);
    });
</script>
```

## Conclusion

`Asor.store()` offers a simple and powerful way to manage global states in your applications using Asor.js. You can flexibly define stores, easily access and modify global states, and ensure that your components automatically react to changes in state. Take advantage of `Asor.store()` capabilities to create more dynamic and organized applications.