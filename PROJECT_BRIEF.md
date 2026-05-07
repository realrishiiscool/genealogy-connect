# Genealogy Connect - Project Brief

Genealogy Connect is a modern full-stack web application designed for managing and visualizing hierarchical referral networks. It provides businesses with tools to track customer growth, manage memberships, and visualize complex referral structures through interactive diagrams.

## 🚀 Core Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React + TanStack Router) for type-safe, full-stack development.
- **Backend:** [Supabase](https://supabase.com/) for Authentication, PostgreSQL database, and real-time capabilities.
- **Visualization:** [@xyflow/react](https://reactflow.dev/) (React Flow) for interactive genealogy trees and [Recharts](https://recharts.org/) for data analytics.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) (shadcn/ui) for a high-performance, accessible, and modern UI.
- **Form Management:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation.

## ✨ Key Features

- **Interactive Genealogy Mapping:** Dynamic visualization of referral hierarchies with zoom, pan, and mini-map support.
- **Member Management:** Comprehensive dashboard for tracking customer statuses (`active`, `pending`, `inactive`) and referral metrics.
- **Boutique Operations:** Tools for managing shop-specific data and boutique-level networking.
- **Secure Authentication:** Integrated Supabase Auth for secure login, registration, and role-based access control.
- **Responsive Design:** Polished, mobile-first interface with elegant transitions and modern aesthetics.

## 📂 Project Structure

- `src/routes/`: File-based routing for the dashboard, network tree, and settings.
- `src/components/app/`: Core feature components (e.g., `GenealogyTree`, `AppShell`).
- `src/components/ui/`: Atomic, reusable UI components.
- `src/integrations/supabase/`: Supabase client configuration and TypeScript types.
- `supabase/migrations/`: Database schema versioning and SQL scripts.

## 🛠️ Getting Started

1. **Install Dependencies:** `bun install` or `npm install`
2. **Setup Environment:** Configure `.env` with your Supabase credentials.
3. **Run Development Server:** `npm run dev`
4. **Build for Production:** `npm run build`
