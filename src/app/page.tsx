import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/ui/Navigation";
import AuthTest from "@/components/auth/AuthTest";
import Footer from "@/components/ui/Footer";
import VideoPlaceholder from "@/components/ui/VideoPlaceholder";
import VideoPlayer from "@/components/ui/VideoPlayer";
import SEO from "@/components/SEO";
import { structuredDataSchemas } from "@/components/SEO";

export default function Home() {
  // Structured data for the homepage
  const homepageStructuredData = [
    structuredDataSchemas.organization,
    structuredDataSchemas.localBusiness,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "REBALL UK",
      "url": "https://reball.uk",
      "description": "Professional football 1v1 training and player development",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://reball.uk/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <>
      <SEO
        title="REBALL - Football 1v1 Training | Improve Your Game Success"
        description="Transform your football game with REBALL's proven 1v1 training methodology. Learn specific tactical, movement and technical skills to instantly increase your success in game scenarios. Professional coaching from Premier League experience."
        keywords="football training, 1v1 training, REBALL, football coaching, player development, football skills, Devon football training, professional football coaching"
        canonical="/"
        ogImage="/images/reball-logo-black.png"
        structuredData={homepageStructuredData}
      />

      <Navigation />

                  {/* Fresh Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Video Background */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{ zIndex: 0 }}
              >
                <source src="/videos/highlight-reel-1.mp4" type="video/mp4" />
              </video>

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

              {/* Content */}
              <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            REBALL
          </h1>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-semibold text-white mb-8 max-w-4xl mx-auto">
            Do you want to instantly increase your game success?
          </h2>

          <p className="text-lg md:text-xl font-poppins text-white-light mb-12 max-w-3xl mx-auto leading-relaxed">
            Learn the specific tactical, movement and technical information you need to instantly increase your game success in the exact scenarios you face in the game
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="bg-white text-black px-8 py-4 rounded-lg text-lg hover:bg-white-off transition-colors shadow-lg"
            >
              Register Now
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Football Logo Carousel Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-white text-center mb-12">
            Trusted by Football's Elite
          </h2>

          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center space-x-16 min-w-full">
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <span className="text-black font-bold text-xs">Champions League</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚽</div>
                    <span className="text-black font-bold text-xs">Premier League</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🇪🇸</div>
                    <span className="text-black font-bold text-xs">La Liga</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌍</div>
                    <span className="text-black font-bold text-xs">FIFA</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏅</div>
                    <span className="text-black font-bold text-xs">UEFA</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚽</div>
                    <span className="text-black font-bold text-xs">Bundesliga</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🇮🇹</div>
                    <span className="text-black font-bold text-xs">Serie A</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <span className="text-black font-bold text-xs">World Cup</span>
                  </div>
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center space-x-16 min-w-full">
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <span className="text-black font-bold text-xs">Champions League</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚽</div>
                    <span className="text-black font-bold text-xs">Premier League</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🇪🇸</div>
                    <span className="text-black font-bold text-xs">La Liga</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🌍</div>
                    <span className="text-black font-bold text-xs">FIFA</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏅</div>
                    <span className="text-black font-bold text-xs">UEFA</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚽</div>
                    <span className="text-black font-bold text-xs">Bundesliga</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🇮🇹</div>
                    <span className="text-black font-bold text-xs">Serie A</span>
                  </div>
                </div>
                <div className="flex-shrink-0 w-32 h-16 bg-white rounded-lg shadow-lg flex items-center justify-center border">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏆</div>
                    <span className="text-black font-bold text-xs">World Cup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Highlights Section - Redesigned */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-white text-center mb-16">
            Training Highlights
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Training Program Videos - Redesigned */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-1">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    <VideoPlayer
                      src="/videos/highlights/seb.mp4"
                      fallbackTitle="1v1 Finishing Masterclass"
                      fallbackDescription="Master the art of 1v1 finishing scenarios with expert guidance"
                      className="rounded-t-2xl"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-poppins font-semibold text-white text-lg">Seb's Training Session</h3>
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                      </div>
                      <p className="text-gray-300 text-sm">Striker training session</p>
                      <div className="mt-4 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-white text-sm font-medium">AI-powered Training</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-1">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    <VideoPlayer
                      src="/videos/highlights/Tylor.mp4"
                      fallbackTitle="Crossing Techniques"
                      fallbackDescription="Perfect your crossing skills from wide positions"
                      className="rounded-t-2xl"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-poppins font-semibold text-white text-lg">Tylor's Training Session</h3>
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Beta</span>
                      </div>
                      <p className="text-gray-300 text-sm">Winger development</p>
                      <div className="mt-4 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-white text-sm font-medium">Tactical Intelligence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 p-1">
                  <div className="bg-black rounded-2xl overflow-hidden">
                    <VideoPlayer
                      src="/videos/highlights/Josh.mp4"
                      fallbackTitle="Goalkeeper 1v1"
                      fallbackDescription="Master 1v1 situations against goalkeepers"
                      className="rounded-t-2xl"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-poppins font-semibold text-white text-lg">Josh's Training Session</h3>
                        <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">Elite</span>
                      </div>
                      <p className="text-gray-300 text-sm">Striker vs Keeper</p>
                      <div className="mt-4 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="text-white text-sm font-medium">Performance Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Training Block */}
            <div className="mt-16">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-1">
                <div className="bg-black rounded-3xl p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center mb-4">
                        <span className="bg-purple-500 text-white text-xs px-3 py-1 rounded-full mr-3">New</span>
                        <span className="text-white text-sm font-medium">THE ULTRA FAST FOOTBALL TRAINING BUILDER</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        AI-powered Training Sessions
                      </h3>
                      <p className="text-gray-300 text-lg mb-6">
                        Experience the future of football training with our intelligent platform that adapts to your playing style and creates personalized training programs.
                      </p>
                      <div className="flex items-center space-x-4">
                        <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                          TRY FOR FREE
                        </button>
                        <div className="flex items-center text-white">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="text-sm">Watch Demo</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="relative w-full h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl"></div>
                        <div className="relative z-10 text-center">
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <p className="text-white font-semibold">AI-powered Training</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-white text-center mb-16">
            What Our Players Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <p className="text-white font-poppins mb-4">
                "REBALL's 1v1 training completely transformed my finishing. I'm now confident in every scenario!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full mr-4"></div>
                <div>
                  <p className="font-poppins font-semibold text-white">Alex Johnson</p>
                  <p className="text-gray-300 text-sm">Striker, U18</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <p className="text-white font-poppins mb-4">
                "The tactical insights are incredible. I see the game completely differently now."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full mr-4"></div>
                <div>
                  <p className="font-poppins font-semibold text-white">Sam Wilson</p>
                  <p className="text-gray-300 text-sm">Winger, U16</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
              <p className="text-white font-poppins mb-4">
                "Best investment in my football development. The progress tracking is amazing."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full mr-4"></div>
                <div>
                  <p className="font-poppins font-semibold text-white">Jordan Lee</p>
                  <p className="text-gray-300 text-sm">Midfielder, U19</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-white text-center mb-16">
            Training Programs
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Foundation Program */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl text-white font-bold mb-3">FOUNDATION PROGRAM</h3>
                <p className="text-gray-300 mb-6">
                  Perfect for beginners and young players looking to build fundamental skills and football knowledge.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Basic ball control and dribbling</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Passing and shooting techniques</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Game understanding and positioning</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">2 sessions per week</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Small group training (6-8 players)</span>
                </li>
              </ul>

              <button className="w-full bg-white border-2 border-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                REGISTER NOW
              </button>
            </div>

            {/* Development Program */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl text-white font-bold mb-3">DEVELOPMENT PROGRAM</h3>
                <p className="text-gray-300 mb-6">
                  Intermediate training for players ready to take their skills to the next level with advanced techniques.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Advanced ball mastery</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Tactical awareness training</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">1v1 and small-sided games</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">3 sessions per week</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Video analysis included</span>
                </li>
              </ul>

              <button className="w-full bg-white border-2 border-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                REGISTER NOW
              </button>
            </div>

            {/* Elite Program */}
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl text-white font-bold mb-3">ELITE PROGRAM</h3>
                <p className="text-gray-300 mb-6">
                  High-intensity training for serious players aiming for professional or semi-professional football.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Professional-level training</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Personalized coaching plans</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Mental performance coaching</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">5 sessions per week</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Nutritional guidance</span>
                </li>
              </ul>

              <button className="w-full bg-white border-2 border-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                REGISTER NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Training Videos Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-white text-center mb-16">
            Training Videos
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Training Program Videos */}
            <div className="bg-black-dark rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer
                src="/videos/highlights/seb.mp4"
                fallbackTitle="1v1 Finishing Masterclass"
                fallbackDescription="Master the art of 1v1 finishing scenarios with expert guidance"
                className="rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-white mb-2">Seb's Training Session</h3>
                <p className="text-white-muted text-sm">Striker training session</p>
              </div>
            </div>

            <div className="bg-black-dark rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer
                src="/videos/highlights/Tylor.mp4"
                fallbackTitle="Crossing Techniques"
                fallbackDescription="Perfect your crossing skills from wide positions"
                className="rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-white mb-2">Tylor's Training Session</h3>
                <p className="text-white-muted text-sm">Winger development</p>
              </div>
            </div>

            <div className="bg-black-dark rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer
                src="/videos/highlights/Josh.mp4"
                fallbackTitle="Goalkeeper 1v1"
                fallbackDescription="Master 1v1 situations against goalkeepers"
                className="rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-white mb-2">Josh's Training Session</h3>
                <p className="text-white-muted text-sm">Striker vs Keeper</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Test Section */}
      <section className="py-10 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl text-center mb-6 text-white">
            Authentication Test
          </h2>
          <div className="max-w-md mx-auto">
            <AuthTest />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
