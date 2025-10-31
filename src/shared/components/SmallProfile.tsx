import { styled } from "styled-components";
import type { IAccount } from "../models/Account";
import ProfileDetails from "../../features/profile/components/ProfileDetails";
import type { IAccountStatus } from "../models/AccountStatus";
const apiUrl = import.meta.env.VITE_API_URL;


import avatarDefault from "@/shared/assets/images/avatar-default.png";

export default function SmallProfile({ account }: { account: IAccount }) {

    if (!account) return null;
    return (
        <ProfileContainer>
            <Avatar src={account.avatar ? `${apiUrl}/api/picture/${account.avatar}` : avatarDefault} alt={account.name} />
            <ProfileDetails account={account} accountStatus={{ achievements: account.achievements, postCount: account.postCount } as unknown as IAccountStatus} />
        </ProfileContainer>
    )
}

const ProfileContainer = styled.div`
    position: absolute;
    display: flex;
    width: fit-content;
    align-items: center;
    background-color: ${({ theme }) => theme?.colors.tertiary};

    padding: 10px 14px;
    border-radius: 10px;
    filter: drop-shadow(0px 15px 10px rgba(0, 0, 0, 0.5));
    cursor: pointer;
    transition: transform 0.15s ease-in-out;
    top: 50px;
    left: 60px;
    
    &:hover {
    transform: scale(1.02);
    }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
`;