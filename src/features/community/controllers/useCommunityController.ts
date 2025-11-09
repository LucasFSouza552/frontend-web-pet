import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { PostsContext } from "@contexts/PostContext";

export function useCommunityController() {
    const { 
        posts, 
        refreshPosts, 
        loadMorePosts, 
        hasMorePosts, 
        loadingPosts, 
        searchPosts,
        loadMoreSearchPosts,
        searchResults,
        hasMoreSearchResults,
        loadingSearchResults
    } = useContext(PostsContext);
    const [isSearching, setIsSearching] = useState(false);

    const observer = useRef<IntersectionObserver>(null);
    const searchObserver = useRef<IntersectionObserver>(null);

    useEffect(() => {
        refreshPosts();
    }, []);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMorePosts && !loadingPosts) {
                    loadMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMorePosts, loadMorePosts, loadingPosts]
    );

    const lastSearchPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (searchObserver.current) searchObserver.current.disconnect();
            searchObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreSearchResults && !loadingSearchResults) {
                    loadMoreSearchPosts();
                }
            });
            if (node) searchObserver.current.observe(node);
        },
        [hasMoreSearchResults, loadMoreSearchPosts, loadingSearchResults]
    );

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
          setIsSearching(false);
          return;
        }
    
        setIsSearching(true);
        try {
          await searchPosts(query);
        } catch (error) {
          console.error("Erro ao pesquisar posts:", error);
        }
      };

    return {
        posts,
        loadingPosts,
        lastPostRef,
        hasMorePosts,
        refreshPosts,
        searchPosts,
        loadMoreSearchPosts,
        searchResults,
        hasMoreSearchResults,
        loadingSearchResults,
        lastSearchPostRef,
        handleSearch,
        isSearching
    };
}

