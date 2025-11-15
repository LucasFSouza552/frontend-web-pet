import { styled } from "styled-components";
import { useState } from "react";
import SmallProfile from "@components/SmallProfile";
import type IComment from "@models/Comments";
import { useNavigate } from "react-router-dom";
import type { IAccount } from "@models/Account";
import ProfileAvatar from "@components/ProfileAvatar";

interface PostCommentProps {
    comment: IComment;
    onReply: (parentId: string, content: string) => Promise<void> | void;
    onEdit: (commentId: string, content: string) => Promise<void> | void;
    onDelete: (commentId: string) => Promise<void> | void;
    currentUserId?: string;
}

export default function CommentCard({ comment, onReply, onEdit, onDelete, currentUserId }: PostCommentProps) {
    const navigate = useNavigate();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>("");
    const [showSmallProfile, setShowSmallProfile] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const isOwner = currentUserId === comment.account?.id;

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

            {isEditing ? (
                <EditContainer>
                    <EditTextarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                            const target = e.currentTarget;
                            target.style.height = "auto";
                            target.style.height = target.scrollHeight + "px";
                        }}
                    />
                    <EditActions>
                        <EditSaveButton
                            onClick={async () => {
                                if (!editText.trim()) return;
                                await onEdit(comment.id, editText.trim());
                                setIsEditing(false);
                            }}
                        >
                            Salvar
                        </EditSaveButton>
                        <CancelButton onClick={() => {
                            setEditText(comment.content);
                            setIsEditing(false);
                        }}>Cancelar</CancelButton>
                    </EditActions>
                </EditContainer>
            ) : (
                <CommentContent>{comment.content}</CommentContent>
            )}

            <CommentOptions>
                <p className="no-select" onClick={() => handleToReply(comment.id)}>Responder</p>
                {isOwner && (
                    <>
                        <p className="no-select" onClick={() => setIsEditing(true)}>Editar</p>
                        <p className="no-select" onClick={() => onDelete(comment.id)}>Excluir</p>
                    </>
                )}
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

const EditContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const EditTextarea = styled.textarea`
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: none;
    background-color: ${({ theme }) => theme.colors.quarternary};
    color: white;
    min-height: 48px;
    resize: none;
`;

const EditActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const EditSaveButton = styled.button`
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
display: flex;
gap: 10px;
flex-direction: row;
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