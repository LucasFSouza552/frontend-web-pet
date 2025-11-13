import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import useManagePostController from "../controller/useManagePostController";
import { FaArrowRight, FaShareAlt, FaUser, FaTrash, FaTimes, FaEdit } from "react-icons/fa";
import { useState } from "react";

interface PostModalProps {
    postId: string;
    moreOptions?: boolean;
    closeModal: (postId: string) => void;
    handleAbout: (postId: string) => void;
    handleShare: () => Promise<void>;
    initialContent?: string;
    onEditPost?: (postId: string) => void;
}

export default function PostModal({ postId, moreOptions = false, closeModal, handleAbout, handleShare, initialContent = "", onEditPost }: PostModalProps) {
    const navigate = useNavigate();

    const { handleDeletePost } = useManagePostController();

    const [/*unused*/_] = useState(initialContent || "");

    const goToPost = () => {
        navigate(`/post/${postId}`);
    }

    return (
        <PostModalContainer>
            <CloseButton onClick={() => closeModal("")} aria-label="Fechar">
                <FaTimes />
            </CloseButton>
            <ModalContent>
                <ModalButton onClick={goToPost}>
                    <FaArrowRight />
                    <span>Ir para o post</span>
                </ModalButton>
                <Separator />
                <ModalButton onClick={handleShare}>
                    <FaShareAlt />
                    <span>Compartilhar</span>
                </ModalButton>
                <Separator />
                <ModalButton onClick={() => handleAbout(postId)}>
                    <FaUser />
                    <span>Sobre a conta</span>
                </ModalButton>
                {moreOptions && (
                    <>
                        <Separator />
                        <ModalButton onClick={() => { onEditPost && onEditPost(postId); closeModal(""); }}>
                            <FaEdit />
                            <span>Editar post</span>
                        </ModalButton>
                        <Separator />
                        <ModalButton $danger onClick={() => handleDeletePost(postId)}>
                            <FaTrash />
                            <span>Excluir</span>
                        </ModalButton>
                    </>
                )}
                <CancelButton onClick={() => closeModal("")}>
                    Cancelar
                </CancelButton>
            </ModalContent>
        </PostModalContainer>
    );
}

const PostModalContainer = styled.div`
    position: absolute;

    right: -1%;
    top: 0px;
    z-index: 30;
    min-width: 280px;
    max-width: 320px;
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                0 0 20px ${({ theme }) => theme.colors.primary}40;
    overflow: hidden;
    animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes slideIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        right: 10px;
        min-width: 260px;
        max-width: calc(100vw - 20px);
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: ${({ theme }) => theme.colors.primary};
        transform: rotate(90deg);
    }

    svg {
        font-size: 14px;
    }
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 16px 16px;
    gap: 0;
`;

const Separator = styled.div`
    height: 1px;
    background: linear-gradient(
        to right,
        transparent,
        rgba(182, 72, 160, 0.3),
        transparent
    );
    margin: 4px 0;
`;

const ModalButton = styled.button<{ $danger?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 16px;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    svg {
        font-size: 16px;
        color: ${({ theme, $danger }) => 
            $danger ? '#ff6b6b' : theme.colors.primary};
        transition: transform 0.2s ease;
    }

    span {
        flex: 1;
    }

    &:hover {
        background: ${({ $danger }) => 
            $danger 
                ? 'rgba(255, 107, 107, 0.15)' 
                : 'rgba(182, 72, 160, 0.15)'};
        transform: translateX(4px);

        svg {
            transform: ${({ $danger }) => 
                $danger ? 'scale(1.1)' : 'translateX(2px)'};
        }
    }

    &:active {
        transform: translateX(2px);
    }

    ${({ $danger }) => $danger && `
        color: #ff6b6b;
        
        &:hover {
            background: rgba(255, 107, 107, 0.2);
        }
    `}
`;

const CancelButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    margin-top: 8px;
    background: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
        background: transparent;
        color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}60;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`;