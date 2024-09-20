# For Directive

## a-for

The `a-for` directive is used to render a list of elements based on an array.

### Basic Syntax

```html
<element a-for="item in items"></element>
```

### Usage Example

```html
<div a-def="{ fruits: ['Apple', 'Banana', 'Cherry'] }">
    <ul a-for="fruit in fruits">
        <li :text="fruit"></li>
    </ul>
</div>
```

### Accessing the Index

You can access the index of the current item using the following syntax:

```html
<div a-def="{ users: [{name: 'Anna'}, {name: 'Bob'}, {name: 'Charlie'}] }">
    <ul a-for="(user, index) in users">
        <li>
            <span :text="index"></span>:
            <span :text="user.name"></span>
        </li>
    </ul>
</div>
```

### Ejemplo con Array

```html
<div a-def=" fruits: ['Manzana', 'Banana', 'Cereza'] ">
  <ul a-for="fruit in fruits">
    <li :text="fruit"></li>
  </ul>
</div>
```

Este ejemplo generará una lista no ordenada con un elemento para cada fruta en el array.

## Acceso al Índice

Puedes acceder al índice del elemento actual en la iteración:

```html
<div a-def="{ users: ['Alice', 'Bob', 'Charlie'] }">
  <ul a-for="(user, index) in users">
    <li :text="`${index + 1}. ${user}`"></li>
  </ul>
</div>
```

## Iteración sobre Objetos

`a-for` también puede iterar sobre las propiedades de un objeto:

```html
<div a-def="{ user: { name: 'Juan', age: 30, city: 'Madrid' } }">
  <ul a-for="(value, key) in user">
    <li  :text="`${key}: ${value}`"> </li>
  </ul>
</div>
```

## Renderizado Condicional en Listas

Puedes combinar `a-for` con `a-if` para filtrar elementos:

```html
<div a-def="{ tasks: [
  { id: 1, text: 'Tarea 1', completed: false },
  { id: 2, text: 'Tarea 2', completed: true },
  { id: 3, text: 'Tarea 3', completed: false }
] }">
  <ul a-for="task in tasks" >
    <li a-if="!task.completed" :text="task.text"></li>
  </ul>
</div>
```

Este ejemplo solo mostrará las tareas no completadas.

## Manejo de Eventos en Listas

Puedes adjuntar manejadores de eventos a elementos dentro de un bucle:

```html
<div a-def="{
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    removeItem(index) {
        this.items = this.items.filter((_, i) => i !== index);
    }
}">
    <ul a-for="(item, index) in items" >
        <li>
            <span :text="item"></span>
            <button @click="removeItem(index)">Eliminar</button>
        </li>
    </ul>
</div>
```

### Considerations

-   Ensure that the array is defined in `a-def` before using it with `a-for`.