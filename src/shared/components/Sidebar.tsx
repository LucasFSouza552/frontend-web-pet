import styled, { useTheme } from "styled-components";
import type { IAccount } from "../models/Account";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { PrimaryButton } from "./PrimaryButton";

import { FaHome, FaHandsHelping, FaHeart, FaDonate, FaHandHoldingHeart } from "react-icons/fa";
import logo from "@assets/images/logo.png";
import { useMemo, type JSX } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

// Paleta de cores baseada em #D960A7
const PRIMARY_PINK = "#D960A7";
const PRIMARY_PINK_LIGHT = "#E88BC4";
const PRIMARY_PINK_DARK = "#C44A8A";
const PRIMARY_PINK_LIGHTER = "#F5B8DB";
const PRIMARY_PINK_DARKER = "#A83A6F";

export default function SideBar({ account }: { account: IAccount | null }) {
  const iconsConfig = useMemo(() => ({ color: PRIMARY_PINK, size: "1.5em" }), []);

  const navItems: NavItem[] = [
    { label: "Página Principal", path: "/", icon: <FaHome size={iconsConfig.size} /> },
    { label: "Match", path: "/match", icon: <FaHeart size={iconsConfig.size} /> },
    { label: "Suporte", path: "/support", icon: <FaHandsHelping size={iconsConfig.size} /> },
    { label: "Doar", path: "/DonatePage", icon: <FaDonate size={iconsConfig.size} /> },
    { label: "Instituições", path: "/institutions", icon: <FaHandHoldingHeart size={iconsConfig.size} /> }
  ];

  return (
    <SidebarContainer>
      <LogoWrapper>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </LogoWrapper>

      <NavLinks>
        {navItems.map((item) => (
          <NavItemLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavItemLink>
        ))}
      </NavLinks>

      <DividerSection>
        <DividerLine />
        <DividerText>Adote. Ame. Transforme vidas</DividerText>
        <DividerLine />
      </DividerSection>

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
  margin-bottom: 20px;

  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

const SidebarContainer = styled.aside`
  height: 100%;
  min-height: calc(100dvh - 5dvh);
  max-height: calc(100dvh - var(--header-height, 80px) - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 24px 18px;
  background: linear-gradient(135deg, rgba(40, 36, 40, 0.98) 0%, rgba(30, 27, 30, 0.95) 100%);
  border: none;
  border-radius: 20px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px ${PRIMARY_PINK}30;
  color: #fff;
  transition: all 0.2s ease;
  backdrop-filter: blur(12px);
  gap: 16px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, ${PRIMARY_PINK}20, ${PRIMARY_PINK_DARK}10);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.5;
  }

  &:hover {
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.35),
      inset 0 0 0 1px ${PRIMARY_PINK}40;
  }

  @media (max-width: 900px) {
    width: 100%;
    justify-content: space-evenly;
    padding: 16px 12px;
    height: auto;
    max-height: none;
    gap: 12px;
    border-radius: 16px;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
  flex: 1;

  @media (max-width: 900px) {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    flex: 0;
    gap: 6px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }
`;

const NavItemLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.3px;
  padding: 0 16px;
  border-radius: 12px;
  border: none;
  transition: all 0.15s ease;
  background-color: rgba(255, 255, 255, 0.04);
  position: relative;

  .icon {
    font-size: 1.25em;
    width: 1.25em;
    height: 1.25em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${PRIMARY_PINK};
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  &:hover {
    background-color: ${PRIMARY_PINK}20;
    color: #fff;

    .icon {
      color: ${PRIMARY_PINK_LIGHT};
      transform: rotate(3deg);
    }
  }

  &.active {
    background: linear-gradient(135deg, ${PRIMARY_PINK}30, ${PRIMARY_PINK_DARK}20);
    color: #fff;
    box-shadow: 
      0 4px 12px ${PRIMARY_PINK}25,
      0 0 0 1px ${PRIMARY_PINK}40,
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);

    .icon {
      color: ${PRIMARY_PINK_LIGHT};
      filter: drop-shadow(0 0 4px ${PRIMARY_PINK}80);
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 70%;
      background: linear-gradient(180deg, ${PRIMARY_PINK}, ${PRIMARY_PINK_LIGHT});
      border-radius: 0 2px 2px 0;
    }
  }

  @media (max-width: 900px) {
    justify-content: center;
    font-size: 0.8rem;
    height: 44px;
    padding: 0 12px;
    gap: 10px;
  }
`;

const DividerSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;

  @media (max-width: 900px) {
    display: none;
  }
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${PRIMARY_PINK}40, transparent);
`;

const DividerText = styled.span`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  font-style: italic;
  text-align: center;
  white-space: nowrap;
  letter-spacing: 0.5px;
`;

const ProfileSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;

  flex-direction: row;

  @media (max-width: 900px) {
    padding-top: 12px;
    margin-top: 0;
    gap: 10px;
  }
`;
