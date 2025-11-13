import { styled } from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type IComment from "@models/Comments";
import type { IAccount } from "@/shared/models/Account";
import ProfileAvatar from "@/shared/components/ProfileAvatar";
import SmallProfile from "@components/SmallProfile";

interface ReplyCardProps {
    reply: IComment;
    onEdit: (commentId: string, content: string) => Promise<void> | void;
    onDelete: (commentId: string) => Promise<void> | void;
    currentUserId?: string;
}

export default function ReplyCard({ reply, onEdit, onDelete, currentUserId }: ReplyCardProps) {
    const navigate = useNavigate();
    const [showSmallProfile, setShowSmallProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(reply.content);
    const isOwner = currentUserId === reply.account?.id;

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
                {isEditing ? (
                    <ReplyEditContainer>
                        <ReplyTextarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                                const target = e.currentTarget;
                                target.style.height = "auto";
                                target.style.height = target.scrollHeight + "px";
                            }}
                        />
                        <ReplyActions>
                            <ReplySaveButton
                                onClick={async () => {
                                    if (!editText.trim()) return;
                                    await onEdit(reply.id, editText.trim());
                                    setIsEditing(false);
                                }}
                            >
                                Salvar
                            </ReplySaveButton>
                            <ReplyCancelButton onClick={() => {
                                setEditText(reply.content);
                                setIsEditing(false);
                            }}>Cancelar</ReplyCancelButton>
                        </ReplyActions>
                    </ReplyEditContainer>
                ) : (
                    <ReplyText>{reply.content}</ReplyText>
                )}
                {isOwner && (
                    <ReplyOptions>
                        <button onClick={() => setIsEditing(true)}>Editar</button>
                        <button onClick={() => onDelete(reply.id)}>Excluir</button>
                    </ReplyOptions>
                )}
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

const ReplyEditContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ReplyTextarea = styled.textarea`
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: none;
    background-color: ${({ theme }) => theme.colors.quarternary};
    color: white;
    min-height: 48px;
    resize: none;
`;

const ReplyActions = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const ReplySaveButton = styled.button`
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

const ReplyCancelButton = styled.button`
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

const ReplyOptions = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;

    button {
        background-color: ${({ theme }) => theme.colors.quarternary};
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
            background-color: ${({ theme }) => theme.colors.tertiary};
        }
    }
`;

