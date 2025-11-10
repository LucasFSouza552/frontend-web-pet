import ProfileDetails from "./ProfileDetails";
import ProfileAvatar from "@components/ProfileAvatar";
import styled from "styled-components";
import type { IAccount } from "@/shared/models/Account";
import type { IAccountStatus } from "@/shared/models/AccountStatus";
import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import EditProfile from "./EditProfileModal";

export default function ProfileCard({ account, accountStatus }: { account: IAccount | null, accountStatus?: IAccountStatus | null }) {
    const [statusModal, setStatusModal] = useState(false);
    return (
        <ProfileContainer>
            <ProfileContent>
                <ProfileAvatar avatar={account?.avatar || ""} alt="avatar" width={150} border />
                <ProfileDetails
                    account={account || null}
                    accountStatus={accountStatus}
                />
                <EditProfileButton onClick={() => setStatusModal(true)}>
                    Editar <FaRegEdit />
                </EditProfileButton>
                {statusModal && <EditProfile />}
            </ProfileContent>
        </ProfileContainer>
    )
}

const ProfileContent = styled.div`
    width: 80%;
    display: flex;
    color: white;
`;

const EditProfileButton = styled.button`
    background: linear-gradient(33deg,rgba(74, 58, 70, 1) 0%, rgba(182, 72, 160, 1) 32%);
    height: 5%;
    width: 10%;
    text-align: center;
    color: white;
    padding: 12px;
    margin-left: 15px;
    border-radius: 50px;
`;

const ProfileContainer = styled.div`
    display: flex;
    width: 100%;
    padding: 15px;
    justify-content: center;
    align-items: center;
    background-position: center;
    border-radius: 1.5rem 0 0 1.5rem;
    background: linear-gradient(51deg,rgba(74, 58, 70, 0.6) 0%, rgba(182, 72, 160, 0.5) 80%);
`;

