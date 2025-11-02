import { useContext, useState } from "react";
import { PostsContext } from "@contexts/PostContext";

export default function useManagePostController() {
    const [error, setError] = useState("");
    const { archivePost } = useContext(PostsContext);

    const handleDeletePost = async (postId: string) => {
        try {
            await archivePost(postId);
            setError("");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erro inesperado ao apagar post.");
            }
        }
    }

    return {
        error,
        handleDeletePost
    }

}