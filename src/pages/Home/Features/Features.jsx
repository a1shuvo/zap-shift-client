import feature3 from "../../../assets/features/call-center.png";
import feature1 from "../../../assets/features/live-tracking.png";
import feature2 from "../../../assets/features/safe-delivery.png";
import FeatureCard from "./FeatureCard";

const features = [
  {
    image: feature1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
  },
  {
    image: feature2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
  },
  {
    image: feature3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
  },
];

const Features = () => {
  return (
    <section className="px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="border-t-[2px] border-dashed border-gray-400 my-16"></div>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
        <div className="border-t-[2px] border-dashed border-gray-400 my-16"></div>
      </div>
    </section>
  );
};

export default Features;
