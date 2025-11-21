import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "@contexts/PostContext";
import type { IPost } from "@models/Post";

interface UsePostCardControllerProps {
    post: IPost;
    accountId?: string;
    handleOptions: (postId: string) => void;
}

export function usePostCardController({ post, accountId, handleOptions }: UsePostCardControllerProps) {
    const navigate = useNavigate();
    const { likePost, updatePostContent } = useContext(PostsContext);
    
    const [animateLike, setAnimateLike] = useState(false);
    const [showSmallProfile, setShowSmallProfile] = useState(false);
    const [showShareMessage, setShowShareMessage] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content || "");
    const [savingContent, setSavingContent] = useState(false);
    const [contentError, setContentError] = useState("");

    const handleLike = useCallback(() => {
        setAnimateLike(true);
        if (!post.id) return console.error("Post id not found");
        if (!accountId) return;
        likePost(post.id);

        setTimeout(() => setAnimateLike(false), 400);
    }, [post.id, accountId, likePost]);

    const handleComments = useCallback((postId: string) => {
        if (!accountId) return;
        navigate(`/post/${postId}`);
    }, [accountId, navigate]);

    const handleProfile = useCallback((accountId: string) => {
        navigate(`/profile/${accountId}`);
    }, [navigate]);

    const handleSmallProfile = useCallback(() => {
        setShowSmallProfile(!showSmallProfile);
    }, [showSmallProfile]);

    const handleShare = useCallback(async () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        const shareData = {
            title: `Post de ${post.account.name}`,
            text: post.content ? `${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}` : `Confira este post de ${post.account.name}!`,
            url: postUrl
        };

        try {
            handleOptions("");
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(postUrl);
                setShowShareMessage(true);
                setTimeout(() => {
                    setShowShareMessage(false);
                }, 2000);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(postUrl);
                    setShowShareMessage(true);
                    setTimeout(() => {
                        setShowShareMessage(false);
                    }, 2000);
                } catch (clipboardError) {
                    console.error('Erro ao copiar link:', clipboardError);
                }
            }
        }
    }, [post.id, post.account.name, post.content, handleOptions]);

    const handleStartEditPost = useCallback(() => {
        setEditedContent(post.content || "");
        setIsEditingContent(true);
        setContentError("");
    }, [post.content]);

    const handleCancelEditContent = useCallback(() => {
        setIsEditingContent(false);
        setEditedContent(post.content || "");
        setContentError("");
    }, [post.content]);

    const handleSaveContent = useCallback(async () => {
        const newContent = editedContent.trim();
        if (!newContent) {
            setContentError("O conteúdo não pode estar vazio.");
            return;
        }
        try {
            setSavingContent(true);
            await updatePostContent(post.id, newContent);
            setSavingContent(false);
            setIsEditingContent(false);
        } catch (e) {
            setSavingContent(false);
            setContentError("Erro ao salvar o conteúdo. Tente novamente.");
        }
    }, [editedContent, post.id, updatePostContent]);

    return {
        animateLike,
        showSmallProfile,
        showShareMessage,
        isEditingContent,
        editedContent,
        savingContent,
        contentError,
        setEditedContent,
        handleLike,
        handleComments,
        handleProfile,
        handleSmallProfile,
        handleShare,
        handleStartEditPost,
        handleCancelEditContent,
        handleSaveContent
    };
}

