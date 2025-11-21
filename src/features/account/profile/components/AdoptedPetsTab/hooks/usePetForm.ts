import { useState, useCallback } from "react";
import { petService } from "@/features/pet/petService";
import { pictureService } from "@api/pictureService";
import type IPet from "@models/Pet";
import { useToast } from "@contexts/ToastContext";

interface PetFormData {
    name: string;
    age: string;
    type: string;
    gender: string;
    weight: string;
    description: string;
    images: File[];
}

export function usePetForm(onSuccess: () => void) {
    const [petFormData, setPetFormData] = useState<PetFormData>({
        name: "",
        age: "",
        type: "",
        gender: "",
        weight: "",
        description: "",
        images: []
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [originalImageIds, setOriginalImageIds] = useState<string[]>([]);
    const [previewToOriginalIdMap, setPreviewToOriginalIdMap] = useState<Map<number, string>>(new Map());
    const [creatingPet, setCreatingPet] = useState(false);
    const [updatingPet, setUpdatingPet] = useState(false);
    const { showSuccess, showError } = useToast();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
        
        if (invalidFiles.length > 0) {
            showError("Apenas imagens JPEG e PNG são permitidas");
            return;
        }
        
        setImagePreviews(prev => {
            if (files.length + prev.length > 6) {
                showError("Você pode adicionar no máximo 6 imagens");
                return prev;
            }
            
            const newImages = [...petFormData.images, ...files];
            setPetFormData(prevState => ({ ...prevState, images: newImages }));
            const newPreviews = files.map(file => URL.createObjectURL(file));
            return [...prev, ...newPreviews];
        });
    };

    const removeImage = (index: number) => {
        const newImages = petFormData.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviews[index]);
        }
        
        const newMap = new Map<number, string>();
        previewToOriginalIdMap.forEach((originalId, mapIndex) => {
            if (mapIndex < index) {
                newMap.set(mapIndex, originalId);
            } else if (mapIndex > index) {
                newMap.set(mapIndex - 1, originalId);
            }
        });
        
        setPetFormData(prev => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
        setPreviewToOriginalIdMap(newMap);
    };

    const resetPetForm = useCallback(() => {
        setPetFormData({
            name: "",
            age: "",
            type: "",
            gender: "",
            weight: "",
            description: "",
            images: []
        });
        setImagePreviews(prev => {
            prev.forEach(preview => {
                if (preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
            return [];
        });
        setOriginalImageIds([]);
        setPreviewToOriginalIdMap(new Map());
        const fileInput = document.getElementById('adopted-pet-images-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }, []);

    const initializeEditForm = (pet: IPet) => {
        setPetFormData({
            name: pet.name || "",
            age: pet.age?.toString() || "",
            type: pet.type || "",
            gender: pet.gender || "",
            weight: pet.weight?.toString() || "",
            description: pet.description || "",
            images: []
        });
        const existingPreviews = pet.images.map((image) => pictureService.fetchPicture(image));
        setImagePreviews(existingPreviews);
        setOriginalImageIds(pet.images || []);
        
        const newMap = new Map<number, string>();
        (pet.images || []).forEach((imageId, index) => {
            newMap.set(index, imageId);
        });
        setPreviewToOriginalIdMap(newMap);
    };

    const handleCreatePet = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!petFormData.name || !petFormData.type || !petFormData.gender || !petFormData.weight) {
            showError("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        if (petFormData.images.length === 0) {
            showError("Por favor, adicione pelo menos uma imagem");
            return;
        }

        setCreatingPet(true);
        try {
            const petData: Partial<IPet> = {
                name: petFormData.name,
                type: petFormData.type as IPet["type"],
                gender: petFormData.gender as IPet["gender"],
                weight: parseFloat(petFormData.weight),
                description: petFormData.description || undefined,
                age: petFormData.age ? parseInt(petFormData.age) : undefined,
                adopted: false,
                images: []
            };

            const createdPet = await petService.institutionCreatePet(petData as IPet);

            if (petFormData.images.length > 0 && createdPet?.id) {
                const formData = new FormData();
                petFormData.images.forEach((image) => {
                    formData.append("images", image);
                });
                await petService.updateImages(createdPet.id, formData);
            }

            showSuccess("Pet adicionado com sucesso!");
            resetPetForm();
            onSuccess();
        } catch (error: any) {
            showError(error.message || "Erro ao criar pet");
        } finally {
            setCreatingPet(false);
        }
    };

    const handleUpdatePet = async (e: React.FormEvent, editingPet: IPet) => {
        e.preventDefault();
        
        if (!petFormData.name || !petFormData.type || !petFormData.gender || !petFormData.weight) {
            showError("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        setUpdatingPet(true);
        try {
            const petData: Partial<IPet> = {
                name: petFormData.name,
                type: petFormData.type as IPet["type"],
                gender: petFormData.gender as IPet["gender"],
                weight: parseFloat(petFormData.weight),
                description: petFormData.description || undefined,
                age: petFormData.age ? parseInt(petFormData.age) : undefined,
            };

            await petService.updatePet(editingPet.id, petData);
            
            const currentImageIds = new Set<string>();
            previewToOriginalIdMap.forEach((originalId, previewIndex) => {
                if (previewIndex < imagePreviews.length) {
                    const preview = imagePreviews[previewIndex];
                    if (!preview.startsWith('blob:')) {
                        currentImageIds.add(originalId);
                    }
                }
            });
            
            const removedImageIds = originalImageIds.filter(id => !currentImageIds.has(id));

            if (removedImageIds.length > 0) {
                await Promise.all(
                    removedImageIds.map(imageId => 
                        petService.deleteImage(editingPet.id, imageId).catch(err => {
                            console.error(`Erro ao deletar imagem ${imageId}:`, err);
                        })
                    )
                );
            }

            const newImageFiles = petFormData.images.filter(img => img instanceof File);
            if (newImageFiles.length > 0) {
                const formData = new FormData();
                newImageFiles.forEach((image) => {
                    formData.append("images", image);
                });
                await petService.updateImages(editingPet.id, formData);
            }

            showSuccess("Pet atualizado com sucesso!");
            resetPetForm();
            onSuccess();
        } catch (error: any) {
            showError(error.message || "Erro ao atualizar pet");
        } finally {
            setUpdatingPet(false);
        }
    };

    return {
        petFormData,
        setPetFormData,
        imagePreviews,
        creatingPet,
        updatingPet,
        handleImageSelect,
        removeImage,
        resetPetForm,
        initializeEditForm,
        handleCreatePet,
        handleUpdatePet
    };
}

