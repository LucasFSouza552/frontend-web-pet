import styled, { keyframes } from "styled-components";

export default function MatchCardSkeleton() {
    return (
        <CardContainer>
            <CardDetails>
                <PetPictureContainer>
                    <ImageSkeleton />
                </PetPictureContainer>
                <PetInfo>
                    <LabelSkeleton />
                    <DescriptionSkeleton />
                    <InfoSkeleton />
                    <InfoSkeleton />
                </PetInfo>
            </CardDetails>
            <CardOptions>
                <OptionSkeleton />
                <OptionSkeleton />
                <OptionSkeleton />
                <OptionSkeleton />
                <OptionSkeleton />
            </CardOptions>
        </CardContainer>
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

const CardContainer = styled.div`
  width: 460px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  max-height: 80%;
  min-height: 80%;
  color: white;
`;

const CardDetails = styled.div`
  background-color: #333;
  width: 400px;
  padding: 5px;
  display: flex;
  flex-direction: column;
`;

const PetPictureContainer = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const ImageSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 100%;
`;

const PetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
  position: relative;
`;

const LabelSkeleton = styled(SkeletonBase)`
  width: 60%;
  height: 25px;
  border-radius: 12px;
`;

const DescriptionSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 40px;
  border-radius: 8px;
`;

const InfoSkeleton = styled(SkeletonBase)`
  width: 80%;
  height: 20px;
  border-radius: 8px;
`;

const CardOptions = styled.div`
  height: fit-content;
  padding: 10px 0;
  flex: 1;
  background-color: #333;
  border-radius: 0px 20px 20px 0px;
  gap: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
`;

const OptionSkeleton = styled(SkeletonBase)`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
