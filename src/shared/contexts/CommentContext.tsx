
import type IComment from "../models/Comments";
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { commentService } from "../api/commentsService";
import { PostsContext } from "./PostContext";
import type { IPost } from "../models/Post";
import { pictureService } from "../api/pictureService";

interface CommentsContextType {
    loadCommentsByPostId: (id: string, page?: number, limit?: number) => Promise<{ post: IPost | null, commentsReturned: number }>
    createComment: (postId: string, comment: string) => Promise<IComment>
    loadingComments: boolean
    replyComment: (commentId: string, content: string) => Promise<IComment>
    loadMoreCommentsByPostId: (postId: string) => Promise<IComment[] | null | undefined>
};

export const CommentsContext = createContext<CommentsContextType>({} as CommentsContextType);

const filterNewComments = (existingComments: IComment[] | undefined, newComments: IComment[]): IComment[] => {
    if (!existingComments || existingComments.length === 0) {
        return newComments;
    }

    const existingIds = new Set(existingComments.map(c => c.id).filter(Boolean));

    return newComments.filter(c => c.id && !existingIds.has(c.id));
};

const LIMIT = 10;

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
    const [loadingComments, setLoadingComments] = useState(false);
    const { addComment, posts, userPosts, currentPostDetails } = useContext(PostsContext);

    const getExistingComments = useCallback((postId: string): IComment[] | undefined => {
        const allPosts = [...posts, ...userPosts];
        const post = allPosts.find(p => p.id === postId);
        return post?.comments;
    }, [posts, userPosts]);

    const loadCommentsByPostId = async (postId: string, page = 1) => {
        setLoadingComments(true);
        try {
            const comments = await commentService.fetchCommentsByPost(postId, page, LIMIT);
            
            if (!comments || comments.length === 0) {
                const allPosts = [...posts, ...userPosts];
                let post = allPosts.find(p => p.id === postId);
                
                if (!post) {
                    try {
                        post = await currentPostDetails(postId);
                    } catch (error) {
                        console.error("Erro ao buscar detalhes do post:", error);
                        return { post: null, commentsReturned: 0 };
                    }
                }
                
                return { post: post || null, commentsReturned: 0 };
            }

            comments.forEach((comment: IComment) => {
                comment.account.avatar = pictureService.fetchPicture(comment.account.avatar);
            });

            const existingComments = getExistingComments(postId);
            const newComments = filterNewComments(existingComments, comments);
            const commentsReturned = comments.length;

            if (newComments.length === 0) {
                const allPosts = [...posts, ...userPosts];
                const post = allPosts.find(p => p.id === postId);
                if (!post) {
                    try {
                        const fetchedPost = await currentPostDetails(postId);
                        return { post: fetchedPost, commentsReturned };
                    } catch (error) {
                        console.error("Erro ao buscar detalhes do post:", error);
                        return { post: null, commentsReturned };
                    }
                }
                return { post: post || null, commentsReturned };
            }
            
            const PostsWithComments = await addComment(postId, newComments);
            return { post: PostsWithComments, commentsReturned };

        } catch (error) {
            throw error;
        } finally {
            setLoadingComments(false);
        }
    }

    const loadMoreCommentsByPostId = async (postId: string, page = 1) => {
        if (loadingComments) return;
        setLoadingComments(true);
        try {
            const comments = await commentService.fetchCommentsByPost(postId, page, LIMIT);
            if (!comments || comments.length === 0) return null;
            comments.forEach((comment: IComment) => {
                comment.account.avatar = pictureService.fetchPicture(comment.account.avatar);
            });
            const existingComments = getExistingComments(postId);
            const newComments = filterNewComments(existingComments, comments);
            if (newComments.length === 0) return null;
            await addComment(postId, newComments);
            return newComments;
        } catch (error) {
            throw error;
        } finally {
            setLoadingComments(false);
        }
    }

    const createComment = async (postId: string, comment: string) => {
        const newComment = await commentService.createComment(postId, comment);
        newComment.account.avatar = pictureService.fetchPicture(newComment?.account?.avatar);

        const existingComments = getExistingComments(postId);

        const isNew = !existingComments?.some(c => c.id === newComment.id);

        if (isNew) {
            await addComment(postId, [newComment]);
        }

        return newComment;
    }

    const replyComment = async (commentId: string, content: string) => {
        try {
            const newComment = await commentService.replyToComment(commentId, content);
            newComment.account.avatar = pictureService.fetchPicture(newComment?.account?.avatar);
            const postId = newComment.post;

            const existingComments = getExistingComments(postId);

            const isNew = !existingComments?.some(c => c.id === newComment.id);

            if (isNew) {
                await addComment(postId, [newComment]);
            }

            return newComment;
        } catch (error) {
            throw error;
        }
    }

    return (
        <CommentsContext.Provider value={{ loadMoreCommentsByPostId, loadCommentsByPostId, createComment, loadingComments, replyComment }}>
            {children}
        </CommentsContext.Provider>
    )
}

