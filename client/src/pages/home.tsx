import { Button } from "@/components/ui/button";
import { RegistrationModal } from "@/components/registration-modal";
import { ProductCarousel } from "@/components/product-carousel";
import mobileTrackingImage from "@assets/mobileTracking.png";
import pawhereLogoImage from "@assets/PAWhere_logo.png";
import { useState } from "react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="font-inter bg-brand-white text-gray-900 min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src={pawhereLogoImage}
                alt="PAWhere Logo"
                className="h-16 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              />
            </div>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-blue font-medium transition-colors duration-200 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#tracking" className="text-gray-700 hover:text-primary-blue font-medium transition-colors duration-200 relative group">
                Live Tracking
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-blue font-medium transition-colors duration-200 relative group">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Register Now Button */}
              <RegistrationModal
                trigger={
                  <Button className="hidden sm:inline-flex bg-gradient-to-r from-primary-yellow to-yellow-500 hover:from-yellow-500 hover:to-primary-yellow font-black px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg" style={{ color: '#10459b' }}>
                    Register Now
                    <span className="ml-2">🚀</span>
                  </Button>
                }
                isVip={true}
              />

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:text-primary-blue hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-95 pointer-events-none'
        }`}>
          <div className="px-4 py-6 space-y-4">
            <a 
              href="#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-blue font-medium py-2 transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="#tracking" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-blue font-medium py-2 transition-colors duration-200"
            >
              Live Tracking
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-primary-blue font-medium py-2 transition-colors duration-200"
            >
              Reviews
            </a>
            <div className="pt-4 border-t border-gray-200">
              <RegistrationModal
                trigger={
                  <Button className="w-full bg-gradient-to-r from-primary-yellow to-yellow-500 hover:from-yellow-500 hover:to-primary-yellow font-black py-3 rounded-full transition-all duration-300 shadow-md" style={{ color: '#10459b' }}>
                    Register Now 🚀
                  </Button>
                }
                isVip={true}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-400 via-primary-yellow to-orange-400 h-screen flex items-center overflow-hidden pt-20">
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-24 h-24 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-primary-blue rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>

        {/* Smooth Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-yellow/40 via-transparent to-amber-300/30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          {/* Compact Title - Reduced Size */}
<h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-12 leading-tight">
            <div className="mb-2">
              <span className="text-primary-blue drop-shadow-2xl">
                PAW Where?
              </span>
            </div>
            <div className="relative">
              <span className="text-white drop-shadow-2xl">PAW Here!!!</span>
            </div>
            <span className="text-primary-blue ml-4 text-3xl sm:text-4xl animate-bounce">
              🐕📍
            </span>
          </h1>

          {/* Streamlined Description */}
          <div className="mb-12">
            <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              Real-time tracking, smart geofencing, and instant alerts — all in
              one lightweight device.
              <br />
              <span className="text-base opacity-90">
                Keep your pet safe, wherever life takes you.
              </span>
            </p>
          </div>

          {/* Cleaner CTA Button */}
          <RegistrationModal
            trigger={
              <Button className="bg-white hover:bg-blue-50 text-primary-blue font-black text-xl px-16 py-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-white/50 group">
                <span className="flex items-center">
                  Get Early Access
                  <span className="ml-3 text-2xl transform group-hover:translate-x-1 transition-transform duration-300">
                    🚀
                  </span>
                </span>
              </Button>
            }
            isVip={true}
          />
        </div>
      </section>

      {/* Product Visual / Showcase */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-blue/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-primary-yellow/20 rounded-full px-6 py-2 mb-6">
              <span className="text-primary-blue font-semibold">
                Meet PAWhere
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary-blue mb-6 leading-tight">
              The Future of Pet Safety
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Designed with cutting-edge technology and your furry friend's
              comfort in mind
            </p>
          </div>

          <ProductCarousel />
        </div>
      </section>

      {/* Mobile App Showcase */}
      <section id="tracking" className="py-16 lg:py-24 bg-gradient-to-br from-primary-blue/5 via-white to-primary-yellow/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 text-6xl">📱</div>
          <div className="absolute bottom-20 right-20 text-6xl">🗺️</div>
          <div className="absolute top-1/2 left-1/4 text-4xl">📍</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 lg:mb-20">
            <div className="inline-block bg-primary-blue/10 rounded-full px-6 lg:px-8 py-2 lg:py-3 mb-4 lg:mb-6">
              <span className="text-primary-blue font-bold text-base lg:text-lg">
                Live Tracking
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-blue mb-4 lg:mb-6 leading-tight px-4">
              Track Your Pet in Real-Time
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              Monitor your furry friend's location, set safe zones, and get
              instant alerts through our intuitive mobile app
            </p>
          </div>

          {/* Mobile Layout - Side by Side */}
          <div className="lg:hidden mb-12">
            <div className="grid grid-cols-5 gap-4 items-center">
              {/* Left Side - Mobile Phone Mockup */}
              <div className="col-span-2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-yellow to-primary-blue rounded-full opacity-20 blur-lg animate-pulse"></div>
                  <div className="relative bg-gray-900 rounded-[1.5rem] p-1.5 shadow-xl">
                    <div className="bg-black rounded-[1rem] p-1">
                      <div className="relative rounded-[0.75rem] overflow-hidden bg-white">
                        <img
                          src={mobileTrackingImage}
                          alt="PAWhere mobile app showing real-time pet tracking"
                          className="w-full h-auto object-cover"
                          style={{ aspectRatio: "9/19.5" }}
                        />
                      </div>
                    </div>
                    {/* Phone Hardware Details */}
                    <div className="absolute left-0 top-12 w-0.5 h-4 bg-gray-700 rounded-l-sm"></div>
                    <div className="absolute left-0 top-18 w-0.5 h-6 bg-gray-700 rounded-l-sm"></div>
                    <div className="absolute left-0 top-26 w-0.5 h-6 bg-gray-700 rounded-l-sm"></div>
                    <div className="absolute right-0 top-16 w-0.5 h-8 bg-gray-700 rounded-r-sm"></div>
                    {/* Camera Notch */}
                    <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-10 h-2.5 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Right Side - App Features */}
              <div className="col-span-3 space-y-4">
                <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-2">
                    <div className="bg-primary-yellow rounded-full p-1.5 flex-shrink-0">
                      <span className="text-sm">🗺️</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary-blue">Real-Time Location</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">See exactly where your pet is at any moment with precise GPS tracking and live map updates.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-2">
                    <div className="bg-primary-blue rounded-full p-1.5 flex-shrink-0">
                      <span className="text-sm">🛡️</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary-blue">Safe Zone Alerts</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">Set up virtual boundaries and get instant notifications when your pet enters or leaves safe areas.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-2">
                    <div className="bg-primary-yellow rounded-full p-1.5 flex-shrink-0">
                      <span className="text-sm">📱</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary-blue">Instant Notifications</h3>
                      <p className="text-gray-600 text-xs leading-relaxed">Receive real-time alerts on your phone about your pet's location, battery status, and activity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center">
            {/* Mobile App Mockup - Desktop Only */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className="relative inline-block">
                <div className="absolute -inset-6 bg-gradient-to-r from-primary-yellow to-primary-blue rounded-full opacity-20 blur-xl animate-pulse"></div>

                {/* Phone Frame - Desktop sizing */}
                <div className="relative bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl transform hover:scale-105 transition-transform duration-500 max-w-sm mx-auto">
                  {/* Phone Screen Bezel */}
                  <div className="bg-black rounded-[2rem] p-2">
                    {/* App Content - Full Screen */}
                    <div className="relative rounded-[1.5rem] overflow-hidden bg-white">
                      <img
                        src={mobileTrackingImage}
                        alt="PAWhere mobile app showing real-time pet tracking on map with Bella the Border Collie"
                        className="w-full h-auto object-cover"
                        style={{ aspectRatio: "9/19.5" }}
                      />
                    </div>
                  </div>

                  {/* Phone Hardware Details */}
                  <div className="absolute left-0 top-20 w-1 h-8 bg-gray-700 rounded-l-md"></div>
                  <div className="absolute left-0 top-32 w-1 h-12 bg-gray-700 rounded-l-md"></div>
                  <div className="absolute left-0 top-48 w-1 h-12 bg-gray-700 rounded-l-md"></div>
                  <div className="absolute right-0 top-28 w-1 h-16 bg-gray-700 rounded-r-md"></div>

                  {/* Camera Notch */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full"></div>
                </div>
              </div>
            </div>

            {/* App Features - Mobile */}
            <div className="lg:hidden space-y-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-yellow rounded-full p-2 flex-shrink-0">
                    <span className="text-lg">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-blue">Real-Time Location</h3>
                    <p className="text-gray-600 text-sm">Precise GPS tracking and live map updates</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-blue rounded-full p-2 flex-shrink-0">
                    <span className="text-lg">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-blue">Safe Zone Alerts</h3>
                    <p className="text-gray-600 text-sm">Virtual boundaries with instant notifications</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-yellow rounded-full p-2 flex-shrink-0">
                    <span className="text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-blue">Instant Notifications</h3>
                    <p className="text-gray-600 text-sm">Real-time alerts about location and activity</p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Features - Desktop */}
            <div className="hidden lg:block space-y-8 order-1 lg:order-2">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-yellow rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-blue mb-2">
                      Real-Time Location
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      See exactly where your pet is at any moment with precise
                      GPS tracking and live map updates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-blue rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-blue mb-2">
                      Safe Zone Alerts
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Set up virtual boundaries and get instant notifications
                      when your pet enters or leaves safe areas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-yellow rounded-full p-3 flex-shrink-0">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-blue mb-2">
                      Instant Notifications
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Receive real-time alerts on your phone about your pet's
                      location, battery status, and activity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Parent Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-primary-yellow/20 rounded-full px-8 py-3 mb-6">
              <span className="text-primary-blue font-bold text-lg">
                Happy Pet Parents
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-primary-blue mb-6 leading-tight">
              Real Stories, Real Peace of Mind
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              See what pet parents are saying about PAWhere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-8 bg-primary-yellow rounded-full p-3">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="pt-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "PAWhere really saved my mind! My dog Bella loves running around and exploring everywhere, and now I can let her go free without worry because I always know where she is. The app is super simple to use, even for me!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-blue rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white font-bold">NM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-blue">
                      Narath Mom
                    </h4>
                    <p className="text-gray-500">Border Collie Mom</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-8 bg-primary-yellow rounded-full p-3">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="pt-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "The safe zone is so clever! I always get alert when my dog Max run out from our yard, and the battery can last many weeks without charge. I recommend it a lot to everyone who love dogs!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-blue rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white font-bold">NV</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-blue">
                      Narith Vann
                    </h4>
                    <p className="text-gray-500">Golden Retriever Dad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-8 bg-primary-yellow rounded-full p-3">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="pt-8">
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "My Luna is escape artist, always try to run away, but PAWhere help me find her very quick every time. The real-time tracking so accurate, no mistake. It really change my life!"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-blue rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white font-bold">NS</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary-blue">
                      Nary Sokna
                    </h4>
                    <p className="text-gray-500">Husky Mom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-primary-blue/10 to-primary-yellow/10 rounded-3xl p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-blue mb-2">
                    100+
                  </div>
                  <p className="text-gray-600">Happy Pet Parents</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-blue mb-2">
                    99.9%
                  </div>
                  <p className="text-gray-600">Tracking Accuracy</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-blue mb-2">
                    24/7
                  </div>
                  <p className="text-gray-600">Real-time Monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-blue mb-2">
                    10+ Days
                  </div>
                  <p className="text-gray-600">Battery Life</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Customer Tester Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-primary-yellow via-yellow-400 to-primary-yellow relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 text-6xl">🐕</div>
          <div className="absolute bottom-20 right-20 text-6xl">🐾</div>
          <div className="absolute top-1/2 left-1/4 text-4xl">📍</div>
          <div className="absolute top-1/3 right-1/4 text-4xl">⭐</div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-16">
            <div className="text-8xl mb-8 animate-bounce-gentle">🐾</div>
            <h2 className="text-5xl sm:text-6xl font-black text-brand-black mb-8 leading-tight">
              Your Pet Deserves VIP Safety Access
            </h2>
            <p className="text-2xl text-brand-black font-semibold mb-16 max-w-4xl mx-auto leading-relaxed">
              Be one of the first to try PAWhere before anyone else. Test it,
              love it, and help us make pet tracking purr-fect!
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto border border-yellow-200">
            <div className="mb-10">
              <div className="bg-gradient-to-br from-primary-blue to-blue-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-primary-yellow text-3xl animate-pulse">
                  ⭐
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Join Our VIP Testers
              </h3>
              <p className="text-gray-600 text-lg">
                Get exclusive early access and help shape the future of pet
                safety
              </p>
            </div>

            <RegistrationModal
              trigger={
                <Button className="w-full bg-gradient-to-r from-primary-blue to-blue-700 hover:from-blue-700 hover:to-primary-blue text-white font-bold py-6 px-12 rounded-2xl transition-all transform hover:scale-105 shadow-xl text-xl">
                  Become a VIP Tester
                  <span className="ml-3 text-2xl">👑</span>
                </Button>
              }
              isVip={true}
            />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center bg-green-50 rounded-full px-4 py-2">
                <span className="text-green-500 mr-2 text-lg">✓</span>
                <span className="font-medium">No spam, ever</span>
              </div>
              <div className="flex items-center bg-blue-50 rounded-full px-4 py-2">
                <span className="text-blue-500 mr-2 text-lg">✓</span>
                <span className="font-medium">Exclusive updates</span>
              </div>
              <div className="flex items-center bg-purple-50 rounded-full px-4 py-2">
                <span className="text-purple-500 mr-2 text-lg">✓</span>
                <span className="font-medium">First access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-4xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-4xl">📍</div>
          <div className="absolute top-1/2 left-1/3 text-2xl">🐕</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="mb-8">
              <h3 className="text-5xl font-black mb-4">
                <span className="text-primary-yellow drop-shadow-lg">
                  PAW Where?
                </span>
                <span className="text-white"> PAW Here!!!</span>
                <span className="text-primary-yellow ml-4">🐕📍</span>
              </h3>
            </div>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Keeping your furry family members safe, one paw at a time.
              Innovation meets compassion.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between border-t border-gray-700 pt-12">
            <div className="mb-8 lg:mb-0">
              <p className="text-gray-400 text-lg">
                © 2025 PAWhere. All right reserved. Track Your Pet in Real-Time
              </p>
            </div>

            <div className="flex space-x-8">
              <a
                href="https://www.facebook.com/profile.php?id=61565003537217"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 transition-all duration-300 text-white p-4 rounded-full text-2xl transform hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/aerokiq25"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-pink-600 transition-all duration-300 text-white p-4 rounded-full text-2xl transform hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@pawhereaerokiq"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-black transition-all duration-300 text-white p-4 rounded-full text-2xl transform hover:scale-110"
                aria-label="Follow us on TikTok"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="mailto:pawhereaerokiq@gmail.com"
                className="bg-gray-800 hover:bg-primary-yellow hover:text-black transition-all duration-300 text-white p-4 rounded-full text-2xl transform hover:scale-110"
                aria-label="Send us an email"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v9.273L12 8.183l6.545 4.911V3.82h3.819c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
