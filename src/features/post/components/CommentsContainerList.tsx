import styled from "styled-components";
import { useState } from "react";
import type IComment from "@models/Comments";
import CommentCard from "./CommentCard";
import ReplyCard from "./ReplyCard";

interface PostCommentsProps {
    comments: IComment[];
    lastCommentRef?: (node: HTMLDivElement | null) => void;
    onReply: (parentId: string, content: string) => Promise<void> | void;
}

export default function PostComments({ comments, lastCommentRef, onReply }: PostCommentsProps) {
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

    const toggleReplies = (commentId: string) => {
        setExpandedReplies(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const topLevel = comments?.filter(c => !c.parent);

    return (
        <CommentsContainer>
            <h3>Comentários</h3>
            {topLevel?.map((comment, index) => {
                const isLast = index === topLevel.length - 1;
                const replies = comments?.filter(c => c.parent === comment.id) || [];
                const isExpanded = expandedReplies.has(comment.id);
                
                return (
                    <CommentContainer key={comment.id} ref={isLast ? lastCommentRef : null}>
                        <CommentCard comment={comment} onReply={onReply} />
                        {replies.length > 0 && (
                            <RepliesSection>
                                <RepliesToggle onClick={() => toggleReplies(comment.id)}>
                                    {isExpanded ? 'Ocultar' : 'Ver'} {replies.length} {replies.length === 1 ? 'resposta' : 'respostas'}
                                </RepliesToggle>
                                {isExpanded && (
                                    <RepliesContainer>
                                        {replies.map(reply => (
                                            <ReplyCard key={reply.id} reply={reply} />
                                        ))}
                                    </RepliesContainer>
                                )}
                            </RepliesSection>
                        )}
                    </CommentContainer>
                )
            })}
        </CommentsContainer>
    )
}



const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.quinary};
    border-radius: 20px;
    padding: 10px;
    gap: 10px;
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

const RepliesSection = styled.div`
    margin-left: 48px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const RepliesToggle = styled.button`
    background-color: ${({ theme }) => theme.colors.quarternary};
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 0.9rem;
    width: fit-content;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.tertiary};
    }
`;

const RepliesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
