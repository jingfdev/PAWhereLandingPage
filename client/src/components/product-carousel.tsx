import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import photo1 from "@assets/photo1_1755183836564.png";
import photo2 from "@assets/photo2_1755183836565.png";
import photo3 from "@assets/photo3_1755183836563.png";
import featureImage from "@assets/feature_1755184028301.png";

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
    if (!isAutoPlaying) return;

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
      {/* Product Carousel Display */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl max-w-6xl mx-auto overflow-hidden border border-gray-100 mb-20">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselProducts.map((product) => (
            <div key={product.id} className="w-full flex-shrink-0">
              <div className={`${product.bgColor} rounded-2xl p-12 text-center relative`}>
                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-primary-yellow/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-6 h-6 bg-primary-blue/20 rounded-full animate-pulse delay-1000"></div>
                
                <img
                  src={product.image}
                  alt={`PAWhere ${product.title}`}
                  className="w-full max-w-md mx-auto h-96 object-contain rounded-2xl mb-8 transform hover:scale-105 transition-transform duration-300"
                />
                <div className="space-y-4">
                  <h4 className="text-3xl font-bold text-primary-blue">
                    {product.title}
                  </h4>
                  <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
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
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-xl rounded-full w-16 h-16 hover:bg-primary-yellow hover:text-white transition-all duration-300 border-2 border-gray-200 hover:border-primary-yellow"
        >
          <span className="text-2xl">←</span>
        </Button>
        
        <Button
          onClick={goToNext}
          variant="outline"
          size="icon"
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm shadow-xl rounded-full w-16 h-16 hover:bg-primary-yellow hover:text-white transition-all duration-300 border-2 border-gray-200 hover:border-primary-yellow"
        >
          <span className="text-2xl">→</span>
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mb-16 space-x-3">
        {carouselProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary-yellow scale-125 shadow-lg"
                : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail Strip */}
      <div className="flex justify-center mb-20 space-x-6 overflow-x-auto pb-4">
        {carouselProducts.map((product, index) => (
          <button
            key={product.id}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-3 transition-all duration-300 ${
              index === currentIndex
                ? "border-primary-yellow shadow-xl scale-110"
                : "border-gray-200 hover:border-gray-300 hover:scale-105"
            }`}
          >
            <img
              src={product.image}
              alt={`${product.title} thumbnail`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Feature Image Display - Under Product Images */}
      {featureProduct && (
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-blue/10 rounded-full px-8 py-3 mb-6">
              <span className="text-primary-blue font-bold text-lg">Advanced Features</span>
            </div>
            <h3 className="text-4xl font-bold text-primary-blue mb-4">
              Everything Your Pet Needs
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-time GPS Tracking, 4G LTE Connectivity, Safe Zone Alerts, 
              Lightweight & Pet-Safe, 10+ Days Battery Life
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
