# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 🚀 Deploying to Vercel

You can easily deploy this React frontend to [Vercel](https://vercel.com/):

1. **Push your code to GitHub, GitLab, or Bitbucket.**
2. **Go to [vercel.com/import](https://vercel.com/import) and import your repository.**
3. **Set the build settings:**
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Set environment variables if needed (e.g., for API URLs).**
5. **Click Deploy!**

> **Note:**  
> To connect to your Django backend running at `http://localhost:8000/api/`, you may need to update API URLs for production or use a proxy.
