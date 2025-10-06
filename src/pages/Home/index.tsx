import { HeaderComponent } from "../../components/Header";
import IntroSection from "../../sections/Home/IntroSection";
import FeaturesSection from "../../sections/Home/FeaturesSection";

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