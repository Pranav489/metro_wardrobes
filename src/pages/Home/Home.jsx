import React from "react";
import HeroSection from "./HeroSection";
import OurProducts from "./OurProducts";
import GallerySection from "./GallerySection";
import FactoryDisplayOutlet from "./FactoryDisplayOutlet";
import FranchiseHighlight from "./FranchiseHighlight";
import WhoWeAre from "./WhoWeAre";
import OurGallery from "./OurGallery";
import AwardSection from "./AwardSection";
import StatsSection from "./StatsSection";

function Home() {
  return (
    <div>
      <HeroSection />

      <WhoWeAre />
      <StatsSection />
      <OurProducts />
      <AwardSection />
      <GallerySection />
      <FactoryDisplayOutlet />
      <FranchiseHighlight />

      {/* <OurGallery /> */}
    </div>
  );
}

export default Home;
