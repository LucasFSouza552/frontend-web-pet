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
import { FaCheck, FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import { pictureService } from "@api/pictureService";

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
    currentAccount?: IAccount | null;
}

export default function PetsTab({ accountId, accountRole, currentAccount }: PetsTabProps) {
    const isOwner = Boolean(
        currentAccount?.id && 
        accountId && 
        String(currentAccount.id) === String(accountId) && 
        accountRole === "institution" &&
        currentAccount.role === "institution"
    );
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
                                handleModalRequests={isOwner ? (e) => {
                                    e?.stopPropagation();
                                    setSelectedPet(pet);
                                } : undefined}
                                pet={pet}
                                adoptionRequestsCount={pet.requestsCount}
                            />
                        </PetSection>
                    ))}
                </PetsContainer>
            )}
            {selectedPet && isOwner && (
                <ModalRequestsContainer onClick={() => setSelectedPet(null)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <RequestsModalHeader>
                            <ModalHeaderInfo>
                                <ModalRequestsTitle>Interessados em {selectedPet.name}</ModalRequestsTitle>
                                <ModalRequestsSubtitle>
                                    {selectedPet.requests?.length || 0} {selectedPet.requests?.length === 1 ? "pessoa interessada" : "pessoas interessadas"}
                                </ModalRequestsSubtitle>
                            </ModalHeaderInfo>
                            <ModalCloseButton onClick={() => { setSelectedPet(null); }}>
                                <FaTimes size={16} />
                            </ModalCloseButton>
                        </RequestsModalHeader>
                        <ModalRequestsList>
                            {selectedPet?.requests && selectedPet.requests.length > 0 ? (
                                selectedPet.requests.map((request, index) => {
                                    const account = (request as any)?.account as IAccount | undefined;
                                    const reqId = `${selectedPet.id}-${account?.id || index}`;
                                    const isProcessing = processingRequest === reqId;
                                    const avatarUrl = account?.avatar ? pictureService.fetchPicture(account.avatar) : null;
                                    
                                    return (
                                        <ModalRequestCard key={request.id || index}>
                                            <RequestCardHeader>
                                                <UserAvatarContainer>
                                                    {avatarUrl ? (
                                                        <UserAvatar src={avatarUrl} alt={account?.name || "Usuário"} />
                                                    ) : (
                                                        <UserAvatarPlaceholder>
                                                            <FaUser size={24} />
                                                        </UserAvatarPlaceholder>
                                                    )}
                                                </UserAvatarContainer>
                                                <UserInfo>
                                                    <UserName>{account?.name || "Usuário"}</UserName>
                                                    {account?.email && (
                                                        <UserDetail>
                                                            <FaEnvelope size={12} />
                                                            {account.email}
                                                        </UserDetail>
                                                    )}
                                                </UserInfo>
                                            </RequestCardHeader>
                                            
                                            <RequestCardDetails>
                                                {account?.phone_number && (
                                                    <DetailRow>
                                                        <DetailIcon>
                                                            <FaPhone size={14} />
                                                        </DetailIcon>
                                                        <DetailText>{account.phone_number}</DetailText>
                                                    </DetailRow>
                                                )}
                                                {account?.address && (
                                                    <DetailRow>
                                                        <DetailIcon>
                                                            <FaMapMarkerAlt size={14} />
                                                        </DetailIcon>
                                                        <DetailText>
                                                            {[
                                                                account.address.city,
                                                                account.address.state
                                                            ].filter(Boolean).join(", ") || "Localização não informada"}
                                                        </DetailText>
                                                    </DetailRow>
                                                )}
                                                {request.createdAt && (
                                                    <DetailRow>
                                                        <DetailIcon>
                                                            <FaCalendar size={14} />
                                                        </DetailIcon>
                                                        <DetailText>
                                                            Solicitado em {new Date(request.createdAt).toLocaleDateString("pt-BR", {
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric"
                                                            })}
                                                        </DetailText>
                                                    </DetailRow>
                                                )}
                                            </RequestCardDetails>
                                            
                                            {isOwner && (
                                                <ModalActions>
                                                    <ModalAcceptButton
                                                        onClick={() => account?.id && handleAcceptAdoption(selectedPet.id, account.id)}
                                                        disabled={isProcessing || !account?.id}
                                                    >
                                                        <FaCheck size={14} />
                                                        {isProcessing ? "Processando..." : "Aceitar"}
                                                    </ModalAcceptButton>
                                                    <ModalRejectButton
                                                        onClick={() => account?.id && handleRejectAdoption(selectedPet.id, account.id)}
                                                        disabled={isProcessing || !account?.id}
                                                    >
                                                        <FaTimes size={14} />
                                                        {isProcessing ? "Processando..." : "Recusar"}
                                                    </ModalRejectButton>
                                                </ModalActions>
                                            )}
                                        </ModalRequestCard>
                                    );
                                })
                            ) : (
                                <EmptyRequestsMessage>
                                    Nenhuma solicitação de adoção encontrada para este pet.
                                </EmptyRequestsMessage>
                            )}
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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    overflow-y: auto;
    backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    background: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.95)"};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.5rem;
    color: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    overflow-y: auto;
    
    @media (max-width: 768px) {
        padding: 1rem;
        max-height: 95vh;
    }
`;

const RequestsModalHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalHeaderInfo = styled.div`
    flex: 1;
`;

const ModalRequestsTitle = styled.h3`
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
`;

const ModalRequestsSubtitle = styled.p`
    margin: 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
`;

const ModalCloseButton = styled.button`
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    width: 36px;
    height: 36px;
    
    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }
`;

const ModalRequestsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const ModalRequestCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
`;

const RequestCardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const UserAvatarContainer = styled.div`
    flex-shrink: 0;
`;

const UserAvatar = styled.img`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
`;

const UserAvatarPlaceholder = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
`;

const UserInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const UserName = styled.h4`
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
`;

const UserDetail = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    
    svg {
        opacity: 0.6;
    }
`;

const RequestCardDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
`;

const DetailRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
`;

const DetailIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    flex-shrink: 0;
    margin-top: 2px;
`;

const DetailText = styled.span`
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    flex: 1;
`;

const ModalActions = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
    
    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const EmptyRequestsMessage = styled.div`
    text-align: center;
    padding: 3rem 2rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1rem;
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


