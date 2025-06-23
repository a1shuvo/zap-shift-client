const FeatureCard = ({ feature }) => {
  const { image, title, description } = feature;
  return (
    <div className="bg-base-100 rounded-2xl p-8 flex flex-col md:flex-row items-center mb-6">
      {/* Left Image */}
      <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
        <img src={image} alt={title} className="w-50 h-50 object-contain" />
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block h-40 border-l-[2px] border-dashed border-gray-400 mx-8"></div>

      {/* Right Content */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h3 className="text-3xl text-primary-content font-bold mb-4">
          {title}
        </h3>
        <p className="font-medium text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
