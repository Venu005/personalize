# Personalized Dashboard
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Venu005/personalize)

A modern, responsive dashboard that aggregates and personalizes content from multiple sources, including news, movies, and social media, built with Next.js and Redux Toolkit.

## Key Features

-   **Multi-Source Content**: Aggregates real-time news from **NewsAPI**, movie data from **TMDB**, and a mock social media feed.
-   **Personalized Feed**: A customizable home feed that mixes content based on user preferences.
-   **Drag & Drop Interface**: Easily reorder items in your personalized feed using `@dnd-kit`.
-   **User Authentication**: Secure login and registration system powered by NextAuth.js, with credentials and Google providers.
-   **Database Integration**: Uses Prisma and PostgreSQL to persist user data, preferences, and sessions.
-   **Favorites System**: Save and manage your favorite content across all categories.
-   **Comprehensive Search**: A global search feature to find content across news, movies, and social posts.
-   **Dynamic Theming**: Switch between light and dark modes.
-   **Internationalization (i18n)**: Supports multiple languages including English, Hindi, Portuguese, and more.
-   **Responsive Design**: A fully responsive layout for seamless use on desktop, tablet, and mobile devices.

## Getting Started

### Prerequisites

-   Node.js (LTS version recommended)
-   npm or yarn
-   PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/venu005/personalize.git
cd personalize
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables.

#### Database URL
You need a running PostgreSQL instance. Your connection string will look something like this:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

#### API Keys
This application requires API keys from NewsAPI and The Movie Database (TMDB) to fetch content.

-   **NewsAPI**:
    1.  Go to [newsapi.org](https://newsapi.org/) and sign up for a free developer account.
    2.  Copy your API key from your account dashboard.
-   **TMDB API**:
    1.  Go to [themoviedb.org](https://www.themoviedb.org/) and create an account.
    2.  Navigate to `Settings > API` and request a developer API key (v3 auth).

Your final `.env.local` file should look like this:

```env
# --- Database ---
# Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"

# --- API Keys ---
# Replace with your actual keys
NEWSAPI_KEY="YOUR_NEWSAPI_KEY"
TMDB_API_KEY="YOUR_TMDB_API_KEY"

# --- NextAuth ---
# Generate a secret key using: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"

# --- Google OAuth (Optional) ---
# GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
# GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
```

### 4. Set Up the Database

Apply the database schema and seed it with initial user data.

```bash
# Apply migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```
This will create two sample users:
-   `user1@example.com` (password: `password1`)
-   `user2@example.com` (password: `password2`)


### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can log in with one of the seeded users to see the personalized features.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/)
-   **Persistence**: [Redux Persist](https://github.com/rt2zz/redux-persist)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
-   **Internationalization**: [i18next](https://www.i18next.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## API Endpoints

The application uses its own backend API routes to securely interact with external services.

| Endpoint          | Method | Description                                     | Query Parameters                                                                |
| ----------------- | ------ | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `/api/news`       | `GET`  | Fetches news articles.                          | `q`, `category`, `country`, `pageSize`, `page`                                  |
| `/api/movies`     | `GET`  | Fetches movies.                                 | `q`, `genre`, `page`                                                            |
| `/api/social`     | `GET`  | Fetches mock social media posts.                | `hashtag`                                                                       |
| `/api/search`     | `GET`  | Searches across all content types.              | `q`, `type`                                                                     |
| `/api/user`       | `GET`  | Retrieves the current authenticated user's data.| -                                                                               |
| `/api/user`       | `PATCH`| Updates the current user's preferences.         | -                                                                               |
| `/api/auth/*`     | -      | Handles all authentication-related logic.       | (Handled by NextAuth.js)                                                        |

## Project Structure

The codebase is organized into the following key directories:

```
├── app/                  # Next.js App Router: Pages and API routes
│   ├── api/              # Backend API endpoints
│   ├── auth/             # Authentication pages (login, register)
│   ├── (main)/           # Main dashboard pages (home, news, movies, etc.)
│   └── layout.tsx        # Root layout
├── components/           # Reusable React components
│   ├── cards/            # Content display cards
│   ├── dialogs/          # Modal dialogs (search, welcome)
│   ├── layout/           # Core layout components (header, sidebar)
│   └── ui/               # UI primitives from shadcn/ui
├── lib/                  # Helper functions, constants, and third-party initializations
├── prisma/               # Prisma schema, migrations, and seed script
├── store/                # Redux Toolkit setup
│   ├── slices/           # Redux state slices (user, content, ui)
│   └── api.ts            # RTK Query API definitions
└── public/               # Static assets
