import styled from "styled-components";
import type IComment from "../../../shared/models/Comments";
import defaultAvatar from "../../../shared/assets/images/avatar-default.png";
const apiUrl = import.meta.env.VITE_API_URL;


interface PostCommentsProps {
    comments: IComment[];
    lastCommentRef?: (node: HTMLDivElement | null) => void;
}

export default function PostComments({ comments, lastCommentRef }: PostCommentsProps) {

    return (
        <CommentsContainer>
            <h3>Comentários</h3>
            {comments?.map((comment, index) => {
                const isLast = index === comments.length - 1;

                return (
                    <CommentContainer key={comment.id} ref={isLast ? lastCommentRef : null}>
                        <CommentArea>

                            <CommentAvatar src={
                                comment.account.avatar ? `${apiUrl}/api/picture/${comment.account.avatar}` : defaultAvatar} alt="" />
                            <div>
                                <AvatarContainer>
                                    <p>{comment.account.name}</p>
                                </AvatarContainer>
                                <CommentContent>{comment.content}</CommentContent>

                                <CommentOptions>
                                    <p className="no-select">Responder</p>
                                </CommentOptions>
                            </div>

                        </CommentArea>
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