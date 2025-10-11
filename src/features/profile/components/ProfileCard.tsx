import background from "../../../shared/assets/images/background.png";
import ProfileDetails from "./ProfileDetails";
import ProfileAvatar from "../../../shared/components/ProfileAvatar";
import styled from "styled-components";
import type { IAccountStatus } from "../../../shared/models/accountStatus";
import type { IAccount } from "../../../shared/models/account";

export default function ProfileCard({ account, accountStatus }: { account: IAccount | null, accountStatus?: IAccountStatus | null }) {

    return (
        <ProfileContainer>
            <ProfileContent>
                {<ProfileAvatar avatar={account?.avatar} alt="avatar" width={150} border />}

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
`;

