import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Expenses from "./pages/Expenses";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/despesas" element={<Expenses />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
