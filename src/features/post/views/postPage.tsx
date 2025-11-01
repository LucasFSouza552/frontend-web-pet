import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import PostComments from "../components/PostComments";
import { styled } from "styled-components";
import Section from "../../../shared/styles/SectionStyle";
import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import PostsContainerList from "../components/PostsContainerList";
import { AuthContext } from "@/features/account/auth/AuthContext";
import { PostsContext } from "../../../app/contexts/PostContext";
import type { IPost } from "@/shared/models/Post";
import { HeaderComponent } from "@/shared/components/HeaderComponent";

export default function PostPage() {
    const { account } = useContext(AuthContext);
    const { loadPostDetails, loadPostComments, posts, addComment } = useContext(PostsContext);

    const [post, setPost] = useState<IPost | null>(null);

    const { id } = useParams<{ id: string }>();

    const [loadingPost, setLoadingPost] = useState(false);
    const [commentsPages, setCommentsPages] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [newComment, setNewComment] = useState("");

    const handleSubmit = () => {
        if (newComment.trim() === "") return;
        const updatedPost = addComment(post?.id || "", newComment);
        setNewComment("");
        setPost((prevPost) => prevPost ? { ...prevPost, ...updatedPost } : prevPost);
    };

    const observer = useRef<IntersectionObserver | null>(null);

    const observeLastComment = useCallback(
        (node: HTMLDivElement | null) => {
            if (loadingPost) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setCommentsPages((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loadingPost]
    );

    useEffect(() => {
        if (!id) return;
        setLoadingPost(true);
        loadPostDetails(id).then((p: IPost) => {
            if (!p) return;
            setPost((prevPost) => prevPost ? { ...p, comments: [...(p.comments || []), ...(prevPost.comments || [])] } : p);
        })
            .finally(() => setLoadingPost(false));

    }, [id, posts]);

    useEffect(() => {
        if (!id || !hasMoreComments) return;
        setLoadingPost(true);
        loadPostComments(id, commentsPages)
            .then((comments) => {
                if ((comments || [])?.length < 10) setHasMoreComments(false);
                if (!comments) return;
                setPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), ...comments] } : prev);
            })
            .finally(() => setLoadingPost(false));
    }, [id, commentsPages]);

    if (!post) {
        return (
            <LoadingContainer>
                <div className="spinner"></div>
            </LoadingContainer>
        );
    }

    return (
        <PostContainer>
            <HeaderComponent account={account} />
            <SectionContent>
                <PostArea>
                    <PostsContainerList account={account} posts={[post]} title="" refCallback={() => { }} />
                    <AddCommentContainer>
                        <CommentInputArea>
                            <CommentInput
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Adicione um comentário..."
                                onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                                    const target = e.currentTarget;
                                    target.style.height = "auto";
                                    target.style.height = target.scrollHeight + "px";
                                }}
                            />
                            <SubmitButton onClick={handleSubmit}>Enviar</SubmitButton>
                        </CommentInputArea>
                    </AddCommentContainer>
                    <PostComments
                        comments={post.comments || []}
                        lastCommentRef={observeLastComment}
                        postId={post.id}
                        onReply={async (parentId: string, content: string) => {
                            const newC = await addComment(post.id, content, parentId);
                            setPost(prev => prev ? { ...prev, comments: [...(prev.comments || []), newC] } : prev);
                        }}
                    />
                    {loadingPost && <LoadingText>Carregando mais comentários...</LoadingText>}
                </PostArea>
            </SectionContent>
        </PostContainer>
    );
}

const AddCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const CommentInputArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1rem;
  height: auto;
  padding: 5px;
`;

const CommentInput = styled.textarea`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: ${({ theme }) => theme.colors.quinary};
  border-radius: 4px;
  color: white;
  max-width: 80%;
  border: none;
  min-height: 40px;
  overflow: hidden;
`;

const SubmitButton = styled.button`
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
    border: transparent 1px solid;
    
    &:hover {
        border: white 1px solid;
        color: white;
    }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100%;

  .spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-left-color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #aaa;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const PostArea = styled.div`
    max-width: 600px;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    display: flex;
    color: white;
    margin-top: 10px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.quarternary};
`;


const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
    width: 100%;
`

const SectionContent = styled(Section)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-direction: column; width: 100%;
    height: 100%;
    min-height: calc(100dvh - var(--header-height));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
`;