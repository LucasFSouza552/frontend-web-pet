import { useContext } from "react";
import { styled } from "styled-components";
import { FaPaperPlane } from "react-icons/fa";

import Section from "@styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { ProfileContext } from "@contexts/ProfileContext";
import { CommentsContext } from "@contexts/CommentContext";
import { useToast } from "@contexts/ToastContext";

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
  const { showSuccess, showError } = useToast();
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

          <CommentSection>
            <CommentTitle>Deixe seu comentário</CommentTitle>
            <CommentBox>
              <TextAreaWrapper>
                <textarea
                  value={newComment}
                  onChange={handleUpdateNewCommentValue}
                  placeholder="Escreva um comentário..."
                  maxLength={1000}
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
                <CharacterCount $isNearLimit={newComment.length > 900}>
                  {newComment.length}/1000
                </CharacterCount>
              </TextAreaWrapper>
              <SendButton onClick={handleSubmit} disabled={!newComment.trim()}>
                <FaPaperPlane size={16} />
                <span>Enviar</span>
              </SendButton>
            </CommentBox>
          </CommentSection>
          
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
                showSuccess("Comentário excluído com sucesso!");
              } catch (error) {
                console.error("Erro ao excluir comentário:", error);
                showError("Erro ao excluir comentário. Tente novamente.");
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

const CommentSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0;
`;

const CommentTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    width: 4px;
    height: 20px;
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primary || "#B648A0"} 0%, rgba(182, 72, 160, 0.6) 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CommentBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.875rem;
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.quinary || "rgba(54, 49, 53, 0.7)"} 0%, 
    ${({ theme }) => theme.colors.quarternary || "rgba(44, 39, 43, 0.6)"} 100%
  );
  border-radius: 16px;
  border: 1.5px solid rgba(182, 72, 160, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    box-shadow: 0 0 0 4px rgba(182, 72, 160, 0.15), 
                0 6px 20px rgba(182, 72, 160, 0.25);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
    border-radius: 12px;
  }
`;

const TextAreaWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;

  textarea {
    width: 100%;
    resize: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    color: white;
    border: 2px solid rgba(182, 72, 160, 0.2);
    padding: 1rem 1rem 2.5rem 1rem;
    min-height: 56px;
    max-height: 200px;
    font-size: 0.95rem;
    font-family: inherit;
    line-height: 1.5;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.1);
    }

    &:hover:not(:focus) {
      border-color: rgba(182, 72, 160, 0.4);
      background: rgba(255, 255, 255, 0.06);
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(182, 72, 160, 0.5);
      border-radius: 3px;

      &:hover {
        background: rgba(182, 72, 160, 0.7);
      }
    }

    @media (max-width: 768px) {
      font-size: 0.9rem;
      padding: 0.875rem 0.875rem 2.25rem 0.875rem;
      min-height: 52px;
      border-radius: 10px;
    }
  }
`;

const CharacterCount = styled.span<{ $isNearLimit: boolean }>`
  position: absolute;
  bottom: 0.5rem;
  right: 0.75rem;
  font-size: 0.75rem;
  color: ${({ $isNearLimit }) => 
    $isNearLimit ? "rgba(255, 100, 100, 0.9)" : "rgba(255, 255, 255, 0.5)"};
  font-weight: ${({ $isNearLimit }) => $isNearLimit ? "600" : "400"};
  pointer-events: none;
  transition: color 0.2s ease;
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary || "#B648A0"} 0%, 
    rgba(182, 72, 160, 0.85) 100%
  );
  border: none;
  color: white;
  border-radius: 12px;
  padding: 0.875rem 1.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(182, 72, 160, 0.35);
  min-height: 56px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(182, 72, 160, 0.5);
    
    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(182, 72, 160, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(182, 72, 160, 0.2);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(2px) translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    min-height: 52px;
    font-size: 0.9rem;
    border-radius: 10px;
    
    span {
      display: none;
    }
    
    svg {
      margin: 0;
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
