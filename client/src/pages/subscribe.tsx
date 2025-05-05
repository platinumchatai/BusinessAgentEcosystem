import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email"),
  serviceLevel: z.enum(["basic", "premium", "enterprise"], {
    required_error: "Please select a service level",
  }),
});

type FormData = z.infer<typeof formSchema>;

const servicePrices = {
  basic: 29.99,
  premium: 99.99,
  enterprise: 299.99,
};

const CheckoutForm = ({ paymentData }: { paymentData: FormData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, navigate] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! Your account has been created.",
      });
      navigate("/");
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
          <div className="flex justify-between">
            <span>{paymentData.serviceLevel.charAt(0).toUpperCase() + paymentData.serviceLevel.slice(1)} Plan</span>
            <span>${servicePrices[paymentData.serviceLevel]}</span>
          </div>
        </div>
        
        <PaymentElement />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${servicePrices[paymentData.serviceLevel]}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentData, setPaymentData] = useState<FormData | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      serviceLevel: "basic",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Create payment intent with account creation data
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: servicePrices[data.serviceLevel],
        serviceLevel: data.serviceLevel,
        username: data.username,
        password: data.password,
        email: data.email,
      });
      
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setPaymentData(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-700 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          {!clientSecret ? (
            <Card>
              <CardHeader>
                <CardTitle>Subscribe to Our Service</CardTitle>
                <CardDescription>
                  Create an account and select your service level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter your email" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Level</FormLabel>
                          <div className="grid grid-cols-3 gap-4">
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer text-center ${
                                field.value === "basic" ? "border-blue-500 bg-blue-50" : ""
                              }`}
                              onClick={() => form.setValue("serviceLevel", "basic")}
                            >
                              <div className="font-semibold">Basic</div>
                              <div className="text-xl font-bold">$29.99</div>
                              <div className="text-sm text-gray-500">Monthly</div>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer text-center ${
                                field.value === "premium" ? "border-blue-500 bg-blue-50" : ""
                              }`}
                              onClick={() => form.setValue("serviceLevel", "premium")}
                            >
                              <div className="font-semibold">Premium</div>
                              <div className="text-xl font-bold">$99.99</div>
                              <div className="text-sm text-gray-500">Monthly</div>
                            </div>
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer text-center ${
                                field.value === "enterprise" ? "border-blue-500 bg-blue-50" : ""
                              }`}
                              onClick={() => form.setValue("serviceLevel", "enterprise")}
                            >
                              <div className="font-semibold">Enterprise</div>
                              <div className="text-xl font-bold">$299.99</div>
                              <div className="text-sm text-gray-500">Monthly</div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full mt-6" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Continue to Payment"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>
                  Enter your payment details to complete your subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm paymentData={paymentData!} />
                </Elements>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="text-white p-6 hidden md:block">
          <h1 className="text-4xl font-bold mb-4">Premium Business Intelligence</h1>
          <p className="text-xl mb-6">
            Subscribe to unlock the full potential of our AI-powered business agents.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <p className="text-lg">Full access to all business agents</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <p className="text-lg">Unlimited AI-generated business strategies</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <p className="text-lg">Priority access to new features and agents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}