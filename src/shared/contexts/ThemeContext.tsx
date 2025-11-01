import { createContext, useContext, useEffect, useState } from "react";
import { saveStorage } from "../../shared/utils/StorageUtils";
import { darkTheme, lightTheme } from "../../shared/styles/Theme";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyle from "../../shared/styles/SlobalStyle";


interface ThemeContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { }
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        saveStorage("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const currentTheme = theme === "light" ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <StyledThemeProvider theme={currentTheme}>
                <GlobalStyle theme={currentTheme} />
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);