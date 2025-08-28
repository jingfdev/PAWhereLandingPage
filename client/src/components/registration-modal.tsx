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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  isVip: z.boolean().default(false),
  
  // Section 1: Background Information
  ownsPet: z.enum(["yes", "no"], { required_error: "Please select an option" }),
  petType: z.array(z.string()).optional(),
  petTypeOther: z.string().optional(),
  outdoorFrequency: z.enum(["rarely", "sometimes", "often"]).optional(),
  hasLostPet: z.enum(["yes", "no"]).optional(),
  howFoundPet: z.string().optional(),
  
  // Section 2: Current Solutions & Pain Points
  usesTrackingSolution: z.enum(["yes", "no"]).optional(),
  trackingSolutionDetails: z.string().optional(),
  safetyWorries: z.array(z.string()).optional(),
  safetyWorriesOther: z.string().optional(),
  currentSafetyMethods: z.string().optional(),
  
  // Section 3: Expectations for PAWhere
  importantFeatures: z.array(z.string()).optional(),
  expectedChallenges: z.array(z.string()).optional(),
  expectedChallengesOther: z.string().optional(),
  usefulnessRating: z.number().min(1).max(10).optional(),
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      phone: "",
      isVip: isVip,
      ownsPet: undefined,
      petType: [],
      petTypeOther: "",
      outdoorFrequency: undefined,
      hasLostPet: undefined,
      howFoundPet: "",
      usesTrackingSolution: undefined,
      trackingSolutionDetails: "",
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
      return await apiRequest("POST", "/api/register", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "We'll contact you soon with early access details.",
        variant: "default",
      });
      form.reset();
      setOpen(false);
      if (onClose) {
        onClose();
      }
      queryClient.invalidateQueries({ queryKey: ["/api/register"] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Something went wrong. Please try again.";
      if (error.message.includes("Email already registered")) {
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

  const onSubmit = (data: RegistrationData) => {
    registerMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const dialogContent = (
    <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
      <DialogHeader>
        <div className="text-center mb-6">
          <div className="bg-primary-yellow rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-brand-white text-2xl">🐾</span>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            {isVip ? "Join Our VIP Testers!" : "Join the Pack!"}
          </DialogTitle>
          <p className="text-gray-600">
            {isVip 
              ? "Get exclusive early access and help shape the future of pet safety" 
              : "Get early access to PAWhere and help us understand your needs"
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please take a moment to answer a few questions so we can better tailor PAWhere to your needs.
          </p>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="rounded-xl focus:ring-primary-yellow"
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
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(+855) 123-4567"
                      className="rounded-xl focus:ring-primary-yellow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 1: Background Information */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Section 1: Background Information</h3>
            
            <FormField
              control={form.control}
              name="ownsPet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Do you currently own a pet?</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="yes"
                          checked={field.value === "yes"}
                          onChange={() => field.onChange("yes")}
                          className="text-primary-yellow"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="no"
                          checked={field.value === "no"}
                          onChange={() => field.onChange("no")}
                          className="text-primary-yellow"
                        />
                        No
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("ownsPet") === "yes" && (
              <>
                <FormField
                  control={form.control}
                  name="petType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. If yes, what type of pet(s) do you own?</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {["Dog", "Cat"].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={field.value?.includes(type) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...(field.value || []), type]);
                                  } else {
                                    field.onChange(field.value?.filter(v => v !== type) || []);
                                  }
                                }}
                              />
                              {type}
                            </label>
                          ))}
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={field.value?.includes("other") || false}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), "other"]);
                                } else {
                                  field.onChange(field.value?.filter(v => v !== "other") || []);
                                }
                              }}
                            />
                            <span>Other:</span>
                            <Input
                              placeholder="Specify"
                              className="w-32 h-8 text-sm"
                              {...form.register("petTypeOther")}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outdoorFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>3. How often does your pet go outdoors?</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {[
                            { value: "rarely", label: "Rarely (mostly indoors)" },
                            { value: "sometimes", label: "Sometimes (walks / play)" },
                            { value: "often", label: "Often (roams freely)" }
                          ].map((option) => (
                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value={option.value}
                                checked={field.value === option.value}
                                onChange={() => field.onChange(option.value)}
                                className="text-primary-yellow"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasLostPet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>4. Have you ever lost your pet before?</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="yes"
                              checked={field.value === "yes"}
                              onChange={() => field.onChange("yes")}
                              className="text-primary-yellow"
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="no"
                              checked={field.value === "no"}
                              onChange={() => field.onChange("no")}
                              className="text-primary-yellow"
                            />
                            No
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("hasLostPet") === "yes" && (
                  <FormField
                    control={form.control}
                    name="howFoundPet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>5. If yes, how did you find your pet (or did you)?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe how you found your pet..."
                            className="rounded-xl focus:ring-primary-yellow"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}
          </div>

          {/* Section 2: Current Solutions & Pain Points */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Section 2: Current Solutions & Pain Points</h3>
            
            <FormField
              control={form.control}
              name="usesTrackingSolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>6. Do you currently use any tracking solution for your pet?</FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="yes"
                          checked={field.value === "yes"}
                          onChange={() => field.onChange("yes")}
                          className="text-primary-yellow"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="no"
                          checked={field.value === "no"}
                          onChange={() => field.onChange("no")}
                          className="text-primary-yellow"
                        />
                        No
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("usesTrackingSolution") === "yes" && (
              <FormField
                control={form.control}
                name="trackingSolutionDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., GPS collar, microchip, etc."
                        className="rounded-xl focus:ring-primary-yellow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="safetyWorries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>7. What worries you most about your pet's safety?</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {["Getting lost", "Stolen", "Injured while outside"].map((worry) => (
                        <label key={worry} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={field.value?.includes(worry) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), worry]);
                              } else {
                                field.onChange(field.value?.filter(v => v !== worry) || []);
                              }
                            }}
                          />
                          {worry}
                        </label>
                      ))}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value?.includes("other") || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value || []), "other"]);
                            } else {
                              field.onChange(field.value?.filter(v => v !== "other") || []);
                            }
                          }}
                        />
                        <span>Other:</span>
                        <Input
                          placeholder="Specify"
                          className="flex-1 h-8 text-sm"
                          {...form.register("safetyWorriesOther")}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentSafetyMethods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>8. What do you currently do to monitor or keep your pet safe?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your current methods..."
                      className="rounded-xl focus:ring-primary-yellow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 3: Expectations for PAWhere */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Section 3: Expectations for PAWhere</h3>
            
            <FormField
              control={form.control}
              name="importantFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>9. Which feature is MOST important to you? (Select up to 2)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {[
                        "GPS tracking accuracy",
                        "Long battery life",
                        "Geofencing alerts (when pet leaves safe zone)",
                        "Small & comfortable device size",
                        "Mobile app usability",
                        "Price"
                      ].map((feature) => (
                        <label key={feature} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={field.value?.includes(feature) || false}
                            onCheckedChange={(checked) => {
                              if (checked && (field.value?.length || 0) < 2) {
                                field.onChange([...(field.value || []), feature]);
                              } else if (!checked) {
                                field.onChange(field.value?.filter(v => v !== feature) || []);
                              }
                            }}
                            disabled={(field.value?.length || 0) >= 2 && !field.value?.includes(feature)}
                          />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedChallenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>10. What challenges do you expect from using a device like PAWhere?</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {[
                        "Complicated setup",
                        "Battery charging too often",
                        "Weak signal or GPS coverage",
                        "Not comfortable for my pet"
                      ].map((challenge) => (
                        <label key={challenge} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={field.value?.includes(challenge) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), challenge]);
                              } else {
                                field.onChange(field.value?.filter(v => v !== challenge) || []);
                              }
                            }}
                          />
                          {challenge}
                        </label>
                      ))}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value?.includes("other") || false}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...(field.value || []), "other"]);
                            } else {
                              field.onChange(field.value?.filter(v => v !== "other") || []);
                            }
                          }}
                        />
                        <span>Other:</span>
                        <Input
                          placeholder="Specify"
                          className="flex-1 h-8 text-sm"
                          {...form.register("expectedChallengesOther")}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usefulnessRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>11. On a scale of 1-10, how useful do you expect PAWhere to be for you? (1 = Not useful at all, 10 = Extremely useful)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <label key={rating} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            value={rating}
                            checked={field.value === rating}
                            onChange={() => field.onChange(rating)}
                            className="text-primary-yellow"
                          />
                          {rating}
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wishFeature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>12. What is one feature you wish PAWhere could have to make it perfect for you?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your ideal feature..."
                      className="rounded-xl focus:ring-primary-yellow"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
              isVip
                ? "bg-primary-blue hover:bg-blue-700 text-white"
                : "bg-primary-yellow hover:bg-yellow-500 text-brand-black"
            }`}
          >
            {registerMutation.isPending ? (
              <>
                <span className="animate-spin mr-2">⭘</span>
                Submitting...
              </>
            ) : (
              <>
                {isVip ? "Become a VIP Tester" : "Get Early Access"}
                <span className="ml-2">{isVip ? "👑" : "→"}</span>
              </>
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {dialogContent}
    </Dialog>
  );
}
