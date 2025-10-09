import IntroSection from "../components/IntroSection";
import FeaturesSection from "../components/FeaturesSection";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import FooterSection from "../components/FooterSection";
import Assessment from "../components/Assessment";

export default function HomeSection() {
  return (
    <>
      <HeaderComponent />
      <main>
        <IntroSection />
        <FeaturesSection />
          <Assessment />
          <FooterSection />
      </main>
    </>
  );
}