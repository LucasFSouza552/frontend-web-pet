import styled, { useTheme } from "styled-components";
import type { IAccount } from "../models/Account";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { PrimaryButton } from "./PrimaryButton";

import { FaHome, FaHandsHelping, FaHeart, FaUsers, FaDonate, FaHandHoldingHeart } from "react-icons/fa";
import logo from "@assets/images/logo.png";
import { useMemo, useState, type JSX } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
}



export default function SideBar({ account }: { account: IAccount | null }) {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const iconsConfig = useMemo(() => ({ color: theme.colors.primary, size: "1.5em" }), [theme.colors.primary]);

  const navItems: NavItem[] = [
    { label: "Página Principal", path: "/", icon: <FaHome color={iconsConfig.color} size={iconsConfig.size} /> },
    { label: "Match", path: "/match", icon: <FaHeart color={iconsConfig.color} size={iconsConfig.size} /> },
    { label: "Suporte", path: "/support", icon: <FaHandsHelping color={iconsConfig.color} size={iconsConfig.size} /> },
    { label: "Doar", path: "/DonatePage", icon: <FaDonate color={iconsConfig.color} size={iconsConfig.size} /> },
    { label: "Instituições", path: "/institutions", icon: <FaHandHoldingHeart color={iconsConfig.color} size={iconsConfig.size} /> }
  ];

  return (
    <SidebarContainer>
      <LogoWrapper >
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <HamburgerButton
          aria-label="Abrir menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </HamburgerButton>
      </LogoWrapper>

      <NavLinks $open={menuOpen}>
        {navItems.map((item) => (
          <NavItemLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setMenuOpen(false)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavItemLink>
        ))}
      </NavLinks>

      <ProfileSection>
        {!account ? (
          <>
            <PrimaryButton text="Anunciar" type="button" filled to="/" />
            <PrimaryButton text="Entrar" type="button" filled={false} to="/login" />
          </>
        ) : (
          <ProfileMenu />
        )}
      </ProfileSection>
    </SidebarContainer>
  );
}

const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
`;
const SidebarContainer = styled.aside`
  width: 260px;
  height: 100%;
  min-height: calc(100dvh - 30px);
  max-height: calc(100dvh - var(--header-height, 80px) - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 25px 15px;
  background-color: ${({ theme }) => theme.colors.quarternary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  box-shadow: 0 0 12px ${({ theme }) => theme.colors.primary};
  color: #fff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    box-shadow: 0 0 20px rgba(182, 72, 160, 0.4);
  }

  @media (max-width: 900px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px;
    height: auto;
    max-height: none;
  }
`;

const NavLinks = styled.nav<{ $open: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;

  @media (max-width: 900px) {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
`;

const NavItemLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-decoration: none;
  color: #fff;
  text-transform: uppercase;
  font-weight: light;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  background-color: rgba(30, 27, 30, 0.6);

  .icon {
    font-size: 12px;
  }

  &:hover {
    background-color: rgba(182, 72, 160, 0.2);
    border-color: #b648a0;
  }

  &.active {
    background-color: rgba(182, 72, 160, 0.3);
    border-color: #b648a0;
  }

  @media (max-width: 900px) {
    justify-content: center;
    font-size: 0.8rem;
  }
`;

const ProfileSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgba(182, 72, 160, 0.3);

  @media (max-width: 900px) {
    border-top: none;
    padding-top: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  gap: 4px;
  cursor: pointer;

  align-items: center;
  justify-content: center;

  span {
    display: block;
    width: 22px;
    height: 2px;
    background: white;
    border-radius: 1px;
  }

  @media (max-width: 768px) {
    display: inline-flex;
    flex-direction: column;
  }
`;
