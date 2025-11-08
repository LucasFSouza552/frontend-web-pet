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
import { pictureService } from "@/shared/api/pictureService";
import { FaCheck, FaTimes, FaUsers } from "react-icons/fa";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            console.error("Erro ao carregar dados:", error);
            setDesiredPets([]);
        } finally {
            setLoadingPets(false);
        }
    }, [accountId, accountRole]);

    const handleAcceptAdoption = async (petId: string, accountId: string) => {
        try {
            setProcessingRequest(`${petId}-${accountId}`);
            await petService.acceptPetAdoption(petId, accountId);
            await loadDesiredPets();
        } catch (error) {
            console.error("Erro ao aceitar adoção:", error);
            alert("Erro ao aceitar solicitação de adoção");
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleRejectAdoption = async (petId: string, accountId: string) => {
        try {
            setProcessingRequest(`${petId}-${accountId}`);
            await petService.rejectPetAdoption(petId, accountId);
            await loadDesiredPets();
        } catch (error) {
            console.error("Erro ao rejeitar adoção:", error);
            alert("Erro ao rejeitar solicitação de adoção");
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
                        <PetSection key={`${pet.id}-${index}`}>
                            <PetDetailCard
                                pet={pet}
                                adoptionRequestsCount={pet.requestsCount}
                            />
                            {accountRole === "institution" && pet.requests && pet.requests.length > 0 && (
                                <RequestsContainer>
                                    <RequestsTitle>
                                        <FaUsers size={20} />
                                        <span>Solicitações de Adoção ({pet.requests.length})</span>
                                    </RequestsTitle>
                                    <RequestsList>
                                        {pet.requests.map((request, reqIndex) => {
                                            const requestId = `${pet.id}-${typeof request.account === 'string' ? request.account : request.account.id}`;
                                            const isProcessing = processingRequest === requestId;
                                            const account = typeof request.account === 'string' ? null : request.account;

                                            return (
                                                <RequestCard key={reqIndex}>
                                                    <RequestUserInfo>
                                                        <UserAvatar
                                                            src={pictureService.fetchPicture(account?.avatar || "")}
                                                            alt={account?.name || "Usuário"}
                                                        />
                                                        <UserDetails>
                                                            <UserName>{account?.name || "Usuário"}</UserName>
                                                            <UserEmail>{account?.email || ""}</UserEmail>
                                                            {request.createdAt && (
                                                                <RequestDate>
                                                                    Solicitado em: {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                                                                </RequestDate>
                                                            )}
                                                        </UserDetails>
                                                    </RequestUserInfo>
                                                    <RequestActions>
                                                        <AcceptButton
                                                            onClick={() => handleAcceptAdoption(pet.id, typeof request.account === 'string' ? request.account : request.account.id)}
                                                            disabled={isProcessing}
                                                        >
                                                            <FaCheck size={16} />
                                                            Aceitar
                                                        </AcceptButton>
                                                        <RejectButton
                                                            onClick={() => handleRejectAdoption(pet.id, typeof request.account === 'string' ? request.account : request.account.id)}
                                                            disabled={isProcessing}
                                                        >
                                                            <FaTimes size={16} />
                                                            Negar
                                                        </RejectButton>
                                                    </RequestActions>
                                                </RequestCard>
                                            );
                                        })}
                                    </RequestsList>
                                </RequestsContainer>
                            )}
                        </PetSection>
                    ))}
                </PetsContainer>
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

const PetsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1rem 0;
`;

const PetSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const RequestsContainer = styled.div`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.3)"};
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RequestsTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    color: white;
    font-size: 1.25rem;
    font-weight: 600;

    span {
        display: flex;
        align-items: center;
    }
`;

const RequestsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const RequestCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    padding: 1rem;
    gap: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        border-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const RequestUserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
`;

const UserAvatar = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#008CFF"};
`;

const UserDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: white;
`;

const UserName = styled.span`
    font-size: 1rem;
    font-weight: 600;
    color: white;
`;

const UserEmail = styled.span`
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
`;

const RequestDate = styled.span`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.25rem;
`;

const RequestActions = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        justify-content: stretch;
    }
`;

const AcceptButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;

    &:hover:not(:disabled) {
        background-color: #059669;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        flex: 1;
        justify-content: center;
    }
`;

const RejectButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;

    &:hover:not(:disabled) {
        background-color: #dc2626;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        flex: 1;
        justify-content: center;
    }
`;


