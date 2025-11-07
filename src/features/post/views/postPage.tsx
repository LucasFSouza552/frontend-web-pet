import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";

import Section from "@styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { PostsContext } from "@contexts/PostContext";
import { ProfileContext } from "@contexts/ProfileContext";
import { CommentsContext } from "@contexts/CommentContext";

import SideBar from "@/shared/components/Sidebar";
import PostsContainerList from "../components/PostsContainerList";
import PostComments from "../components/CommentsContainerList";

import type { IPost } from "@/shared/models/Post";
import type IComment from "@/shared/models/Comments";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { account } = useContext(ProfileContext);
  const { currentPostDetails } = useContext(PostsContext);
  const { createComment, loadCommentsByPostId, replyComment } = useContext(CommentsContext);

  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);
  const [newComment, setNewComment] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoadingPost(true);
    setComments([]);
    setPage(1);
    setHasMore(true);

    currentPostDetails(id)
      .then((post) => {
        setPost(post)
      })
      .finally(() => setLoadingPost(false));
  }, [id]);

  useEffect(() => {
    if (!id || !hasMore || loadingPost) return;

    loadCommentsByPostId(id, page)
      .then((data: IPost | null) => {
        const newComments = data?.comments ?? [];
        if (!newComments.length) {
          setHasMore(false);
          return;
        }

        setComments((prev) => {
          const ids = new Set(prev.map((c) => c.id));
          const uniques = newComments.filter((c) => !ids.has(c.id));
          return [...prev, ...uniques];
        });

        if (newComments.length < 10) setHasMore(false);
      })
      .catch(() => setHasMore(false));
  }, [id, page, hasMore, loadingPost ]);

  const observeLastComment = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node || !hasMore) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      });
      observer.current.observe(node);
    },
    [hasMore]
  );

  const handleSubmit = async () => {
    if (!newComment.trim() || !post?.id) return;
    try {
      const comment = await createComment(post.id, newComment);
      if (comment) setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
    }
  };

  if (loadingPost || !post) {
    return (
      <Container>
        <Background />
        <LoadingContainer />
      </Container>
    );
  }

  return (
    <Container>
      <Background />
      <Content>
        <StickySidebar>
          <SideBar account={account} />
        </StickySidebar>

        <Main>
          <PostsContainerList account={account} posts={[post]} title="" refCallback={() => { }} />

          <CommentBox>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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
            comments={comments}
            lastCommentRef={observeLastComment}
            onReply={async (parentId: string, content: string) => {
              try {
                const reply = await replyComment(parentId, content);
                if (reply) setComments((prev) => [...prev, reply]);
              } catch (error) {
                console.error("Erro ao responder comentário:", error);
              }
            }}
          />

          {!hasMore && <EndText>Sem mais comentários.</EndText>}
        </Main>
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

const StickySidebar = styled.div`
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: fit-content;
  max-height: calc(100dvh - 30px);
  overflow-y: auto;
  z-index: 10;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 2px;
  }
  
  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    max-height: none;
    z-index: 1;
  }
`;

const Main = styled.div`
  flex: 2;
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
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
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  width: 100%;
`;
