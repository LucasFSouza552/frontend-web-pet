import styled, { css, keyframes } from "styled-components"
import ProfileAvatar from "@components/ProfileAvatar"
import type { IPost } from "../../../shared/models/Post";

import { FaHeart, FaShareAlt } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { PostsContext } from "@contexts/PostContext";
import { useContext, useState } from "react";

import AvatarDefault from "@assets/images/avatar-default.png";
import { useNavigate } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import SmallProfile from "@components/SmallProfile";
import type { IAccount } from "@models/Account";

const apiUrl = import.meta.env.VITE_API_URL;

interface PostCardProps {
    post: IPost;
    accountId?: string;
    onLike?: (postId: string) => void;
    handleOptions: (postId: string) => void
}

const PostPictureContainer = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;
    return (
        <PictureContainer>
            {images.map((image) => <PostPicture>
                <img src={`${apiUrl}/picture/${image}`} alt={image || ""}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = AvatarDefault;
                    }} />
            </PostPicture>)}
        </PictureContainer>
    )
}

const PostCard: React.FC<PostCardProps> = ({ post, accountId, handleOptions }) => {
    const navigate = useNavigate();
    if (!post) return null;

    const { likePost } = useContext(PostsContext);
    const [animateLike, setAnimateLike] = useState(false);
    const [showSmallProfile, setShowSmallProfile] = useState(false);
    const handleLike = () => {
        setAnimateLike(true);
        if(!post.id) return console.error("Post id not found");
        if (!accountId) return;
        likePost(post.id);

        setTimeout(() => setAnimateLike(false), 400);
    }

    const handleComments = (postId: string) => {
        if (!accountId) return;
        navigate(`/post/${postId}`);
    }   

    const handleProfile = (accountId: string) => {
        navigate(`/profile/${accountId}`);
    }

    const handleSmallProfile = () => {
        setShowSmallProfile(!showSmallProfile);
    }
    
    return (    
        <PostContainer>
            <PostContent>
                <PostHeader className="no-select">
                    <PostProfileContainer onMouseEnter={handleSmallProfile} onMouseLeave={handleSmallProfile} onClick={() => handleProfile(post.account.id)}>
                        <ProfileAvatar avatar={post.account.avatar} alt={post.account.name} />
                        <span>{post.account.name || "Unknown"}</span>
                        {showSmallProfile && post.account && <SmallProfile account={post.account as IAccount} />}
                    </PostProfileContainer>
                    <PostOptions onClick={() => handleOptions(post.id)}>
                        <HiDotsVertical size={25} />
                    </PostOptions>
                    
                </PostHeader>
                <div>{post.title}</div>
                <PostPictureContainer images={post.image || []} />
            </PostContent>
            <RowContainer>
                <RowContainer className="no-select">
                    <CircleIcon onClick={handleLike}>
                        <HeartIcon $animate={animateLike} color={accountId && post.likes.includes(accountId) ? "red" : "white"} />
                    </CircleIcon>
                    <p>{post.likes.length || 0} Curtidas</p>
                </RowContainer>
                <RowContainer className="no-select" onClick={() => handleComments(post.id)}>
                    <CircleIcon><BsChatFill /></CircleIcon>
                    <p>Comentários</p>
                </RowContainer>
                <RowContainer className="no-select" onClick={() => { }}>
                    <CircleIcon><FaShareAlt /></CircleIcon>
                    <p>Compartilhar</p>
                </RowContainer>
            </RowContainer>
        </PostContainer>
    )
}

export default PostCard;

const PostOptions = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.quarternary};
    padding: 5px;
    border-radius: 100%;
    --size: 35px;
    justify-content: center;
    align-items: center;
    width: var(--size);
    height: var(--size);
    cursor: pointer;

    &:hover {
        background-color: ${({ theme }) => theme.colors.tertiary};
    }
`;

const PostProfileContainer = styled.div`
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

const RowContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    inline-size: 70%;
    justify-content: space-evenly;
    width: auto;

    @media (max-width: 600px) {
        p {
            display: none;
        }
    }

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
    min-inline-size: 30px;
    gap: 5px;
    block-size: 30px;
    border-radius: 50%;
    color: white;
    cursor: pointer;

    &:hover {
        background-color: ${({ theme }) => theme.colors.tertiary};
    }
    
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
    inline-size: 100%;
    block-size: auto;
    border-radius: 8px;
    padding: 10px;
    gap: 5px;
    
`;

const PictureContainer = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 8px;
    inline-size: 100%;
    block-size: 300px;
`;

const PostPicture = styled.div`
inline-size: 100%;
block-size: 100%;
    
    img {
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        border-radius: 5px;
    }
`;

const PostContainer = styled.div`
    block-size: auto;
    background-color: ${({ theme }) => theme.colors.quarternary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    max-inline-size: 600px;
    inline-size: 100%;
    gap: 5px;
    color: white;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.quinary};
    
    
    position: relative;
    border-radius: 50px;
`;