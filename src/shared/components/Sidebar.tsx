import styled, { useTheme } from "styled-components";
import type { IAccount } from "../models/Account";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { PrimaryButton } from "./PrimaryButton";

import { FaHome, FaBullhorn, FaHandsHelping, FaHeart, FaUsers, FaSearch } from "react-icons/fa";
import logo from "@assets/images/logo.png";
import { useMemo, type JSX } from "react";

interface NavItem {
    label: string;
    path: string;
    icon: JSX.Element;
}



export default function SideBar({ account }: { account: IAccount | null }) {
    const theme = useTheme();
    const iconsConfig = useMemo(() => ({ color: theme.colors.primary, size: "1.5em" }), [theme.colors.primary]);
    const navItems: NavItem[] = [
        { label: "Página Principal", path: "/", icon: <FaHome color={iconsConfig.color} size={iconsConfig.size} /> },
        // { label: "Pesquisar", path: "/", icon: <FaSearch color={iconsConfig.color} size={iconsConfig.size} /> },
        { label: "Divulgação", path: "/disclosure", icon: <FaBullhorn color={iconsConfig.color} size={iconsConfig.size} /> },
        { label: "Suporte", path: "/support", icon: <FaHandsHelping color={iconsConfig.color} size={iconsConfig.size} /> },
        { label: "Match", path: "/match", icon: <FaHeart color={iconsConfig.color} size={iconsConfig.size} /> },
    ];

    return (
        <SidebarContainer>
            <LogoWrapper >
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </LogoWrapper>

            <NavLinks>
                {navItems.map((item) => (
                    <NavLink key={item.path} to={item.path}>
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </NavLink>
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
    max-width: 50px;
    height: auto;
    object-fit: contain;
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
  background-color: rgba(44, 39, 43, 0.85);
  border: 1px solid #B648A0;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(182, 72, 160, 0.3);
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

const NavLinks = styled.nav`
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
`;

const NavLink = styled(Link)`
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
`;
