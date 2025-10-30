# BookIt Frontend

This is the frontend for the BookIt application, built with React, TypeScript, Vite, and TailwindCSS.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Backend server (see [backend README](../backend/README.md) for setup)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Bookit/frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
```

Update the `VITE_API_URL` to point to your backend API URL if it's different from the default.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `yarn dev`

Runs the app in development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview` or `yarn preview`

Serves the production build from the `dist` folder. Useful for testing the production build locally.

### `npm run lint` or `yarn lint`

Runs the linter to check for code quality issues.

## Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── lib/          # Utility functions
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Helper functions
│   ├── App.tsx       # Main App component
│   └── main.tsx      # Application entry point
├── .env              # Environment variables
├── tailwind.config.js # TailwindCSS configuration
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
```

## Key Dependencies

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide Icons
- Radix UI
- Class Variance Authority

## Development

This project uses:

- [Vite](https://vitejs.dev/) for fast development and building
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [TailwindCSS](https://tailwindcss.com/) for styling
- [ESLint](https://eslint.org/) for code linting

## Browser Support

The application supports all modern browsers (Chrome, Firefox, Safari, Edge).

## License

ISC
