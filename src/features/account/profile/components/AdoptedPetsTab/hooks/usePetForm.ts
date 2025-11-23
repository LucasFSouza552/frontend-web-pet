import { useState, useCallback } from "react";
import { petService } from "@/features/pet/petService";
import { pictureService } from "@api/pictureService";
import type IPet from "@models/Pet";
import { useToast } from "@contexts/ToastContext";

/**
 * Converte uma URL de imagem em um arquivo File
 * @param url - URL da imagem a ser convertida
 * @param filename - Nome do arquivo (opcional, padrão: 'image.jpg')
 * @returns Promise<File> - Arquivo File criado a partir da URL
 */
const convertUrlToFile = async (url: string, filename: string = 'image.jpg'): Promise<File> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar imagem: ${response.statusText}`);
        }

        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
        return file;
    } catch (error) {
        throw new Error(`Erro ao converter URL para arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
};

interface PetFormData {
    name: string;
    age: string;
    type: string;
    gender: string;
    weight: string;
    description: string;
    images: File[] | string[];
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
            setPetFormData(prevState => ({ ...prevState, images: newImages as File[] }));
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

        setPetFormData(prev => ({ ...prev, images: newImages as File[] }));
        setImagePreviews(newPreviews);
    };

    const resetPetForm = useCallback(() => {
        setPetFormData({
            name: "",
            age: "",
            type: "",
            gender: "",
            weight: "",
            description: "",
            images: [] as File[]
        });
        setImagePreviews(prev => {
            prev.forEach(preview => {
                if (preview.startsWith('blob:')) {
                    URL.revokeObjectURL(preview);
                }
            });
            return [];
        });
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
            images: pet.images as string[]
        });
        const existingPreviews = pet.images.map((image) => pictureService.fetchPicture(image));
        setImagePreviews(existingPreviews);
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
            if (petFormData.images.length > 0) {
                const formData = new FormData();

                const imageFiles = await Promise.all(
                    petFormData.images.map(async (image, index) => {
                        if (image instanceof File) {
                            return image;
                        }

                        if (typeof image === 'string') {
                            const filename = `pet-image-${index + 1}.jpg`;
                            return await convertUrlToFile(pictureService.fetchPicture(image), filename);
                        }

                        throw new Error(`Tipo de imagem inválido no índice ${index}`);
                    })
                );

                imageFiles.forEach((file) => {
                    formData.append("images", file);
                });
                await petService.updateImages(editingPet.id, formData);
            } else {
                await petService.updateImages(editingPet.id, new FormData());
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

