# Clients Directory

This directory contains **client-side wrapper components** that manage complex state and interactions for pages/forms.

## Client Components

### Form Clients

**`add-product-client.tsx`**

- Purpose: Client-side wrapper for adding products
- Features:
  - Form state management (`useFormErrors`, `useMessage`)
  - Success modal with auto-redirect to edit page
  - Form submission handling
  - Reset functionality
  - Context provider for form-wide state
- Used in: `app/add-product/page.tsx`
- Props: `formAction` (server action), `categories`

**`product-edit-client.tsx`**

- Purpose: Client-side wrapper for editing products
- Features:
  - Form dirty state tracking (unsaved changes warning)
  - Navigation blocking when unsaved
  - Delete confirmation modal
  - Success modal with toast feedback
  - Form reset and validation
  - Context provider for form state
- Used in: `app/inventory/[id]/edit-product/page.tsx`
- Props: `product`, `formAction` (server action), `deleteAction`, `children`

## Design Pattern

These "client" components follow the pattern:

1. **"use client"** directive (client-side only)
2. **Heavy state management** - hooks, modals, redirects
3. **Server action integration** - receive server actions as props
4. **Context provision** - wrap children with context for form state
5. **User feedback** - modals, messages, loading states

## When to Use Client Components

Use client components when you need:

- Complex client-side state management
- Modal dialogs or confirmations
- Form validation and error tracking
- Navigation guards
- Keyboard shortcuts or event listeners

For simple state-less display components, use regular components in `components/` instead.
