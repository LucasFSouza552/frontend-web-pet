import styled from "styled-components";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { pictureService } from "@/shared/api/pictureService";
import type { IAccount } from "@/shared/models/Account";

interface InstitutionCardProps {
    institution: IAccount;
    onProfile: (institutionId: string) => void;
    onDonate: (institutionId: string) => void;
}

export default function InstitutionCard({ institution, onProfile, onDonate }: InstitutionCardProps) {
    return (
        <Card>
            <AvatarContainer>
                <Avatar
                    src={pictureService.fetchPicture(institution.avatar || "")}
                    alt={institution.name}
                />
                {institution.verified && <VerifiedBadge />}
            </AvatarContainer>
            <Info>
                <Name>{institution.name}</Name>
                <RoleChip><FaBuilding /> Instituição</RoleChip>
                {institution.address?.city && institution.address?.state && (
                    <Location><FaMapMarkerAlt /> {institution.address.city}, {institution.address.state}</Location>
                )}
                {institution.email && (
                    <Email><FaEnvelope /> {institution.email}</Email>
                )}
                <Meta>
                    {institution.phone_number && (
                        <MetaItem><FaPhone /> {institution.phone_number}</MetaItem>
                    )}
                    {institution.cnpj && (
                        <MetaItem><strong>CNPJ:</strong> {institution.cnpj}</MetaItem>
                    )}
                    {institution.address?.street && (
                        <MetaItem>
                            {institution.address.street}{institution.address.number ? `, ${institution.address.number}` : ""}{institution.address.neighborhood ? ` - ${institution.address.neighborhood}` : ""}
                        </MetaItem>
                    )}
                </Meta>
                <Actions>
                    <PrimaryButton onClick={() => onProfile(institution.id)}>Ver perfil</PrimaryButton>
                    <SecondaryButton onClick={() => onDonate(institution.id)}>Doar</SecondaryButton>
                </Actions>
            </Info>
        </Card>
    );
}

const Card = styled.div`
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: rgba(20, 18, 20, 0.6);
    border: 1px solid rgba(182, 72, 160, 0.3);
    border-radius: 12px;
    color: white;
    align-items: center;
    flex-direction: column;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.2);
    }
`;

const AvatarContainer = styled.div`
    position: relative;
    flex-shrink: 0;
`;

const Avatar = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    object-position: center;
    background-color: ${({ theme }) => theme.colors.bg};
`;

const VerifiedBadge = styled(BsPatchCheckFill)`
    position: absolute;
    bottom: -4px;
    right: -4px;
    color: #00D9FF;
    font-size: 1.25rem;
    background: ${({ theme }) => theme.colors.quarternary};
    border-radius: 50%;
    filter: drop-shadow(0px 2px 4px rgba(0, 217, 255, 0.5));
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const Name = styled.div`
    font-weight: 700;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const RoleChip = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.95rem;
    font-weight: 600;
`;

const Location = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #d8d8d8;
    font-size: 0.9rem;
`;

const Email = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Meta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.25rem;
`;

const MetaItem = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #d8d8d8;
    font-size: 0.85rem;
    strong {
        color: white;
        font-weight: 600;
    }
    svg {
        color: ${({ theme }) => theme.colors.primary};
        flex-shrink: 0;
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
`;

const PrimaryButton = styled.button`
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: white;
    text-decoration: none;
    font-size: 0.875rem;
    background: ${({ theme }) => theme.colors.primary};
    transition: 0.2s ease;
    &:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
    }
`;

const SecondaryButton = styled(PrimaryButton)`
    background: rgba(182, 72, 160, 0.15);
    border-color: rgba(182, 72, 160, 0.6);
    color: ${({ theme }) => theme.colors.primary};
    &:hover {
        background: rgba(182, 72, 160, 0.25);
    }
`;

