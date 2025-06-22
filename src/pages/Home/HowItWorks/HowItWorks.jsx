import { FaRegBuilding, FaRegMoneyBillAlt } from "react-icons/fa";
import { LuTruck } from "react-icons/lu";
import { MdOutlineWarehouse } from "react-icons/md";

const HowItWorks = () => {
  const cardData = [
    {
      icon: <LuTruck className="text-6xl" />,
      title: "Booking Pick & Drop",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      icon: <FaRegMoneyBillAlt className="text-6xl" />,
      title: "Cash On Delivery",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      icon: <MdOutlineWarehouse className="text-6xl" />,
      title: "Delivery Hub",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
    {
      icon: <FaRegBuilding className="text-6xl" />,
      title: "Booking SME & Corporate",
      description:
        "From personal packages to business shipments — we deliver on time, every time.",
    },
  ];

  return (
    <section className="p-16">
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-3xl font-extrabold text-primary-content">How it Works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="card rounded-2xl bg-base-100 p-6"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="font-bold mb-2 text-primary-content">{card.title}</h3>
            <p className="font-medium text-sm text-gray-600">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
