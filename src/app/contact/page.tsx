'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/Toast';
import { LoadingButton } from '@/components/Loading';
import FormField from '@/components/ui/FormField';
import { commonRules } from '@/utils/formValidation';
import { useApiError } from '@/utils/apiErrorHandler';
import SEO from '@/components/SEO';
import { structuredDataSchemas } from '@/components/SEO';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  age: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  bestTime: string;
}

export default function Contact() {
  const { addToast } = useToast();
  const { handleApiError } = useApiError();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    age: '',
    inquiryType: '',
    message: '',
    preferredContact: '',
    bestTime: ''
  });

  // Structured data for the Contact page
  const contactStructuredData = [
    structuredDataSchemas.organization,
    structuredDataSchemas.localBusiness,
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact REBALL",
      "description": "Get in touch with REBALL for football training inquiries",
      "mainEntity": {
        "@type": "Organization",
        "name": "REBALL UK",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+44-123-456-7890",
          "contactType": "customer service",
          "email": "harry@reball.uk",
          "availableLanguage": "English"
        }
      }
    }
  ];

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      addToast({
        type: 'success',
        title: 'Message sent successfully!',
        message: 'We\'ll get back to you within 24 hours.',
        duration: 5000
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        age: '',
        inquiryType: '',
        message: '',
        preferredContact: '',
        bestTime: ''
      });
    } catch (error) {
      const apiError = handleApiError(error, (message) => {
        addToast({
          type: 'error',
          title: 'Failed to send message',
          message,
          duration: 5000
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const positionOptions = [
    { value: 'striker', label: 'Striker' },
    { value: 'winger', label: 'Winger' },
    { value: 'cam', label: 'CAM' },
    { value: 'full-back', label: 'Full-back' },
    { value: 'other', label: 'Other' }
  ];

  const inquiryOptions = [
    { value: 'general', label: 'General Information' },
    { value: 'booking', label: 'Course Booking Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'media', label: 'Media Inquiries' }
  ];

  const contactOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'whatsapp', label: 'WhatsApp' }
  ];

  const timeOptions = [
    { value: 'morning', label: 'Morning (9AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
    { value: 'evening', label: 'Evening (5PM - 8PM)' }
  ];

  return (
    <>
      <SEO
        title="Contact REBALL - Book Your Football Training Today"
        description="Get in touch with REBALL for football training inquiries. Contact our professional coaching team in Devon for 1v1 training, course bookings, and support. Call +44 123 456 7890 or email harry@reball.uk"
        keywords="contact REBALL, football training contact, Devon football coaching, REBALL phone number, football training inquiry, book football training"
        canonical="/contact"
        ogImage="/images/reball-logo-black.png"
        structuredData={contactStructuredData}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to Start Your REBALL Journey?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get in touch with our team - we're here to help you succeed
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>harry@reball.uk</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+44 123 456 7890</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Devon, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    rules={commonRules.name}
                    required
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                    rules={commonRules.email}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+44 123 456 7890"
                    value={formData.phone}
                    onChange={(value) => handleInputChange('phone', value)}
                    rules={commonRules.phone}
                    helpText="Optional - for urgent matters"
                  />

                  <FormField
                    label="Player Position"
                    name="position"
                    type="select"
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                    options={positionOptions}
                    helpText="What position do you play?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Age"
                    name="age"
                    type="text"
                    placeholder="e.g., 14, 16, 18"
                    value={formData.age}
                    onChange={(value) => handleInputChange('age', value)}
                    helpText="For appropriate course recommendations"
                  />

                  <FormField
                    label="Inquiry Type"
                    name="inquiryType"
                    type="select"
                    value={formData.inquiryType}
                    onChange={(value) => handleInputChange('inquiryType', value)}
                    options={inquiryOptions}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Preferred Contact Method"
                    name="preferredContact"
                    type="select"
                    value={formData.preferredContact}
                    onChange={(value) => handleInputChange('preferredContact', value)}
                    options={contactOptions}
                    required
                  />

                  <FormField
                    label="Best Time to Contact"
                    name="bestTime"
                    type="select"
                    value={formData.bestTime}
                    onChange={(value) => handleInputChange('bestTime', value)}
                    options={timeOptions}
                    required
                  />
                </div>

                <FormField
                  label="Message"
                  name="message"
                  type="textarea"
                  placeholder="Tell us about your football goals, training needs, or any questions you have..."
                  value={formData.message}
                  onChange={(value) => handleInputChange('message', value)}
                  rules={commonRules.message}
                  required
                  helpText="Please provide details about your inquiry"
                />

                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </LoadingButton>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-600">harry@reball.uk</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <p className="text-gray-600">+44 123 456 7890</p>
                      <p className="text-sm text-gray-500">Available during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Location</h4>
                      <p className="text-gray-600">Devon, United Kingdom</p>
                      <p className="text-sm text-gray-500">Training sessions available locally</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
                      <p className="text-sm text-gray-500">Weekend sessions available</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Follow Us</h3>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://instagram.com/reball_uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-pink-600 mr-3" />
                    <span className="text-sm font-medium">Instagram</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>

                  <a
                    href="https://tiktok.com/@reball.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-black mr-3" />
                    <span className="text-sm font-medium">TikTok</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Why Choose REBALL?</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Proven 1v1 training methodology</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Professional coaching from Premier League experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Personalized training plans</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Video analysis and feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 