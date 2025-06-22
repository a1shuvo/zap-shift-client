import Marquee from "react-fast-marquee";
import brand1 from "../../../assets/brands/amazon.png";
import brand2 from "../../../assets/brands/casio.png";
import brand3 from "../../../assets/brands/moonstar.png";
import brand4 from "../../../assets/brands/randstad.png";
import brand5 from "../../../assets/brands/start-people 1.png";
import brand6 from "../../../assets/brands/start.png";

// Replace with your actual logo image paths
const brandLogos = [brand1, brand2, brand3, brand4, brand5, brand6];

const BrandSlider = () => {
  return (
    <section className="p-4 md:p-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-primary-content text-center mb-12">
          We've helped thousands of sales teams
        </h2>

        <Marquee gradient={false} speed={50} direction="left">
          {brandLogos.map((logo, index) => (
            <div key={index} className="mx-8">
              <img
                src={logo}
                alt={`Brand ${index + 1}`}
                className="w-30 object-contain"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default BrandSlider;
