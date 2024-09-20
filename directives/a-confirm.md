# Confirm Directive

The `a-confirm` directive in asor.js allows you to add confirmation dialogs before executing certain actions. This is particularly useful for potentially destructive or important operations where you want to ensure the user's intent.

## Syntax

```html
<element a-confirm[.modifier]="message">Content</element>
```

- `message`: The confirmation message to display to the user.
- `modifier` (optional): Additional behaviors for the confirmation.

## Basic Usage

Here's a simple example of how to use the `a-confirm` directive:

```html
<button a-confirm="Are you sure you want to delete this item?" a-xhr="/delete-item">
Delete Item
</button>
```
 
When this button is clicked, a confirmation dialog will appear with the specified message. The delete action will only proceed if the user confirms.

## Modifiers

### .prompt

The `.prompt` modifier allows you to require a specific input from the user:

```html
<button
  a-confirm.prompt="Please type 'DELETE' to confirm:|DELETE"
  a-xhr="/delete-account"
>
  Delete Account
</button>
```

In this example, the user must type 'DELETE' exactly to proceed with the account deletion.

## Advanced Usage

### Combining with other directives

You can combine `a-confirm` with other asor.js directives for more complex behavior:

```html
<form
  a-xhr:post="/submit-important-data"
  a-confirm="Are you sure you want to submit this data?"
  a-loading.class="is-submitting"
>
  <!-- Form fields -->
  <button type="submit">Submit Data</button>
</form>
```

This example will show a confirmation dialog before submitting the form, and add a loading class while the submission is in progress.