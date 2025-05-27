# 🧡 Danang Lover - PWA

*A community-driven Progressive Web App for Danang enthusiasts to share their favorite spots and stories.*

## ✅ **Implemented Features**

### 🔧 **Core Architecture**
- ✅ **3-Layer Architecture**: UI Layer, Service Layer, Repository Layer
- ✅ **TypeScript**: Strict mode with complete type definitions
- ✅ **Supabase Integration**: Full backend integration with authentication
- ✅ **PWA Ready**: Web manifest, service worker, offline support
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS

### 🔐 **Authentication**
- ✅ **Google OAuth**: Seamless authentication via Supabase
- ✅ **User Context**: Global authentication state management
- ✅ **Protected Routes**: Authentication-gated create/edit operations
- ✅ **User Profiles**: Automatic profile creation and management

### 🗺️ **Place Explorer**
- ✅ **Place Listings**: Paginated place browsing with filtering
- ✅ **Place Types**: Filter by Coffee Shop, Restaurant, Check-in
- ✅ **Place Details**: Full place information with photos
- ✅ **CRUD Operations**: Create, edit, delete places (authenticated users)
- ✅ **Image Upload**: Supabase Storage integration
- ✅ **Reviews System**: Rate and review places
- ✅ **Favorites**: Add places to personal favorites

### 📝 **Blog System**
- ✅ **Markdown Support**: Full Markdown rendering with `react-markdown`
- ✅ **Blog Editor**: Rich text editing with live preview
- ✅ **Blog Listings**: Paginated blog post browsing
- ✅ **Blog Details**: Full post rendering with custom styling
- ✅ **Comments**: User commenting system
- ✅ **Image Support**: Upload and display images in posts

### 🎨 **UI/UX**
- ✅ **Modern Design**: Clean, intuitive interface
- ✅ **shadcn/ui Components**: Beautiful, accessible UI components
- ✅ **Responsive Layout**: Works perfectly on all devices
- ✅ **Loading States**: Smooth loading animations
- ✅ **Error Handling**: Graceful error states

---

## 🚀 **Setup Instructions**

### 1. **Environment Setup**

Create a `.env.local` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. **Supabase Configuration**

1. Create a new Supabase project
2. Run the SQL from `database_schema.sql` in your Supabase SQL editor
3. Configure Google OAuth in Supabase Auth settings
4. Create storage buckets: `place-photos` and `blog-images`

### 3. **Install Dependencies**

```bash
npm install
```

### 4. **Development**

```bash
npm run dev
```

### 5. **Build for Production**

```bash
npm run build
```

---

## 📁 **Project Structure**

```
src/
├── components/          # UI Layer - Pure presentational components
│   ├── ui/             # shadcn/ui components
│   ├── layout/         # Layout components (Navigation)
│   ├── home/           # Homepage components
│   ├── places/         # Place-related components
│   └── blog/           # Blog-related components
├── services/           # Service Layer - Business logic
│   ├── AuthService.ts
│   ├── PlaceService.ts
│   └── BlogService.ts
├── repositories/       # Repository Layer - Data access
│   ├── AuthRepository.ts
│   ├── PlaceRepository.ts
│   └── BlogRepository.ts
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── lib/                # Utility libraries
└── hooks/              # Custom React hooks
```

---

## 🧭 **Architecture Rules**

### **UI Layer** (`components/`)
- Pure presentational React components only
- No direct Supabase calls
- Props-driven, reusable components

### **Service Layer** (`services/`)
- Business logic and orchestration
> Act as a full-stack AI app builder. Design and build a **Progressive Web App (PWA)** called **“Danang Lover”** using **Vite + React + TypeScript**.
>
> ---
>
> **🧡 Project Overview**
> *Tagline:* *A Danang lover — people, places, and thoughts.*
> Build a modern, community-driven web app for Danang enthusiasts to share their favorite spots (coffee shops, restaurants, check-in places) and personal thoughts via blogs.
>
> ---
>
> **🔑 Core Features**
>
> ### 1. Place Explorer
>
> * **Place model** includes:
>
>   * `name`, `description`, `price` (USD/VND), `photos` (uploaded), and `placeType`
>   * Place types stored in a `place_type` table with values: *Coffee Shop*, *Restaurant*, *Checkin*
> * **User Permissions**:
>
>   * Public: view places and reviews
>   * Authenticated users can:
>
>     * Create, edit, delete their own places
>     * Add reviews
>     * Add places to favorites
>
> ### 2. Blog System
>
> * Users can create **blog posts** with:
>
>   * Title, Markdown-formatted content, optional images (uploaded)
>   * Comments from other users
> * **Editor**: Support live Markdown editing with preview
> * **Blog detail page**: Render post content with full Markdown syntax (headings, code blocks, links, etc.)
> * Public: view blog posts and comments
> * Authenticated users: can write and comment
>
> ---
>
> **🧱 Architecture & Tech Stack**
>
> * **Frontend**: Vite + React + TypeScript
> * **Project Structure**:
>
>   * `UI Layer`: Components, pages, styling
>   * `Service Layer`: Business logic and orchestration
>   * `Repository Layer`: Supabase queries + localStorage access
> * **PWA**:
>
>   * Web manifest, service worker, offline fallback
> * **Authentication**:
>
>   * Use Supabase with **Google Auth** via OAuth
> * **Markdown Rendering**:
>
>   * Use a robust Markdown parser (e.g., `react-markdown` or `markdown-it`)
>
> ---
>
> **🔧 Code Quality & Config**
>
> * **ESLint**: TypeScript + React rules with Prettier integration
> * **File Upload**: Image storage via Supabase Storage API
> * **Database Naming**:
>
>   * **snake\_case** for tables
>   * **camelCase** for columns
> * **Supabase interactions** abstracted into a `Repository` layer
>
> ---
>
> **🎨 UI/UX Guidelines**
>
> * Fully responsive design
> * Intuitive navigation between Places and Blog
> * Clean Markdown editor with split view (edit/preview)
> * Smooth image upload UX
> * Auth UI for login/logout and access control
>
> ---
>
> **📦 Deliverables**
>
> * Layered folder structure
> * PWA-ready configuration (manifest, service worker)
> * ESLint + Prettier setup
> * `.env` example with Supabase keys
> * Markdown editor and renderer setup
> * Authentication with Google OAuth
>
> ---
>
> Begin generating the codebase for **Danang Lover**.
