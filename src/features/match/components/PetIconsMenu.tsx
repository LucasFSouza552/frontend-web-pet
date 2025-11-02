import { FaShareFromSquare } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { FaHeart, FaHeartBroken, FaInfo } from "react-icons/fa";
import { styled } from "styled-components";
import type IPet from "@/shared/models/Pet";

interface PetIconsMenuProps {
    pet: IPet;
    setShowInfo: (showInfo: boolean) => void;
    handleRequestAdoption: (petId: string) => void;
    handleRejectAdoption: (petId: string) => void;
    handleModalSponsor: () => void;
}

export default function PetIconsMenu({ pet, setShowInfo, handleRequestAdoption, handleRejectAdoption, handleModalSponsor }: PetIconsMenuProps) {

    const options = [
        { title: "Gostei", icon: <FaHeart size={25} />, onClick: () => handleRequestAdoption(pet.id) },
        { title: "Não gostei", icon: <FaHeartBroken size={25} />, onClick: () => handleRejectAdoption(pet.id) },
        { title: "Apadrinhar", icon: <IoMdStar size={30} />, onClick: () => handleModalSponsor() },
        { title: "Informações", icon: <FaInfo size={25} />, onClick: () => setShowInfo(true) },
        { title: "Compartilhar", icon: <FaShareFromSquare size={25} /> },
    ];

    return (
        <CardOptions>
            {options.map(({ title, icon, onClick }, index) => (
                <OptionIcons key={index} title={title} onClick={onClick}>
                    {icon}
                </OptionIcons>
            ))}
        </CardOptions>
    );

}

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