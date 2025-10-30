
import { useState } from "react";
import { deletePost } from "../postService";
export default function useManagePostController() {
    const [error, setError] = useState("");

    const handleDeletePost = async (postId: string) => {
        console.log("deletando post", postId);
        try {
            await deletePost(postId);
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