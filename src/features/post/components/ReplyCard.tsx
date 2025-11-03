import { styled } from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type IComment from "@models/Comments";
import type { IAccount } from "@/shared/models/Account";
import ProfileAvatar from "@/shared/components/ProfileAvatar";
import SmallProfile from "@components/SmallProfile";

interface ReplyCardProps {
    reply: IComment;
}

export default function ReplyCard({ reply }: ReplyCardProps) {
    const navigate = useNavigate();
    const [showSmallProfile, setShowSmallProfile] = useState(false);

    const handleProfile = (accountId: string) => {
        navigate(`/profile/${accountId}`);
    };

    const handleSmallProfile = () => {
        setShowSmallProfile(!showSmallProfile);
    };

    return (
        <ReplyItem>
            <ProfileAvatar avatar={reply.account?.avatar} alt={reply.account?.name || ""} width={36} />
            <ReplyContent>
                <ReplyHeader 
                    onMouseEnter={handleSmallProfile} 
                    onMouseLeave={handleSmallProfile} 
                    onClick={() => handleProfile(reply.account.id)}
                >
                    <ReplyName>{reply.account?.name || "Unknown"}</ReplyName>
                    {showSmallProfile && reply.account && (
                        <SmallProfile account={reply.account as IAccount} />
                    )}
                </ReplyHeader>
                <ReplyText>{reply.content}</ReplyText>
            </ReplyContent>
        </ReplyItem>
    );
}

const ReplyItem = styled.div`
    display: flex;
    gap: 10px;
    background-color: ${({ theme }) => theme.colors.quinary};
    border-radius: 12px;
    padding: 8px;
`;

const ReplyContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const ReplyHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    position: relative;
    cursor: pointer;
    width: fit-content;
    padding: 2px 4px;
    border-radius: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.colors.quarternary};
    }
`;

const ReplyName = styled.p`
    font-weight: bold;
    font-size: 0.9rem;
    margin: 0;
`;

const ReplyText = styled.p`
    margin: 0;
    font-size: 0.9rem;
    word-wrap: break-word;
`;

