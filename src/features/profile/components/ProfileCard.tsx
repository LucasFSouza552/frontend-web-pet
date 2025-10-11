import { useContext } from "react";


import avatarDefault from "@/shared/assets/images/avatar-default.png";
import background from "../../../shared/assets/images/background.png";


import ProfileDetails from "./ProfileDetails";
import ProfileAvatar from "../../../shared/components/ProfileAvatar";
import { AuthContext } from "../../auth/AuthContext";
import styled from "styled-components";

export default function ProfileCard() {

    const { account } = useContext(AuthContext);
    return (
        <ProfileContainer>
            {/* <ProfileBackground /> */}
            <ProfileContent>
                {<ProfileAvatar avatar={account?.avatar || avatarDefault} alt="avatar" width={150} />}

                <ProfileDetails account={account || null} />
            </ProfileContent>
        </ProfileContainer>
    )
}

const ProfileContent = styled.div`
    width: 80%;
    display: flex;

`

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

