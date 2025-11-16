import { useState, useCallback, useRef, useEffect } from "react";
import type { IPost } from "../models/post";
import type IComment from "../models/Comments";
import { pictureService } from "../api/pictureService";

interface UsePaginatedPostsParams {
    limit?: number;
    onLoadAvatar?: (posts: IPost[]) => void;
}

export function usePaginatedPosts(
    fetchFn: (params: any) => Promise<IPost[]>,
    options: UsePaginatedPostsParams = {}
) {
    const { limit = 10, onLoadAvatar } = options;
    const [items, setItems] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(1);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);


    const processAvatars = useCallback((posts: IPost[]) => {
        posts && posts?.forEach((post: IPost) => {
            if (post.account?.avatar) {
                post.account.avatar = pictureService.fetchPicture(post.account.avatar);
            }
        });
        if (onLoadAvatar) {
            onLoadAvatar(posts);
        }
    }, [onLoadAvatar]);

    const addPostsWithoutDuplicates = useCallback(
        (currentPosts: IPost[], newPosts: IPost[], updateExisting: boolean = false): IPost[] => {
            const existingPostsMap = new Map<string, IPost>();
            currentPosts.forEach(post => {
                existingPostsMap.set(post.id, post);
            });

            const processedNewPosts = new Map<string, IPost>();
            
            newPosts.forEach(newPost => {
                const existingPost = existingPostsMap.get(newPost.id);
                
                if (existingPost) {
                    let mergedPost = { ...newPost };
                    
                    if (existingPost.comments && existingPost.comments.length > 0) {
                        if (!newPost.comments || newPost.comments.length === 0) {
                            mergedPost = { ...newPost, comments: existingPost.comments };
                        } else {
                            const commentsMap = new Map<string, IComment>();
                            existingPost.comments.forEach(comment => {
                                if (comment.id) commentsMap.set(comment.id, comment);
                            });
                            newPost.comments.forEach(comment => {
                                if (comment.id) commentsMap.set(comment.id, comment);
                            });
                            mergedPost = { ...newPost, comments: Array.from(commentsMap.values()) };
                        }
                    }
                    
                    processedNewPosts.set(newPost.id, mergedPost);
                } else {
                    processedNewPosts.set(newPost.id, newPost);
                }
            });

            const sortByDateDesc = (a: IPost, b: IPost) => {
                const aTime = new Date((a as any).createdAt || (a as any).updatedAt || 0).getTime();
                const bTime = new Date((b as any).createdAt || (b as any).updatedAt || 0).getTime();
                return bTime - aTime;
            };

            if (updateExisting) {
                const result: IPost[] = [];
                
                currentPosts.forEach(post => {
                    if (processedNewPosts.has(post.id)) {
                        result.push(processedNewPosts.get(post.id)!);
                        processedNewPosts.delete(post.id); 
                    } else {
                        result.push(post);
                    }
                });
                
                processedNewPosts.forEach(post => {
                    result.push(post);
                });
                
                return result.sort(sortByDateDesc);
            } else {
                const existingIds = new Set(currentPosts.map(post => post.id));
                const uniqueNewPosts = Array.from(processedNewPosts.values()).filter(
                    post => !existingIds.has(post.id)
                );
                return [...currentPosts, ...uniqueNewPosts].sort(sortByDateDesc);
            }
        },
        []
    );
      
    const loadMore = useCallback(async (params: any = {}) => {
        if (loading) return;
        setLoading(true);
        try {
            const currentPage = pageRef.current;
            const newPosts = await fetchFn({ ...params, page: currentPage, limit });
            processAvatars(newPosts);

            setHasMore(newPosts.length >= limit);
            setItems(prev => addPostsWithoutDuplicates(prev, newPosts, false));
            const nextPage = currentPage + 1;
            setPage(nextPage);
            pageRef.current = nextPage;
        } catch (error) {
            console.error('Erro ao carregar mais posts:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [loading, limit, fetchFn, processAvatars, addPostsWithoutDuplicates]);

    const refresh = useCallback(async (params: any = {}) => {
        setLoading(true);
        try {
            const newPosts = await fetchFn({ ...params, page: 1, limit });
            processAvatars(newPosts);

            setHasMore(newPosts.length >= limit);
            setItems(prevItems => addPostsWithoutDuplicates(prevItems, newPosts, true));

            setPage(2);
            pageRef.current = 2;
        } catch (error) {
            console.error('Erro ao atualizar posts:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [limit, fetchFn, processAvatars, addPostsWithoutDuplicates]);

    const addPost = useCallback((post: IPost) => {
        setItems(prev => {
            const exists = prev.some(p => p.id === post.id);
            if (exists) return prev;
            return [...prev, post];
        });
    }, []);

    const updatePost = useCallback((postId: string, updater: (post: IPost) => IPost) => {
        setItems(prev => prev.map(p => p.id === postId ? updater(p) : p));
    }, []);

    const removePost = useCallback((postId: string) => {
        setItems(prev => prev.filter(p => p.id !== postId));
    }, []);

    const addComments = useCallback((postId: string, comments: IComment[]): IPost | null => {
        if (!comments || comments.length === 0) {
            return null;
        }

        let computedPost: IPost | null = null;

        setItems(prev => {
            const postIndex = prev.findIndex(p => p.id === postId);
            if (postIndex === -1) {
                return prev;
            }

            const post = prev[postIndex];
            const commentsMap = new Map<string, IComment>();

            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(c => {
                    if (c.id) commentsMap.set(c.id, c);
                });
            }

            comments.forEach(c => {
                if (c.id) commentsMap.set(c.id, c);
            });

            const uniqueComments = Array.from(commentsMap.values());
            computedPost = { ...post, comments: uniqueComments };

            const newItems = [...prev];
            newItems[postIndex] = computedPost;
            return newItems;
        });

        return computedPost;
    }, []);

    const addComment = useCallback((postId: string, comment: IComment): IPost | null => {
        return addComments(postId, [comment]);
    }, [addComments]);

    const removeComment = useCallback((postId: string, commentId: string): IPost | null => {
        let computedPost: IPost | null = null;

        setItems(prev => {
            const postIndex = prev.findIndex(p => p.id === postId);
            if (postIndex === -1) {
                return prev;
            }

            const post = prev[postIndex];
            if (!post.comments || post.comments.length === 0) {
                computedPost = post;
                return prev;
            }

            const filteredComments = post.comments.filter(c => c.id !== commentId);
            computedPost = { ...post, comments: filteredComments };

            const newItems = [...prev];
            newItems[postIndex] = computedPost;
            return newItems;
        });

        return computedPost;
    }, []);

    const updateComment = useCallback((postId: string, commentId: string, updater: (comment: IComment) => IComment): IPost | null => {
        let computedPost: IPost | null = null;

        setItems(prev => {
            const postIndex = prev.findIndex(p => p.id === postId);
            if (postIndex === -1) {
                return prev;
            }

            const post = prev[postIndex];
            if (!post.comments || post.comments.length === 0) {
                computedPost = post;
                return prev;
            }

            const updatedComments = post.comments.map(c =>
                c.id === commentId ? updater(c) : c
            );
            computedPost = { ...post, comments: updatedComments };

            const newItems = [...prev];
            newItems[postIndex] = computedPost;
            return newItems;
        });

        return computedPost;
    }, []);

    const getPostComments = useCallback((postId: string): IComment[] => {
        const post = items.find(p => p.id === postId);
        return post?.comments || [];
    }, [items]);

    const getPost = useCallback((postId: string): IPost | null => {
        return items.find(p => p.id === postId) || null;
    }, [items]);

    const reset = useCallback(() => {
        setItems([]);
        setPage(1);
        pageRef.current = 1;
        setHasMore(true);
    }, []);

    return {
        items,
        loadMore,
        refresh,
        loading,
        hasMore,
        setItems,
        addPost,
        updatePost,
        removePost,
        reset,

        addComments,
        addComment,
        removeComment,
        updateComment,
        getPostComments,
        getPost
    };
}