import styled from "styled-components";

import avatarDefault from "@/shared/assets/images/avatar-default.png";

export default function ProfileAvatar({ avatar, alt, width = 40, border }: { avatar?: string, alt: string, width?: number, border?: boolean }) {
  return (
    <AvatarContainer width={width} border={border}>
      <img src={avatar ? `http://localhost:3000/api/picture/${avatar}` : avatarDefault} alt={alt} />
    </AvatarContainer>
  );
}

const AvatarContainer = styled.div<{ width: number; border?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.bg || "white"};
  border: ${({ border, theme }) =>
    border ? `5px solid ${theme.colors.primary}` : "none"};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;