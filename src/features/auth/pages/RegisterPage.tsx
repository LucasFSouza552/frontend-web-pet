import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import Section from "../../../shared/styles/SectionStyle";
import FooterSection from "../../home/components/FooterSection";
import Forms from "../components/Forms";

export default function RegisterSection() {
    return (
        <Section height="auto">
            <HeaderComponent />
            <Forms />
            <FooterSection />
        </Section>
    );
}