import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import PostComments from "../components/PostComments";
import { styled } from "styled-components";
import PostsContainerList from "../components/PostsContainerList";

import Section from "@styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { PostsContext } from "@contexts/PostContext";
import type { IPost } from "@/shared/models/Post";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import { CommentsContext } from "@/shared/contexts/CommentContext";
import SideBar from "@/shared/components/Sidebar";

export default function PostPage() {
    const { id } = useParams<{ id: string }>();
    const { account } = useContext(ProfileContext);
    const { loadPostDetails, currentPostDetails, posts, userPosts } = useContext(PostsContext);
    const { createComment, loadCommentsByPostId } = useContext(CommentsContext);

    const [loadingComments, setLoadingComments] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [post, setPost] = useState<IPost>();


    const [commentsPages, setCommentsPages] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [newComment, setNewComment] = useState("");


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
        currentPostDetails(id).then((postDetailed: IPost) => {
            if (!postDetailed) return;
            setPost(postDetailed);
        })
    }, [posts, id, userPosts]);

    const handleSubmit = () => {
        if (newComment.trim() === "") return;
        const updatedPost = createComment(post?.id || "", newComment);
        setNewComment("");
    };


    useEffect(() => {
        if (!id || !hasMoreComments) return;
        setLoadingComments(true);
        loadCommentsByPostId(id, commentsPages).then((postDetailed: IPost | null) => {
            if (!postDetailed) return;
            if (postDetailed.comments?.length === 0) setHasMoreComments(false);
            if (!postDetailed.comments) return;
            console.log(postDetailed.comments);
            setPost(postDetailed);
        }).finally(() => {
            setLoadingComments(false);
        })

    }, [id, commentsPages]);

    if (!post) {
        return (
            <div>

            </div>
        );
    }

    return (
        <PostContainer>
            <SectionContent>
                <SideBar account={account} />
                <PostWrapper>
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
                            onReply={async (content: string) => {
                                await createComment(post.id, content);
                            }}
                        />
                        {loadingComments && <LoadingText>Carregando mais comentários...</LoadingText>}
                    </PostArea>
                </PostWrapper>
            </SectionContent>
        </PostContainer>
    );
}

const PostWrapper = styled.div`
    width: 100%;
    height: max-content;
`;
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
    width: 100%;
    align-items: flex-start;
    justify-content: space-around;
    flex-direction: row; 
    width: 100%;
    height: 100%;
    min-height: calc(100dvh - var(--header-height));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
`;