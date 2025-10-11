import styled from "styled-components";
import type { IAccount } from "../../../shared/models/account";
import { BsPatchCheckFill } from "react-icons/bs";
import type { IAccountStatus } from "../../../shared/models/accountStatus";

import { RiMedalFill, RiMedalLine } from "react-icons/ri";
import { BiMedal } from "react-icons/bi";

import { IoPaw } from "react-icons/io5";
import type { IconType } from "react-icons";




export default function ProfileDetails({ account, accountStatus }: { account: IAccount | null, accountStatus: IAccountStatus | null }) {

  if (!account) { return null; }
  return (
    <ProfileDetailsContainer>
      <ProfileConteinter>

        <ProfileName>
          {account.name}
        </ProfileName>

        {account?.verified && <VerifiedBadge color={"#00D9FF"} size={20} />}
        {accountStatus?.achievements.map((achievement, index) => {
          switch (achievement.type) {
            case "adoption":
              return (
                <BadgeContainer>
                  <VerifiedAdoptionBadge key={index} color={"#BC2DEB"} size={20} />
                  <Tooltip>{achievement.description}</Tooltip>
                </BadgeContainer>);
            case "donation":
              return <RiMedalLine key={index} color={"#E02880"} size={20} />;
            case "sponsorship":
              return <BiMedal key={index} color={"#E02880"} size={20} />;
          }
        })}

      </ProfileConteinter>

      <ProfileStats>
        <ProfileStatBadge>
          {accountStatus?.postCount || 0} Publicações
        </ProfileStatBadge>
      </ProfileStats >
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


const ProfileConteinter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 5px;
`;

const ProfileStatBadge = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 2px 5px;
  border-radius: 10px;

  color: white;
`;

const ProfileStats = styled.div`
    
`;

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-left: 20px;
  height: 80%
`;

const ProfileName = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  width: fit-content;


  `;