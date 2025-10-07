import { useContext } from "react";


import avatarDefault from "@/assets/avatar-default.png";

import ProfileDetails from "./ProfileDetails";
import ProfileAvatar from "../../../shared/components/ProfileAvatar";
import { AuthContext } from "../../../app/contexts/AuthContext";

export default function ProfileCard() {

    const { account } = useContext(AuthContext);
    return (
        <div>
            <p>{account?.name}</p>
            {<ProfileAvatar avatar={account?.avatar || avatarDefault} alt="avatar" width={150} />}
            <ProfileDetails account={account || null} />
        </div>
    )
}