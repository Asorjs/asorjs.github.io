# Asor Component

## Asor.component(...)

It provides a way to reuse `a-def` contexts within your application.

Below is an artificial **dropdown** component, for example:

```html
<div a-def="dropdown">
    <button @click="toggle()">click</button>

    <div a-show="open"> content</div>
</div>

<script>
    document.addEventListener('asor:init', () => {
        Asor.component('dropdown', () => ({
            open: false,

            toggle() {
                this.open = !this.open;
            }
        }));
    });
</script>
```

As you can see, we have extracted the properties and methods that we would normally define directly with `a-def` into a separate Asor component object.

### Registering from a Package

If you have chosen to use a compilation step for your Asor code, you must register your components as follows:

```javascript
import Asor from 'asor.js'; 
import dropdown from './dropdown.js';

Asor.component('dropdown', dropdown);

Asor.start();
```

This assumes that you have a file named `dropdown.js` with the following content:

```javascript
export default () => ({
    open: false,

    toggle() {
        this.open = !this.open;
    }
});
```