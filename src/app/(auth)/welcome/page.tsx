"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WelcomeFormData {
  // Step 1: Personal Information
  playerName: string;
  dateOfBirth: string;
  parentGuardianName: string;
  contactEmail: string;
  contactNumber: string;
  postcode: string;

  // Step 2: Football Profile
  position: string;
  playingLevel: string;
  currentTeam: string;
  medicalConditions: string;

  // Step 3: Training Background
  trainingReason: string;
  hearAbout: string;
  referralName: string;
  otherSource: string;

  // Step 4: Preferences & Requirements
  postTrainingSnacks: string;
  postTrainingDrinks: string;
  evidenceFiles: File[];
  socialMediaConsent: boolean;
  marketingConsent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<WelcomeFormData>({
    playerName: "",
    dateOfBirth: "",
    parentGuardianName: "",
    contactEmail: "",
    contactNumber: "",
    postcode: "",
    position: "",
    playingLevel: "",
    currentTeam: "",
    medicalConditions: "",
    trainingReason: "",
    hearAbout: "",
    referralName: "",
    otherSource: "",
    postTrainingSnacks: "",
    postTrainingDrinks: "",
    evidenceFiles: [],
    socialMediaConsent: false,
    marketingConsent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Pre-fill form with session data if available
    if (session.user?.name) {
      setFormData(prev => ({
        ...prev,
        playerName: session.user.name,
        contactEmail: session.user.email || "",
      }));
    }
  }, [session, status, router]);

  useEffect(() => {
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const ageDiff = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? ageDiff - 1 
        : ageDiff;
      setAge(calculatedAge);
    }
  }, [formData.dateOfBirth]);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.playerName.trim()) newErrors.playerName = "Player name is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (age !== null && age < 16 && !formData.parentGuardianName.trim()) {
          newErrors.parentGuardianName = "Parent/guardian name is required for players under 16";
        }
        if (!formData.contactEmail) newErrors.contactEmail = "Contact email is required";
        if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required";
        if (!formData.postcode) newErrors.postcode = "Postcode is required";
        break;

      case 2:
        if (!formData.position) newErrors.position = "Position is required";
        if (!formData.playingLevel) newErrors.playingLevel = "Playing level is required";
        break;

      case 3:
        if (!formData.trainingReason.trim()) newErrors.trainingReason = "Training reason is required";
        if (!formData.hearAbout) newErrors.hearAbout = "Please tell us how you heard about REBALL";
        if (formData.hearAbout === "coach-referral" || formData.hearAbout === "player-referral") {
          if (!formData.referralName.trim()) newErrors.referralName = "Referral name is required";
        }
        if (formData.hearAbout === "other" && !formData.otherSource.trim()) {
          newErrors.otherSource = "Please specify how you heard about REBALL";
        }
        break;

      case 4:
        if (!formData.socialMediaConsent) newErrors.socialMediaConsent = "Social media consent is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        evidenceFiles: Array.from(e.target.files || [])
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "evidenceFiles") {
          formData.evidenceFiles.forEach((file, index) => {
            formDataToSend.append(`evidenceFiles[${index}]`, file);
          });
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch("/api/profile/complete", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setErrors({ general: data.message || "Failed to save profile" });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Step {currentStep} of 4</span>
        <span className="text-sm text-white font-semibold">
          {currentStep === 1 && "Personal Information"}
          {currentStep === 2 && "Football Profile"}
          {currentStep === 3 && "Training Background"}
          {currentStep === 4 && "Preferences & Requirements"}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="playerName" className="block text-sm font-medium text-white mb-2">
            Player Name *
          </label>
          <input
            id="playerName"
            name="playerName"
            type="text"
            required
            value={formData.playerName}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.playerName ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="Enter your full name"
          />
          {errors.playerName && (
            <p className="mt-1 text-sm text-red-400">{errors.playerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white mb-2">
            Date of Birth *
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.dateOfBirth ? "border-red-500" : "border-gray-600"
            }`}
          />
          {age !== null && (
            <p className="mt-1 text-sm text-gray-400">Age: {age} years old</p>
          )}
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>
          )}
        </div>

        {age !== null && age < 16 && (
          <div>
            <label htmlFor="parentGuardianName" className="block text-sm font-medium text-white mb-2">
              Parent/Guardian Name *
            </label>
            <input
              id="parentGuardianName"
              name="parentGuardianName"
              type="text"
              required
              value={formData.parentGuardianName}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
                errors.parentGuardianName ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Parent or guardian name"
            />
            {errors.parentGuardianName && (
              <p className="mt-1 text-sm text-red-400">{errors.parentGuardianName}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-white mb-2">
            Contact Email *
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            value={formData.contactEmail}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.contactEmail ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="your.email@example.com"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-400">{errors.contactEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium text-white mb-2">
            Contact Number *
          </label>
          <input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            required
            value={formData.contactNumber}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.contactNumber ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="07123456789"
          />
          {errors.contactNumber && (
            <p className="mt-1 text-sm text-red-400">{errors.contactNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="postcode" className="block text-sm font-medium text-white mb-2">
            Postcode *
          </label>
          <input
            id="postcode"
            name="postcode"
            type="text"
            required
            value={formData.postcode}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.postcode ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="SW1A 1AA"
          />
          {errors.postcode && (
            <p className="mt-1 text-sm text-red-400">{errors.postcode}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Football Profile</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-white mb-2">
            Position *
          </label>
          <select
            id="position"
            name="position"
            required
            value={formData.position}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.position ? "border-red-500" : "border-gray-600"
            }`}
          >
            <option value="">Select your position</option>
            <option value="full-back">Full Back</option>
            <option value="centre-back">Centre Back</option>
            <option value="central-defensive-midfielder">Central Defensive Midfielder</option>
            <option value="central-midfielder">Central Midfielder</option>
            <option value="central-attacking-midfielder">Central Attacking Midfielder</option>
            <option value="left-winger">Left Winger</option>
            <option value="right-winger">Right Winger</option>
            <option value="striker">Striker</option>
          </select>
          {errors.position && (
            <p className="mt-1 text-sm text-red-400">{errors.position}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Playing Level *
          </label>
          <div className="space-y-3">
            {[
              { value: "grassroots-club", label: "Grassroots Club" },
              { value: "semi-professional-club", label: "Semi-Professional Club" },
              { value: "professional-club", label: "Professional Club" }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="playingLevel"
                  value={option.value}
                  checked={formData.playingLevel === option.value}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-white focus:ring-white border-gray-600 bg-gray-800"
                />
                <span className="ml-3 text-white">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.playingLevel && (
            <p className="mt-1 text-sm text-red-400">{errors.playingLevel}</p>
          )}
        </div>

        <div>
          <label htmlFor="currentTeam" className="block text-sm font-medium text-white mb-2">
            Current Team
          </label>
          <input
            id="currentTeam"
            name="currentTeam"
            type="text"
            value={formData.currentTeam}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Your current team (optional)"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="medicalConditions" className="block text-sm font-medium text-white mb-2">
            Medical Conditions
          </label>
          <textarea
            id="medicalConditions"
            name="medicalConditions"
            rows={3}
            value={formData.medicalConditions}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Any medical conditions we should be aware of (optional)"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Training Background</h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="trainingReason" className="block text-sm font-medium text-white mb-2">
            Why do you want REBALL training? *
          </label>
          <textarea
            id="trainingReason"
            name="trainingReason"
            required
            rows={4}
            value={formData.trainingReason}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.trainingReason ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="Tell us about your goals and what you want to achieve..."
          />
          {errors.trainingReason && (
            <p className="mt-1 text-sm text-red-400">{errors.trainingReason}</p>
          )}
        </div>

        <div>
          <label htmlFor="hearAbout" className="block text-sm font-medium text-white mb-2">
            How did you hear about REBALL? *
          </label>
          <select
            id="hearAbout"
            name="hearAbout"
            required
            value={formData.hearAbout}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
              errors.hearAbout ? "border-red-500" : "border-gray-600"
            }`}
          >
            <option value="">Select an option</option>
            <option value="social-media">Social Media</option>
            <option value="coach-referral">Coach Referral</option>
            <option value="player-referral">Player Referral</option>
            <option value="club-partnership">Club Partnership</option>
            <option value="other">Other</option>
          </select>
          {errors.hearAbout && (
            <p className="mt-1 text-sm text-red-400">{errors.hearAbout}</p>
          )}
        </div>

        {(formData.hearAbout === "coach-referral" || formData.hearAbout === "player-referral") && (
          <div>
            <label htmlFor="referralName" className="block text-sm font-medium text-white mb-2">
              Referral Name *
            </label>
            <input
              id="referralName"
              name="referralName"
              type="text"
              required
              value={formData.referralName}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
                errors.referralName ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="Name of coach or player who referred you"
            />
            {errors.referralName && (
              <p className="mt-1 text-sm text-red-400">{errors.referralName}</p>
            )}
          </div>
        )}

        {formData.hearAbout === "other" && (
          <div>
            <label htmlFor="otherSource" className="block text-sm font-medium text-white mb-2">
              Please specify *
            </label>
            <input
              id="otherSource"
              name="otherSource"
              type="text"
              required
              value={formData.otherSource}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent ${
                errors.otherSource ? "border-red-500" : "border-gray-600"
              }`}
              placeholder="How did you hear about REBALL?"
            />
            {errors.otherSource && (
              <p className="mt-1 text-sm text-red-400">{errors.otherSource}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Preferences & Requirements</h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="postTrainingSnacks" className="block text-sm font-medium text-white mb-2">
            Post-Training Snacks
          </label>
          <input
            id="postTrainingSnacks"
            name="postTrainingSnacks"
            type="text"
            value={formData.postTrainingSnacks}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Any dietary preferences for post-training snacks"
          />
        </div>

        <div>
          <label htmlFor="postTrainingDrinks" className="block text-sm font-medium text-white mb-2">
            Post-Training Drinks
          </label>
          <input
            id="postTrainingDrinks"
            name="postTrainingDrinks"
            type="text"
            value={formData.postTrainingDrinks}
            onChange={handleInputChange}
            className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Any drink preferences"
          />
        </div>

        {formData.playingLevel === "professional-club" && (
          <div>
            <label htmlFor="evidenceFiles" className="block text-sm font-medium text-white mb-2">
              Evidence Files
            </label>
            <input
              id="evidenceFiles"
              name="evidenceFiles"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-400">
              Upload evidence of your professional status (contracts, certificates, etc.)
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start">
            <input
              id="socialMediaConsent"
              name="socialMediaConsent"
              type="checkbox"
              required
              checked={formData.socialMediaConsent}
              onChange={handleInputChange}
              className="h-4 w-4 text-white focus:ring-white border-gray-600 rounded bg-gray-800 mt-1"
            />
            <label htmlFor="socialMediaConsent" className="ml-3 block text-sm text-white">
              I consent to REBALL using my image and training footage for social media and marketing purposes *
            </label>
          </div>
          {errors.socialMediaConsent && (
            <p className="mt-1 text-sm text-red-400">{errors.socialMediaConsent}</p>
          )}

          <div className="flex items-start">
            <input
              id="marketingConsent"
              name="marketingConsent"
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={handleInputChange}
              className="h-4 w-4 text-white focus:ring-white border-gray-600 rounded bg-gray-800 mt-1"
            />
            <label htmlFor="marketingConsent" className="ml-3 block text-sm text-white">
              I would like to receive marketing communications from REBALL (you can opt out anytime)
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white font-permanent-marker">
              REBALL
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white font-permanent-marker">
            Welcome to REBALL!
          </h2>
          <p className="mt-2 text-sm text-gray-400 font-poppins">
            Let's get to know you better to personalize your training experience
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Welcome Form */}
        <div className="bg-gray-900 rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Skip for now
                </Link>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Completing...
                      </div>
                    ) : (
                      "Complete Setup"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 