import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { petInteractionService } from "@/features/account/interactions/petInteractionService";
import { petService } from "@/features/pet/petService";
import type { AccountPetInteraction } from "@/shared/models/AccountPetInteraction";
import type IPet from "@/shared/models/Pet";
import type { IAccount } from "@/shared/models/Account";
import PetDetailCard from "./PetDetailCard";
import animationFile from "@/shared/assets/lottie/loading.lottie?url";

interface AdoptionRequest {
    account: IAccount;
    pet: IPet;
    institution?: IAccount;
    createdAt?: string;
}

interface PetWithRequests extends IPet {
    requestsCount?: number;
}

interface PetsTabProps {
    accountId?: string;
    accountRole?: "user" | "admin" | "institution";
}

export default function PetsTab({ accountId, accountRole }: PetsTabProps) {
    const [desiredPets, setDesiredPets] = useState<PetWithRequests[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);

    const loadDesiredPets = useCallback(async () => {
        if (!accountId) return;
        setLoadingPets(true);
        try {
            if (accountRole === "institution") {
                const requests = await petService.getRequestedAdoptions(accountId);
                console.log(requests);
                
                const petMap = new Map<string, { pet: IPet; count: number; institution?: IAccount }>();
                
                (requests || []).forEach((request: AdoptionRequest) => {
                    const petId = request.pet.id;
                    
                    if (petMap.has(petId)) {
                        const existing = petMap.get(petId)!;
                        existing.count += 1;
                    } else {
                        petMap.set(petId, {
                            pet: { ...request.pet, account: request.institution || request.pet.account },
                            count: 1,
                            institution: request.institution
                        });
                    }
                });

                const petsWithRequests: PetWithRequests[] = Array.from(petMap.values()).map(({ pet, count }) => ({
                    ...pet,
                    requestsCount: count
                }));

                setDesiredPets(petsWithRequests);
            } else {
                const interactions = await petInteractionService.getInteractionByAccount(accountId);
                const likedInteractions = interactions.filter((interaction: AccountPetInteraction) =>
                    interaction.status === "liked"
                );
                const pets = likedInteractions.map((interaction: AccountPetInteraction) => interaction.pet as IPet);
                setDesiredPets(pets);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            setDesiredPets([]);
        } finally {
            setLoadingPets(false);
        }
    }, [accountId, accountRole]);

    useEffect(() => {
        loadDesiredPets();
    }, [loadDesiredPets]);

    if (loadingPets) {
        return (
            <LoadingContainer>
                <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />
            </LoadingContainer>
        );
    }
    return (
        <ContentContainer>
            <h2>{accountRole === "institution" ? "Pets desejados pelos usuários" : "Pets que deseja adotar"}</h2>
            {desiredPets.length === 0 ? (
                <EmptyState>
                    <h3>
                        {accountRole === "institution"
                            ? "Nenhum pet desejado ainda"
                            : "Nenhum pet marcado ainda"}
                    </h3>
                    <p>
                        {accountRole === "institution"
                            ? "Quando usuários demonstrarem interesse em seus pets, eles aparecerão aqui."
                            : "Quando você demonstrar interesse em um pet, ele aparecerá aqui."}
                    </p>
                </EmptyState>
            ) : (
                <PetsGrid>
                    {desiredPets.map((pet, index) => (
                        <PetDetailCard 
                            key={`${pet.id}-${index}`} 
                            pet={pet}
                            adoptionRequestsCount={pet.requestsCount}
                        />
                    ))}
                </PetsGrid>
            )}
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

    h2 {
        color: white;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
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
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 2rem;
    align-items: start;
    padding: 1rem 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }

    @media (max-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    }
`;


