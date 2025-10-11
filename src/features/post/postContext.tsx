import { createContext, useState, type ReactNode } from "react";
import type { Post } from "../../shared/models/post";
import { fetchPostById, fetchPosts, ToggleLike } from "./postService";




export const PostsContext = createContext<PostsContextType>({} as PostsContextType);

const LIMIT = 10;

export const PostsProvider = ({ children }: { children: ReactNode }) => {
    // Feed geral
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);

    // Feed do usuário
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userPage, setUserPage] = useState(1);
    const [hasMoreUserPosts, setHasMoreUserPosts] = useState(true);
    const [loadingUserPosts, setLoadingUserPosts] = useState(false);


    const loadPostDetails = async (id: string) => {
        try {
            const post = await fetchPostById(id);
            return post;
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
        } catch (error) {
            throw error;
        }
    };

    return (
        <PostsContext.Provider
            value={{
                posts, setPosts, refreshPosts, loadMorePosts, loadingPosts,
                userPosts, setUserPosts, refreshUserPosts, loadMoreUserPosts, loadingUserPosts,
                hasMorePosts, hasMoreUserPosts, likePost,
                loadPostDetails
            }}>
            {children}
        </PostsContext.Provider>
    );
};


interface PostsContextType {
    posts: Post[];
    userPosts: Post[];
    setPosts: (posts: Post[]) => void;
    setUserPosts: (usersPosts: Post[]) => void;

    refreshPosts: (accountId?: string) => Promise<void>;
    refreshUserPosts: (accountId?: string) => Promise<void>;

    loadMorePosts: (accountId?: string) => Promise<void>;
    loadMoreUserPosts: (accountId?: string) => Promise<void>;

    loadPostDetails: (id: string) => Promise<Post>;

    hasMorePosts: boolean;
    hasMoreUserPosts: boolean;

    loadingPosts: boolean;
    loadingUserPosts: boolean;

    likePost: (postId: string) => Promise<void>;
}
