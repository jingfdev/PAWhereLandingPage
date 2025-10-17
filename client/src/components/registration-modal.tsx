import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registrationSchema = z.object({
  // Contact Info
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),

  // Background Information
  ownsPet: z.enum(["yes", "no"], { required_error: "Please select an option" }),
  petType: z.array(z.string()).optional(),
  petTypeOther: z.string().optional(),
  outdoorFrequency: z.enum(["rarely", "sometimes", "often"]).optional(),
  lostPetBefore: z.enum(["yes", "no"]).optional(),
  howFoundPet: z.string().optional(),

  // Current Solutions & Pain Points
  currentTracking: z.enum(["yes", "no"]).optional(),
  currentTrackingSpecify: z.string().optional(),
  safetyWorries: z.array(z.string()).optional(),
  safetyWorriesOther: z.string().optional(),
  currentSafetyMethods: z.string().optional(),

  // Expectations for PAWhere
  importantFeatures: z.array(z.string()).optional(),
  expectedChallenges: z.array(z.string()).optional(),
  expectedChallengesOther: z.string().optional(),
  usefulnessRating: z.number().optional(),
  wishFeature: z.string().optional(),
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
  isVip?: boolean;
}

export function RegistrationModal({ isOpen, onClose, trigger, isVip = false }: RegistrationModalProps) {
  const [open, setOpen] = useState(isOpen || false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      phone: "",
      ownsPet: undefined,
      petType: [],
      petTypeOther: "",
      outdoorFrequency: undefined,
      lostPetBefore: undefined,
      howFoundPet: "",
      currentTracking: undefined,
      currentTrackingSpecify: "",
      safetyWorries: [],
      safetyWorriesOther: "",
      currentSafetyMethods: "",
      importantFeatures: [],
      expectedChallenges: [],
      expectedChallengesOther: "",
      usefulnessRating: undefined,
      wishFeature: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      console.log("Sending registration data:", JSON.stringify(data, null, 2));
      try {
        const response = await apiRequest("POST", "/api/register", data);
        const result = await response.json();
        console.log("Registration response:", result);
        return result;
      } catch (error) {
        console.error("Registration request error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("Registration mutation succeeded");
      toast({
        title: "Success!",
        description: "Welcome to PAWhere! We'll be in touch soon.",
        variant: "default",
      });
      form.reset();
      setCurrentStep(0);
      setOpen(false);
      if (onClose) {
        onClose();
      }
      queryClient.invalidateQueries({ queryKey: ["/api/register"] });
    },
    onError: (error: any) => {
      console.error("Registration mutation error:", error);
      const errorMessage = error.message || "Something went wrong. Please try again.";
      if (error.message && error.message.includes("Email already registered")) {
        toast({
          title: "Already Registered",
          description: "This email is already registered. You'll be contacted soon!",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  const nextStep = async () => {
    // Trigger validation to ensure all fields are captured on mobile
    const isValid = await form.trigger();
    
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Force complete form validation - this is critical for mobile
    // where form state might be out of sync with UI
    const isFormValid = await form.trigger();
    
    if (!isFormValid) {
      console.error("Form validation failed:", form.formState.errors);
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Use a small delay to ensure all form state updates have been processed
    // This is especially important for mobile browsers
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get fresh form values directly from the form state
    // Do NOT use form.getValues() alone - use form.watch to ensure all fields are captured
    const currentFormState = form.getValues();
    
    console.log("=== MOBILE-OPTIMIZED SUBMISSION ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("All form values:", JSON.stringify(currentFormState, null, 2));
    
    // Validate critical fields
    if (!currentFormState.email || !currentFormState.email.trim()) {
      toast({
        title: "Missing Email",
        description: "Email address is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentFormState.phone || !currentFormState.phone.trim()) {
      toast({
        title: "Missing Phone",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }
    
    // Clean and prepare data for submission
    const submissionData: RegistrationData = {
      email: (currentFormState.email || "").trim(),
      phone: (currentFormState.phone || "").trim(),
      ownsPet: currentFormState.ownsPet || undefined,
      petType: Array.isArray(currentFormState.petType) ? currentFormState.petType : [],
      petTypeOther: currentFormState.petTypeOther || undefined,
      outdoorFrequency: currentFormState.outdoorFrequency || undefined,
      lostPetBefore: currentFormState.lostPetBefore || undefined,
      howFoundPet: currentFormState.howFoundPet || undefined,
      currentTracking: currentFormState.currentTracking || undefined,
      currentTrackingSpecify: currentFormState.currentTrackingSpecify || undefined,
      safetyWorries: Array.isArray(currentFormState.safetyWorries) ? currentFormState.safetyWorries : [],
      safetyWorriesOther: currentFormState.safetyWorriesOther || undefined,
      currentSafetyMethods: currentFormState.currentSafetyMethods || undefined,
      importantFeatures: Array.isArray(currentFormState.importantFeatures) ? currentFormState.importantFeatures : [],
      expectedChallenges: Array.isArray(currentFormState.expectedChallenges) ? currentFormState.expectedChallenges : [],
      expectedChallengesOther: currentFormState.expectedChallengesOther || undefined,
      usefulnessRating: currentFormState.usefulnessRating,
      wishFeature: currentFormState.wishFeature || undefined,
    };
    
    console.log("=== CLEANED SUBMISSION DATA ===");
    console.log("Data to submit:", submissionData);
    console.log("Data size:", JSON.stringify(submissionData).length, "bytes");
    
    // Log each field for debugging
    Object.entries(submissionData).forEach(([key, value]) => {
      console.log(`[${key}]:`, value, `(${typeof value}, length: ${Array.isArray(value) ? value.length : 'N/A'})`);
    });
    
    // Include isVip flag
    const finalData = {
      ...submissionData,
      isVip: isVip
    };
    
    console.log("Final data with isVip:", finalData);
    console.log("Ready to submit - calling mutation");
    
    // Submit the form
    registerMutation.mutate(finalData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Don't close dialog while mutation is in progress
    if (registerMutation.isPending) {
      console.warn("Cannot close dialog while registration is in progress");
      return;
    }
    
    setOpen(newOpen);
    if (!newOpen) {
      setCurrentStep(0);
      form.reset();
      if (onClose) {
        onClose();
      }
    }
  };

  const canProceed = () => {
    const email = form.watch("email");
    const phone = form.watch("phone");
    const ownsPet = form.watch("ownsPet");
    const petType = form.watch("petType");
    const outdoorFrequency = form.watch("outdoorFrequency");
    const lostPetBefore = form.watch("lostPetBefore");
    const currentTracking = form.watch("currentTracking");
    const safetyWorries = form.watch("safetyWorries");
    const currentSafetyMethods = form.watch("currentSafetyMethods");
    const importantFeatures = form.watch("importantFeatures");
    const expectedChallenges = form.watch("expectedChallenges");
    const usefulnessRating = form.watch("usefulnessRating");
    const wishFeature = form.watch("wishFeature");

    switch (currentStep) {
      case 0:
        return email && phone;
      case 1:
        return (
          ownsPet &&
          (ownsPet === "no" ||
            (petType && petType.length > 0 && outdoorFrequency && lostPetBefore))
        );
      case 2:
        return currentTracking && safetyWorries && safetyWorries.length > 0 && currentSafetyMethods;
      case 3:
        return (
          importantFeatures && importantFeatures.length > 0 &&
          expectedChallenges && expectedChallenges.length > 0 &&
          usefulnessRating !== undefined &&
          wishFeature
        );
      default:
        return true;
    }
  };

  const renderStep = () => {
    const ownsPet = form.watch("ownsPet");
    const lostPetBefore = form.watch("lostPetBefore");
    const currentTracking = form.watch("currentTracking");
    const petType = form.watch("petType");
    const safetyWorries = form.watch("safetyWorries");
    const importantFeatures = form.watch("importantFeatures");
    const expectedChallenges = form.watch("expectedChallenges");

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#f4a905]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#f4a905]" />
              </div>
              <h2 className="text-2xl font-bold text-balance">Welcome to PAWhere!</h2>
              <p className="text-gray-600 text-pretty">
                Let's get started by collecting some basic information to personalize your experience.
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email Address *</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="focus:ring-[#f4a905] focus:border-[#f4a905]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <FormControl>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(+855) 123-4567"
                        className="focus:ring-[#f4a905] focus:border-[#f4a905]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-balance">Background Information</h2>
              <p className="text-gray-600 text-pretty">
                Tell us about your pet and your experience as a pet owner.
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="ownsPet"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <Label className="text-base font-medium">1. Do you currently own a pet?</Label>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="owns-yes"
                            name="ownsPet"
                            value="yes"
                            checked={form.watch("ownsPet") === "yes"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                form.setValue("ownsPet", "yes");
                              }
                            }}
                            className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                          />
                          <Label htmlFor="owns-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="owns-no"
                            name="ownsPet"
                            value="no"
                            checked={form.watch("ownsPet") === "no"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                form.setValue("ownsPet", "no");
                              }
                            }}
                            className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                          />
                          <Label htmlFor="owns-no" className="cursor-pointer">No</Label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {ownsPet === "yes" && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">2. If yes, what type of pet(s) do you own?</Label>
                    <div className="space-y-2">
                      {["Dog", "Cat"].map((type) => (
                        <div key={type} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`pet-${type.toLowerCase()}`}
                            checked={petType?.includes(type) || false}
                            onChange={(e) => {
                              const currentPetTypes = form.getValues("petType") || [];
                              if (e.target.checked) {
                                form.setValue("petType", [...currentPetTypes, type]);
                              } else {
                                form.setValue("petType", currentPetTypes.filter(t => t !== type));
                              }
                            }}
                            className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                          />
                          <Label htmlFor={`pet-${type.toLowerCase()}`} className="cursor-pointer">{type}</Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="pet-other"
                          checked={petType?.includes("Other") || false}
                          onChange={(e) => {
                            const currentPetTypes = form.getValues("petType") || [];
                            if (e.target.checked) {
                              form.setValue("petType", [...currentPetTypes, "Other"]);
                            } else {
                              form.setValue("petType", currentPetTypes.filter(t => t !== "Other"));
                            }
                          }}
                          className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2"
                        />
                        <Label htmlFor="pet-other" className="cursor-pointer">Other:</Label>
                        <Input
                          placeholder="Specify..."
                          value={form.watch("petTypeOther") || ""}
                          onChange={(e) => form.setValue("petTypeOther", e.target.value)}
                          className="flex-1 focus:ring-[#f4a905] focus:border-[#f4a905]"
                        />
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="outdoorFrequency"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label className="text-base font-medium">3. How often does your pet go outdoors?</Label>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="outdoor-rarely"
                                name="outdoorFrequency"
                                value="rarely"
                                checked={form.watch("outdoorFrequency") === "rarely"}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setValue("outdoorFrequency", "rarely");
                                  }
                                }}
                                className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                              />
                              <Label htmlFor="outdoor-rarely" className="cursor-pointer">Rarely (mostly indoors)</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="outdoor-sometimes"
                                name="outdoorFrequency"
                                value="sometimes"
                                checked={form.watch("outdoorFrequency") === "sometimes"}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setValue("outdoorFrequency", "sometimes");
                                  }
                                }}
                                className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                              />
                              <Label htmlFor="outdoor-sometimes" className="cursor-pointer">Sometimes (walks / play)</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="outdoor-often"
                                name="outdoorFrequency"
                                value="often"
                                checked={form.watch("outdoorFrequency") === "often"}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setValue("outdoorFrequency", "often");
                                  }
                                }}
                                className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                              />
                              <Label htmlFor="outdoor-often" className="cursor-pointer">Often (roams freely)</Label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lostPetBefore"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <Label className="text-base font-medium">4. Have you ever lost your pet before?</Label>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="lost-yes"
                                name="lostPetBefore"
                                value="yes"
                                checked={form.watch("lostPetBefore") === "yes"}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setValue("lostPetBefore", "yes");
                                  }
                                }}
                                className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                              />
                              <Label htmlFor="lost-yes" className="cursor-pointer">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                id="lost-no"
                                name="lostPetBefore"
                                value="no"
                                checked={form.watch("lostPetBefore") === "no"}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setValue("lostPetBefore", "no");
                                  }
                                }}
                                className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                              />
                              <Label htmlFor="lost-no" className="cursor-pointer">No</Label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {lostPetBefore === "yes" && (
                    <div className="space-y-2">
                      <Label htmlFor="how-found" className="text-base font-medium">5. If yes, how did you find your pet (or did you)?</Label>
                      <Textarea
                        id="how-found"
                        placeholder="Please describe how you found your pet..."
                        value={form.watch("howFoundPet") || ""}
                        onChange={(e) => form.setValue("howFoundPet", e.target.value)}
                        className="focus:ring-[#f4a905] focus:border-[#f4a905]"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-balance">Current Solutions & Pain Points</h2>
              <p className="text-gray-600 text-pretty">
                Help us understand your current approach to pet safety and tracking.
              </p>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="currentTracking"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <Label className="text-base font-medium">
                      6. Do you currently use any tracking solution for your pet?
                    </Label>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="tracking-yes"
                            name="currentTracking"
                            value="yes"
                            checked={form.watch("currentTracking") === "yes"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                form.setValue("currentTracking", "yes");
                              }
                            }}
                            className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                          />
                          <Label htmlFor="tracking-yes" className="cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id="tracking-no"
                            name="currentTracking"
                            value="no"
                            checked={form.watch("currentTracking") === "no"}
                            onChange={(e) => {
                              if (e.target.checked) {
                                form.setValue("currentTracking", "no");
                              }
                            }}
                            className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                          />
                          <Label htmlFor="tracking-no" className="cursor-pointer">No</Label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {currentTracking === "yes" && (
                <div className="mt-2">
                  <Input
                    placeholder="Please specify which tracking solution..."
                    value={form.watch("currentTrackingSpecify") || ""}
                    onChange={(e) => form.setValue("currentTrackingSpecify", e.target.value)}
                    className="focus:ring-[#f4a905] focus:border-[#f4a905]"
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-base font-medium">7. What worries you most about your pet's safety?</Label>
                <div className="space-y-2">
                  {["Getting lost", "Stolen", "Injured while outside"].map((worry) => (
                    <div key={worry} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`worry-${worry.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={safetyWorries?.includes(worry) || false}
                        onChange={(e) => {
                          const currentWorries = form.getValues("safetyWorries") || [];
                          if (e.target.checked) {
                            form.setValue("safetyWorries", [...currentWorries, worry]);
                          } else {
                            form.setValue("safetyWorries", currentWorries.filter(w => w !== worry));
                          }
                        }}
                        className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2"
                      />
                      <Label htmlFor={`worry-${worry.toLowerCase().replace(/\s+/g, "-")}`} className="cursor-pointer">{worry}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="worry-other"
                      checked={safetyWorries?.includes("Other") || false}
                      onChange={(e) => {
                        const currentWorries = form.getValues("safetyWorries") || [];
                        if (e.target.checked) {
                          form.setValue("safetyWorries", [...currentWorries, "Other"]);
                        } else {
                          form.setValue("safetyWorries", currentWorries.filter(w => w !== "Other"));
                        }
                      }}
                      className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2"
                    />
                    <Label htmlFor="worry-other" className="cursor-pointer">Other:</Label>
                    <Input
                      placeholder="Specify..."
                      value={form.watch("safetyWorriesOther") || ""}
                      onChange={(e) => form.setValue("safetyWorriesOther", e.target.value)}
                      className="flex-1 focus:ring-[#f4a905] focus:border-[#f4a905]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-safety" className="text-base font-medium">
                  8. What do you currently do to monitor or keep your pet safe?
                </Label>
                <Textarea
                  id="current-safety"
                  placeholder="Please describe your current safety measures..."
                  value={form.watch("currentSafetyMethods") || ""}
                  onChange={(e) => form.setValue("currentSafetyMethods", e.target.value)}
                  className="focus:ring-[#f4a905] focus:border-[#f4a905]"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-balance">Expectations for PAWhere</h2>
              <p className="text-gray-600 text-pretty">
                Tell us what features matter most to you and what you expect from our product.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  9. Which feature is MOST important to you? (Select up to 2)
                </Label>
                <div className="space-y-2">
                  {[
                    "GPS tracking accuracy",
                    "Long battery life",
                    "Geofencing alerts (when pet leaves safe zone)",
                    "Small & comfortable device size",
                    "Mobile app usability",
                    "Price",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={importantFeatures?.includes(feature) || false}
                        onChange={(e) => {
                          const currentFeatures = form.getValues("importantFeatures") || [];
                          if (e.target.checked && currentFeatures.length < 2) {
                            form.setValue("importantFeatures", [...currentFeatures, feature]);
                          } else if (!e.target.checked) {
                            form.setValue("importantFeatures", currentFeatures.filter(f => f !== feature));
                          }
                        }}
                        disabled={
                          (importantFeatures?.length || 0) >= 2 && !(importantFeatures?.includes(feature))
                        }
                        className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2 disabled:opacity-50"
                      />
                      <Label htmlFor={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`} className="cursor-pointer">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  10. What challenges do you expect from using a device like PAWhere?
                </Label>
                <div className="space-y-2">
                  {[
                    "Complicated setup",
                    "Battery charging too often",
                    "Weak signal or GPS coverage",
                    "Not comfortable for my pet",
                  ].map((challenge) => (
                    <div key={challenge} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`challenge-${challenge.toLowerCase().replace(/\s+/g, "-")}`}
                        checked={expectedChallenges?.includes(challenge) || false}
                        onChange={(e) => {
                          const currentChallenges = form.getValues("expectedChallenges") || [];
                          if (e.target.checked) {
                            form.setValue("expectedChallenges", [...currentChallenges, challenge]);
                          } else {
                            form.setValue("expectedChallenges", currentChallenges.filter(c => c !== challenge));
                          }
                        }}
                        className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2"
                      />
                      <Label htmlFor={`challenge-${challenge.toLowerCase().replace(/\s+/g, "-")}`} className="cursor-pointer">{challenge}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="challenge-other"
                      checked={expectedChallenges?.includes("Other") || false}
                      onChange={(e) => {
                        const currentChallenges = form.getValues("expectedChallenges") || [];
                        if (e.target.checked) {
                          form.setValue("expectedChallenges", [...currentChallenges, "Other"]);
                        } else {
                          form.setValue("expectedChallenges", currentChallenges.filter(c => c !== "Other"));
                        }
                      }}
                      className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 rounded focus:ring-[#f4a905] focus:ring-2"
                    />
                    <Label htmlFor="challenge-other" className="cursor-pointer">Other:</Label>
                    <Input
                      placeholder="Specify..."
                      value={form.watch("expectedChallengesOther") || ""}
                      onChange={(e) => form.setValue("expectedChallengesOther", e.target.value)}
                      className="flex-1 focus:ring-[#f4a905] focus:border-[#f4a905]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  11. On a scale of 1-10, how useful do you expect PAWhere to be for you?
                </Label>
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`rating-${rating}`}
                        name="usefulnessRating"
                        value={rating.toString()}
                        checked={form.watch("usefulnessRating") === rating}
                        onChange={(e) => {
                          if (e.target.checked) {
                            form.setValue("usefulnessRating", rating);
                          }
                        }}
                        className="w-4 h-4 text-[#f4a905] bg-gray-100 border-gray-300 focus:ring-[#f4a905] focus:ring-2 accent-[#f4a905]"
                      />
                      <Label htmlFor={`rating-${rating}`} className="cursor-pointer">{rating}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wish-feature" className="text-base font-medium">
                  12. What is one feature you wish PAWhere could have to make it perfect for you?
                </Label>
                <Textarea
                  id="wish-feature"
                  placeholder="Describe your ideal feature..."
                  value={form.watch("wishFeature") || ""}
                  onChange={(e) => form.setValue("wishFeature", e.target.value)}
                  className="focus:ring-[#f4a905] focus:border-[#f4a905]"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#f4a905]/10 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-[#f4a905]" />
              </div>
              <h2 className="text-2xl font-bold text-balance">You're All Set!</h2>
              <p className="text-gray-600 text-pretty">
                Thank you for taking the time to complete our onboarding survey. Your responses will help us provide you
                with the best possible experience with PAWhere.
              </p>
            </div>

            <Card className="bg-[#f4a905]/5 border-[#f4a905]/20">
              <CardHeader>
                <CardTitle className="text-lg">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#f4a905] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Account Setup</p>
                    <p className="text-sm text-gray-600">
                      We'll create your PAWhere account and send you a welcome email.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#f4a905] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Device Shipping</p>
                    <p className="text-sm text-gray-600">
                      You will be informed if you are selected to be our first tester.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#f4a905] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Setup Support</p>
                    <p className="text-sm text-gray-600">
                      Our team will guide you through the setup process to ensure everything works perfectly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="px-8 bg-[#f4a905] hover:bg-[#e09804] text-white"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Completing..." : "Complete Onboarding"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  const dialogContent = (
    <div className="min-h-[80vh] bg-gradient-to-br from-white to-gray-50/50 rounded-lg">
      <div className="max-w-2xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#f4a905] h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()}>
                {renderStep()}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center bg-transparent border-gray-300 hover:border-[#f4a905] hover:text-[#f4a905]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()} 
              className="flex items-center bg-[#f4a905] hover:bg-[#e09804] text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-0">
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-0">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
