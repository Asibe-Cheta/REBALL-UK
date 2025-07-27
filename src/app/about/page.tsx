'use client';

import { useState } from 'react';
import Image from 'next/image';
import SEO from '@/components/SEO';
import { structuredDataSchemas } from '@/components/SEO';
import {
  Play,
  Award,
  Users,
  Target,
  Star,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  qualifications: string[];
  specializations: string[];
  contact: {
    email: string;
    phone: string;
  };
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: string;
  rating: number;
}

export default function AboutPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [activeGalleryImage, setActiveGalleryImage] = useState<number | null>(null);

  // Structured data for the About page
  const aboutStructuredData = [
    structuredDataSchemas.organization,
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What age groups do you cater to?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "REBALL training is designed for players aged 8-18, with programs specifically tailored to different age groups and skill levels."
          }
        },
        {
          "@type": "Question",
          "name": "How long is each training session?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each REBALL training session lasts 60 minutes, designed to maximize learning while maintaining player engagement."
          }
        }
      ]
    }
  ];

  const faqs: FAQ[] = [
    {
      question: "What age groups do you cater to?",
      answer: "REBALL training is designed for players aged 8-18, with programs specifically tailored to different age groups and skill levels. We focus on age-appropriate training that builds confidence and technical ability progressively."
    },
    {
      question: "How long is each training session?",
      answer: "Each REBALL training session lasts 60 minutes, designed to maximize learning while maintaining player engagement and energy levels. Sessions are structured to include warm-up, skill development, and game application phases."
    },
    {
      question: "What equipment do I need?",
      answer: "Players need basic football equipment: football boots, shin guards, and comfortable training clothes. REBALL provides all training equipment including balls, cones, and specialized training aids. Just bring your enthusiasm!"
    },
    {
      question: "Can I reschedule sessions?",
      answer: "Yes, we understand that schedules can change. You can reschedule sessions up to 24 hours in advance through your REBALL dashboard. We'll work with you to find an alternative time that fits your schedule."
    },
    {
      question: "How do I access my training videos?",
      answer: "All training videos are available in your personal REBALL dashboard. After each session, you'll receive SISW (Session in Slow-motion with Voiceover) and TAV (Technical Analysis Videos) that you can review anytime to reinforce learning."
    },
    {
      question: "What if I miss a session?",
      answer: "If you miss a session, you'll receive a summary of what was covered and can catch up through our video library. We also offer makeup sessions when possible, ensuring you don't fall behind in your development."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a satisfaction guarantee. If you're not completely satisfied with your first session, we'll provide a full refund. For ongoing programs, we offer prorated refunds for unused sessions with proper notice."
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      name: "Coach Josh",
      role: "Head Coach & Founder",
      bio: "Former professional player with over 15 years of coaching experience. Specializes in 1v1 scenarios and player development. UEFA A licensed coach with a passion for developing young talent.",
      image: "/images/coaches/josh.jpg",
      qualifications: ["UEFA A License", "FA Level 3", "Former Professional Player"],
      specializations: ["1v1 Scenarios", "Striker Development", "Tactical Analysis"],
      contact: {
        email: "josh@reball.co.uk",
        phone: "+44 123 456 7890"
      }
    },
    {
      name: "Coach Sarah",
      role: "Technical Director",
      bio: "Ex-England youth international with extensive coaching experience. Focuses on technical development and position-specific training. Known for developing players' confidence and game understanding.",
      image: "/images/coaches/sarah.jpg",
      qualifications: ["UEFA B License", "Ex-England Youth", "Sports Science Degree"],
      specializations: ["Technical Development", "Midfielder Training", "Game Analysis"],
      contact: {
        email: "sarah@reball.co.uk",
        phone: "+44 123 456 7891"
      }
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Alex Thompson",
      role: "U16 Striker",
      quote: "REBALL transformed my game. The 1v1 training helped me become more confident in front of goal. My scoring rate has doubled since starting with REBALL!",
      image: "/images/testimonials/alex.jpg",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "U14 Midfielder",
      quote: "The video analysis is incredible. I can see exactly what I need to improve and the coaches break it down so clearly. My passing accuracy has improved dramatically.",
      image: "/images/testimonials/emma.jpg",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Parent",
      quote: "As a parent, I love how REBALL tracks my son's progress. The confidence ratings and video feedback show real improvement. Worth every penny!",
      image: "/images/testimonials/james.jpg",
      rating: 5
    }
  ];

  const galleryImages = [
    { src: "/images/gallery/training-1.jpg", alt: "1v1 Training Session" },
    { src: "/images/gallery/training-2.jpg", alt: "Technical Skills Development" },
    { src: "/images/gallery/training-3.jpg", alt: "Coach Working with Player" },
    { src: "/images/gallery/facility-1.jpg", alt: "REBALL Training Facility" },
    { src: "/images/gallery/achievement-1.jpg", alt: "Certificate Presentation" },
    { src: "/images/gallery/team-1.jpg", alt: "REBALL Team Photo" }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <>
      <SEO
        title="About REBALL - Professional Football Training Methodology"
        description="Discover REBALL's revolutionary 1v1 football training methodology. Learn about our professional coaching team, proven training approach, and success stories from players across Devon. Transform your game with our unique scenario-based training."
        keywords="REBALL football training, 1v1 training methodology, professional football coaching, Devon football training, player development, football skills training, UEFA licensed coaches"
        canonical="/about"
        ogImage="/images/founder-img.jpg"
        structuredData={aboutStructuredData}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About REBALL
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Revolutionizing football training through proven 1v1 methodology
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center">
              <Award className="w-6 h-6 mr-2" />
              <span>Professional Coaching</span>
            </div>
            <div className="flex items-center">
              <Target className="w-6 h-6 mr-2" />
              <span>Proven Results</span>
            </div>
            <div className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              <span>Player Development</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                REBALL was founded with a simple mission: to transform how young footballers develop their skills through focused, scenario-based training. Our methodology is built on the principle that players learn best when training mirrors real game situations.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                With over 15 years of professional coaching experience, our team has developed a unique approach that combines tactical understanding, technical skill, and mental preparation. We believe every player has the potential to excel when given the right tools and guidance.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  500+ Players Trained
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  95% Success Rate
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/founder-img.jpg"
                alt="REBALL Founder - Harry Ross"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Founder
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Harry Ross - The Vision Behind REBALL
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="/images/founder-img.jpg"
                alt="Harry Ross - REBALL Founder"
                width={500}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Harry Ross
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Harry Ross is the visionary founder of REBALL, bringing over 15 years of professional football experience to the training ground. His journey began as a young player in Devon, where he discovered his passion for the beautiful game and the importance of focused, scenario-based training.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                After playing at various levels and experiencing the limitations of traditional training methods, Harry developed the REBALL methodology. His approach focuses on real game scenarios, helping players develop the specific skills needed to succeed in actual match situations rather than isolated drills.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Harry's coaching philosophy centers around building player confidence through mastery of 1v1 scenarios. He believes that when players can handle individual battles effectively, they become more valuable team players and develop the mental toughness needed for high-level competition.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                  <p className="text-sm text-gray-600">15+ Years Professional Coaching</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Qualifications</h4>
                  <p className="text-sm text-gray-600">UEFA A Licensed Coach</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Specialization</h4>
                  <p className="text-sm text-gray-600">1v1 Scenario Training</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-sm text-gray-600">Devon, United Kingdom</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive training system is designed to develop complete footballers through focused, scenario-based learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <Target className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">1v1 Scenarios Focus</h3>
              <p className="text-gray-600">
                We train players for the specific 1v1 situations they'll encounter in matches, building confidence and decision-making skills that translate directly to game performance.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <Play className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">SISW Analysis</h3>
              <p className="text-gray-600">
                Session in Slow-motion with Voiceover provides detailed analysis of your training, helping you understand exactly what to improve and how to apply it in games.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <Star className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">TAV Videos</h3>
              <p className="text-gray-600">
                Technical Analysis Videos offer Match of the Day style analysis, breaking down professional games to show how top players handle the same scenarios you're training for.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <Users className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Position-Specific Training</h3>
              <p className="text-gray-600">
                Our courses are tailored for each position - strikers, midfielders, defenders, and wingers - ensuring you develop the skills most relevant to your role.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <Award className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confidence Building</h3>
              <p className="text-gray-600">
                We track before/after confidence ratings to ensure players develop the mental strength needed to perform under pressure in real game situations.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border">
              <CheckCircle className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real Game Application</h3>
              <p className="text-gray-600">
                Every training session is designed to translate directly to match performance, with clear connections between practice and game situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the expert coaches who make REBALL training exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <p>{member.name}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-500 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Qualifications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.qualifications.map((qual, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specializations.map((spec, i) => (
                        <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <Mail className="w-4 h-4" />
                      <span>{member.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{member.contact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Philosophy Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Training Philosophy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The core principles that guide every REBALL training session
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Core Principles</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Scenario-Based Learning</h4>
                    <p className="text-gray-600">Every training session focuses on specific game scenarios, ensuring players develop the exact skills they need for real match situations.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Confidence Through Repetition</h4>
                    <p className="text-gray-600">We build player confidence through targeted practice of challenging scenarios, measuring improvement with before/after confidence ratings.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Video Analysis Integration</h4>
                    <p className="text-gray-600">SISW and TAV videos provide detailed feedback and learning opportunities, allowing players to review and improve their performance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Player Development</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Technical Skills</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Confidence</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Game Understanding</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">1v1 Performance</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about REBALL training
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Gallery</h2>
            <p className="text-xl text-gray-600">
              See REBALL training in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-lg h-64 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setActiveGalleryImage(index)}
              >
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Players Say</h2>
            <p className="text-xl text-gray-600">
              Real feedback from REBALL players and parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Game?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join REBALL and experience the difference that focused, scenario-based training can make
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Book Your First Session
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-500 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {activeGalleryImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{galleryImages[activeGalleryImage].alt}</h3>
                <button
                  onClick={() => setActiveGalleryImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p>Gallery Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 