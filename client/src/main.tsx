import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main script loaded and attempting to render App.");

createRoot(document.getElementById("root")!).render(<App />);