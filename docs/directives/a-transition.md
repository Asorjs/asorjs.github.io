# Transition Directive

The `a-transition` directive in asor.js allows you to add smooth transition effects when elements are added, removed, or updated in your application. This enhances the user experience by providing visual feedback for changes in the DOM.

## Syntax

```html
<element a-transition[.modifier]>Content</element>
```

- `modifier` (optional): Specifies the type or duration of the transition.

## Basic Usage

Here's a simple example of how to use the `a-transition` directive:

```html
<div a-transition>
  This content will transition smoothly when added or removed.
</div>
```

By default, this will apply a fade and slide effect.

## Modifiers

### Duration

You can specify the duration of the transition:

```html
<div a-transition.300ms>Fast transition</div>
<div a-transition.1s>Slow transition</div>
```

### Predefined Transitions

asor.js comes with some predefined transition effects:

```html
<div a-transition.fade>Fade effect</div>
<div a-transition.slide>Slide effect</div>
<div a-transition.scale>Scale effect</div>
```

### Custom Classes

You can use your own CSS classes for transitions:

<div a-transition.my-custom-transition>
  This will use the 'my-custom-transition' CSS class for the transition effect.
</div>

## Advanced Usage

### Combining with other directives

You can combine `a-transition` with other asor.js directives for more dynamic behavior:

```html
<div a-xhr="/api/data" a-transition a-loading.class="is-loading">
  Content here will transition smoothly when updated via XHR.
</div>
```

### Different enter and leave transitions

You can specify different transitions for when an element enters or leaves the DOM:

```html
<div a-transition @enter="fade-in" @leave="slide-out">
  This element will fade in when added and slide out when removed.
</div>
```

### Transition events

You can listen for transition events:

```html
<div
  a-transition
  a-transition:start="handleStart"
  a-transition:end="handleEnd"
>
  Transition content
</div>
```

```js
<script>
function handleStart(el) {
  console.log('Transition started for:', el);
}

function handleEnd(el) {
  console.log('Transition ended for:', el);
}
</script>
```

## Important Notes

- The `a-transition` directive works best with elements that are being added, removed, or have their visibility toggled.
- Transitions are applied using CSS classes, so make sure your CSS is set up correctly to handle the transition effects.
- Be cautious with long transitions on frequently updating elements, as it might affect performance or user experience.
- Not all properties can be transitioned. Refer to CSS transition documentation for a list of animatable properties.
- For complex animations, you might need to use a dedicated animation library in conjunction with asor.js.

By using the `a-transition` directive, you can easily add polished, professional-looking transitions to your web application, enhancing visual feedback and overall user experience.