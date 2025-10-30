import styled from "styled-components";
import type IComment from "../../../shared/models/Comments";
import defaultAvatar from "../../../shared/assets/images/avatar-default.png";
const apiUrl = import.meta.env.VITE_API_URL;


interface PostCommentsProps {
    comments: IComment[];
    lastCommentRef?: (node: HTMLDivElement | null) => void;
    postId: string;
    onReply: (parentId: string, content: string) => Promise<void> | void;
}

import { useState } from "react";

export default function PostComments({ comments, lastCommentRef, postId, onReply }: PostCommentsProps) {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>("");

    const topLevel = comments?.filter(c => !c.parent);

    const handleSendReply = async (parentId: string) => {
        if (!replyText.trim()) return;
        await onReply(parentId, replyText.trim());
        setReplyText("");
        setReplyingTo(null);
    }

    return (
        <CommentsContainer>
            <h3>Comentários</h3>
            {topLevel?.map((comment, index) => {
                const isLast = index === topLevel.length - 1;
                const replies = comments?.filter(c => c.parent === comment.id) || [];

                return (
                    <CommentContainer key={comment.id} ref={isLast ? lastCommentRef : null}>
                        <CommentArea>

                            <CommentAvatar src={
                                comment?.account?.avatar ? `${apiUrl}/api/picture/${comment.account.avatar}` : defaultAvatar} alt="" />
                            <div>
                                <AvatarContainer>
                                    <p>{comment.account?.name}</p>
                                </AvatarContainer>
                                <CommentContent>{comment.content}</CommentContent>

                                <CommentOptions>
                                    <p className="no-select" onClick={() => setReplyingTo(prev => prev === comment.id ? null : comment.id)}>Responder</p>
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
                                        <ReplyButton onClick={() => handleSendReply(comment.id)}>Responder</ReplyButton>
                                    </ReplyBox>
                                )}
                            </div>

                        </CommentArea>
                        {replies.length > 0 && (
                            <RepliesContainer>
                                {replies.map(reply => (
                                    <ReplyItem key={reply.id}>
                                        <CommentAvatar src={
                                            reply?.account?.avatar ? `${apiUrl}/api/picture/${reply.account.avatar}` : defaultAvatar} alt="" />
                                        <div>
                                            <AvatarContainer>
                                                <p>{reply.account?.name}</p>
                                            </AvatarContainer>
                                            <CommentContent>{reply.content}</CommentContent>
                                        </div>
                                    </ReplyItem>
                                ))}
                            </RepliesContainer>
                        )}
                    </CommentContainer>)
            })}
        </CommentsContainer>)
}

const CommentArea = styled.div`
    display: flex;
    flex-direction: row;
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

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.quinary};
    border-radius: 20px;
    padding: 10px;
    gap: 10px;
`;

const CommentContent = styled.p`
`;

const CommentsContainer = styled.div`
    display: flex;
    padding: 10px;
    width: 100%;
    max-width: 600px;
    min-height: 100%;
    flex-direction: column;
    gap: 10px;
    background-color: ${({ theme }) => theme.colors.quarternary};
    color: white;
    flex: 1;
`;

const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
`;

const CommentAvatar = styled.img`
    --size: 40px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
`;

const RepliesContainer = styled.div`
    margin-left: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ReplyItem = styled.div`
    display: flex;
    gap: 10px;
    background-color: ${({ theme }) => theme.colors.quinary};
    border-radius: 12px;
    padding: 8px;
`;

const ReplyBox = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
    align-items: flex-start;
`;

const ReplyInput = styled.textarea`
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: none;
    background-color: ${({ theme }) => theme.colors.quinary};
    color: white;
    min-height: 36px;
    max-width: 80%;
`;

const ReplyButton = styled.button`
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
`;