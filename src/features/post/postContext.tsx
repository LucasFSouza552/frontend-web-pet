import { createContext, useState, type ReactNode, useEffect } from "react";
import type { Post } from "../../shared/models/post";
import { fetchPosts, ToggleLike } from "./postService";


interface PostsContextType {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    refreshPosts: (accountId?: string) => Promise<void>;
    loadMorePosts: (accountId?: string) => Promise<void>;
    hasMore: boolean;
    loading: boolean;
    likePost: (postId: string) => Promise<void>;
}

export const PostsContext = createContext<PostsContextType>({} as PostsContextType);


const limit = 10;

export const PostsProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);





    const loadMorePosts = async (accountId?: string) => {
        setLoading(true);
        try {
            const newPosts = await fetchPosts(accountId, page, limit);

            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setPage(prevPage => prevPage + 1);
            setHasMore(newPosts.length === limit);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const refreshPosts = async (accountId?: string) => {
        setLoading(true);
        try {
            const posts = await fetchPosts(accountId, 1, limit);
            setPage(2);
            setPosts(posts);
            setHasMore(posts.length === limit);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const likePost = async (postId: string) => {
        try {
            const post = await ToggleLike(postId);
            setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? post : p));
        } catch (error) {
            throw error;
        }
    };

    return (
        <PostsContext.Provider
            value={{
                posts, setPosts, refreshPosts, loadMorePosts, hasMore, loading, likePost
            }}>
            {children}
        </PostsContext.Provider>
    );
};

