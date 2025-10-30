import styled from "styled-components";
import type IPet from "../../../shared/models/Pet";
const apiUrl = import.meta.env.VITE_API_URL;

import { IoLocationSharp } from "react-icons/io5";
import { FaWeightHanging, FaShieldDog, FaShareFromSquare } from "react-icons/fa6";
import { IoMdMale, IoMdFemale, IoMdStar } from "react-icons/io";
import { FaHeart, FaHeartBroken, FaInfo } from "react-icons/fa";
import { useState } from "react";
import { usePetInteractionController } from "../../pet/controllers/usePetInteractionController";

export default function MatchCard({ Pet }: { Pet: IPet }) {
    const [imagePage, setImagePage] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    const { handleRequestAdoption, handleRejectAdoption, handleSponsor, loading, error } = usePetInteractionController();

    const handleClick = async () => {
        const imageIndex = imagePage < Pet.images.length - 1 ? imagePage + 1 : 0;
        setImagePage(imageIndex);
    }

    if (loading || !Pet) {
        return <p>Carregando... Pet</p>
    }

    return (
        <CardContainer>
            <CardDetails>

                <PetPictureContainer onClick={handleClick}>
                    <PetImageSection>{Pet.images.map((_, index) => {
                        return <span className={imagePage === index ? "active" : ""}></span>
                    })}</PetImageSection>
                    {Pet?.images.length > 0 && <img src={`${apiUrl}/api/picture/${Pet.images[imagePage]}`} alt="" />}
                </PetPictureContainer>
                <PetInfo>
                    <PetLabel>
                        <p>
                            {Pet.name}
                        </p>
                        <div>
                            {Pet.gender === "M" && <IoMdMale size={30} color="#008CFF" />}
                            {Pet.gender === "F" && <IoMdFemale size={30} color="#a502b4" />}
                        </div>
                    </PetLabel>
                    <PetDescription title="Descrição">
                        {Pet.description}
                    </PetDescription>
                    <Info>
                        <IoLocationSharp size={20} />
                        {Pet.account.address?.street || ""},{Pet.account.address?.neighborhood || ""} {Pet.account.address?.number},  {Pet.account.address?.city}, {Pet.account.address?.state}
                    </Info>
                    {Pet.weight && <Info>
                        <FaWeightHanging title="Peso" size={20} />
                        {Pet.weight}kg
                    </Info>}
                    <Info title="Instituição">
                        <FaShieldDog size={20} />
                        {Pet.account.name}
                    </Info>
                </PetInfo>
            </CardDetails>
            <CardOptions>
                <OptionIcons title="Gostei" onClick={() => handleRequestAdoption(Pet.id)}>
                    <FaHeart size={25} />
                </OptionIcons>
                <OptionIcons title="Não gostei" onClick={() => handleRejectAdoption(Pet.id)}>
                    <FaHeartBroken size={25} />
                </OptionIcons>
                <OptionIcons title="Apadrinhar" onClick={() => handleSponsor(Pet.id)}>
                    <IoMdStar size={30} />
                </OptionIcons>
                <OptionIcons title="Informações" onClick={() => setShowInfo(true)}>
                    <FaInfo size={25} />
                </OptionIcons>
                <OptionIcons title="Compartilhar">
                    <FaShareFromSquare size={25} />
                </OptionIcons>
            </CardOptions>
            {showInfo && (
                <ModalOverlay onClick={() => setShowInfo(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h3>{Pet.name}</h3>
                            <CloseButton onClick={() => setShowInfo(false)}>×</CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <p>{Pet.description}</p>
                            <Info>
                                <IoLocationSharp size={20} />
                                {Pet.account.address?.street || ""},{Pet.account.address?.neighborhood || ""} {Pet.account.address?.number},  {Pet.account.address?.city}, {Pet.account.address?.state}
                            </Info>
                            {Pet.weight && (
                                <Info>
                                    <FaWeightHanging title="Peso" size={20} />
                                    {Pet.weight}kg
                                </Info>
                            )}
                            <Info title="Instituição">
                                <FaShieldDog size={20} />
                                {Pet.account.name}
                            </Info>
                        </ModalBody>
                        <ModalFooter>
                            <ActionButton disabled={loading} onClick={() => handleSponsor(Pet.id)}>
                                {loading ? "Processando..." : "Apadrinhar"}
                            </ActionButton>
                        </ModalFooter>
                        {error && <ErrorText>{error}</ErrorText>}
                    </ModalContent>
                </ModalOverlay>
            )}
        </CardContainer>
    );
}

const PetImageSection = styled.div`
    width: 100%;
    position: absolute;
    z-index: 0;
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding: 8px;
    span {
        display: block;
        width: 100%;
        height: 8px;
        background-color: ${({ theme }) => theme.colors.secondary};
        border-radius: 5px;
    }

    .active {
        
        background-color: ${({ theme }) => theme.colors.primary};
    }
`;

const PetLabel = styled.div`
    --height: 50px;
    position: absolute;
    align-items: center;
    display: flex;
    font-weight: bold;
    background-color: ${({ theme }) => theme.colors.tertiary};
    color: white;
    height: var(--height);
    text-align: left;
    padding: 15px;
    z-index: 1;
    top: calc(0px - var(--height));
    left: 0;
    border-radius: 20px 20px 0 0;
    width: 100%;
    justify-content: space-between;

    font-size: 25px;
`;

const CardContainer = styled.div`
    width: 460px;
    display: flex;
    justify-content: center;
    overflow: hidden;
    color: white;
    max-height: 80%;
    min-height: 80%;
`;

const PetInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    flex: 1;
    max-height: min-content;
    position: relative;
`;

const CardDetails = styled.div`
    background-color: ${({ theme }) => theme.colors.quarternary};
    width: 400px;
    padding: 5px;
    display: flex;
    flex-direction: column;
`;

const CardOptions = styled.div`
    height: fit-content;
    padding: 10px 0px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.quarternary};
    border-radius: 0px 20px 20px 0px;
    gap: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: auto;
    margin-bottom: auto;
`;


const PetPictureContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    flex: 1;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: white;
`;

const PetDescription = styled.p`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    max-height: 3em;
    color: white;
`;

const OptionIcons = styled.div`
    background-color: ${({ theme }) => theme.colors.secondary};
    width: 40px;
    height: 40px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme.colors.quarternary};
    color: #fff;
    border-radius: 12px;
    width: min(600px, 92vw);
    max-height: 80vh;
    overflow: auto;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    h3 { font-size: 22px; }
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
`;

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ModalFooter = styled.div`
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
`;

const ActionButton = styled.button`
    background-color: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-weight: bold;
    cursor: pointer;
`;

const ErrorText = styled.p`
    color: #ff8a8a;
    margin-top: 8px;
`;