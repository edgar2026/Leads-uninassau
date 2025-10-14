# AI Development Rules for CRM Educacional

This document outlines the rules and conventions for AI-driven development on this project. Adhering to these guidelines ensures consistency, maintainability, and leverages the existing tech stack effectively.

## Tech Stack Overview

The application is built on a modern, type-safe stack. Key technologies include:

- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite for fast development and optimized builds.
- **Styling**: Tailwind CSS for a utility-first styling approach.
- **UI Components**: A comprehensive library built with shadcn/ui and Radix UI primitives.
- **Routing**: Wouter for simple and efficient client-side routing.
- **Data Fetching & Caching**: TanStack Query for managing server state.
- **Forms**: React Hook Form with Zod for robust, type-safe form validation.
- **Charts & Visualizations**: Recharts for data visualization.
- **Icons**: Lucide React for a consistent and clean icon set.
- **Backend**: Express.js server for API endpoints.

## Library Usage Rules

To maintain consistency, please follow these strict rules when adding or modifying features:

### 1. UI Components: Use shadcn/ui
- **Rule**: ALWAYS use pre-built components from `client/src/components/ui` (shadcn/ui) for all UI elements like buttons, cards, forms, dialogs, etc.
- **Reason**: This ensures visual consistency and leverages a well-tested, accessible component library.
- **Example**: To create a button, import `{ Button } from "@/components/ui/button";`. Do not create a new button component from scratch.

### 2. Styling: Use Tailwind CSS
- **Rule**: ALL styling must be done with Tailwind CSS utility classes. Do not write custom CSS in `.css` files or use inline `style` attributes.
- **Reason**: Keeps styling co-located with markup and maintains a consistent design system.
- **Example**: Use classes like `bg-primary`, `text-lg`, `font-bold`, `p-4`, `rounded-md`.

### 3. Icons: Use Lucide React
- **Rule**: ONLY use icons from the `lucide-react` package.
- **Reason**: Ensures a uniform icon style throughout the application.
- **Example**: `import { Users } from "lucide-react";`

### 4. Routing: Use Wouter
- **Rule**: All client-side routing must be handled by Wouter. Define all routes within `client/src/App.tsx`.
- **Reason**: Simplicity and consistency in navigation logic.
- **Example**: Use `<Route path="/leads" component={LeadsPanel} />`.

### 5. Data Fetching: Use TanStack Query
- **Rule**: For any interaction with the backend API (fetching, creating, updating, deleting data), you MUST use TanStack Query (`useQuery`, `useMutation`).
- **Reason**: Provides robust caching, request de-duplication, and a consistent pattern for handling server state.
- **Example**: Use `useQuery({ queryKey: ['leads'], queryFn: fetchLeads })` to fetch data.

### 6. Charts: Use Recharts
- **Rule**: All data visualizations and charts must be created using the `recharts` library.
- **Reason**: Maintains a consistent look and feel for all charts.
- **Example**: Use components like `<LineChart>`, `<BarChart>`, and `<PieChart>` from `recharts`.

### 7. Forms: Use React Hook Form + Zod
- **Rule**: All forms must be built using `react-hook-form`. Schema validation MUST be done with Zod.
- **Reason**: Provides performance, type safety, and a standardized way to handle form state and validation.
- **Example**: Use the `useForm` hook with `zodResolver` from `@hookform/resolvers/zod`.

### 8. File Structure
- **Rule**: Adhere to the established file structure.
  - **Pages**: `client/src/pages/`
  - **Reusable Components**: `client/src/components/`
  - **Custom Hooks**: `client/src/hooks/`
  - **Utilities**: `client/src/lib/`
- **Reason**: Keeps the codebase organized and predictable.