
import { useContext, useState } from "react";

import { PostsContext } from "../PostContext";
export default function useManagePostController() {
    const [error, setError] = useState("");
    const { deletePostUpdate } = useContext(PostsContext);

    const handleDeletePost = async (postId: string) => {
        try {
            await deletePostUpdate(postId);

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