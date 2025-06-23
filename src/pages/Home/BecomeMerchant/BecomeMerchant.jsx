import merchantImage from "../../../assets/location-merchant.png"; // replace with your image path

const BecomeMerchant = () => {
  return (
    <section className="p-4 md:p-16">
      <div className="p-16 bg-primary-content bg-[url(assets/be-a-merchant-bg.png)] bg-no-repeat rounded-2xl">
        <div></div>
        <div className="flex flex-col-reverse md:flex-row items-center gap-6">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Merchant and Customer Satisfaction is Our First Priority
            </h2>
            <p className="text-gray-300">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. Pathao courier delivers your
              parcels in every corner of Bangladesh right on time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="btn btn-primary text-primary-content rounded-full px-6">
                Become a Merchant
              </button>
              <button className="btn btn-outline btn-primary rounded-full px-6">
                Earn with Profast Courier
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={merchantImage}
              alt="Merchant Illustration"
              className="w-full max-w-sm md:max-w-md rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeMerchant;
