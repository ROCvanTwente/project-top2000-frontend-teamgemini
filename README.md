# Top 2000 Frontend - Team Gemini

A modern React-based frontend application for the Top 2000 project, built by Team Gemini at ROC van Twente.

## 📋 About

This is the frontend application for the Top 2000 project, providing a user-friendly interface to interact with Top 2000 data and features. The application is built with modern web technologies and connects to a backend API for data management.

## 🛠️ Technology Stack

- **React 19.2.0** - Modern UI library for building interactive user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite 7.2.4** - Fast build tool and development server
- **ESLint** - Code quality and consistency
- **CSS** - Styling

## ✅ Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js)
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ROCvanTwente/project-top2000-frontend-teamgemini.git
   cd project-top2000-frontend-teamgemini
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (or copy from `.env.example` if available):
   ```env
   VITE_API_URL=http://localhost:5237
   ```
   
   Update the `VITE_API_URL` to point to your backend API server.

## 💻 Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode with hot module replacement (HMR).

Open [http://localhost:5173](http://localhost:5173) (default Vite port) to view it in your browser.

The page will reload when you make changes, and you'll see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.

It compiles TypeScript and bundles React code optimally for the best performance. The build is minified and the filenames include hashes for caching.

### `npm run preview`

Previews the production build locally. Run this after `npm run build` to test the production build before deploying.

### `npm run lint`

Runs ESLint to check code quality and identify potential issues. This helps maintain consistent code style across the project.

## 🔧 Development Workflow

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Make your changes** in the `src` directory

3. **Lint your code** before committing
   ```bash
   npm run lint
   ```

4. **Build and test** before deploying
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
project-top2000-frontend-teamgemini/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, and other assets
│   ├── components/     # React components
│   │   └── Users.tsx   # Example user component
│   ├── App.tsx         # Main application component
│   ├── App.css         # Application styles
│   ├── api.js          # API utility functions
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── .env                # Environment variables (not in git)
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 🔌 API Integration

The application connects to a backend API using the configuration specified in the `.env` file. 

- **Local Development**: `http://localhost:5237`
- **Production**: Configure as needed

API calls are handled through the `src/api.js` utility module.

## 👥 Team

**Team Gemini** - ROC van Twente

## 📝 License

This project is private and intended for educational purposes at ROC van Twente.

## 🤝 Contributing

This is a team project for ROC van Twente. If you're a team member:

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request for review

## 📞 Support

For questions or issues, please contact your team members or instructor at ROC van Twente.

---

**Note**: This project was created with Vite + React + TypeScript template and customized for the Top 2000 project requirements.
