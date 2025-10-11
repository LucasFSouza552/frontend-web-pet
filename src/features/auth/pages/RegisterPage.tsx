import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import Section from "../../../shared/styles/SectionStyle";
import FooterSection from "../../home/components/FooterSection";
import RegisterForm from "../components/RegisterForm";

export default function RegisterSection() {
    return (
        <Section height="auto">
            <HeaderComponent />
            <RegisterForm />
            <FooterSection />
        </Section>
    );
}