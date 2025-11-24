import styled, { css, keyframes } from "styled-components"
import ProfileAvatar from "@components/ProfileAvatar"
import type { IPost } from "@models/Post";

import { FaHeart, FaShareAlt } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import SmallProfile from "@components/SmallProfile";
import type { IAccount } from "@/shared/models/Account";
import PostModal from "./PostModal";
import PostPictureContainer from "./PostPictureContainer";
import { formatRelativeDate } from "@utils/dateUtils";
import { usePostCardController } from "../controller/usePostCardController";

interface PostCardProps {
    post: IPost;
    accountId?: string;
    onLike?: (postId: string) => void;
    handleOptions: (postId: string) => void;
    handleAbout: (postId: string) => void;
    postOptions: string;
}


const PostCard: React.FC<PostCardProps> = ({ post, accountId, handleOptions, handleAbout, postOptions }) => {
    if (!post) return null;

    const {
        animateLike,
        showSmallProfile,
        showShareMessage,
        isEditingContent,
        editedContent,
        savingContent,
        contentError,
        setEditedContent,
        handleLike,
        handleComments,
        handleProfile,
        handleSmallProfile,
        handleShare,
        handleStartEditPost,
        handleCancelEditContent,
        handleSaveContent
    } = usePostCardController({ post, accountId, handleOptions });

    return (
            <PostContainer>
                <PostContent>
                    <PostHeader className="no-select">
                        <PostProfileContainer onMouseEnter={handleSmallProfile} onMouseLeave={handleSmallProfile} onClick={() => handleProfile(post.account.id)}>
                            <ProfileAvatar avatar={post.account.avatar} alt={post.account.name} />
                            <ProfileInfo>
                                <ProfileName>{post.account.name || "Unknown"}</ProfileName>
                                <PostDate>{formatRelativeDate(post.createdAt || post.date)}</PostDate>
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


const PostContainer = styled.div`
    block-size: auto;
    background-color: ${({ theme }) => theme.colors.quarternary};
    padding: 10px;
    display: flex;
    flex-direction: column;
    max-inline-size: 100%;
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