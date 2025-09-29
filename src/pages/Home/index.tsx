import { HeaderComponent } from "../../components/Header";
import IntroSection from "../../sections/Home/IntroSection";
import FeaturesSection from "../../sections/Home/FeaturesSection";
import Section from "../../styles/SectionStyle";

export default function HomeSection() {
  return (
    <>
      <Section>
        <HeaderComponent />
        <IntroSection />
        <FeaturesSection />
      </Section>
    </>
  );
}