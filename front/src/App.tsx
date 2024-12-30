import Body from "./components/Body";
import Header from "./components/Header";
import { ThemeProvider } from "@/components/theme-provider";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="bg-[#f1f3ee] dark:bg-[#212c40] w-screen h-screen relative">
        <Header />
        <Body />
      </div>
    </ThemeProvider>
  );
};

export default App;
