import IntroSection from "../../../sections/Home/IntroSection";
import FeaturesSection from "../../../sections/Home/FeaturesSection";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import FooterSection from "../../../sections/Home/FooterSection";

export default function CommunityPage() {
  return (
    <>
      <HeaderComponent />
      <main>
          <CommunityPage />
          <IntroSection />
          <FeaturesSection />
          <FooterSection />
      </main>
    </>
  );
}