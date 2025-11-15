import { pictureService } from "@api/pictureService";
import { ProfileContext } from "@contexts/ProfileContext";
import { useContext, useRef } from "react";
import { styled } from "styled-components";

export default function EditProfile() {
    const { account } = useContext(ProfileContext);
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <ModalContainer>
            <AvatarImage src={pictureService.fetchPicture(account?.avatar)} alt="avatar" />
            <HiddenInput type="file" ref={inputRef} />
            <InputButton onClick={() => inputRef?.current?.click()}>Anexar imagem</InputButton>
        </ModalContainer>
    );
}

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.tertiary};
    width: 50vw;
    height: 50vh;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 50;
    z-index: 20;
    border-radius: 30px;
`;

const HiddenInput = styled.input`
    display: none;
`;

const InputButton = styled.button`
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
    padding: 10px;
    border-radius: 10px;
    transition: ease-in-out 0.3s;
    
    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
    }
`;

const AvatarImage = styled.img`
    background-color: white;
    border-radius: 200px;
    height: 150px;
    margin-bottom: 30px;
    border: 5px solid ${({ theme }) => theme.colors.primary};
`;