import styled, { css, keyframes } from "styled-components"
import ProfileAvatar from "@components/ProfileAvatar"
import type { IPost } from "@models/post";

import { FaHeart, FaShareAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { PostsContext } from "@contexts/PostContext";
import { useContext, useState } from "react";

import AvatarDefault from "@assets/images/avatar-default.png";
import { useNavigate } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import SmallProfile from "@components/SmallProfile";
import type { IAccount } from "@models/Account";
import { ErrorBoundary } from "@Error/ErrorBoundary";
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    if (!images || images.length === 0) return null;

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goTo = (index: number) => setCurrentIndex(index);

    const currentImage = images[currentIndex];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (images.length <= 1) return;
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX;
        const threshold = 40;
        if (diff > threshold) goPrev();
        if (diff < -threshold) goNext();
        setTouchStartX(null);
    };

    return (
        <PictureContainer
            tabIndex={0}
            role="region"
            aria-label="Carrossel de imagens do post"
            onKeyDown={handleKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <PostPicture key={currentImage}>
                <img
                    src={`${apiUrl}/picture/${currentImage}`}
                    alt={currentImage || `post-image-${currentIndex + 1}`}
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = AvatarDefault;
                    }}
                />
            </PostPicture>
            {images.length > 1 && (
                <>
                    <CarouselButtonLeft onClick={goPrev} aria-label="Imagem anterior">
                        <FaChevronLeft />
                    </CarouselButtonLeft>
                    <CarouselButtonRight onClick={goNext} aria-label="Próxima imagem">
                        <FaChevronRight />
                    </CarouselButtonRight>
                    <ImageCounter>{currentIndex + 1}/{images.length}</ImageCounter>
                    <DotsContainer>
                        {images.map((_, i) => (
                            <Dot
                                key={`dot-${i}`}
                                $active={i === currentIndex}
                                onClick={() => goTo(i)}
                                aria-label={`Ir para imagem ${i + 1}`}
                            />
                        ))}
                    </DotsContainer>
                </>
            )}
        </PictureContainer>
    )
}

const PostCard: React.FC<PostCardProps> = ({ post, accountId, handleOptions, handleAbout, postOptions }) => {
    const navigate = useNavigate();
    if (!post) return null;

    const { likePost, updatePostContent } = useContext(PostsContext);
    const [animateLike, setAnimateLike] = useState(false);
    const [showSmallProfile, setShowSmallProfile] = useState(false);
    const [showShareMessage, setShowShareMessage] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content || "");
    const [savingContent, setSavingContent] = useState(false);
    const [contentError, setContentError] = useState("");

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

        try {
            handleOptions("");
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

    const handleStartEditPost = () => {
        setEditedContent(post.content || "");
        setIsEditingContent(true);
        setContentError("");
    }

    const handleCancelEditContent = () => {
        setIsEditingContent(false);
        setEditedContent(post.content || "");
        setContentError("");
    }

    const handleSaveContent = async () => {
        const newContent = editedContent.trim();
        if (!newContent) {
            setContentError("O conteúdo não pode estar vazio.");
            return;
        }
        try {
            setSavingContent(true);
            await updatePostContent(post.id, newContent);
            setSavingContent(false);
            setIsEditingContent(false);
        } catch (e) {
            setSavingContent(false);
            setContentError("Erro ao salvar o conteúdo. Tente novamente.");
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



                        {postOptions === post.id && <PostModal postId={post.id} initialContent={post.content || ""} moreOptions={post.account.id === accountId} closeModal={handleOptions} handleAbout={handleAbout} handleShare={handleShare} onEditPost={handleStartEditPost} />}

                    </PostHeader>
                    {!isEditingContent ? (
                        <ContentText>{post.content || "Sem conteúdo"}</ContentText>
                    ) : (
                        <ContentEditorContainer>
                            <ContentTextArea
                                value={editedContent}
                                maxLength={1000}
                                onChange={(e) => setEditedContent(e.target.value)}
                                placeholder="Edite o conteúdo do post"
                                autoFocus
                            />
                            {contentError && <ContentError>{contentError}</ContentError>}
                            <ContentActions>
                                <ContentButton disabled={savingContent} onClick={handleSaveContent}>
                                    {savingContent ? "Salvando..." : "Salvar"}
                                </ContentButton>
                                <ContentButton onClick={handleCancelEditContent}>
                                    Cancelar
                                </ContentButton>
                            </ContentActions>
                        </ContentEditorContainer>
                    )}
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
    position: relative;
    display: flex;
    overflow: hidden;
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    max-block-size: 60vh;
    min-block-size: 220px;
    border-radius: 8px;
    outline: none;

    @media (max-width: 600px) {
        aspect-ratio: 4 / 3;
    }
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
        border-radius: 8px;
        user-select: none;
    }
`;

const CarouselButtonBase = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
    z-index: 5;

    &:hover {
        background: rgba(0, 0, 0, 0.5);
    }
`;

const CarouselButtonLeft = styled(CarouselButtonBase)`
    left: 8px;
`;

const CarouselButtonRight = styled(CarouselButtonBase)`
    right: 8px;
`;

const DotsContainer = styled.div`
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 5;
`;

const Dot = styled.button<{ $active: boolean }>`
    width: 8px;
    height: 8px;
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'rgba(255,255,255,0.5)')};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease, background 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const ImageCounter = styled.span`
    position: absolute;
    top: 8px;
    right: 10px;
    padding: 4px 8px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 12px;
    z-index: 6;
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

const ContentText = styled.div`
    color: white;
    word-break: break-word;
`;

const ContentEditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
`;

const ContentTextArea = styled.textarea`
    width: 100%;
    min-height: 100px;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.06);
    color: white;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}30;
    }
`;

const ContentActions = styled.div`
    display: flex;
    gap: 8px;
`;

const ContentButton = styled.button`
    padding: 8px 12px;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        transform: translateY(-1px);
    }
`;

const ContentError = styled.span`
    color: #ff6b6b;
    font-size: 0.8rem;
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