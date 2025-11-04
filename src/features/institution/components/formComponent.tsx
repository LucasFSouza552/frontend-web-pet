import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import useRegisterController from "../controllers/UseRegisterController";
import styled from "styled-components";
import { PrimaryButton } from "@components/PrimaryButton";
import { FaPlus } from "react-icons/fa";

export default function FormularySection() {
    const [actualStep, setActualStep] = useState(1);
    const { credentials, handleChange } = useRegisterController();
    
    return (
        <ModalContainer>
            <ModalTitle>Enviar novo Pet</ModalTitle>
            <ModalContent>
                {(
                    <FormSection>
                        {actualStep === 1 && <Step1 name={credentials.name} age={credentials.age} handleChange={handleChange} />}
                        {actualStep === 2 && <Step2 gender={credentials.gender} type={credentials.type} handleChange={handleChange} />}
                        {actualStep === 3 && <Step3 description={credentials.description} weight={credentials.weight} handleChange={handleChange} />}
                        {actualStep === 4 && <Step4 handleChange={handleChange} />}
                        <ButtonContainer>
                            {actualStep > 1 && (
                                <PrimaryButton 
                                    filled={false} 
                                    text="Voltar" 
                                    type="button" 
                                    onClick={() => { setActualStep(actualStep - 1); }} 
                                />
                            )}
                            <PrimaryButton 
                                filled={true} 
                                text="Prosseguir" 
                                type="button" 
                                onClick={() => { setActualStep(actualStep + 1); }} 
                            />
                        </ButtonContainer>
                    </FormSection>
                )}
            </ModalContent>
        </ModalContainer>
    );
}

const ModalContainer = styled.div`
    width: 100%;
    max-width: 900px;
    background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
`;

const ModalContent = styled.div`
    display: flex;
    gap: 2rem;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem;
    }
`;

const ImageUploadSection = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ImageUploadArea = styled.div`
    width: 100%;
    aspect-ratio: 1;
    max-width: 400px;
    border: 3px dashed ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(182, 72, 160, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        background-color: rgba(182, 72, 160, 0.1);
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        transform: scale(1.02);
    }

    input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
    }
`;

const UploadIcon = styled.div`
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const FormSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const Step4Description = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: white;

    h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
        color: white;
    }

    p {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
        
        button {
            width: 100%;
        }
    }
`;