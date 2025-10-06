import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import photo1 from "@assets/photo1_1755183836564.png";
import photo2 from "@assets/photo2_1755183836565.png";
import photo3 from "@assets/photo3_1755183836563.png";
import featureImage from "@assets/feature_1755184028301.png";
import sample1 from "@assets/sample1.png";
import sample2 from "@assets/sample2.png";

const products = [
  {
    id: 1,
    image: photo1,
    title: "Fresh Green",
    description: "Perfect for outdoor adventures",
    bgColor: "bg-white",
  },
  {
    id: 2,
    image: photo2,
    title: "Classic Black",
    description: "Sleek and sophisticated",
    bgColor: "bg-white",
  },
  {
    id: 3,
    image: photo3,
    title: "Pure White",
    description: "Clean and minimal design",
    bgColor: "bg-white",
  },
  {
    id: 4,
    image: featureImage,
    title: "Advanced Features",
    description: "Everything your pet needs for ultimate safety and freedom",
    bgColor: "bg-white",
    isFeature: true,
  },
];

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter out feature image from carousel
  const carouselProducts = products.filter(p => !p.isFeature);
  const featureProduct = products.find(p => p.isFeature);

  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselProducts.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselProducts.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselProducts.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="relative">
      {/* Main Product Showcase - Side by Side Layout */}
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start mb-20">
        
        {/* Left Side - Product Sample Images (Dogs Using PAWhere) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-block bg-primary-yellow/20 rounded-full px-4 py-2 mb-3">
              <span className="text-primary-blue font-semibold text-sm">
                Real Dogs, Real Stories
              </span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-primary-blue mb-6">
              See PAWhere in Action
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src={sample1}
                alt="Dog wearing PAWhere GPS tracker in outdoor setting"
                className="w-full h-72 sm:h-80 object-contain bg-gradient-to-br from-amber-50 to-orange-50 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">Adventure Ready</p>
                <p className="text-xs opacity-90">Explore with confidence</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src={sample2}
                alt="Happy dog with PAWhere GPS collar in safe environment"
                className="w-full h-72 sm:h-80 object-contain bg-gradient-to-br from-amber-50 to-orange-50 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium">Always Protected</p>
                <p className="text-xs opacity-90">Peace of mind for pet parents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Product Carousel */}
        <div className="lg:col-span-3 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselProducts.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0">
                  <div className="relative group overflow-hidden">
                    <img
                      src={product.image}
                      alt={`PAWhere ${product.title}`}
                      className="w-full h-80 sm:h-96 lg:h-[480px] object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover overlay with text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      <h4 className="text-xl lg:text-2xl font-bold mb-2 text-center">
                        {product.title}
                      </h4>
                      <p className="text-sm lg:text-base text-center leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              onClick={goToPrevious}
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full w-10 h-10 lg:w-12 lg:h-12 hover:bg-primary-yellow hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary-yellow z-10"
            >
              <span className="text-lg lg:text-xl">←</span>
            </Button>
            
            <Button
              onClick={goToNext}
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-lg rounded-full w-10 h-10 lg:w-12 lg:h-12 hover:bg-primary-yellow hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary-yellow z-10"
            >
              <span className="text-lg lg:text-xl">→</span>
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {carouselProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary-yellow scale-125 shadow-md"
                    : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Feature Image Display - Advanced Features */}
      {featureProduct && (
        <div className="mt-20">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-blue/10 rounded-full px-8 py-3 mb-6">
              <span className="text-primary-blue font-bold text-lg">Advanced Features</span>
            </div>
            <h3 className="text-4xl font-bold text-primary-blue mb-4">
              Everything Your Pet Needs
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time GPS Tracking, 4G LTE Connectivity, Safe Zone Alerts, 
              Lightweight & Pet-Safe, 30+ Days Battery Life
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-12 shadow-2xl max-w-5xl mx-auto border border-blue-100 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 text-4xl text-primary-blue">⚡</div>
              <div className="absolute bottom-10 right-10 text-4xl text-primary-yellow">🛡️</div>
              <div className="absolute top-1/2 right-20 text-3xl text-primary-blue">📡</div>
            </div>
            
            <img
              src={featureProduct.image}
              alt="PAWhere Advanced Features - Real-time GPS tracking, 4G LTE connectivity, safe zone alerts, long battery life"
              className="w-full h-auto rounded-2xl relative z-10 transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
