import { useEffect, useState } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { petInteractionService } from "@/features/account/interactions/petInteractionService";
import type { AccountPetInteraction } from "@/shared/models/AccountPetInteraction";
import type IPet from "@/shared/models/Pet";
import MatchCard from "@/features/match/components/MatchCard";
import animationFile from "@/shared/assets/lottie/loading.lottie?url";

interface PetsTabProps {
    accountId?: string;
}

export default function PetsTab({ accountId }: PetsTabProps) {
    const [desiredPets, setDesiredPets] = useState<IPet[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);

    const loadDesiredPets = async () => {
        if (!accountId) return;
        setLoadingPets(true);
        try {
            const interactions = await petInteractionService.fetchAccountPetsInteractions();
            const likedInteractions = interactions.filter((interaction: AccountPetInteraction) => 
                interaction.status === "liked"
            );
            const pets = likedInteractions.map((interaction: AccountPetInteraction) => interaction.pet as IPet);
            setDesiredPets(pets);
        } catch (error) {
            console.error("Erro ao carregar pets desejados:", error);
            setDesiredPets([]);
        } finally {
            setLoadingPets(false);
        }
    };

    useEffect(() => {
        if (accountId) {
            loadDesiredPets();
        }
    }, [accountId]);

    if (loadingPets) {
        return (
            <LoadingContainer>
                <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />
            </LoadingContainer>
        );
    }

    return (
        <ContentContainer>
            <h2>Pets que deseja adotar</h2>
            {desiredPets.length === 0 ? (
                <EmptyState>
                    <h3>Nenhum pet marcado ainda</h3>
                    <p>Quando você demonstrar interesse em um pet, ele aparecerá aqui.</p>
                </EmptyState>
            ) : (
                <PetsGrid>
                    {desiredPets.map((pet, index) => (
                        <MatchCard key={`${pet.id}-${index}`} Pet={pet} />
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
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 1.5rem;
    align-items: start;
    padding: 1rem 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

