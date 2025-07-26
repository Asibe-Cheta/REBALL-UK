"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  description: string;
  position: string;
  durationWeeks: number;
  price121: number;
  priceGroup: number;
  available: boolean;
}

interface BookingState {
  step: number;
  trainingType: "1v1" | "group" | null;
  selectedCourse: Course | null;
  selectedPackage: "training-only" | "training-sisw" | "training-sisw-tav" | null;
  answers: Record<string, string>;
}

interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  badge?: string;
}

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [playerPosition, setPlayerPosition] = useState<string>("");
  const [bookingState, setBookingState] = useState<BookingState>({
    step: 1,
    trainingType: null,
    selectedCourse: null,
    selectedPackage: null,
    answers: {},
  });

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    fetchPlayerData();
    fetchCourses();
  }, [session, status, router]);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setPlayerPosition(data.position || "");
      }
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredCourses = () => {
    if (!playerPosition) return courses;
    
    const positionMap: Record<string, string[]> = {
      "striker": ["1v1 Attacking Finishing", "1v1 with Keeper"],
      "winger": ["1v1 Attacking Finishing", "1v1 Attacking Crossing"],
      "central-attacking-midfielder": ["1v1 Attacking Finishing", "1v1 Attacking Crossing"],
      "full-back": ["1v1 Attacking Crossing"],
    };

    const allowedCourses = positionMap[playerPosition] || [];
    return courses.filter(course => 
      allowedCourses.includes(course.name) && course.available
    );
  };

  const getPackageOptions = (): PackageOption[] => {
    const basePrice = bookingState.selectedCourse?.price121 || 0;
    const groupPrice = bookingState.selectedCourse?.priceGroup || 0;
    const price = bookingState.trainingType === "group" ? groupPrice : basePrice;

    return [
      {
        id: "training-only",
        name: "Training Only",
        description: "Standard training sessions",
        price: price,
        features: ["8 training sessions", "Progress tracking", "Coach feedback"],
      },
      {
        id: "training-sisw",
        name: "Training + SISW",
        description: "Includes Session in Slow-motion with Voiceover",
        price: price + 40,
        features: ["8 training sessions", "SISW videos", "Voiceover analysis", "Progress tracking"],
        badge: "Most Popular",
      },
      {
        id: "training-sisw-tav",
        name: "Training + SISW + TAV",
        description: "Includes Technical Analysis Videos",
        price: price * 2,
        features: ["8 training sessions", "SISW videos", "TAV analysis", "Complete video library", "Advanced analytics"],
        badge: "Best Value",
      },
    ];
  };

  const getCourseQuestions = (courseName: string) => {
    const questionMap: Record<string, string[]> = {
      "1v1 Attacking Finishing": [
        "Why do you want to be on the 1v1 Attacking Finishing Course?",
        "How confident are you out of 10 you can win every 1v1 scenario?",
        "What foot/feet do you want to work on when cutting inside to finish?",
        "Do you want to focus on finishing from specific areas of the box?"
      ],
      "1v1 with Keeper": [
        "What specific goalkeeper scenarios do you struggle with?",
        "How do you currently approach 1v1 situations with the keeper?",
        "What's your preferred finishing technique in these scenarios?",
        "Are there particular areas of the goal you want to improve?"
      ],
      "1v1 Attacking Crossing": [
        "What type of crosses do you want to improve?",
        "How confident are you with both feet for crossing?",
        "What specific crossing scenarios do you face most?",
        "Do you want to focus on early crosses or cut-backs?"
      ],
    };

    return questionMap[courseName] || [];
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      setBookingState(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handlePrevious = () => {
    setBookingState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const canProceedToNextStep = () => {
    switch (bookingState.step) {
      case 1:
        return bookingState.trainingType !== null;
      case 2:
        return bookingState.selectedCourse !== null;
      case 3:
        return bookingState.selectedPackage !== null;
      case 4:
        const questions = getCourseQuestions(bookingState.selectedCourse?.name || "");
        return questions.every(q => bookingState.answers[q]);
      default:
        return true;
    }
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setBookingState(prev => ({
      ...prev,
      answers: { ...prev.answers, [question]: answer }
    }));
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Step {bookingState.step} of 4</span>
        <span className="text-sm text-white font-semibold">
          {bookingState.step === 1 && "Training Type"}
          {bookingState.step === 2 && "Course Selection"}
          {bookingState.step === 3 && "Package Selection"}
          {bookingState.step === 4 && "Course Questions"}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${(bookingState.step / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-permanent-marker mb-6">
        Choose Your Training Type
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 1v1 Training Card */}
        <div 
          className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
            bookingState.trainingType === "1v1" 
              ? "border-white bg-gray-800" 
              : "border-gray-600 bg-gray-900 hover:border-gray-500"
          }`}
          onClick={() => setBookingState(prev => ({ ...prev, trainingType: "1v1" }))}
        >
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
              Popular Choice
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-4">1v1 Training</h3>
          <div className="text-3xl font-bold text-white mb-2">£400</div>
          <div className="text-gray-400 text-sm mb-4">£50 × 8 sessions</div>
          
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Personal attention from coach
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Customized training plan
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Flexible scheduling
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Detailed progress tracking
            </li>
          </ul>
        </div>

        {/* Group Training Card */}
        <div 
          className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
            bookingState.trainingType === "group" 
              ? "border-white bg-gray-800" 
              : "border-gray-600 bg-gray-900 hover:border-gray-500"
          }`}
          onClick={() => setBookingState(prev => ({ ...prev, trainingType: "group" }))}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Group Training</h3>
          <div className="text-3xl font-bold text-white mb-2">£280</div>
          <div className="text-gray-400 text-sm mb-4">£35 × 8 sessions</div>
          
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Team environment
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Competitive scenarios
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Peer learning
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Cost-effective option
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-permanent-marker mb-6">
        Select Your Course
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {getFilteredCourses().map((course) => (
          <div 
            key={course.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              bookingState.selectedCourse?.id === course.id 
                ? "border-white bg-gray-800" 
                : "border-gray-600 bg-gray-900 hover:border-gray-500"
            }`}
            onClick={() => setBookingState(prev => ({ ...prev, selectedCourse: course }))}
          >
            <h3 className="text-xl font-semibold text-white mb-2">{course.name}</h3>
            <p className="text-gray-400 mb-4">{course.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300 text-sm">{course.durationWeeks} weeks</span>
              <span className="text-white font-semibold">
                £{bookingState.trainingType === "group" ? course.priceGroup : course.price121}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{course.position}</span>
              <span className="text-green-400 text-sm">Available</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Courses */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {["1v2 Scenarios", "Dribbling", "Receiving"].map((course) => (
            <div key={course} className="border border-gray-700 rounded-lg p-4 opacity-50">
              <h4 className="text-white font-semibold mb-2">{course}</h4>
              <p className="text-gray-400 text-sm">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-permanent-marker mb-6">
        Choose Your Package
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {getPackageOptions().map((option) => (
          <div 
            key={option.id}
            className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
              bookingState.selectedPackage === option.id 
                ? "border-white bg-gray-800" 
                : "border-gray-600 bg-gray-900 hover:border-gray-500"
            }`}
            onClick={() => setBookingState(prev => ({ ...prev, selectedPackage: option.id as any }))}
          >
            {option.badge && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                  {option.badge}
                </span>
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-white mb-2">{option.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{option.description}</p>
            
            <div className="text-3xl font-bold text-white mb-4">£{option.price}</div>
            
            <ul className="space-y-2 text-gray-300">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white font-permanent-marker mb-6">
        Course-Specific Questions
      </h2>
      
      <div className="space-y-6">
        {getCourseQuestions(bookingState.selectedCourse?.name || "").map((question, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-white">
              {question}
            </label>
            <textarea
              value={bookingState.answers[question] || ""}
              onChange={(e) => handleAnswerChange(question, e.target.value)}
              rows={3}
              className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Your answer..."
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white font-permanent-marker">
            Book Your Training
          </h2>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Booking Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-8">
            {bookingState.step === 1 && renderStep1()}
            {bookingState.step === 2 && renderStep2()}
            {bookingState.step === 3 && renderStep3()}
            {bookingState.step === 4 && renderStep4()}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8">
              <button
                onClick={handlePrevious}
                disabled={bookingState.step === 1}
                className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </Link>

                {bookingState.step < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceedToNextStep()}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/booking/confirm")}
                    disabled={!canProceedToNextStep()}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 