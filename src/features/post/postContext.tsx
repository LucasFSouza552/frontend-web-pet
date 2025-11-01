import { createContext, useState, type ReactNode } from "react";
import { fetchPostById, fetchPosts, ToggleLike, addCommentService, fetchComments, addReplyCommentService, deletePost } from "./PostService";
import type IComment from "../../shared/models/comments";
import type { IPost } from "../../shared/models/Post";

export const PostsContext = createContext<PostsContextType>({} as PostsContextType);

const LIMIT = 10;

export const PostsProvider = ({ children }: { children: ReactNode }) => {
    // Feed geral
    const [posts, setPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Feed do usuário
    const [userPosts, setUserPosts] = useState<IPost[]>([]);
    const [userPage, setUserPage] = useState(1);
    const [hasMoreUserPosts, setHasMoreUserPosts] = useState(true);
    const [loadingUserPosts, setLoadingUserPosts] = useState(false);

    const getPostById = async (id: string) => {
        try {
            const post = posts.find(p => p.id === id);
            if (!post) {
                const fPost = await fetchPostById(id);
                setPosts(prev => [...prev, fPost]);
                return fPost;
            }
            return post;
        } catch (error) {
            throw error;
        }
    }

    const loadPostDetails = async (id: string) => {
        try {
            const existingPost = posts.find(p => p.id === id);
            if (existingPost) {
                return existingPost;
            }

            const fetchedPost = await fetchPostById(id);

            setPosts(prev => [...prev, fetchedPost]);

            return fetchedPost;
        } catch (error) {
            throw error;
        }
    }

    const loadPostComments = async (postId: string, page: number = 1) => {
        try {
            const comments = await fetchComments({ postId, page, limit: LIMIT });
            if (!comments) return [];
            return comments;
        } catch (error) {
            throw error;
        }
    }

    const loadMoreUserPosts = async (account?: string) => {
        try {
            const newPosts = await fetchPosts({ account, page: userPage, limit: LIMIT });

            setUserPosts(prevPosts => [...prevPosts, ...newPosts]);
            setUserPage(prevPage => prevPage + 1);
            setHasMoreUserPosts(newPosts.length === LIMIT);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUserPosts(false);
        }
    }

    const refreshUserPosts = async (account?: string) => {
        setLoadingUserPosts(true);
        try {
            const posts = await fetchPosts({ account, page: 1, limit: LIMIT });
            setUserPage(2);
            setUserPosts(posts);
            setHasMoreUserPosts(posts.length === LIMIT);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUserPosts(false);
        }
    }

    const loadMorePosts = async () => {
        setLoadingPosts(true);
        try {
            const newPosts = await fetchPosts({ page, limit: LIMIT });

            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setPage(prevPage => prevPage + 1);
            setHasMorePosts(newPosts.length === LIMIT);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPosts(false);
        }
    }

    const refreshPosts = async () => {
        setLoadingPosts(true);
        try {
            const posts = await fetchPosts({ page: 1, limit: LIMIT });
            setPage(2);
            setPosts(posts);
            setHasMorePosts(posts.length === LIMIT);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPosts(false);
        }
    }

    const likePost = async (postId: string) => {
        try {
            const post = await ToggleLike(postId);
            setPosts(prev => prev.map(p => (p.id === post.id ? post : p)));
            setUserPosts(prev => prev.map(p => (p.id === post.id ? post : p)));
            console.log("Atualizando post:", post);
            return post;
        } catch (error) {
            throw error;
        }
    };

    const addComment = async (postId: string, content: string, parent?: string) => {
        try {
            const comment = await addCommentService(postId, content, parent);
            setPosts(prev => prev.map(p => {
                const comments = p.comments ? [...p.comments, comment] : [comment];

                return { ...p, comments };
            }));

            return comment;
        } catch (error) {
            throw error;
        }


    };

    const addReplyComment = async (commentId: string, content: string) => {
        try {
            const comment = await addReplyCommentService(commentId, content);
            if (!comment) return;
            setPosts(prev => prev.map(p => {
                if (p.id !== comment?.id) return p;
                const comments = p.comments ? [...p.comments, comment] : [comment];

                return { ...p, comments };
            }));
        } catch (error) {
            throw error;
        }
    }

    const deletePostUpdate = async (postId: string) => {
        try {
            await deletePost(postId);
            setPosts((prevPost) => prevPost.filter((post) => post.id !== postId))
        } catch (error) {
            throw error;
        }
    }

    return (
        <PostsContext.Provider
            value={{
                posts, setPosts, refreshPosts, loadMorePosts, loadingPosts,
                userPosts, setUserPosts, refreshUserPosts, loadMoreUserPosts, loadingUserPosts,
                hasMorePosts, hasMoreUserPosts, likePost,
                loadPostDetails,
                loadPostComments, addComment,
                getPostById,
                addReplyComment,
                deletePostUpdate
            }}>
            {children}
        </PostsContext.Provider>
    );
};


interface PostsContextType {
    posts: IPost[];
    userPosts: IPost[];
    setPosts: (posts: IPost[]) => void;
    setUserPosts: (usersPosts: IPost[]) => void;

    refreshPosts: (accountId?: string) => Promise<void>;
    refreshUserPosts: (accountId?: string) => Promise<void>;

    loadMorePosts: (accountId?: string) => Promise<void>;
    loadMoreUserPosts: (accountId?: string) => Promise<void>;

    loadPostDetails: (id: string) => Promise<IPost>;

    hasMorePosts: boolean;
    hasMoreUserPosts: boolean;

    loadingPosts: boolean;
    loadingUserPosts: boolean;

    likePost: (post: string) => Promise<IPost>;

    loadPostComments: (id: string, page: number) => Promise<IComment[] | null>;
    addComment: (postId: string, content: string, parent?: string) => Promise<IComment>;

    getPostById: (id: string) => Promise<IPost>;

    addReplyComment: (commentId: string, content: string) => Promise<void>;
    deletePostUpdate: (postId: string) => Promise<void>
}
