import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import { InputComponent } from "@components/InputComponent";
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

const ModalFormContent = styled.div`
    width: 100%;
    max-width: 700px;
    background: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.9)"};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    color: white;
    max-height: 90vh;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1.5rem;
        max-height: 95vh;
    }
`;

const AddPetModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
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

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-size: 0.95rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
`;

const SelectInput = styled.select`
    padding: 12px 15px;
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
    color: white;
    font-size: 0.95rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.2);
    }

    option {
        background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
        color: white;
    }
`;

const ImageUploadArea = styled.div`
    width: 100%;
    min-height: 200px;
    border: 2px dashed ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 12px;
    padding: 1rem;
    position: relative;
    background: rgba(182, 72, 160, 0.05);
`;

const HiddenFileInput = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 5;
    top: 0;
    left: 0;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};

    &:disabled {
        cursor: not-allowed;
    }
`;

const UploadPlaceholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    height: 200px;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    pointer-events: none;
`;

const ImagePreviewGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
`;

const ImagePreviewItem = styled.div`
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.1);
    z-index: 15;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const RemoveImageButton = styled.button`
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: rgba(239, 68, 68, 0.9);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    z-index: 20;
    pointer-events: auto;

    &:hover:not(:disabled) {
        background: rgba(239, 68, 68, 1);
        transform: scale(1.1);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const AddMoreButton = styled.button`
    aspect-ratio: 1;
    border: 2px dashed ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 8px;
    background: rgba(182, 72, 160, 0.1);
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(182, 72, 160, 0.2);
        transform: scale(1.05);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const FormActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const FormActionsLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const FormActionsRight = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
        width: 100%;
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

const SubmitButton = styled.button`
    padding: 0.75rem 1.5rem;
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    border: none;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(182, 72, 160, 0.9);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.3);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;

const DeletePetButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
        background-color: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

interface PetFormModalProps {
    isOpen: boolean;
    isEditMode: boolean;
    editingPet: IPet | null;
    petFormData: {
        name: string;
        age: string;
        type: string;
        gender: string;
        weight: string;
        description: string;
        images: File[] | string[];
    };
    imagePreviews: string[];
    creatingPet: boolean;
    updatingPet: boolean;
    onClose: () => void;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    onFormSubmit: (e: React.FormEvent) => void;
    onFormDataChange: (key: string, value: string) => void;
    onDeletePet?: () => void;
}

