import { useContext } from "react";
import styled from "styled-components";
import { PrimaryButton } from "./PrimaryButton";
import ProfileAvatar from "./ProfileAvatar";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ProfileContext } from "../contexts/ProfileContext";

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
  cursor: pointer;

  p {
    margin: 0;
    font-weight: 500;
    color: #333;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background-color:  #dfdfdf;
  }
`;

// Gera um menu de perfil com avatar, nome do usuário e botão de sair
// Normalmente usado no lado superior direito da tela no header
export default function ProfileMenu() {
  const { logout } = useContext(AuthContext);
  const { account } = useContext(ProfileContext);
  const navigate = useNavigate();

  const profileClick = (accountId: string) => {
    navigate(`/profile/${accountId}`);
  }

  if (!account) return null;


  return (
    <ProfileMenuContainer onClick={() => profileClick(account?.id)}>
      <ProfileAvatar avatar={account?.avatar} alt="avatar" />
      <p>{account?.name}</p>
      <PrimaryButton text="Sair" type="button" filled onClick={logout} />
    </ProfileMenuContainer>
  )
}
