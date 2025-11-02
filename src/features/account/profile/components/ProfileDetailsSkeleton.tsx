import styled, { keyframes } from "styled-components";

export default function ProfileDetailsSkeleton() {
  return (
    <ProfileDetailsContainer>
      <ProfileConteinter>
        <SkeletonName />

        <BadgesContainer>
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </BadgesContainer>
      </ProfileConteinter>

      <ProfileStats>
        <SkeletonStatBadge />
      </ProfileStats>
    </ProfileDetailsContainer>
  );
}

const shine = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #444 25%, #555 50%, #444 75%);
  background-size: 200px 100%;
  animation: ${shine} 1.5s infinite linear;
  border-radius: 8px;
`;

const ProfileDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-left: 20px;
  height: 80%;
`;

const ProfileConteinter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border-radius: 10px;
`;

const BadgesContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin: 0px 10px;
`;

const ProfileStats = styled.div``;

const SkeletonName = styled(SkeletonBase)`
  width: 150px;
  height: 24px;
`;

const SkeletonBadge = styled(SkeletonBase)`
  width: 22px;
  height: 22px;
  border-radius: 50%;
`;

const SkeletonStatBadge = styled(SkeletonBase)`
  width: 130px;
  height: 22px;
  border-radius: 25px;
  margin-top: 8px;
`;
