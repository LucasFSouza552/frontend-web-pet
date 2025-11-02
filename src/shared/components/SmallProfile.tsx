import { styled } from "styled-components";
import type { IAccount } from "../models/Account";
import type { IAccountStatus } from "../models/AccountStatus";
import ProfileDetails from "@/features/account/profile/components/ProfileDetails";

export default function SmallProfile({ account, top, left }: { account: IAccount, top?: number, left?: number }) {

    if (!account) return null;
    return (
        <ProfileContainer style={{ top: `${top}px`, left: `${left}px` }}>
            <Avatar src={account.avatar} alt={account.name} />
            <ProfileDetails account={account} accountStatus={{ achievements: account.achievements, postCount: account.postCount } as unknown as IAccountStatus} />
        </ProfileContainer>
    )
}

const ProfileContainer = styled.div`
    position: absolute;
    display: flex;
    z-index: 9999;
    width: max-content;
    align-items: center;
    background-color: ${({ theme }) => theme?.colors.tertiary};

    padding: 10px 14px;
    border-radius: 10px;
    filter: drop-shadow(0px 15px 10px rgba(0, 0, 0, 0.5));
    cursor: pointer;
    transition: transform 0.15s ease-in-out;
    top: 80%;
    left: 10%;
    
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