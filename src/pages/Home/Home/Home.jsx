import Banner from "../Banner/Banner";
import BecomeMerchant from "../BecomeMerchant/BecomeMerchant";
import BrandSlider from "../BrandSlider/BrandSlider";
import Features from "../Features/Features";
import HowItWorks from "../HowItWorks/HowItWorks";
import Services from "../Services/Services";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <Services></Services>
      <BrandSlider></BrandSlider>
      <Features></Features>
      <BecomeMerchant></BecomeMerchant>
    </div>
  );
};

export default Home;
