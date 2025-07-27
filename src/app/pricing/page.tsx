'use client';

import { useState } from 'react';
import Image from 'next/image';
import SEO from '@/components/SEO';
import { structuredDataSchemas } from '@/components/SEO';
import {
  Check,
  Star,
  Play,
  Users,
  Target,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Shield,
  Clock,
  Calendar,
  Video,
  Download,
  MessageSquare,
  Zap
} from 'lucide-react';

interface PricingPackage {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  bestValue?: boolean;
  type: 'group' | 'individual';
  videoIncluded: 'none' | 'sisw' | 'sisw-tav';
}

interface Course {
  id: string;
  name: string;
  position: string;
  description: string;
  price: number;
  duration: string;
}

export default function PricingPage() {
  const [trainingType, setTrainingType] = useState<'group' | 'individual'>('group');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Structured data for the Pricing page
  const pricingStructuredData = [
    structuredDataSchemas.organization,
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "REBALL Football Training",
      "description": "Professional 1v1 football training with video analysis",
      "provider": {
        "@type": "Organization",
        "name": "REBALL UK"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Devon, United Kingdom"
      },
      "serviceType": "Football Training",
      "offers": [
        {
          "@type": "Offer",
          "name": "Group Training Only",
          "price": "280",
          "priceCurrency": "GBP",
          "description": "Essential group training with position-specific 1v1 scenario training"
        },
        {
          "@type": "Offer",
          "name": "Group Training + SISW",
          "price": "320",
          "priceCurrency": "GBP",
          "description": "Group training with detailed video analysis"
        },
        {
          "@type": "Offer",
          "name": "Group Training + SISW + TAV",
          "price": "560",
          "priceCurrency": "GBP",
          "description": "Complete group training with premium video analysis"
        }
      ]
    }
  ];

  const groupPackages: PricingPackage[] = [
    {
      id: 'group-training-only',
      name: 'Training Only',
      price: 280,
      description: 'Essential group training with position-specific 1v1 scenario training',
      features: [
        '8 weekly group training sessions',
        'Position-specific 1v1 scenario training',
        'Progress tracking and confidence ratings',
        'Access to player dashboard',
        'Course completion certificate'
      ],
      type: 'group',
      videoIncluded: 'none'
    },
    {
      id: 'group-training-sisw',
      name: 'Training + SISW',
      price: 320,
      description: 'Group training with detailed video analysis',
      features: [
        'Everything in Training Only',
        'Session in Slow-motion with Voiceover videos',
        'Detailed technical analysis of your performance',
        'Professional coach commentary',
        'Downloadable video library'
      ],
      popular: true,
      type: 'group',
      videoIncluded: 'sisw'
    },
    {
      id: 'group-training-sisw-tav',
      name: 'Training + SISW + TAV',
      price: 560,
      description: 'Complete group training with premium video analysis',
      features: [
        'Everything in Training + SISW',
        'Technical Analysis Videos (Match of the Day style)',
        'Advanced tactical analysis',
        'Game situation breakdowns',
        'Professional video production quality'
      ],
      bestValue: true,
      type: 'group',
      videoIncluded: 'sisw-tav'
    }
  ];

  const individualPackages: PricingPackage[] = [
    {
      id: 'individual-training-only',
      name: 'Training Only',
      price: 480,
      description: 'Personalized 1v1 training sessions with expert coaching',
      features: [
        '8 weekly individual training sessions',
        'Personalized 1v1 scenario training',
        'Individual progress tracking',
        'Personal coach feedback',
        'Course completion certificate'
      ],
      type: 'individual',
      videoIncluded: 'none'
    },
    {
      id: 'individual-training-sisw',
      name: 'Training + SISW',
      price: 560,
      description: 'Individual training with personalized video analysis',
      features: [
        'Everything in Training Only',
        'Personalized SISW videos',
        'Individual technical analysis',
        'One-on-one coach commentary',
        'Personal video library access'
      ],
      popular: true,
      type: 'individual',
      videoIncluded: 'sisw'
    },
    {
      id: 'individual-training-sisw-tav',
      name: 'Training + SISW + TAV',
      price: 800,
      description: 'Complete individual training with premium video analysis',
      features: [
        'Everything in Training + SISW',
        'Personalized Technical Analysis Videos',
        'Advanced individual tactical analysis',
        'Personal game situation breakdowns',
        'Professional video production quality'
      ],
      bestValue: true,
      type: 'individual',
      videoIncluded: 'sisw-tav'
    }
  ];

  const courses: Course[] = [
    {
      id: 'striker-course',
      name: 'Striker Development',
      position: 'Striker',
      description: 'Master the art of scoring goals with advanced finishing techniques and positioning',
      price: 320,
      duration: '8 weeks'
    },
    {
      id: 'winger-course',
      name: 'Winger Mastery',
      position: 'Winger',
      description: 'Develop explosive pace, crossing ability, and 1v1 attacking skills',
      price: 320,
      duration: '8 weeks'
    },
    {
      id: 'cam-course',
      name: 'CAM Excellence',
      position: 'CAM',
      description: 'Perfect your playmaking abilities and creative attacking movement',
      price: 320,
      duration: '8 weeks'
    },
    {
      id: 'fullback-course',
      name: 'Full-back Complete',
      position: 'Full-back',
      description: 'Master defensive positioning and attacking full-back play',
      price: 320,
      duration: '8 weeks'
    }
  ];

  const faqs = [
    {
      question: "What's included in each training package?",
      answer: "Each package includes 8 weekly training sessions, position-specific 1v1 scenario training, progress tracking, and a course completion certificate. Video analysis packages add SISW (Session in Slow-motion with Voiceover) and TAV (Technical Analysis Videos) content."
    },
    {
      question: "Can I upgrade my package after starting?",
      answer: "Yes, you can upgrade your package at any time during your course. The difference in price will be prorated based on remaining sessions. Contact our team to arrange the upgrade."
    },
    {
      question: "What's the difference between group and individual training?",
      answer: "Group training offers shared learning with 4-6 players, while individual training provides one-on-one coaching for personalized attention. Both follow the same REBALL methodology but with different levels of personalization."
    },
    {
      question: "How do I access my training videos?",
      answer: "All videos are available in your personal REBALL dashboard. SISW videos are uploaded within 48 hours of each session, while TAV videos are produced weekly with professional analysis."
    },
    {
      question: "Do you offer payment plans?",
      answer: "Yes, we offer flexible payment plans for all packages. You can pay in full or split payments over the course duration. Contact us to discuss payment options."
    },
    {
      question: "What if I miss a session?",
      answer: "We understand schedules can change. You can reschedule sessions up to 24 hours in advance. Missed sessions can be made up during the course period or added to your video library for review."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const currentPackages = trainingType === 'group' ? groupPackages : individualPackages;

  return (
    <>
      <SEO
        title="REBALL Training Prices - Group & 1v1 Football Courses"
        description="Compare REBALL football training packages and prices. Choose from group or individual training with optional video analysis. Professional 1v1 scenario training starting from £280. Book your course today!"
        keywords="REBALL pricing, football training prices, group training cost, individual coaching price, Devon football training cost, video analysis packages"
        canonical="/pricing"
        ogImage="/images/reball-logo-black.png"
        structuredData={pricingStructuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            REBALL Training Prices
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
            Choose the perfect training package to transform your football game
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center">
              <Target className="w-6 h-6 mr-2" />
              <span>Proven Methodology</span>
            </div>
            <div className="flex items-center">
              <Video className="w-6 h-6 mr-2" />
              <span>Video Analysis</span>
            </div>
            <div className="flex items-center">
              <Award className="w-6 h-6 mr-2" />
              <span>Professional Coaching</span>
            </div>
          </div>
        </div>
      </section>

      {/* Training Type Selection */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Training Type
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select between group training for shared learning or individual coaching for personalized attention
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-100 rounded-lg p-2 flex">
              <button
                onClick={() => setTrainingType('group')}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors ${
                  trainingType === 'group'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Group Training</span>
                </div>
                <p className="text-sm mt-1 opacity-75">4-6 players per session</p>
              </button>
              <button
                onClick={() => setTrainingType('individual')}
                className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-colors ${
                  trainingType === 'individual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Individual Training</span>
                </div>
                <p className="text-sm mt-1 opacity-75">One-on-one coaching</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg shadow-lg p-8 relative ${
                  pkg.popular ? 'ring-2 ring-blue-500' : ''
                } ${pkg.bestValue ? 'ring-2 ring-green-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                {pkg.bestValue && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Best Value
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">£{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        £{pkg.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">8-week course</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPackage(pkg.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Choose Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Single Session Option */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Try Before You Commit</h2>
            <p className="text-xl mb-6">
              Experience REBALL training with a single session
            </p>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold mb-2">£60</div>
              <div className="text-lg mb-4">Single 1v1 Session</div>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>No commitment required</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Experience REBALL training approach</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Personalized feedback</span>
                </li>
              </ul>
            </div>
            <button className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-semibold transition-colors">
              Book Trial Session
            </button>
          </div>
        </div>
      </section>

      {/* Package Comparison Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Package Comparison</h2>
            <p className="text-xl text-gray-600">
              Compare all features across our training packages
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Training Only</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Training + SISW</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Training + SISW + TAV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Training Sessions</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Progress Tracking</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">SISW Videos</td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">TAV Videos</td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center"><span className="text-gray-400">—</span></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Certificate</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment & Booking</h2>
            <p className="text-xl text-gray-600">
              Secure, transparent payment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <CreditCard className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Stripe-powered secure payments with industry-standard encryption</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">Transparent pricing with no surprise charges or additional costs</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Reschedule sessions up to 24 hours in advance</p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple online booking process with instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose REBALL?</h2>
            <p className="text-xl text-gray-600">
              The proven investment in your football development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Zap className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Immediate Impact</h3>
              <p className="text-gray-600">See improvements in your game confidence and performance from the very first session</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Target className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Specific Training</h3>
              <p className="text-gray-600">Train for the exact scenarios you face in matches, not generic skills that don't translate</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Video className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Analysis</h3>
              <p className="text-gray-600">Professional video analysis helps you understand and improve your performance</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Award className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600">95% of players report increased confidence and improved game performance</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Coaches</h3>
              <p className="text-gray-600">Learn from coaches with Premier League academy experience and proven track records</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <MessageSquare className="w-12 h-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ongoing Support</h3>
              <p className="text-gray-600">Continuous feedback and support throughout your development journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course-Specific Pricing */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Position-Specific Courses</h2>
            <p className="text-xl text-gray-600">
              Specialized training programs designed for your position
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{course.position}</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">£{course.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{course.duration}</span>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about REBALL pricing and packages
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

      {/* CTA Section */}
      <section className="py-16 bg-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your REBALL Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose your package and begin your transformation today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Book Your Course
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-500 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </>
  );
} 