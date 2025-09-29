import { useContext } from "react";
import ProfileAvatar from "../../../components/ProfileAvatar";
import ProfileDetails from "./ProfileDetails";
import { AuthContext } from "../../../contexts/AuthContext";

export default function ProfileCard() {

    const { account } = useContext(AuthContext);

    return (
        <div>
            <p>{account?.name}</p>
            {account?.avatar && <ProfileAvatar avatar={account.avatar} alt="avatar" width={150} />}
            <ProfileDetails account={account || null} />
        </div>
    )
}