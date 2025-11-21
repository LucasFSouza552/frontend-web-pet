import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PostsContext } from "@contexts/PostContext";
import { useNavigate, useParams } from "react-router-dom";
import type { IPost } from "@models/Post";
import { CommentsContext } from "@contexts/CommentContext";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";

export default function useManagePostController() {
    const { id } = useParams<{ id: string }>();
    const idRef = useRef<string | undefined>(id);

    const [error, setError] = useState("");
    const [post, setPost] = useState<IPost | null>(null);
    const navigate = useNavigate();
    const [loadingPost, setLoadingPost] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [commentsPage, setCommentsPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);

    const { archivePost, currentPostDetails, posts, userPosts } = useContext(PostsContext);
    const { createComment, loadCommentsByPostId } = useContext(CommentsContext);
    const { handleError, showSuccess } = useErrorHandler();


    useEffect(() => {
        idRef.current = id;
    }, [id]);

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (!id || post) return;

        setLoadingPost(true);
        setCommentsPage(1);
        setHasMoreComments(true);

        loadCommentsByPostId(id, 1).then((result) => {
            if (result && result.post) {
                setPost(result.post);
                setHasMoreComments(result.commentsReturned >= 10);
                setCommentsPage(2);
                setLoadingPost(false);
            } else {
                currentPostDetails(id).then((postData) => {
                    setPost(postData);
                    setHasMoreComments(false);
                    setLoadingPost(false);
                }).catch((error) => {
                    console.error("Erro ao buscar post:", error);
                    setHasMoreComments(false);
                    setLoadingPost(false);
                });
            }
        }).catch((error) => {
            console.error("Erro ao carregar comentários:", error);
            currentPostDetails(id).then((postData) => {
                setPost(postData);
                setHasMoreComments(false);
                setLoadingPost(false);
            }).catch((err) => {
                console.error("Erro ao buscar post:", err);
                setHasMoreComments(false);
                setLoadingPost(false);
            });
        });
    }, [id, currentPostDetails, loadCommentsByPostId]);

    useEffect(() => {
        if (!id) return;
        const allPosts = [...posts, ...userPosts];
        const updated = allPosts.find(p => p.id === id);
        if (updated) {
            setPost(updated);
        }
    }, [posts, userPosts, id]);

    const loadMoreComments = useCallback(async () => {
        const currentId = idRef.current;

        if (!currentId || !hasMoreComments || loadingComments) return;

        try {
            setLoadingComments(true);
            const result = await loadCommentsByPostId(currentId, commentsPage);
            if (result && result.post) {
                setPost(result.post);
                setHasMoreComments(result.commentsReturned >= 10);
                setCommentsPage(prev => prev + 1);
            } else {
                setHasMoreComments(false);
            }
        } catch (error) {
            console.error("Erro ao carregar mais comentários:", error);
            setHasMoreComments(false);
        } finally {
            setLoadingComments(false);
        }
    }, [hasMoreComments, loadingComments, loadCommentsByPostId, commentsPage]);

    const lastCommentRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            
            if (!node || !hasMoreComments || loadingComments) {
                return;
            }
            
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMoreComments && !loadingComments) {
                        loadMoreComments();
                    }
                },
                {
                    rootMargin: '100px',
                    threshold: 0.1
                }
            );
            
            observer.current.observe(node);
        },
        [hasMoreComments, loadMoreComments, loadingComments]
    );

    const handleDeletePost = async (postId: string) => {
        try {
            await archivePost(postId);
            showSuccess("Post excluído com sucesso!");
            navigate('/');
            setError("");
        } catch (error) {
            handleError(error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erro inesperado ao apagar post.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim() || !post?.id) return;
        try {
            await createComment(post.id, newComment);
            setNewComment("");
            
            const allPosts = [...posts, ...userPosts];
            const updatedPost = allPosts.find(p => p.id === post.id);
            if (updatedPost) {
                setPost(updatedPost);
            }
        } catch (err) {
            console.error("Erro ao criar comentário:", err);
        }
    };

    useEffect(() => {
        if (!id || !post) return;
        
        const allPosts = [...posts, ...userPosts];
        const updatedPost = allPosts.find(p => p.id === id);
        
        if (updatedPost && updatedPost.comments?.length !== post.comments?.length) {
            setPost(updatedPost);
        }
    }, [id, posts, userPosts, post]);

    const handleUpdateNewCommentValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value || "");
    };

    return {
        error,
        handleDeletePost,
        post,
        loadingPost,
        handleSubmit,
        newComment,
        handleUpdateNewCommentValue,
        hasMoreComments,
        loadingComments,
        lastCommentRef
    };
}