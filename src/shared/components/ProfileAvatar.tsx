import styled from "styled-components";

import avatarDefault from "@/shared/assets/images/avatar-default.png";

export default function ProfileAvatar({ avatar, alt, width = 40 }: { avatar?: string, alt: string, width?: number }) {
    return (
        <AvatarContainer width={width}>
            <img src={avatar || avatarDefault} alt={alt} />
        </AvatarContainer>
    );
}

const AvatarContainer = styled.div<{ width: number }>`
    border-radius: 50%;
    overflow: hidden;
    width: ${({ width }) => width}px;
    height: ${({ width }) => width}px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;