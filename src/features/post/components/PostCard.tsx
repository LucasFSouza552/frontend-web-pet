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
import type { IAccount } from "@/shared/models/Account";
import { ErrorBoundary } from "@/shared/Error/ErrorBoundary";
import PostModal from "./PostModal";

const apiUrl = import.meta.env.VITE_API_URL;

interface PostCardProps {
    post: IPost;
    accountId?: string;
    onLike?: (postId: string) => void;
    handleOptions: (postId: string) => void;
    handleAbout: (postId: string) => void;
    postOptions: string;
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

const PostCard: React.FC<PostCardProps> = ({ post, accountId, handleOptions, handleAbout, postOptions }) => {
    const navigate = useNavigate();
    if (!post) return null;

    const { likePost } = useContext(PostsContext);
    const [animateLike, setAnimateLike] = useState(false);
    const [showSmallProfile, setShowSmallProfile] = useState(false);
    const [showShareMessage, setShowShareMessage] = useState(false);

    const handleLike = () => {
        setAnimateLike(true);
        if (!post.id) return console.error("Post id not found");
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

    const handleShare = async () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        const shareData = {
            title: `Post de ${post.account.name}`,
            text: post.content ? `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}` : `Confira este post de ${post.account.name}!`,
            url: postUrl
        };

        try {handleOptions("");
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(postUrl);
                setShowShareMessage(true);
                setTimeout(() => {
                    setShowShareMessage(false);
                }, 2000);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(postUrl);
                    setShowShareMessage(true);
                    setTimeout(() => {
                        setShowShareMessage(false);
                    }, 2000);
                } catch (clipboardError) {
                    console.error('Erro ao copiar link:', clipboardError);
                }
            }
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return "agora";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    return (
        <ErrorBoundary>
            <PostContainer>
                <PostContent>
                    <PostHeader className="no-select">
                        <PostProfileContainer onMouseEnter={handleSmallProfile} onMouseLeave={handleSmallProfile} onClick={() => handleProfile(post.account.id)}>
                            <ProfileAvatar avatar={post.account.avatar} alt={post.account.name} />
                            <ProfileInfo>
                                <ProfileName>{post.account.name || "Unknown"}</ProfileName>
                                <PostDate>{formatDate(post.createdAt || post.date)}</PostDate>
                            </ProfileInfo>
                            {showSmallProfile && post.account && <SmallProfile account={post.account as IAccount} />}
                        </PostProfileContainer>
                        <PostOptions onClick={() => handleOptions(post.id)}>
                            <HiDotsVertical size={25} />
                        </PostOptions>



                        {postOptions === post.id && <PostModal postId={post.id} moreOptions={post.account.id === accountId} closeModal={handleOptions} handleAbout={handleAbout}  handleShare={handleShare} />}

                    </PostHeader>
                    <div>{post.content || "Sem conteúdo"}</div>
                    <PostPictureContainer images={post.image || []} />
                </PostContent>
                <RowContainer>
                    <RowContainer className="no-select">
                        <CircleIcon onClick={handleLike}>
                            <HeartIcon $animate={animateLike} color={accountId && post?.likes?.includes(accountId) ? "red" : "white"} />
                        </CircleIcon>
                        <p>{post?.likes?.length || 0} Curtidas</p>
                    </RowContainer>
                    <RowContainer className="no-select" onClick={() => handleComments(post.id)}>
                        <CircleIcon><BsChatFill /></CircleIcon>
                        <p>Comentários</p>
                    </RowContainer>
                    <RowContainer className="no-select" onClick={handleShare}>
                        <ShareIconContainer>
                            <CircleIcon><FaShareAlt /></CircleIcon>
                            {showShareMessage && <ShareMessage>Link copiado!</ShareMessage>}
                        </ShareIconContainer>
                        <p>Compartilhar</p>
                    </RowContainer>
                </RowContainer>
            </PostContainer>
        </ErrorBoundary>
    )
}

export default PostCard;

const ProfileName = styled.span`
    font-weight: bold;
    font-size: 1rem;
    color: white;
    transition: text-decoration 0.2s ease;
`;

const PostDate = styled.span`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    font-weight: normal;
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const PostProfileContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    padding: 8px;
    border-radius: 50px;
    cursor: pointer;
    position: relative;

    &:hover ${ProfileName} {
        text-decoration: underline;
    }
`;

const PostOptions = styled.div`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.quarternary};
    padding: 5px;
    border-radius: 100%;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.colors.tertiary};
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
    max-inline-size: 70%;
    inline-size: 100%;
    gap: 5px;
    color: white;
    border-radius: 1.5rem;
`;

const PostHeader = styled.div`
    display: flex;
    position: relative;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.quinary};
    position: relative;
    border-radius: 50px;
`;

const ShareIconContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ShareMessage = styled.span`
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.75rem;
    white-space: nowrap;
    animation: fadeInOut 2s ease-in-out;
    z-index: 100;
    pointer-events: none;

    &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid ${({ theme }) => theme.colors.primary};
    }

    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
        20% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
        }
    }
`;