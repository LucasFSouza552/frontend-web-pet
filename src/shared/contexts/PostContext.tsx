import { createContext, useState, type ReactNode } from "react";
import type { IPost } from "@models/Post";
import { postService } from "@api/postService";
import type IComment from "../models/Comments";
import { pictureService } from "../api/pictureService";

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

    const loadAvatarPostsImage = async (posts: IPost[] | IPost) => {
        if (!posts) return;
        if (!Array.isArray(posts)) {
            posts.account.avatar = pictureService.fetchPicture(posts?.account?.avatar);
            return;
        }

        posts.forEach((post: any) => {
            if (post.account.avatar)
                post.account.avatar = pictureService.fetchPicture(post.account.avatar);
        });
    }


    const loadPostDetails = async (id: string) => {

        setLoadingPosts(true);
        try {
            const existingPost = posts.find(p => p.id === id);
            if (existingPost) {
                return existingPost;
            }

            const fetchedPost = await postService.fetchPostWithAuthor(id);
            loadAvatarPostsImage(fetchedPost);
            setPosts(prev => [...prev, fetchedPost]);

            return fetchedPost;
        } catch (error) {
            throw error;
        } finally {
            setLoadingPosts(true);
        }
    }

    const loadMoreUserPosts = async (account?: string) => {
        try {
            const newPosts = await postService.fetchPostsWithAuthor({ account, page: userPage, limit: LIMIT });
            loadAvatarPostsImage(newPosts);
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
            const posts = await postService.fetchPostsWithAuthor({ account, page: 1, limit: LIMIT });

            loadAvatarPostsImage(posts);

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
            const newPosts = await postService.fetchPostsWithAuthor({ page, limit: LIMIT });

            loadAvatarPostsImage(newPosts);
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
            const posts = await postService.fetchPostsWithAuthor({ page: 1, limit: LIMIT });

            loadAvatarPostsImage(posts);
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
            if (!postId) throw new Error("Post não encontrado");
            const post = await postService.toggleLikePostById(postId);
            setPosts(prev => prev.map(p => (p.id === post.id ? { ...p, likes: post.likes } : p)));
            setUserPosts(prev => prev.map(p => (p.id === post.id ? { ...p, likes: post.likes } : p)));
            return post;
        } catch (error) {
            throw error;
        }
    };

    const addComment = async (postId: string, comment: IComment[]) => {
        try {
            let updatedPost: IPost | undefined = posts.find(p => p.id === postId);
            if (!updatedPost) {
                const fetchedPost = await postService.fetchPostWithAuthor(postId);
                if (!fetchedPost) throw new Error("Post não encontrado");
                setPosts(prev => [...prev, fetchedPost]);
                updatedPost = fetchedPost;
            }

            const comments = updatedPost.comments ? [...updatedPost.comments, ...comment] : [...comment];

            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments } : p));

            return { ...updatedPost, account: { ...updatedPost.account, avatar: pictureService.fetchPicture(updatedPost.account.avatar) }, comments };

        } catch (error) {
            throw error;
        }
    }

    const currentPostDetails = async (postId: string) => {
        try {
            let currentPost = [...posts, ...userPosts].find(p => p.id === postId);
            if (!currentPost) {
                const fetchedPost = await postService.fetchPostWithAuthor(postId);
                if(!fetchedPost) throw new Error("Post nao encontrado");
                setPosts(prev => [...prev, fetchedPost]);
                currentPost = fetchedPost;
            }
            return { ...currentPost, account: { ...currentPost.account, avatar: pictureService.fetchPicture(currentPost.account.avatar) } };
        } catch (error) {
            throw error;
        }
    }

    // const addComment = async (postId: string, content: string, parent?: string) => {
    //     try {
    //         const comment = await addCommentService(postId, content, parent);
    //         setPosts(prev => prev.map(p => {
    //             const comments = p.comments ? [...p.comments, comment] : [comment];

    //             return { ...p, comments };
    //         }));

    //         return comment;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    // const loadPostComments = async (postId: string, page: number = 1) => {
    //     try {
    //         const comments = await postService.fetchComments({ postId, page, limit: LIMIT });
    //         if (!comments) return [];
    //         return comments;
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    // const addReplyComment = async (commentId: string, content: string) => {
    //     try {
    //         const comment = await addReplyCommentService(commentId, content);
    //         if (!comment) return;
    //         setPosts(prev => prev.map(p => {
    //             if (p.id !== comment?.id) return p;
    //             const comments = p.comments ? [...p.comments, comment] : [comment];

    //             return { ...p, comments };
    //         }));
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    const archivePost = async (postId: string) => {
        try {
            await postService.softDeletePostById(postId);
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
                addComment,
                // loadPostComments
                // addReplyComment,
                archivePost,
                currentPostDetails
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

    // loadPostComments: (id: string, page: number) => Promise<IComment[] | null>;
    addComment: (postId: string, comment: IComment[]) => Promise<IPost>;
    // addReplyComment: (commentId: string, content: string) => Promise<void>;
    archivePost: (postId: string) => Promise<void>

    currentPostDetails: (postId: string) => Promise<IPost>
}