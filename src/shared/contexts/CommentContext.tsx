
import type IComment from "../models/Comments";
import { createContext, useContext, useState, type ReactNode } from "react";
import { commentService } from "../api/commentsService";
import { PostsContext } from "./PostContext";
import type { IPost } from "../models/Post";
import { pictureService } from "../api/pictureService";

interface CommentsContextType {
    loadCommentsByPostId: (id: string, page?: number, limit?: number) => Promise<IPost | null>
    createComment: (postId: string, comment: string) => void
    loadingComments: boolean
    replyComment: (postId: string, comment: string) => void
};

export const CommentsContext = createContext<CommentsContextType>({} as CommentsContextType);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
    const [loadingComments, setLoadingComments] = useState(false);
    const { addComment } = useContext(PostsContext);

    const loadCommentsByPostId = async (postId: string, page = 1, limit = 10) => {
        setLoadingComments(true);
        try {
            const comments = await commentService.fetchCommentsByPost(postId, page, limit);
            if (!comments || comments.length === 0) return null;

            comments.forEach((comment: IComment) => {
                return comment.account.avatar = pictureService.fetchPicture(comment.account.avatar);
            });

            return addComment(postId, comments);

        } catch (error) {
            throw error;
        } finally {
            setLoadingComments(false);
        }
    }

    const createComment = async (postId: string, comment: string) => {
        const newComment = await commentService.createComment(postId, comment);
        newComment.account.avatar = pictureService.fetchPicture(newComment?.account?.avatar);
        addComment(postId, [newComment]);
    }

    const replyComment = async (postId: string, comment: string) => {
        try {
            const newComment = await commentService.replyToComment(postId, comment);
            addComment(postId, [newComment]);
        } catch (error) {
            throw error;
        }
    }

    return (
        <CommentsContext.Provider value={{ loadCommentsByPostId, createComment, loadingComments, replyComment }}>
            {children}
        </CommentsContext.Provider>
    )
}

