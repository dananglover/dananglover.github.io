import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (window.location.host == 'dananglover.lovable.app') {
    window.location.href = 'https://dananglover.github.io'
}

createRoot(document.getElementById("root")!).render(<App />);
