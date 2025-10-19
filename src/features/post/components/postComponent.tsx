import styled, { css, keyframes } from "styled-components"
import ProfileAvatar from "../../../shared/components/ProfileAvatar"
import type { IPost } from "../../../shared/models/Post";

import { FaHeart, FaShareAlt } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { PostsContext } from "../postContext";
import { useContext, useState } from "react";

import AvatarDefault from "../../../shared/assets/images/avatar-default.png";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

interface PostCardProps {
    post: IPost;
    accountId?: string;
    onLike?: (postId: string) => void;
}

const PostPictureContainer = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;
    return (
        <PictureContainer>
            {images.map((image) => <PostPicture>
                <img src={`${apiUrl}/api/picture/${image}`} alt={image || ""}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = AvatarDefault;
                    }} />
            </PostPicture>)}
        </PictureContainer>
    )
}

const PostCard: React.FC<PostCardProps> = ({ post, accountId }) => {
    const navigate = useNavigate();
    if (!post) return null;

    const { likePost } = useContext(PostsContext);
    const [animateLike, setAnimateLike] = useState(false);

    const handleLike = () => {
        if (!accountId) return;
        setAnimateLike(true);
        likePost(post.id);

        setTimeout(() => setAnimateLike(false), 400);
    }

    const handleComments = (postId: string) => {
        if (!accountId) return;
        navigate(`/post/${postId}`);
    }
    return (
        <PostContainer>
            <PostHeader>
                <ProfileAvatar avatar={post.account.avatar} alt={post.account.name} />
                <span>{post.account.name || "Unknown"}</span>
            </PostHeader>
            <PostContent>
                <div>{post.title}</div>
                <PostPictureContainer images={post.image || []} />
            </PostContent>
            <RowContainer>
                <RowContainer className="no-select">
                    <CircleIcon onClick={handleLike}>
                        <HeartIcon $animate={animateLike} color={accountId && post.likes.includes(accountId) ? "red" : "white"} />
                    </CircleIcon>
                    {post.likes.length || 0} Curtidas
                </RowContainer>
                <RowContainer className="no-select" onClick={() => handleComments(post.id)}>
                    <CircleIcon><BsChatFill /></CircleIcon>
                    Comentários
                </RowContainer>
                <RowContainer className="no-select" onClick={() => { }}>
                    <CircleIcon><FaShareAlt /></CircleIcon>
                    Compartilhar
                </RowContainer>
            </RowContainer>
        </PostContainer>
    )
}

export default PostCard;

const RowContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    width: 70%;
    min-width: 120px;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const CircleIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.quinary};
    min-width: 30px;
    gap: 5px;
    height: 30px;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    
`;

const HeartIcon = styled(FaHeart) <{ $animate?: boolean }>`
    color: red;
    ${({ $animate }) =>
        $animate &&
        css`
      animation: ${pulse} 0.4s ease-in-out;
    `}
`;




const PostContent = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.quinary};
    width: 100%;
    height: auto;
    border-radius: 8px;
    padding: 10px;
    gap: 5px;
    
`;

const PictureContainer = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 8px;
    width: 100%;
    height: 300px;
`;

const PostPicture = styled.div`
width: 100%;
height: 100%;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        border-radius: 5px;
    }
`;

const PostContainer = styled.div`
    /* border-radius: 20px; */
    height: auto;
    background-color: ${({ theme }) => theme.colors.quarternary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    width: 100%;
    gap: 5px;
    color: white;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    background-color: ${({ theme }) => theme.colors.quinary};
    padding: 8px;
    border-radius: 50px;
`;