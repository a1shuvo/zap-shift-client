const ServiceCard = ({ service }) => {
  const { icon, title, description } = service;
  return (
    <div className="card bg-base-100 rounded-2xl p-6 transition duration-300 hover:bg-primary">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#EEEDFC] to-[#EEEDFC00] flex items-center justify-center">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      <h3 className="font-bold text-xl text-center text-primary-content mb-2">
        {title}
      </h3>
      <p className="font-medium text-sm text-gray-600 text-center">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
