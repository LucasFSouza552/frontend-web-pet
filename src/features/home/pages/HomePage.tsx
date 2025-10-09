import IntroSection from "../components/IntroSection";
import FeaturesSection from "../components/FeaturesSection";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import FooterSection from "../components/FooterSection";

export default function HomeSection() {
  return (
    <>
      <HeaderComponent />
      <main>
        <IntroSection />
        <FeaturesSection />
          <FooterSection />
      </main>
    </>
  );
}