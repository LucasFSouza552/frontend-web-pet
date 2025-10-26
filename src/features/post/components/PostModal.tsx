import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

export default function PostModal({ postId, moreOptions = false, closeModal }: { postId: string, moreOptions?: boolean, closeModal?: () => void }) {
    const navigate = useNavigate();

    const goToPost = () => {
        navigate(`/post/${postId}`);
    }

    return (<PostModalContainer >
        <button onClick={goToPost}>Ir para o post</button>
        <button>Compartilhar</button>
        <button>Sobre a conta</button>
        {moreOptions && <button>Excluir</button>}
        <button onClick={closeModal}>Cancelar</button>
    </PostModalContainer>);
}

const PostModalContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
   
    
    background-color: ${({ theme }) => theme.colors.quarternary};
    border-radius: 10px;
    right: -10px;
    top: 0px;
    z-index: 9999;
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