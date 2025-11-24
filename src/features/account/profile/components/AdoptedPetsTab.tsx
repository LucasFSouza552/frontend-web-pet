import { useState } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type IPet from "@models/Pet";
import type { IAccount } from "@models/Account";
import animationFile from "@assets/lottie/loading.lottie?url";
import PetDetailCard from "./PetDetailCard";
import { FaPlus, FaEdit } from "react-icons/fa";
import { useToast } from "@contexts/ToastContext";
import { petService } from "@/features/pet/petService";
import { useAdoptedPets } from "./AdoptedPetsTab/hooks/useAdoptedPets";
import { usePetForm } from "./AdoptedPetsTab/hooks/usePetForm";
import PetFormModal from "./AdoptedPetsTab/components/PetFormModal";
import DeletePetModal from "./AdoptedPetsTab/components/DeletePetModal";

interface AdoptedPetsTabProps {
    accountId?: string;
    accountRole?: "user" | "admin" | "institution";
    currentAccount?: IAccount | null;
}

export default function AdoptedPetsTab({ accountId, accountRole, currentAccount }: AdoptedPetsTabProps) {
    const isOwner = Boolean(
        currentAccount?.id && 
        accountId && 
        String(currentAccount.id) === String(accountId) && 
        accountRole === "institution" &&
        currentAccount.role === "institution"
    );
    const [showAddPetModal, setShowAddPetModal] = useState(false);
    const [showEditPetModal, setShowEditPetModal] = useState(false);
    const [editingPet, setEditingPet] = useState<IPet | null>(null);
    const [deletingPet, setDeletingPet] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [petToDelete, setPetToDelete] = useState<IPet | null>(null);
    const { showError, showSuccess } = useToast();

    const { adoptedPets, loadingPets, loadAdoptedPets } = useAdoptedPets(accountId, accountRole);

    const petForm = usePetForm(() => {
        setShowAddPetModal(false);
        setShowEditPetModal(false);
        setEditingPet(null);
        loadAdoptedPets();
    });

    const handleEditPet = (pet: IPet) => {
        setEditingPet(pet);
        petForm.initializeEditForm(pet);
        setShowEditPetModal(true);
    };

    const handleCancel = () => {
        petForm.resetPetForm();
        setShowAddPetModal(false);
        setShowEditPetModal(false);
        setEditingPet(null);
    };

    const handleDeletePet = (pet: IPet) => {
        if (pet.adopted) {
            showError("Não é possível excluir um pet que já foi adotado");
            return;
        }
        setPetToDelete(pet);
        setShowDeleteModal(true);
    };

    const confirmDeletePet = async () => {
        if (!petToDelete) return;

        if (petToDelete.adopted) {
            showError("Não é possível excluir um pet que já foi adotado");
            setShowDeleteModal(false);
            setPetToDelete(null);
            return;
        }

        setDeletingPet(petToDelete.id);
        try {
            await petService.softDeletePet(petToDelete.id);
            showSuccess("Pet excluído com sucesso!");
            setShowDeleteModal(false);
            setPetToDelete(null);
            await loadAdoptedPets();
        } catch (error: any) {
            showError(error.message || "Erro ao excluir pet");
        } finally {
            setDeletingPet(null);
        }
    };

    const cancelDeletePet = () => {
        setShowDeleteModal(false);
        setPetToDelete(null);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        if (showEditPetModal && editingPet) {
            petForm.handleUpdatePet(e, editingPet);
        } else {
            petForm.handleCreatePet(e);
        }
    };

    if (loadingPets) {
        return (
            <LoadingContainer>
                <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />
            </LoadingContainer>
        );
    }

    return (
        <ContentContainer>
            <HeaderContainer>
                <h2>{accountRole === "institution" ? "Pets na instituição" : "Pets Adotados"}</h2>
                {isOwner && (
                    <AddPetButton onClick={() => setShowAddPetModal(true)}>
                        <FaPlus size={16} />
                        Adicionar Pet
                    </AddPetButton>
                )}
            </HeaderContainer>
            {adoptedPets.length === 0 ? (
                <EmptyState>
                    <h3>{accountRole === "institution" ? "Nenhum pet cadastrado ainda" : "Nenhum pet adotado ainda"}</h3>
                    <p>{accountRole === "institution" ? "Quando você cadastrar um pet, ele aparecerá aqui." : "Quando você adotar um pet, ele aparecerá aqui."}</p>
                </EmptyState>
            ) : (
                <PetsGrid>
                    {adoptedPets.map((pet, index) => (
                        <PetCardWrapper key={index}>
                            {isOwner && (
                                <PetActionsBar>
                                    <EditPetButton onClick={() => handleEditPet(pet)}>
                                        <FaEdit size={16} />
                                        Editar
                                    </EditPetButton>
                                </PetActionsBar>
                            )}
                            <PetDetailCard pet={pet} adoptionRequestsCount={0} />
                        </PetCardWrapper>
                    ))}
                </PetsGrid>
            )}
            <PetFormModal
                isOpen={showAddPetModal || showEditPetModal}
                isEditMode={showEditPetModal}
                editingPet={editingPet}
                petFormData={petForm.petFormData}
                imagePreviews={petForm.imagePreviews}
                creatingPet={petForm.creatingPet}
                updatingPet={petForm.updatingPet}
                onClose={handleCancel}
                onImageSelect={petForm.handleImageSelect}
                onRemoveImage={petForm.removeImage}
                onFormSubmit={handleFormSubmit}
                onFormDataChange={(key, value) => petForm.setPetFormData(prev => ({ ...prev, [key]: value }))}
                onDeletePet={editingPet ? () => {
                    setShowEditPetModal(false);
                    handleDeletePet(editingPet);
                } : undefined}
            />
            <DeletePetModal
                isOpen={showDeleteModal}
                petToDelete={petToDelete}
                deletingPet={!!deletingPet}
                onClose={cancelDeletePet}
                onConfirm={confirmDeletePet}
            />
        </ContentContainer>
    );
}

const ContentContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    color: white;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    
    h2 {
        color: white;
        font-size: 1.5rem;
        margin: 0;
        font-weight: bold;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const AddPetButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.95rem;

    &:hover {
        background-color: rgba(182, 72, 160, 0.9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.3);
    }

    &:active {
        transform: translateY(0);
    }
`;

const PetCardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const PetActionsBar = styled.div`
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding: 0.5rem 0;
`;

const EditPetButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    background-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(182, 72, 160, 0.3);

    &:hover {
        background-color: rgba(182, 72, 160, 0.9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
`;

const LoadingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
`;

const EmptyState = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.3)"};
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    backdrop-filter: blur(10px);

    h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: white;
    }

    p {
        font-size: 1rem;
        opacity: 0.8;
    }
`;

const PetsGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 1.5rem;
    align-items: start;
    padding: 1rem 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;
