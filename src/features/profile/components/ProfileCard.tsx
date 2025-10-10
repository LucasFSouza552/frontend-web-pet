import { useContext } from "react";


import avatarDefault from "@/shared/assets/images/avatar-default.png";

import ProfileDetails from "./ProfileDetails";
import ProfileAvatar from "../../../shared/components/ProfileAvatar";
import { AuthContext } from "../../auth/AuthContext";
import styled from "styled-components";

export default function ProfileCard() {

    const { account } = useContext(AuthContext);
    
    return (
        <ProfileContainer>
            {<ProfileAvatar avatar={account?.avatar || avatarDefault} alt="avatar" width={150} />}

            <ProfileDetails account={account || null} />
        </ProfileContainer>
    )
}

const ProfileContainer = styled.div`
  display: flex;  
  width: 100%;
  padding: 15px;
`;

