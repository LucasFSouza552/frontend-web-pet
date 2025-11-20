import { useContext } from "react";
import { styled } from "styled-components";

import Section from "@styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { ProfileContext } from "@contexts/ProfileContext";
import { CommentsContext } from "@contexts/CommentContext";

import SideBar from "@components/Sidebar";
import PostsContainerList from "../components/PostsContainerList";
import PostComments from "../components/CommentsContainerList";

import useManagePostController from "../controller/useManagePostController";
import TrendingPosts from "@/features/community/components/TrendingPosts";
import StickySidebar from "@/shared/styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";

export default function PostPage() {
  const { account } = useContext(ProfileContext);
  const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();
  const { replyComment, editComment, deleteComment } = useContext(CommentsContext);
  const { 
    post, 
    loadingPost,
    handleSubmit,
    newComment,
    handleUpdateNewCommentValue,
    hasMoreComments, 
    loadingComments,
    lastCommentRef
  } = useManagePostController();

  if (loadingPost || !post) {
    return (
      <Container>
        <Background />
        <LoadingContainer>
          <p>Carregando post...</p>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ResponsiveSidebar 
        account={account} 
        isMenuOpen={isMenuOpen} 
        onCloseMenu={closeMenu}
      />
      <Background />
      <Content>
        <StickySidebar>
          <SideBar account={account} />
        </StickySidebar>

        <Main>
          <HamburgerButton onClick={toggleMenu} />
          <PostsContainerList account={account} posts={[post]} title="" refCallback={() => { }} />

          <CommentBox>
            <textarea
              value={newComment}
              onChange={handleUpdateNewCommentValue}
              placeholder="Escreva um comentário..."
              onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                const target = e.currentTarget;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button onClick={handleSubmit} disabled={!newComment.trim()}>
              Enviar
            </button>
          </CommentBox>
          
          <PostComments
            comments={post.comments || []}
            lastCommentRef={lastCommentRef}
            currentUserId={account?.id}
            onReply={async (parentId: string, content: string) => {
              try {
                await replyComment(parentId, content);
              } catch (error) {
                console.error("Erro ao responder comentário:", error);
              }
            }}
            onEdit={async (commentId: string, content: string) => {
              try {
                await editComment(post.id, commentId, content);
              } catch (error) {
                console.error("Erro ao editar comentário:", error);
              }
            }}
            onDelete={async (commentId: string) => {
              try {
                await deleteComment(post.id, commentId);
              } catch (error) {
                console.error("Erro ao excluir comentário:", error);
              }
            }}
          />

          {loadingComments && (
            <LoadingCommentsText>Carregando mais comentários...</LoadingCommentsText>
          )}

          {!hasMoreComments && post.comments && post.comments.length > 0 && (
            <EndText>Sem mais comentários.</EndText>
          )}
        </Main>

        <StickySidebar>
          <TrendingPosts />
        </StickySidebar>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: url(${backgroundPage}) center/cover repeat fixed;
  z-index: 0;
  pointer-events: none;
`;

const Content = styled(Section)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: calc(100dvh - var(--header-height, 80px));
  padding: 1.25rem;
  gap: 1.25rem;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;


const Main = styled.div`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.quarternary || "rgba(44, 39, 43, 0.85)"};
  border: 1px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(182, 72, 160, 0.25);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: visible;

  &:hover {
    box-shadow: 0 6px 24px rgba(182, 72, 160, 0.35);
  }

  @media (max-width: 1024px) {
    width: 100%;
    max-width: 100%;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    border-radius: 8px;
  }
`;

const CommentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.quinary || "rgba(54, 49, 53, 0.6)"};
  border-radius: 12px;
  border: 1px solid rgba(182, 72, 160, 0.3);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.1);
  }

  textarea {
    flex: 1;
    resize: none;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(44, 39, 43, 0.6)"};
    color: white;
    border: 1px solid rgba(182, 72, 160, 0.2);
    padding: 0.75rem;
    min-height: 44px;
    max-height: 120px;
    font-size: 0.9rem;
    font-family: inherit;
    transition: all 0.2s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
      box-shadow: 0 0 0 2px rgba(182, 72, 160, 0.15);
    }

    &:hover {
      border-color: rgba(182, 72, 160, 0.4);
    }
  }

  button {
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    color: white;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(182, 72, 160, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const EndText = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1rem;
  padding: 1rem;
`;

const LoadingCommentsText = styled.p`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1rem;
  padding: 1rem;
  font-style: italic;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  width: 100%;
`;
