import { useEffect, useState } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { petService } from "@/features/pet/petService";
import type IPet from "@models/Pet";
import animationFile from "@assets/lottie/loading.lottie?url";
import PetDetailCard from "./PetDetailCard";

interface AdoptedPetsTabProps {
    accountId?: string;
    accountRole?: "user" | "admin" | "institution";
}

export default function AdoptedPetsTab({ accountId, accountRole }: AdoptedPetsTabProps) {
    const [adoptedPets, setAdoptedPets] = useState<IPet[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);

    const loadAdoptedPets = async () => {
        if (!accountId) return;
        setLoadingPets(true);
        try {
            if (accountRole === "institution") {
                const pets = await petService.getAllByInstitution(accountId);
                setAdoptedPets(pets);
            } else {
                const pets = await petService.getAdoptedPetsByAccount(accountId);
                console.log("Meus pets:", pets)
                setAdoptedPets(pets);
            }
        } catch (error) {
            console.error("Erro ao carregar pets:", error);
            setAdoptedPets([]);
        } finally {
            setLoadingPets(false);
        }
    };

    useEffect(() => {
        if (accountId) {
            loadAdoptedPets();
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
            <h2>{accountRole === "institution" ? "Pets na instituição" : "Pets Adotados"}</h2>
            {adoptedPets.length === 0 ? (
                <EmptyState>
                    <h3>{accountRole === "institution" ? "Nenhum pet cadastrado ainda" : "Nenhum pet adotado ainda"}</h3>
                    <p>{accountRole === "institution" ? "Quando você cadastrar um pet, ele aparecerá aqui." : "Quando você adotar um pet, ele aparecerá aqui."}</p>
                </EmptyState>
            ) : (
                <PetsGrid>
                    {adoptedPets.map((pet, index) => (
                        <PetDetailCard pet={pet} adoptionRequestsCount={0} key={index} />
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

