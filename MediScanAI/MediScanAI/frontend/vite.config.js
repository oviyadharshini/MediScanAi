// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "396a5ee1-5de4-4a83-a0e4-51de3118f208-00-1yapvl3nz6wrq.picard.replit.dev",
    ],
    port: 5173, // default Vite port
    open: true, // auto open browser when running locally
  },
});
