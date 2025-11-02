import styled from "styled-components";
import type { IAccount } from "@models/Account";
import { BsPatchCheckFill } from "react-icons/bs";
import type { IAccountStatus } from "@models/AccountStatus";

import { FaShieldDog } from "react-icons/fa6";
import { FaHandsHelping } from "react-icons/fa";



import { IoPaw } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ProfileDetailsSkeleton from "./ProfileDetailsSkeleton";

export default function ProfileDetails({ account, accountStatus }: { account: IAccount | null, accountStatus?: IAccountStatus | null }) {
  const navigate = useNavigate();

  if (!account) { return null; }

  const goToProfile = () => {
    navigate(`/profile/${account?.id}`);
  }

  if (!account || !accountStatus) {
    return <ProfileDetailsSkeleton />
  }

  return (
    <ProfileDetailsContainer>
      <ProfileConteinter>

        <ProfileName onClick={goToProfile}>
          {account.name}
        </ProfileName>

        <BadgesContainer>
          {account?.verified && <VerifiedBadge color={"#00D9FF"} size={20} />}
          {(accountStatus || [])?.achievements?.map((achievement, index) => {
            switch (achievement.type) {
              case "adoption":
                return (
                  <BadgeContainer>
                    <VerifiedAdoptionBadge key={index} color={"#BC2DEB"} size={20} />
                    <Tooltip>{achievement.description}</Tooltip>
                  </BadgeContainer>);
              case "donation":
                return (
                  <BadgeContainer>
                    <VerifiedDonationBadge key={index} color={"#E02880"} size={20} />
                    <Tooltip>{achievement.description}</Tooltip>
                  </BadgeContainer>);
              case "sponsorship":
                return (
                  <BadgeContainer>
                    <VerifiedSponsorshipBadge key={index} color={"#427AF4"} size={20} />
                    <Tooltip>{achievement.description}</Tooltip>
                  </BadgeContainer>
                );
            }
          })}

        </BadgesContainer>
      </ProfileConteinter>

      {<ProfileStats>
        <ProfileStatBadge>
          {account?.postCount || 0} Publicações
        </ProfileStatBadge>
      </ProfileStats >}
    </ProfileDetailsContainer>
  );
}
const BadgeContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover span {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: 125%;
  left: 50%;
  background-color: ${({ theme }) => theme.colors.primary || "#333"};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 0.75rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  z-index: 10;
`;

const VerifiedBadge = styled(BsPatchCheckFill) <{ color: string }>`
  filter: drop-shadow(0px 5px 7px ${({ color }) => color});
`;

const VerifiedAdoptionBadge = styled(IoPaw) <{ color: string }>`
  filter: drop-shadow(0px 5px 7px ${({ color }) => color});
`;

const VerifiedDonationBadge = styled(FaShieldDog) <{ color: string }>`
  filter: drop-shadow(0px 5px 7px ${({ color }) => color});
`;

const VerifiedSponsorshipBadge = styled(FaHandsHelping) <{ color: string }>`
  filter: drop-shadow(0px 5px 7px ${({ color }) => color});
`;

const ProfileConteinter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 10px;
`;

const ProfileStatBadge = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 2px 10px;
  border-radius: 25px;
  color: white;
  font-size: 1.1rem;
  width: fit-content;
`;

const ProfileStats = styled.div`
    
`;

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-left: 20px;
  height: 80%;
`;

const ProfileName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  width: fit-content;
  `;

const BadgesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    margin: 0px 10px;
  `;