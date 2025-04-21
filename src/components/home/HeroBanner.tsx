import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/CustomButton";

const HeroBanner = () => {
  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-900">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/90 to-blue-800/50"></div>
      <img
        src="https://images.pexels.com/photos/4549416/pexels-photo-4549416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Latest smartphones"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-2xl">
          Discover the Latest Tech Innovations
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
          Explore our collection of premium smartphones and accessories with
          exclusive deals and free shipping.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/products">
            <Button
              className="bg-white text-blue-700 hover:bg-blue-50"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

