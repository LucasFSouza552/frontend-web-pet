import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import useManagePostController from "../controller/useManagePostController";
import { FaArrowRight, FaShareAlt, FaUser, FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { createPortal } from "react-dom";

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

    const [_] = useState(initialContent || "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingPost, setDeletingPost] = useState(false);

    const goToPost = () => {
        navigate(`/post/${postId}`);
    }

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    }

    const handleConfirmDelete = async () => {
        setDeletingPost(true);
        try {
            await handleDeletePost(postId);
            setShowDeleteConfirm(false);
            closeModal("");
        } catch (error) {
        } finally {
            setDeletingPost(false);
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    }

    return (
        <>
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
                            <ModalButton $danger onClick={handleDeleteClick}>
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
            
            {showDeleteConfirm && createPortal(
                <DeleteConfirmModalOverlay onClick={handleCancelDelete}>
                    <DeleteConfirmModal onClick={(e) => e.stopPropagation()}>
                        <DeleteConfirmHeader>
                            <DeleteConfirmIcon>
                                <FaTrash />
                            </DeleteConfirmIcon>
                            <DeleteConfirmTitle>Excluir Post</DeleteConfirmTitle>
                            <DeleteConfirmSubtitle>
                                Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                            </DeleteConfirmSubtitle>
                        </DeleteConfirmHeader>
                        <DeleteConfirmActions>
                            <DeleteCancelButton onClick={handleCancelDelete} disabled={deletingPost}>
                                <FaTimes size={14} />
                                Cancelar
                            </DeleteCancelButton>
                            <DeleteConfirmButton onClick={handleConfirmDelete} disabled={deletingPost}>
                                <FaCheck size={14} />
                                {deletingPost ? "Excluindo..." : "Confirmar"}
                            </DeleteConfirmButton>
                        </DeleteConfirmActions>
                    </DeleteConfirmModal>
                </DeleteConfirmModalOverlay>,
                document.body
            )}
        </>
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

const DeleteConfirmModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const DeleteConfirmModal = styled.div`
    background: ${({ theme }) => theme.colors.quarternary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    padding: 32px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                0 0 30px ${({ theme }) => theme.colors.primary}40;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (max-width: 768px) {
        padding: 24px;
        max-width: 90%;
    }
`;

const DeleteConfirmHeader = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const DeleteConfirmIcon = styled.div`
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(239, 68, 68, 0.15);
    border: 2px solid rgba(239, 68, 68, 0.3);
    border-radius: 50%;
    color: #ef4444;
    font-size: 28px;
    animation: pulse 2s ease-in-out infinite;

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;

const DeleteConfirmTitle = styled.h3`
    margin: 0 0 12px 0;
    font-size: 24px;
    font-weight: 700;
    color: white;
    
    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

const DeleteConfirmSubtitle = styled.p`
    margin: 0;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const DeleteConfirmActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    
    @media (max-width: 768px) {
        flex-direction: column-reverse;
    }
`;

const DeleteConfirmButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    background: #ef4444;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 120px;

    &:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const DeleteCancelButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    min-width: 120px;

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;