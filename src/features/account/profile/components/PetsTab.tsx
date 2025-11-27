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
import { useToast } from "@contexts/ToastContext";

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
    const [cancellingPetId, setCancellingPetId] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    const isProfileOwner = Boolean(
        currentAccount?.id &&
        accountId &&
        String(currentAccount.id) === String(accountId)
    );
    const canCancelOwnRequest = accountRole !== "institution" && isProfileOwner;

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
        } catch (error) {
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleCancelAdoption = async (petId: string) => {
        try {
            setCancellingPetId(petId);
            await petInteractionService.undoInteraction(petId);
            showSuccess("Pedido de adoção cancelado com sucesso!");
            await loadDesiredPets();
        } catch (error: any) {
            showError(error?.message || "Erro ao cancelar pedido de adoção");
        } finally {
            setCancellingPetId(null);
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
                        <PetSection className="pet-section" key={pet.id || `pet-${index}`}>
                            <PetDetailCard
                                pet={pet}
                                adoptionRequestsCount={pet.requestsCount}
                                adoptionRequests={pet.requests}
                                isOwner={isOwner}
                                onAcceptAdoption={isOwner ? handleAcceptAdoption : undefined}
                                onRejectAdoption={isOwner ? handleRejectAdoption : undefined}
                                processingRequest={processingRequest}
                                onCancelAdoption={
                                    canCancelOwnRequest ? () => handleCancelAdoption(pet.id) : undefined
                                }
                                isCancelling={cancellingPetId === pet.id}
                            />
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


