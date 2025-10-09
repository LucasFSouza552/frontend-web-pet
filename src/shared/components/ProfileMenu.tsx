import { useContext } from "react";
import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import ProfileAvatar from "./ProfileAvatar";

import avatarDefault from "../assets/images/avatar-default.png";
import { AuthContext } from "../../features/auth/AuthContext";

const ProfileMenuContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  width: 100%;
  max-width: 400px;
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  gap: 15px;

  p {
    margin: 0;
    font-weight: 500;
    color: #333;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// Gera um menu de perfil com avatar, nome do usuário e botão de sair
// Normalmente usado no lado superior direito da tela no header
export default function ProfileMenu() {
  const { account, logout } = useContext(AuthContext);
  return (
    <ProfileMenuContainer>
      <ProfileAvatar avatar={account?.avatar} alt="avatar" />
      <p>{account?.name}</p>
      <PrimaryButton text="Sair" type="button" filled onClick={logout} />
    </ProfileMenuContainer>
  )
}
