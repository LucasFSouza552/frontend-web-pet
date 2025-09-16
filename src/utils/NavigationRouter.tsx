import type { ReactNode } from "react";
import { BrowserRouter, Routes } from "react-router-dom";

interface NavigationRouterProps {
    children: ReactNode;
}

export default function NavigationRouter({ children }: NavigationRouterProps) {
    return (
        <BrowserRouter>
            <Routes>
                {children}
            </Routes>
        </BrowserRouter>
    );
}