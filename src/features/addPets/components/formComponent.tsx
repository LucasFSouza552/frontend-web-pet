import { useState } from "react";
import Section from "../../../shared/styles/SectionStyle";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import useRegisterController from "../controllers/useRegisterController";

export default function FormularySection() {
    const [actualStep, setActualStep] = useState(1);
    const { credentials, handleChange } = useRegisterController();
    return (
        <Section height="auto">
            <form>
                {actualStep == 1 && <Step1 name={credentials.name} age={credentials.age} handleChange={handleChange} />}
                {actualStep == 2 && <Step2 gender={credentials.gender} type={credentials.type} handleChange={handleChange} />}
                {actualStep == 3 && <Step3 description={credentials.description} weight={credentials.weight} handleChange={handleChange} />}
                {actualStep == 4 && <Step4 images={credentials.images} handleChange={handleChange} />}
            </form>
        </Section>
    );
}