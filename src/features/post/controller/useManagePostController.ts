import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PostsContext } from "@contexts/PostContext";
import { useNavigate, useParams } from "react-router-dom";
import type { IPost } from "@/shared/models/post";
import { CommentsContext } from "@/shared/contexts/CommentContext";

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


    useEffect(() => {
        idRef.current = id;
    }, [id]);

    useEffect(() => {
        if (!id || post) return;


        setLoadingPost(true);
        setCommentsPage(1);
        setHasMoreComments(true);

        loadCommentsByPostId(id, 1).then((data) => {
            if (data) {
                const commentsCount = data.comments?.length || 0;
                console.log('commentsCount', data);
                setPost(data);
                setHasMoreComments(commentsCount >= 10);
                setCommentsPage(2);
                setLoadingPost(false);
            }
        }).catch((error) => {
            console.error("Erro ao carregar comentários:", error);
            setHasMoreComments(false);
            setLoadingPost(false);
        });

        // currentPostDetails(id)
        //     .then((postData) => {
        //         setPost(postData);
        //         setLoadingPost(false);

        //         if (postData) {

        //         }
        //     })
        //     .catch((error) => {
        //         setError(error.message);
        //         setLoadingPost(false);
        //     });
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
            const data = await loadCommentsByPostId(currentId, commentsPage);
            if (data) {
                setPost(data);

                setHasMoreComments(data.comments?.length && data.comments.length > 10 || false);
                setCommentsPage(prev => prev + 1);
            }
        } catch (error) {
            console.error("Erro ao carregar mais comentários:", error);
            setHasMoreComments(false);
        } finally {
            setLoadingComments(false);
        }
    }, [hasMoreComments, loadingComments, loadCommentsByPostId, commentsPage]);

    // const lastCommentRef = useCallback(
    //     (node: HTMLDivElement | null) => {
    //         if (observer.current) observer.current.disconnect();
    //         observer.current = new IntersectionObserver((entries) => {
    //             if (entries[0].isIntersecting && hasMoreComments && !loadingComments) {
    //                 loadMoreComments();
    //             }
    //         });
    //         if (node) observer.current.observe(node);
    //     },
    //     [hasMoreComments, loadMoreComments, loadingComments]
    // );

    const handleDeletePost = async (postId: string) => {
        try {
            await archivePost(postId);
            navigate('/');
            setError("");
        } catch (error) {
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
        } catch (err) {
            console.error("Erro ao criar comentário:", err);
        }
    };

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
        loadingComments
    };
}