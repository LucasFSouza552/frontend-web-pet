import { useState } from "react";
import Section from "../../../shared/styles/SectionStyle";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import useRegisterController from "../controllers/useRegisterController";
import styled from "styled-components";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

export default function FormularySection() {
    const [actualStep, setActualStep] = useState(1);
    const { credentials, handleChange } = useRegisterController();
    return (
        <Section height="auto">
            <FormDiv>
                <FormContent>
                    {actualStep == 1 && <Step1 name={credentials.name} age={credentials.age} handleChange={handleChange} />}
                    {actualStep == 2 && <Step2 gender={credentials.gender} type={credentials.type} handleChange={handleChange} />}
                    {actualStep == 3 && <Step3 description={credentials.description} weight={credentials.weight} handleChange={handleChange} />}
                    {actualStep == 4 && <Step4 images={credentials.images} handleChange={handleChange} />}
                    {actualStep < 4 && <PrimaryButton filled={true} text="Prosseguir" type="button" onClick={() => { setActualStep(actualStep + 1); }} />}
                </FormContent>
            </FormDiv>
        </Section>
    );
}

const FormDiv = styled.div`
    display: flex;
    padding: 150px;
    justify-content: center;
`;

const FormContent = styled.form`
    display: flex;
    background-color: #61475C;
    gap: 120px;
    padding: 150px;
    border-radius: 30px;
`;