import IntroSection from "../../../sections/Home/IntroSection";
import FeaturesSection from "../../../sections/Home/FeaturesSection";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";

export default function HomeSection() {
  return (
    <>
      <HeaderComponent />
      <main>
        <IntroSection />
        <FeaturesSection />
      </main>
    </>
  );
}