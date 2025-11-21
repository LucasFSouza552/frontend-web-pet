import { FaTimes } from "react-icons/fa";
import type IPet from "@models/Pet";
import styled from "styled-components";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
    padding: 1rem;
    overflow-y: auto;
`;

const DeleteModalContent = styled.div`
    width: 100%;
    max-width: 500px;
    background: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.9)"};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    color: white;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const DeleteModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

const DeleteModalTitle = styled.h3`
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #ef4444;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const DeleteModalBody = styled.div`
    margin-bottom: 2rem;
    
    p {
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.9);
    }

    strong {
        color: white;
        font-weight: 600;
    }
`;

const DeleteModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CancelButton = styled.button`
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const DeleteConfirmButton = styled.button`
    padding: 0.75rem 1.5rem;
    background: #ef4444;
    border: none;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;

interface DeletePetModalProps {
    isOpen: boolean;
    petToDelete: IPet | null;
    deletingPet: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeletePetModal({
    isOpen,
    petToDelete,
    deletingPet,
    onClose,
    onConfirm
}: DeletePetModalProps) {
    if (!isOpen || !petToDelete) return null;

    return (
        <ModalOverlay onClick={() => !deletingPet && onClose()}>
            <DeleteModalContent onClick={(e) => e.stopPropagation()}>
                <DeleteModalHeader>
                    <DeleteModalTitle>Confirmar Exclusão</DeleteModalTitle>
                    <CloseButton onClick={() => !deletingPet && onClose()} disabled={!!deletingPet}>
                        <FaTimes />
                    </CloseButton>
                </DeleteModalHeader>
                <DeleteModalBody>
                    <p>Tem certeza que deseja excluir o pet <strong>{petToDelete.name}</strong>?</p>
                    <p style={{ fontSize: "0.9rem", opacity: 0.8, marginTop: "0.5rem" }}>
                        Esta ação não pode ser desfeita.
                    </p>
                </DeleteModalBody>
                <DeleteModalActions>
                    <CancelButton
                        type="button"
                        onClick={onClose}
                        disabled={!!deletingPet}
                    >
                        Cancelar
                    </CancelButton>
                    <DeleteConfirmButton
                        type="button"
                        onClick={onConfirm}
                        disabled={!!deletingPet}
                    >
                        {deletingPet ? "Excluindo..." : "Excluir Pet"}
                    </DeleteConfirmButton>
                </DeleteModalActions>
            </DeleteModalContent>
        </ModalOverlay>
    );
}
