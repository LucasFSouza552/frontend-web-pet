import { useContext } from "react";
import ProfileAvatar from "../../../components/ProfileAvatar";
import ProfileDetails from "./ProfileDetails";
import { AuthContext } from "../../../contexts/AuthContext";
import avatarDefault from "../../../assets/avatar-default.png";

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