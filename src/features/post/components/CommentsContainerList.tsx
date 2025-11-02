import styled from "styled-components";
import type IComment from "@models/Comments";
import defaultAvatar from "@assets/images/avatar-default.png";
import CommentCard from "./CommentCard";

const apiUrl = import.meta.env.VITE_API_URL;

interface PostCommentsProps {
    comments: IComment[];
    lastCommentRef?: (node: HTMLDivElement | null) => void;
    onReply: (parentId: string, content: string) => Promise<void> | void;
}

export default function PostComments({ comments, lastCommentRef, onReply }: PostCommentsProps) {

    const topLevel = comments?.filter(c => !c.parent);

    return (
        <CommentsContainer>
            <h3>Comentários</h3>
            {topLevel?.map((comment, index) => {
                const isLast = index === topLevel.length - 1;
                const replies = comments?.filter(c => c.parent === comment.id) || [];
                return (
                    <CommentContainer key={comment.id} ref={isLast ? lastCommentRef : null}>
                        <CommentCard comment={comment} onReply={onReply} />
                        {replies.length > 0 && (
                            <RepliesContainer>
                                {replies.map(reply => (
                                    <ReplyItem key={reply.id}>
                                        <CommentAvatar src={
                                            reply?.account?.avatar ? `${apiUrl}/picture/${reply.account.avatar}` : defaultAvatar} alt="" />
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
    position: relative;
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
