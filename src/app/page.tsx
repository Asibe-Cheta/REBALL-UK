import Link from "next/link";
import Navigation from "@/components/ui/Navigation";
import AuthTest from "@/components/auth/AuthTest";

export default function Home() {
  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-black to-black-dark opacity-80"></div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-permanent-marker text-white mb-6">
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
              className="bg-white text-black px-8 py-4 rounded-lg font-poppins font-semibold text-lg hover:bg-white-off transition-colors shadow-lg"
            >
              Register Now
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-poppins font-semibold text-lg hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-permanent-marker text-black text-center mb-16">
            What Our Players Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial Cards */}
            <div className="bg-white-light p-8 rounded-lg shadow-lg">
              <p className="text-black-dark font-poppins mb-4">
                "REBALL's 1v1 training completely transformed my finishing. I'm now confident in every scenario!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-full mr-4"></div>
                <div>
                  <p className="font-poppins font-semibold text-black">Alex Johnson</p>
                  <p className="text-white-text text-sm">Striker, U18</p>
                </div>
              </div>
            </div>

            <div className="bg-white-light p-8 rounded-lg shadow-lg">
              <p className="text-black-dark font-poppins mb-4">
                "The tactical insights are incredible. I see the game completely differently now."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-full mr-4"></div>
                <div>
                  <p className="font-poppins font-semibold text-black">Sam Wilson</p>
                  <p className="text-white-text text-sm">Winger, U16</p>
                </div>
              </div>
            </div>

            <div className="bg-white-light p-8 rounded-lg shadow-lg">
              <p className="text-black-dark font-poppins mb-4">
                "Best investment in my football development. The progress tracking is amazing."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-full mr-4"></div>
                <div>
                  <p className="font-poppins font-semibold text-black">Jordan Lee</p>
                  <p className="text-white-text text-sm">Midfielder, U19</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Highlights Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-permanent-marker text-white text-center mb-16">
            Training Highlights
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Placeholders */}
            <div className="bg-black-dark rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-black-medium flex items-center justify-center">
                <span className="text-white font-poppins">Video 1</span>
              </div>
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-white mb-2">1v1 Finishing Masterclass</h3>
                <p className="text-white-muted text-sm">Striker training session</p>
              </div>
            </div>

            <div className="bg-black-dark rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-black-medium flex items-center justify-center">
                <span className="text-white font-poppins">Video 2</span>
              </div>
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-white mb-2">Crossing Techniques</h3>
                <p className="text-white-muted text-sm">Winger development</p>
              </div>
            </div>

            <div className="bg-black-dark rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video bg-black-medium flex items-center justify-center">
                <span className="text-white font-poppins">Video 3</span>
              </div>
              <div className="p-6">
                <h3 className="font-poppins font-semibold text-white mb-2">Goalkeeper 1v1</h3>
                <p className="text-white-muted text-sm">Striker vs Keeper</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Test Section */}
      <section className="py-10 bg-white-light">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-permanent-marker text-center mb-6 text-black-dark">
            Authentication Test
          </h2>
          <div className="max-w-md mx-auto">
            <AuthTest />
          </div>
        </div>
      </section>
    </>
  );
}
