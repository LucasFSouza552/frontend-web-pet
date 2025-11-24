import { createContext, useState, useCallback, type ReactNode, useEffect } from "react";
import type { IPost } from "@/shared/models/Post";
import { postService } from "@api/postService";
import type IComment from "@models/Comments";
import { pictureService } from "../api/pictureService";
import { usePaginatedPosts } from "../hooks/usePaginatedPosts";

export const PostsContext = createContext<PostsContextType>({} as PostsContextType);

const LIMIT = 10;

export const PostsProvider = ({ children }: { children: ReactNode }) => {
    const generalPosts = usePaginatedPosts(
        useCallback(async (params: any) => {
            return await postService.fetchPostsWithAuthor({ page: params.page, limit: params.limit });
        }, []),
        { limit: LIMIT }
    );

    const userPostsHook = usePaginatedPosts(
        useCallback(async (params: any) => {
            return await postService.fetchPostsWithAuthor({
                account: params.account,
                page: params.page,
                limit: params.limit
            });
        }, []),
        { limit: LIMIT }
    );

    const [searchResults, setSearchResults] = useState<IPost[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loadingSearchResults, setLoadingSearchResults] = useState(false);
    const [hasMoreSearchResults, setHasMoreSearchResults] = useState(true);
    const [searchPage, setSearchPage] = useState(1);

    const posts = generalPosts.items;
    const setPosts = generalPosts.setItems;
    const loadingPosts = generalPosts.loading;
    const hasMorePosts = generalPosts.hasMore;

    const userPosts = userPostsHook.items;
    const setUserPosts = userPostsHook.setItems;
    const loadingUserPosts = userPostsHook.loading;
    const hasMoreUserPosts = userPostsHook.hasMore;

    const loadAvatarPostsImage = useCallback((posts: IPost[] | IPost) => {
        if (!posts) return;
        if (posts && !Array.isArray(posts)) {
            posts.account.avatar = pictureService.fetchPicture(posts?.account?.avatar);
            return;
        }

        posts.forEach((post: IPost) => {
            if (post.account?.avatar) {
                post.account.avatar = pictureService.fetchPicture(post.account.avatar);
            }
        });
    }, []);


    const loadPostDetails = async (id: string) => {
        const existingPost = generalPosts.getPost(id) || userPostsHook.getPost(id);
        if (existingPost) {
            return existingPost;
        }

        try {
            const fetchedPost = await postService.fetchPostWithAuthor(id);
            loadAvatarPostsImage(fetchedPost);
            generalPosts.addPost(fetchedPost);
            return fetchedPost;
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        console.log('generalPosts.items', generalPosts.items.length);
    }, [generalPosts.items])

    const loadMorePosts = useCallback(async () => {
        await generalPosts.loadMore();
    }, [generalPosts]);

    const refreshPosts = useCallback(async () => {
        await generalPosts.refresh();
    }, [generalPosts]);

    const loadMoreUserPosts = useCallback(async (account?: string) => {
        await userPostsHook.loadMore({ account });
    }, [userPostsHook]);

    const refreshUserPosts = useCallback(async (account?: string) => {
        await userPostsHook.refresh({ account });
    }, [userPostsHook]);

    const likePost = async (postId: string) => {
        try {
            if (!postId) throw new Error("Post não encontrado");
            const post = await postService.toggleLikePostById(postId);
            const updateLikes = (p: IPost) => (p.id === post.id ? { ...p, likes: post.likes } : p);

            generalPosts.updatePost(postId, updateLikes);
            userPostsHook.updatePost(postId, updateLikes);
            setSearchResults(prev => prev.map(updateLikes));

            return post;
        } catch (error) {
            throw error;
        }
    };

    const addComment = async (postId: string, comment: IComment[]): Promise<IPost> => {
        try {
            let basePost: IPost | null =
                generalPosts.getPost(postId) ||
                userPostsHook.getPost(postId) ||
                searchResults.find(p => p.id === postId) ||
                null;

            if (!basePost) {
                const fetchedPost = await postService.fetchPostWithAuthor(postId);
                if (!fetchedPost) throw new Error("Post não encontrado");
                loadAvatarPostsImage(fetchedPost);
                generalPosts.addPost(fetchedPost);
                basePost = fetchedPost;
            }

            if (!comment || comment.length === 0) {
                const postToReturn = { ...basePost, account: { ...basePost.account } };
                return {
                    ...postToReturn,
                    account: { ...postToReturn.account, avatar: pictureService.fetchPicture(postToReturn.account.avatar) }
                };
            }

            const incomingComments = comment.map((c: IComment) => {
                if (c?.account?.avatar) {
                    c.account.avatar = pictureService.fetchPicture(c.account.avatar);
                }
                return c;
            });

            const mergeComments = (existing?: IComment[], incoming?: IComment[]): IComment[] => {
                const byId = new Map<string, IComment>();
                if (existing && existing.length > 0) {
                    existing.forEach(c => { if (c?.id) byId.set(c.id, c); });
                }
                if (incoming && incoming.length > 0) {
                    incoming.forEach(c => { if (c?.id) byId.set(c.id, c); });
                }
                const merged = Array.from(byId.values());
                merged.sort((a, b) => {
                    const aTime = new Date(a.createdAt as any).getTime();
                    const bTime = new Date(b.createdAt as any).getTime();
                    return aTime - bTime;
                });
                return merged;
            };

            const applyMerge = (p: IPost) => {
                const mergedComments = mergeComments(p.comments, incomingComments);
                return { ...p, comments: mergedComments };
            };

            generalPosts.updatePost(postId, applyMerge);
            userPostsHook.updatePost(postId, applyMerge);
            setSearchResults(prev => {
                const idx = prev.findIndex(p => p.id === postId);
                if (idx === -1) return prev;
                const post = prev[idx];
                const updated = applyMerge(post);
                const next = [...prev];
                next[idx] = updated;
                return next;
            });

            const mergedForReturn = applyMerge(basePost);
            const postToReturn = { ...mergedForReturn, account: { ...mergedForReturn.account } };
            return {
                ...postToReturn,
                account: { ...postToReturn.account, avatar: pictureService.fetchPicture(postToReturn.account.avatar) }
            };
        } catch (error) {
            throw error;
        }
    }

    const updateComment = async (postId: string, commentId: string, updater: (comment: IComment) => IComment): Promise<IPost | null> => {
        try {
            const generalPost = generalPosts.updateComment(postId, commentId, updater);
            const userPost = userPostsHook.updateComment(postId, commentId, updater);

            setSearchResults(prev => {
                const postIndex = prev.findIndex(p => p.id === postId);
                if (postIndex === -1) return prev;

                const post = prev[postIndex];
                if (!post.comments) return prev;

                const updatedComments = post.comments.map(comment =>
                    comment.id === commentId ? updater(comment) : comment
                );

                const newItems = [...prev];
                newItems[postIndex] = { ...post, comments: updatedComments };
                return newItems;
            });

            return generalPost || userPost || null;
        } catch (error) {
            throw error;
        }
    }

    const removeComment = async (postId: string, commentId: string): Promise<IPost | null> => {
        try {
            const generalPost = generalPosts.removeComment(postId, commentId);
            const userPost = userPostsHook.removeComment(postId, commentId);

            setSearchResults(prev => {
                const postIndex = prev.findIndex(p => p.id === postId);
                if (postIndex === -1) return prev;

                const post = prev[postIndex];
                if (!post.comments) return prev;

                const filteredComments = post.comments.filter(comment => comment.id !== commentId);

                const newItems = [...prev];
                newItems[postIndex] = { ...post, comments: filteredComments };
                return newItems;
            });

            return generalPost || userPost || null;
        } catch (error) {
            throw error;
        }
    }

    const currentPostDetails = async (postId: string) => {
        try {
            let currentPost = generalPosts.getPost(postId) ||
                userPostsHook.getPost(postId);

            if (!currentPost) {
                const fetchedPost = await postService.fetchPostWithAuthor(postId);
                if (!fetchedPost) throw new Error("Post nao encontrado");
                loadAvatarPostsImage(fetchedPost);
                generalPosts.addPost(fetchedPost);
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

            generalPosts.removePost(postId);
            userPostsHook.removePost(postId);
            setSearchResults(prev => prev.filter(post => post.id !== postId));
        } catch (error) {
            throw error;
        }
    }

    const addPostsWithoutDuplicates = useCallback((currentPosts: IPost[], newPosts: IPost[]): IPost[] => {
        const existingIds = new Set(currentPosts.map(post => post.id));
        const uniqueNewPosts = newPosts.filter(post => !existingIds.has(post.id));
        return [...currentPosts, ...uniqueNewPosts];
    }, []);

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
            const localPosts: IPost[] = [...generalPosts.items, ...userPostsHook.items].filter((post: IPost) =>
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

            apiPosts.forEach((post: IPost) => generalPosts.addPost(post));

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

            newPosts.forEach((post: IPost) => generalPosts.addPost(post));

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

    const updatePostContent = async (postId: string, newContent: string) => {
        try {
            const updated = await postService.updatePost(postId, { content: newContent } as any);

            const applyUpdatedContent = (p: IPost) =>
                p.id === updated.id ? { ...p, content: updated.content } : p;

            generalPosts.updatePost(postId, applyUpdatedContent);
            userPostsHook.updatePost(postId, applyUpdatedContent);
            setSearchResults(prev => prev.map(applyUpdatedContent));

            return updated as IPost;
        } catch (error) {
            throw error;
        }
    }

    const updatePostTitle = async (postId: string, newTitle: string) => {
        try {
            const updated = await postService.updatePost(postId, { title: newTitle } as any);

            const applyUpdatedTitle = (p: IPost) =>
                p.id === updated.id ? { ...p, title: updated.title } : p;

            generalPosts.updatePost(postId, applyUpdatedTitle);
            userPostsHook.updatePost(postId, applyUpdatedTitle);
            setSearchResults(prev => prev.map(applyUpdatedTitle));

            return updated as IPost;
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
                updateComment,
                removeComment,
                archivePost,
                currentPostDetails,
                topPosts,
                searchPosts,
                loadMoreSearchPosts,
                searchResults,
                hasMoreSearchResults,
                loadingSearchResults,
                updatePostContent,
                updatePostTitle
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

    addComment: (postId: string, comment: IComment[]) => Promise<IPost>;
    updateComment: (postId: string, commentId: string, updater: (comment: IComment) => IComment) => Promise<IPost | null>;
    removeComment: (postId: string, commentId: string) => Promise<IPost | null>;
    archivePost: (postId: string) => Promise<void>
    searchPosts: (query: string) => Promise<IPost[]>
    loadMoreSearchPosts: () => Promise<IPost[] | void>
    searchResults: IPost[]
    hasMoreSearchResults: boolean
    loadingSearchResults: boolean
    currentPostDetails: (postId: string) => Promise<IPost>

    topPosts: () => Promise<IPost[]>
    updatePostContent: (postId: string, newContent: string) => Promise<IPost>
    updatePostTitle: (postId: string, newTitle: string) => Promise<IPost>
}