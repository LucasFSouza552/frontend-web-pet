import { useState } from "react";
import Section from "../../../shared/styles/SectionStyle";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";

export default function FormularySection() {
    const [actualStep, setActualStep] = useState(1);
    const steps = [
        <Step1 />,
        <Step2 />,
        <Step3 />,
        <Step4 />
    ];
    return (
        <Section height="auto">
            <form>

            </form>
        </Section>
    );
}