export default function PetFormModal({
    isOpen,
    isEditMode,
    editingPet,
    petFormData,
    imagePreviews,
    creatingPet,
    updatingPet,
    onClose,
    onImageSelect,
    onRemoveImage,
    onFormSubmit,
    onFormDataChange,
    onDeletePet
}: PetFormModalProps) {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={() => !creatingPet && !updatingPet && onClose()}>
            <ModalFormContent onClick={(e) => e.stopPropagation()}>
                <AddPetModalHeader>
                    <ModalTitle>{isEditMode ? "Editar Pet" : "Adicionar Novo Pet"}</ModalTitle>
                    <CloseButton onClick={() => !creatingPet && !updatingPet && onClose()} disabled={creatingPet || updatingPet}>
                        <FaTimes />
                    </CloseButton>
                </AddPetModalHeader>
                <Form onSubmit={onFormSubmit}>
                    <FormRow>
                        <FormGroup>
                            <Label>Nome *</Label>
                            <InputComponent
                                label="name"
                                type="text"
                                placeholder="Nome do pet"
                                value={petFormData.name}
                                onChange={onFormDataChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Idade</Label>
                            <InputComponent
                                label="age"
                                type="number"
                                placeholder="Idade em anos"
                                value={petFormData.age}
                                onChange={onFormDataChange}
                            />
                        </FormGroup>
                    </FormRow>
                    <FormRow>
                        <FormGroup>
                            <Label>Tipo *</Label>
                            <SelectInput
                                value={petFormData.type}
                                onChange={(e) => onFormDataChange("type", e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="Cachorro">Cachorro</option>
                                <option value="Gato">Gato</option>
                                <option value="Pássaro">Pássaro</option>
                                <option value="Outro">Outro</option>
                            </SelectInput>
                        </FormGroup>
                        <FormGroup>
                            <Label>Sexo *</Label>
                            <SelectInput
                                value={petFormData.gender}
                                onChange={(e) => onFormDataChange("gender", e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="male">Macho</option>
                                <option value="female">Fêmea</option>
                            </SelectInput>
                        </FormGroup>
                        <FormGroup>
                            <Label>Peso (kg) *</Label>
                            <InputComponent
                                label="weight"
                                type="number"
                                placeholder="Peso em kg"
                                value={petFormData.weight}
                                onChange={onFormDataChange}
                            />
                        </FormGroup>
                    </FormRow>
                    <FormGroup>
                        <Label>Descrição</Label>
                        <InputComponent
                            label="description"
                            type="textarea"
                            placeholder="Descreva o pet..."
                            value={petFormData.description}
                            onChange={onFormDataChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Imagens {isEditMode ? "(máximo 6)" : "* (máximo 6)"}</Label>
                        <ImageUploadArea>
                            {imagePreviews.length === 0 ? (
                                <>
                                    <HiddenFileInput
                                        id="adopted-pet-images-input"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        multiple
                                        onChange={onImageSelect}
                                        disabled={creatingPet || updatingPet || petFormData.images.length >= 6}
                                    />
                                    <UploadPlaceholder>
                                        <FaPlus size={32} />
                                        <span>Clique para adicionar imagens</span>
                                    </UploadPlaceholder>
                                </>
                            ) : (
                                <>
                                    <ImagePreviewGrid>
                                        {imagePreviews.map((preview, index) => (
                                            <ImagePreviewItem key={index}>
                                                <PreviewImage src={preview} alt={`Preview ${index + 1}`} />
                                                <RemoveImageButton
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        onRemoveImage(index);
                                                    }}
                                                    disabled={creatingPet || updatingPet}
                                                >
                                                    <FaTimes />
                                                </RemoveImageButton>
                                            </ImagePreviewItem>
                                        ))}
                                        {imagePreviews.length < 6 && (
                                            <AddMoreButton
                                                type="button"
                                                onClick={() => document.getElementById('adopted-pet-images-input')?.click()}
                                                disabled={creatingPet || updatingPet}
                                            >
                                                <FaPlus size={24} />
                                            </AddMoreButton>
                                        )}
                                    </ImagePreviewGrid>
                                    <HiddenFileInput
                                        id="adopted-pet-images-input"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        multiple
                                        onChange={onImageSelect}
                                        disabled={creatingPet || updatingPet || petFormData.images.length >= 6}
                                        style={{ display: 'none' }}
                                    />
                                </>
                            )}
                        </ImageUploadArea>
                    </FormGroup>
                    <FormActions>
                        <FormActionsLeft>
                            {isEditMode && editingPet && !editingPet.adopted && onDeletePet && (
                                <DeletePetButton
                                    type="button"
                                    onClick={onDeletePet}
                                    disabled={creatingPet || updatingPet}
                                >
                                    <FaTrash size={14} />
                                    Excluir Pet
                                </DeletePetButton>
                            )}
                        </FormActionsLeft>
                        <FormActionsRight>
                            <CancelButton
                                type="button"
                                onClick={onClose}
                                disabled={creatingPet || updatingPet}
                            >
                                Cancelar
                            </CancelButton>
                            <SubmitButton type="submit" disabled={creatingPet || updatingPet}>
                                {isEditMode 
                                    ? (updatingPet ? "Atualizando..." : "Atualizar Pet")
                                    : (creatingPet ? "Criando..." : "Criar Pet")
                                }
                            </SubmitButton>
                        </FormActionsRight>
                    </FormActions>
                </Form>
            </ModalFormContent>
        </ModalOverlay>
    );
}
