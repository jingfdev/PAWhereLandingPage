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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const registrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  isVip: z.boolean().default(false),
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
      if (onClose) onClose();
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
    <DialogContent className="max-w-md">
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
              : "Get early access to PAWhere and keep your pet safe"
            }
          </p>
        </div>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="+1 (555) 123-4567"
                    className="rounded-xl focus:ring-primary-yellow"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
