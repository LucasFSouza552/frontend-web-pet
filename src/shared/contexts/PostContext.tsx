import { createContext, useState, type ReactNode } from "react";
import type { IPost } from "@/shared/models/Post";
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

    // Busca
    const [searchResults, setSearchResults] = useState<IPost[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchPage, setSearchPage] = useState(1);
    const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);
    const [loadingSearchResults, setLoadingSearchResults] = useState(false);

    const loadAvatarPostsImage = async (posts: IPost[] | IPost) => {
        if (!posts) return;
        if (posts && !Array.isArray(posts)) {
            posts.account.avatar = pictureService.fetchPicture(posts?.account?.avatar);
            return;
        }

        posts.forEach((post: any) => {
            post.account.avatar = pictureService.fetchPicture(post.account.avatar);
        });
    }

    const addPostsWithoutDuplicates = (currentPosts: IPost[], newPosts: IPost[]): IPost[] => {
        const existingIds = new Set(currentPosts.map(post => post.id));
        const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
        return [...currentPosts, ...uniqueNewPosts];
    }

    // Função auxiliar para adicionar um único post sem duplicata
    const addPostWithoutDuplicate = (currentPosts: IPost[], newPost: IPost): IPost[] => {
        const exists = currentPosts.some(post => post.id === newPost.id);
        if (exists) {
            return currentPosts;
        }
        return [...currentPosts, newPost];
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
            setPosts(prev => addPostWithoutDuplicate(prev, fetchedPost));

            return fetchedPost;
        } catch (error) {
            throw error;
        } finally {
            setLoadingPosts(false);
        }
    }

    const loadMoreUserPosts = async (account?: string) => {
        if (loadingUserPosts) return;
        setLoadingUserPosts(true);
        try {
            const newPosts = await postService.fetchPostsWithAuthor({ account, page: userPage, limit: LIMIT });
            loadAvatarPostsImage(newPosts);
            setUserPosts(prevPosts => addPostsWithoutDuplicates(prevPosts, newPosts));
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
            setPosts(prevPosts => addPostsWithoutDuplicates(prevPosts, newPosts));
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
            const updateLikes = (p: IPost) => (p.id === post.id ? { ...p, likes: post.likes } : p);
            setPosts(prev => prev.map(updateLikes));
            setUserPosts(prev => prev.map(updateLikes));
            setSearchResults(prev => prev.map(updateLikes));
            return post;
        } catch (error) {
            throw error;
        }
    };

    const addComment = async (postId: string, comment: IComment[]): Promise<IPost> => {
        try {
            let updatedPost: IPost | undefined = [...posts, ...userPosts].find(p => p.id === postId);
            if (!updatedPost) {
                const fetchedPost = await postService.fetchPostWithAuthor(postId);
                if (!fetchedPost) throw new Error("Post não encontrado");
                loadAvatarPostsImage(fetchedPost);
                setPosts(prev => addPostWithoutDuplicate(prev, fetchedPost));
                updatedPost = fetchedPost;
            }
            const post = { ...updatedPost, account: { ...updatedPost.account } }

            if (!comment) {
                return { ...post, account: { ...post.account, avatar: pictureService.fetchPicture(post.account.avatar) } };
            }

            const comments = updatedPost.comments ? [...comment, ...updatedPost.comments] : [...comment];

            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments } : p));
            setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, comments } : p));

            return { ...post, comments, account: { ...post.account, avatar: pictureService.fetchPicture(post.account.avatar) } };

        } catch (error) {
            throw error;
        }
    }

    const currentPostDetails = async (postId: string) => {
        try {
            let currentPost = [...posts, ...userPosts].find(p => p.id === postId);
            if (!currentPost) {
                const fetchedPost = await postService.fetchPostWithAuthor(postId);
                if (!fetchedPost) throw new Error("Post nao encontrado");
                loadAvatarPostsImage(fetchedPost);
                setPosts(prev => addPostWithoutDuplicate(prev, fetchedPost));
                currentPost = fetchedPost;
            }
            const post = { ...currentPost, account: { ...currentPost.account } };
            return post;
        } catch (error) {
            throw error;
        }
    }

    const archivePost = async (postId: string) => {
        try {
            await postService.softDeletePostById(postId);
            setPosts((prevPost) => prevPost.filter((post) => post.id !== postId))

            setUserPosts((prevPost) => prevPost.filter((post) => post.id !== postId))
        } catch (error) {
            throw error;
        }
    }

    const searchPosts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            setSearchQuery("");
            setSearchPage(1);
            setHasMoreSearchResults(true);
            return [];
        }

        setLoadingSearchResults(true);
        setSearchQuery(query);
        setSearchPage(1);

        try {
            const localPosts: IPost[] = [...posts, ...userPosts].filter((post: IPost) =>
                post.content?.toLowerCase().includes(query.toLowerCase()) ||
                post.title?.toLowerCase().includes(query.toLowerCase())
            );

            const apiPosts = await postService.searchPosts(query, 1, LIMIT);
            loadAvatarPostsImage(apiPosts);

            const allPosts = addPostsWithoutDuplicates(localPosts, apiPosts);

            if (localPosts.length > 0) {
                loadAvatarPostsImage(localPosts);
            }

            setSearchResults(allPosts);
            setSearchPage(2);
            setHasMoreSearchResults(apiPosts.length === LIMIT);

            setPosts(prevPosts => addPostsWithoutDuplicates(prevPosts, apiPosts));

            return allPosts;
        } catch (error) {
            console.error("Erro ao buscar posts:", error);
            throw error;
        } finally {
            setLoadingSearchResults(false);
        }
    }

    const loadMoreSearchPosts = async () => {
        if (loadingSearchResults || !hasMoreSearchResults || !searchQuery.trim()) return;

        setLoadingSearchResults(true);
        try {
            const newPosts = await postService.searchPosts(searchQuery, searchPage, LIMIT);
            loadAvatarPostsImage(newPosts);
            setSearchResults(prevResults => addPostsWithoutDuplicates(prevResults, newPosts));
            setSearchPage(prevPage => prevPage + 1);
            setHasMoreSearchResults(newPosts.length === LIMIT);

            setPosts(prevPosts => addPostsWithoutDuplicates(prevPosts, newPosts));

            return newPosts;
        } catch (error) {
            console.error("Erro ao carregar mais posts da busca:", error);
            throw error;
        } finally {
            setLoadingSearchResults(false);
        }
    }

    const topPosts = async () => {
        try {
            return await postService.fetchTopPosts();
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
                archivePost,
                currentPostDetails,
                topPosts,
                searchPosts,
                loadMoreSearchPosts,
                searchResults,
                hasMoreSearchResults,
                loadingSearchResults
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
    searchPosts: (query: string) => Promise<IPost[]>
    loadMoreSearchPosts: () => Promise<IPost[] | void>
    searchResults: IPost[]
    hasMoreSearchResults: boolean
    loadingSearchResults: boolean
    currentPostDetails: (postId: string) => Promise<IPost>

    topPosts: () => Promise<IPost[]>
}