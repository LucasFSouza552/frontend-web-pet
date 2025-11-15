import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { petInteractionService } from "@/features/account/interactions/petInteractionService";
import { petService } from "@/features/pet/petService";
import type { AccountPetInteraction } from "@models/AccountPetInteraction";
import type IPet from "@models/Pet";
import type { IAccount } from "@models/Account";
import PetDetailCard from "./PetDetailCard";
import animationFile from "@assets/lottie/loading.lottie?url";
import { FaCheck, FaTimes } from "react-icons/fa";

interface AdoptionRequest {
    account: IAccount;
    pet: IPet;
    institution?: IAccount;
    createdAt?: string;
    id?: string;
}

interface PetWithRequests extends IPet {
    requestsCount?: number;
    requests?: AdoptionRequest[];
}

interface PetsTabProps {
    accountId?: string;
    accountRole?: "user" | "admin" | "institution";
}

export default function PetsTab({ accountId, accountRole }: PetsTabProps) {
    const [desiredPets, setDesiredPets] = useState<PetWithRequests[]>([]);
    const [loadingPets, setLoadingPets] = useState(false);
    const [processingRequest, setProcessingRequest] = useState<string | null>(null);
    const [selectedPet, setSelectedPet] = useState<PetWithRequests | null>(null);

    const loadDesiredPets = useCallback(async () => {
        if (!accountId) return;
        setLoadingPets(true);
        try {
            if (accountRole === "institution") {
                const requests = await petService.getRequestedAdoptions(accountId);

                const petMap = new Map<string, { pet: IPet; requests: AdoptionRequest[] }>();

                (requests || []).forEach((request: AdoptionRequest) => {
                    const petId = request.pet.id;
                    if (request.pet.adopted) {
                        return;
                    }

                    if (petMap.has(petId)) {
                        const existing = petMap.get(petId)!;
                        existing.requests.push(request);
                    } else {
                        petMap.set(petId, {
                            pet: { ...request.pet, account: request.institution || request.pet.account },
                            requests: [request]
                        });
                    }
                });

                const petsWithRequests: PetWithRequests[] = Array.from(petMap.values()).map(({ pet, requests }) => ({
                    ...pet,
                    requestsCount: requests.length,
                    requests: requests
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
            setDesiredPets([]);
        } finally {
            setLoadingPets(false);
        }
    }, [accountId, accountRole]);

    const handleAcceptAdoption = async (petId: string, adopterAccountId: string) => {
        try {
            setProcessingRequest(`${petId}-${adopterAccountId}`);
            await petService.acceptPetAdoption(petId, adopterAccountId);
            await loadDesiredPets();
            setSelectedPet(null);
        } catch (error) {
            console.error("Erro ao aceitar adoção:", error);
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleRejectAdoption = async (petId: string, adopterAccountId: string) => {
        try {
            setProcessingRequest(`${petId}-${adopterAccountId}`);
            await petService.rejectPetAdoption(petId, adopterAccountId);
            await loadDesiredPets();
            setSelectedPet(null);
        } catch (error) {
            console.error("Erro ao rejeitar adoção:", error);
        } finally {
            setProcessingRequest(null);
        }
    };

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
                <PetsContainer>
                    {desiredPets.map((pet, index) => (
                        <PetSection className="pet-section" key={`${pet.id}-${index}`}>
                            <PetDetailCard
                                handleModalRequests={() => setSelectedPet(pet)}
                                pet={pet}
                                adoptionRequestsCount={pet.requestsCount}
                            />
                        </PetSection>
                    ))}
                </PetsContainer>
            )}
            {selectedPet && (
                <ModalRequestsContainer>
                    <ModalContent>
                        <ModalHeader>
                            <ModalRequestsTitle>Solicitações de Adoção</ModalRequestsTitle>
                            <ModalCloseButton onClick={() => { setSelectedPet(null); }}>
                                Fechar
                            </ModalCloseButton>
                        </ModalHeader>
                        <ModalRequestsList>
                            {selectedPet?.requests?.map((request, index) => {
                                const account = (request as any)?.account as IAccount | undefined;
                                const reqId = `${selectedPet.id}-${account?.id || index}`;
                                const isProcessing = processingRequest === reqId;
                                return (
                                    <ModalRequestCard key={request.id || index}>
                                        <h3>{account?.name || "Usuário"}</h3>
                                        {account?.email && <span>{account.email}</span>}
                                        {request.createdAt && (
                                            <small>Solicitado em: {new Date(request.createdAt).toLocaleDateString("pt-BR")}</small>
                                        )}
                                        <ModalActions>
                                            <ModalAcceptButton
                                                onClick={() => account?.id && handleAcceptAdoption(selectedPet.id, account.id)}
                                                disabled={isProcessing || !account?.id}
                                            >
                                                <FaCheck size={14} />
                                                Aceitar
                                            </ModalAcceptButton>
                                            <ModalRejectButton
                                                onClick={() => account?.id && handleRejectAdoption(selectedPet.id, account.id)}
                                                disabled={isProcessing || !account?.id}
                                            >
                                                <FaTimes size={14} />
                                                Negar
                                            </ModalRejectButton>
                                        </ModalActions>
                                    </ModalRequestCard>
                                );
                            })}
                        </ModalRequestsList>
                    </ModalContent>
                </ModalRequestsContainer>
            )}
        </ContentContainer>
    );
}

const ModalRequestsContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
`;
const ModalContent = styled.div`
    width: 90%;
    max-width: 640px;
    background: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.9)"};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1rem;
    color: white;
`;
const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
`;
const ModalRequestsTitle = styled.h3`
    margin: 0;
    font-size: 1.25rem;
`;
const ModalCloseButton = styled.button`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
`;
const ModalRequestsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;
const ModalRequestCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    h3 {
        margin: 0;
        font-size: 1rem;
    }
    span {
        font-size: 0.875rem;
        opacity: 0.8;
    }
    small {
        font-size: 0.75rem;
        opacity: 0.6;
    }
`;
const ModalActions = styled.div`
    margin-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
`;
const baseModalBtn = `
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
`;
const ModalAcceptButton = styled.button`
    ${baseModalBtn}
    background-color: #10b981;
    color: white;
    &:hover:not(:disabled) {
        background-color: #059669;
        transform: translateY(-1px);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
const ModalRejectButton = styled.button`
    ${baseModalBtn}
    background-color: #ef4444;
    color: white;
    &:hover:not(:disabled) {
        background-color: #dc2626;
        transform: translateY(-1px);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
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

const PetsContainer = styled.div`
    flex: 1;
    max-width: 100%;
    width: 100%;
    overflow: hidden;
    flex-wrap: wrap;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: row;
    padding: 1rem 0;
    gap: 1rem;
`;

const PetSection = styled.div`
    width: fit-content;
    height: fit-content;
    min-width: 450px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
`;

// (Removed unused styled components related to the commented Requests section)


