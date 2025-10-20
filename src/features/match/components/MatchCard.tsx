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
    const { handleRequestAdoption, handleRejectAdoption, loading, error } = usePetInteractionController();

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
                <OptionIcons>
                    <IoMdStar size={30} />
                </OptionIcons>
                <OptionIcons title="Informações">
                    <FaInfo size={25} />
                </OptionIcons>
                <OptionIcons title="Compartilhar">
                    <FaShareFromSquare size={25} />
                </OptionIcons>
            </CardOptions>
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