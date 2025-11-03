import { styled } from "styled-components";
import { useState } from "react";
import SmallProfile from "@components/SmallProfile";
import type IComment from "@models/Comments";
import { useNavigate } from "react-router-dom";
import type { IAccount } from "@/shared/models/Account";
import ProfileAvatar from "@/shared/components/ProfileAvatar";

interface PostCommentProps {
    comment: IComment;
    onReply: (parentId: string, content: string) => Promise<void> | void;
}

export default function CommentCard({ comment, onReply }: PostCommentProps) {
    const navigate = useNavigate();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>("");
    const [showSmallProfile, setShowSmallProfile] = useState<boolean>(false);

    const handleSendReply = async (parentId: string) => {
        if (!replyText.trim()) return;
        await onReply(parentId, replyText.trim());
        setReplyText("");
        setReplyingTo(null);
    }

    const handleToReply = (commentId: string) => {
        setReplyingTo(prev => prev === commentId ? null : commentId)
    }

    const handleSmallProfile = () => {
        setShowSmallProfile(!showSmallProfile);
    }

    const handleProfile = (accountId: string) => {
        navigate(`/profile/${accountId}`);
    }
    return (
        <CommentArea>
            <CommentHeader className="no-select">
                <CommentProfileContainer onMouseEnter={handleSmallProfile} onMouseLeave={handleSmallProfile} onClick={() => handleProfile(comment.account.id)}>
                    <ProfileAvatar avatar={comment.account.avatar} alt={comment.account.name} />
                    <span>{comment.account.name || "Unknown"}</span>
                    {showSmallProfile && comment.account && <SmallProfile account={comment.account as IAccount} />}
                </CommentProfileContainer>
            </CommentHeader>

            <CommentContent>{comment.content}</CommentContent>

            <CommentOptions>
                <p className="no-select" onClick={() => handleToReply(comment.id)}>Responder</p>
            </CommentOptions>
            {replyingTo === comment.id && (
                <ReplyBox>
                    <ReplyInput
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escreva uma resposta..."
                        onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                            const target = e.currentTarget;
                            target.style.height = "auto";
                            target.style.height = target.scrollHeight + "px";
                        }}
                    />
                    <ReplyActions>
                        <ReplyButton onClick={() => handleSendReply(replyingTo)}>Responder</ReplyButton>
                        <CancelButton onClick={() => setReplyingTo(null)}>Cancelar</CancelButton>
                    </ReplyActions>
                </ReplyBox>
            )}
        </CommentArea>
    );
}

const CommentContent = styled.p`

`;

const CommentProfileContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    padding: 8px;
    border-radius: 50px;
    cursor: pointer;
    
    span {
        font-weight: bold;
    }

    &:hover {
        text-decoration: underline;
    }
`;

const CommentHeader = styled.div`
      display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.quinary};
    
    
    position: relative;
    border-radius: 50px;
`;


const CommentArea = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const CommentOptions = styled.div`
margin-top: 10px;
p { 
        cursor: pointer;
        background-color: ${({ theme }) => theme.colors.quarternary};
        padding: 5px 10px;
        width: fit-content;
        border-radius: 20px;
        border: solid 1px ${({ theme }) => theme.colors.quarternary};

        &:hover {
            background-color: ${({ theme }) => theme.colors.tertiary};
        }
        
    }
` ;


const ReplyBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
`;

const ReplyInput = styled.textarea`
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: none;
    background-color: ${({ theme }) => theme.colors.quarternary};
    color: white;
    min-height: 36px;
    resize: none;
`;

const ReplyActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const ReplyButton = styled.button`
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }
`;

const CancelButton = styled.button`
    padding: 8px 16px;
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }
`;