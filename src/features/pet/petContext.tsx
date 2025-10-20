import { createContext, useCallback, useState } from "react";
import type IPet from "../../shared/models/Pet";
import type Pet from "../../shared/models/Pet";

interface PetContextProps {
    pets: IPet[];
    selectedPet: IPet | null;
    loadingPets: boolean;
    hasMorePets: boolean;
    setSelectedPet: (pet: IPet | null) => void;
}

export const PetsContext = createContext<PetContextProps>({} as PetContextProps)

export function PetsProvider({ children }: { children: React.ReactNode }) {

    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<IPet | null>(null);
    const [loadingPets, setLoadingPets] = useState(false);
    const [hasMorePets, setHasMorePets] = useState(false);

    return (
        <PetsContext.Provider value={{
            pets,
            selectedPet,
            loadingPets,
            hasMorePets,
            setSelectedPet
        }}>{children}</PetsContext.Provider>
    )
}