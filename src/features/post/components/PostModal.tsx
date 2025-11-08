import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import useManagePostController from "../controller/useManagePostController";

interface PostModalProps {
    postId: string;
    moreOptions?: boolean;
    closeModal: (postId: string) => void;
    handleAbout: (postId: string) => void;
}

export default function PostModal({ postId, moreOptions = false, closeModal, handleAbout }: PostModalProps) {
    const navigate = useNavigate();

    const { handleDeletePost } = useManagePostController();

    const goToPost = () => {
        navigate(`/post/${postId}`);
    }
    
    return (<PostModalContainer >
        <button onClick={goToPost}>Ir para o post</button>
        <button>Compartilhar</button>
        <button onClick={() => handleAbout(postId)}>Sobre a conta</button>
        {moreOptions && <button onClick={() => handleDeletePost(postId)}>Excluir</button>}
        <button onClick={() => closeModal("")}>Cancelar</button>
    </PostModalContainer>);
}

const PostModalContainer = styled.div`
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.quarternary};
    border-radius: 10px;
    right: -10px;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    button {
        color: white;
        width: 100%;
        cursor: pointer;
        padding: 10px 30px;

        &:last-child {
            background-color: ${({ theme }) => theme.colors.primary};
        }
    }

    button:hover {
        background-color: ${({ theme }) => theme.colors.tertiary};
    }
`;