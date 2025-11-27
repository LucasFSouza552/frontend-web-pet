import styled from "styled-components";
import { BsX } from "react-icons/bs";
import SideBar from "./Sidebar";
import type { IAccount } from "@models/Account";

interface ResponsiveSidebarProps {
    account: IAccount | null;
    isMenuOpen: boolean;
    onCloseMenu: () => void;
}

export default function ResponsiveSidebar({ account, isMenuOpen, onCloseMenu }: ResponsiveSidebarProps) {
    return (
        <>
            {isMenuOpen && <Overlay onClick={onCloseMenu} />}
            
            <MobileSidebar $isOpen={isMenuOpen}>
                <CloseButton onClick={onCloseMenu} aria-label="Fechar menu">
                    <BsX size={28} />
                </CloseButton>
                <SideBar account={account} />
            </MobileSidebar>
        </>
    );
}

export function HamburgerButton({ onClick }: { onClick: () => void }) {
    return (
        <HamburgerButtonWrapper onClick={onClick} aria-label="Abrir menu">
            <span />
            <span />
            <span />
        </HamburgerButtonWrapper>
    );
}

const PRIMARY_PINK = "#D960A7";
const PRIMARY_PINK_LIGHT = "#E88BC4";

const HamburgerButtonWrapper = styled.button`
    display: none;
    position: relative;
    align-self: flex-start;
    margin-bottom: 1rem;
    z-index: 10;
    background: linear-gradient(135deg, rgba(40, 36, 40, 0.98) 0%, rgba(30, 27, 30, 0.95) 100%);
    border: none;
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.25),
        inset 0 0 0 1px ${PRIMARY_PINK}30;
    transition: all 0.15s ease;
    backdrop-filter: blur(12px);

    &:hover {
        background: linear-gradient(135deg, ${PRIMARY_PINK}20, ${PRIMARY_PINK}15);
        box-shadow: 
            0 6px 16px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px ${PRIMARY_PINK}40;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    span {
        display: block;
        width: 24px;
        height: 3px;
        background: white;
        border-radius: 2px;
        transition: all 0.3s ease;
    }

    @media (max-width: 1024px) {
        display: flex;
    }

    @media (max-width: 768px) {
        padding: 8px;
        gap: 4px;
        margin-bottom: 0.75rem;

        span {
            width: 22px;
            height: 2.5px;
        }
    }

    @media (max-width: 480px) {
        padding: 6px;
        gap: 3px;
        margin-bottom: 0.5rem;

        span {
            width: 20px;
            height: 2px;
        }
    }
`;

const Overlay = styled.div`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(4px);

    @media (max-width: 1024px) {
        display: block;
    }
`;

const MobileSidebar = styled.div<{ $isOpen: boolean }>`
    display: none;
    position: fixed;
    top: 0;
    left: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: linear-gradient(135deg, rgba(40, 36, 40, 0.98) 0%, rgba(30, 27, 30, 0.95) 100%);
    box-shadow: 
        4px 0 24px rgba(0, 0, 0, 0.4),
        inset -1px 0 0 ${PRIMARY_PINK}20;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem 1rem 1rem;
    backdrop-filter: blur(12px);

    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${PRIMARY_PINK};
        border-radius: 2px;
        transition: background 0.15s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${PRIMARY_PINK_LIGHT};
    }

    @media (max-width: 1024px) {
        display: block;
    }

    @media (max-width: 768px) {
        padding: 1.25rem 0.75rem 0.75rem;
    }

    @media (max-width: 480px) {
        padding: 1rem 0.5rem 0.5rem;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    border-radius: 12px;
    color: white;
    cursor: pointer;
    transition: all 0.15s ease;
    z-index: 1001;
    box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 0 0 1px ${PRIMARY_PINK}30;

    &:hover {
        background: ${PRIMARY_PINK}20;
        transform: rotate(90deg);
        box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px ${PRIMARY_PINK}40;
    }

    &:active {
        transform: rotate(90deg) scale(0.95);
    }

    @media (max-width: 480px) {
        top: 0.75rem;
        left: 0.75rem;
        width: 36px;
        height: 36px;
    }
`;

