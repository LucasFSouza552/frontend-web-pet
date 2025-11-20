import { useState } from "react";

export function useResponsiveSidebar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return {
        isMenuOpen,
        toggleMenu,
        closeMenu
    };
}

