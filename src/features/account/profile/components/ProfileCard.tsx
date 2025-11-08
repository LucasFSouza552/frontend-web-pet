import background from "@assets/images/background.png";
import ProfileDetails from "./ProfileDetails";
import ProfileAvatar from "@components/ProfileAvatar";
import styled from "styled-components";
import type { IAccount } from "@/shared/models/Account";
import type { IAccountStatus } from "@models/AccountStatus";

export default function ProfileCard({ account, accountStatus }: { account: IAccount | null, accountStatus?: IAccountStatus | null }) {

    return (
        <ProfileContainer>
            <ProfileContent>
                {<ProfileAvatar avatar={account?.avatar || ""} alt="avatar" width={150} border />}

                <ProfileDetails
                    account={account || null}
                    accountStatus={accountStatus}
                />
            </ProfileContent>
        </ProfileContainer>
    )
}

const ProfileContent = styled.div`
    width: 80%;
    display: flex;
    color: white;
`;

const ProfileContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 15px;
    justify-content: center;
    align-items: center;
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    background-position:  left left;
    border-radius: 1.5rem 0 0 1.5rem;
    background: linear-gradient(51deg,rgba(74, 58, 70, 0.6) 0%, rgba(182, 72, 160, 0.5) 80%);
`;

