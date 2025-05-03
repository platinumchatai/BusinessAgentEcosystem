import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import MainLayout from '@/layouts/MainLayout';
import { Check, User, CreditCard, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Mock ReCAPTCHA component since we don't have a real key
const MockReCAPTCHA = ({ onChange }: { onChange: (token: string | null) => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-gray-200 bg-gray-50 rounded-md">
      <div className="text-sm text-gray-700 font-medium mb-2">reCAPTCHA verification</div>
      <button 
        onClick={() => onChange('mock-token-123')}
        className="px-4 py-1 bg-gray-200 rounded-md text-sm"
      >
        I'm not a robot
      </button>
    </div>
  );
};

// Define subscription tiers
const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter Tier',
    description: 'Essential Platinum Chat AI experience for beginners',
    price: '$49',
    frequency: 'month',
    features: [
      'Access to 3 AI Agents of your choice',
      'Unlimited conversations with your selected agents',
      'Basic document formatting by Editor-in-Chief',
      'Export documents in HTML format',
      'Email support',
      'Limited to 100 queries per month'
    ],
    limitations: [
      'No workflow automations',
      'Limited export formats',
      'Basic support only'
    ],
    recommended: false,
    buttonText: 'Get Started'
  },
  {
    id: 'growth',
    name: 'Growth Tier',
    description: 'Expanded Platinum Chat AI capabilities for growing businesses',
    price: '$79',
    frequency: 'month',
    features: [
      'Access to 5 AI Agents of your choice',
      '1 Workflow automation of your choice',
      'Unlimited conversations with your selected agents',
      'Advanced document formatting by Editor-in-Chief',
      'Export in multiple formats (HTML, PDF, DOCX)',
      'Priority email support',
      'Up to 250 queries per month'
    ],
    limitations: [
      'Limited workflow access',
      'Limited number of agents'
    ],
    recommended: true,
    buttonText: 'Subscribe Now'
  },
  {
    id: 'accelerator',
    name: 'Accelerator Tier',
    description: 'Full Platinum Chat AI ecosystem for maximum growth',
    price: '$129',
    frequency: 'month',
    features: [
      'Access to all 16 AI Agents',
      'All 4 Workflow automations',
      'Unlimited conversations with all agents',
      'Premium document formatting by Editor-in-Chief',
      'Export in all formats',
      'Priority email & chat support',
      'Unlimited queries per month'
    ],
    limitations: [],
    recommended: false,
    buttonText: 'Scale Now'
  }
];

const Subscribe = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(1); // Default to Professional plan
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    nameOnCard: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    agreeTerms: false,
    username: ''
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaVerified(!!token);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) { // Account creation validation
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (!formData.username) newErrors.username = 'Username is required';
      
      if (!captchaVerified) newErrors.captcha = 'Please verify you are not a robot';
    }
    
    if (step === 1) { // Payment validation
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
      
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Use MM/YY format';
      
      if (!formData.cvc) newErrors.cvc = 'CVC is required';
      else if (!/^\d{3,4}$/.test(formData.cvc)) newErrors.cvc = 'Invalid CVC';
      
      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
      
      if (!formData.billingAddress) newErrors.billingAddress = 'Billing address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
      
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (validateForm(tabIndex)) {
      setTabIndex(tabIndex + 1);
    }
  };
  
  const handlePrevStep = () => {
    setTabIndex(tabIndex - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(tabIndex)) {
      alert('Subscription successful! In a real implementation, this would process the payment and create your account.');
      // Here we would submit to API, process payment, etc.
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Subscribe to Business Agency AI</h1>
          <p className="text-gray-800 font-medium text-lg">
            Get access to our advanced AI agent ecosystem and transform how you build and grow your business
          </p>
        </div>
        
        {/* Plan Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {subscriptionPlans.map((plan, index) => (
            <div 
              key={plan.id}
              className={cn(
                "bg-white rounded-lg overflow-hidden border transition-all",
                selectedPlan === index 
                  ? "border-blue-600 shadow-md transform scale-[1.02]" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setSelectedPlan(index)}
            >
              {plan.recommended && (
                <div className="bg-accent text-white text-center py-2 text-sm font-medium">
                  Recommended Plan
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                <p className="text-gray-700 mt-2 text-sm font-medium">{plan.description}</p>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-700 ml-1 text-lg font-medium">/{plan.frequency}</span>
                </div>
                
                <Button 
                  className={cn(
                    "w-full mt-6 py-3 rounded-full font-medium shadow-sm",
                    selectedPlan === index 
                      ? "bg-accent hover:bg-accent/90 text-white" 
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedPlan(index)}
                >
                  {selectedPlan === index ? 'Selected' : plan.buttonText}
                </Button>
                
                <div className="mt-8">
                  <h4 className="font-medium mb-3 text-gray-800">Features:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start">
                            <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 font-medium">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Subscription Form with Tabs */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Complete Your {subscriptionPlans[selectedPlan].name} Subscription
            </h2>
            <p className="text-gray-800 font-medium mt-2">
              {subscriptionPlans[selectedPlan].price}/{subscriptionPlans[selectedPlan].frequency} - {subscriptionPlans[selectedPlan].description}
            </p>
          </div>
          
          <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
            <Tab.List className="flex px-4 py-2 bg-gray-50 border-b border-gray-200">
              <Tab
                className={({ selected }) =>
                  cn(
                    "flex items-center py-3 px-6 text-sm font-medium outline-none rounded-full transition-all",
                    selected
                      ? "text-white bg-accent shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <User className="w-4 h-4 mr-2" />
                Account
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    "flex items-center py-3 px-6 text-sm font-medium outline-none rounded-full transition-all",
                    selected
                      ? "text-white bg-accent shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payment
              </Tab>
              <Tab
                className={({ selected }) =>
                  cn(
                    "flex items-center py-3 px-6 text-sm font-medium outline-none rounded-full transition-all",
                    selected
                      ? "text-white bg-accent shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <Shield className="w-4 h-4 mr-2" />
                Confirmation
              </Tab>
            </Tab.List>
            
            <Tab.Panels>
              {/* Account Creation Panel */}
              <Tab.Panel>
                <form className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={errors.username ? "border-red-500" : ""}
                      />
                      {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                    

                    
                    {/* CAPTCHA verification */}
                    <div className="mt-6">
                      <MockReCAPTCHA onChange={handleCaptchaChange} />
                      {errors.captcha && <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-accent hover:bg-accent/90 rounded-full px-6 py-2.5 font-medium shadow-sm text-white"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </Tab.Panel>
              
              {/* Payment Information Panel */}
              <Tab.Panel>
                <form className="p-6" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Card Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nameOnCard">Name on Card</Label>
                          <Input
                            id="nameOnCard"
                            name="nameOnCard"
                            placeholder="John Doe"
                            value={formData.nameOnCard}
                            onChange={handleInputChange}
                            className={errors.nameOnCard ? "border-red-500" : ""}
                          />
                          {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
                        </div>
                        
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className={errors.cardNumber ? "border-red-500" : ""}
                          />
                          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className={errors.expiryDate ? "border-red-500" : ""}
                            />
                            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input
                              id="cvc"
                              name="cvc"
                              placeholder="123"
                              value={formData.cvc}
                              onChange={handleInputChange}
                              className={errors.cvc ? "border-red-500" : ""}
                            />
                            {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="billingAddress">Street Address</Label>
                          <Input
                            id="billingAddress"
                            name="billingAddress"
                            placeholder="123 Main St"
                            value={formData.billingAddress}
                            onChange={handleInputChange}
                            className={errors.billingAddress ? "border-red-500" : ""}
                          />
                          {errors.billingAddress && <p className="text-red-500 text-xs mt-1">{errors.billingAddress}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              placeholder="New York"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={errors.city ? "border-red-500" : ""}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              placeholder="NY"
                              value={formData.state}
                              onChange={handleInputChange}
                              className={errors.state ? "border-red-500" : ""}
                            />
                            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              placeholder="10001"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className={errors.zipCode ? "border-red-500" : ""}
                            />
                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                          </div>
                          
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <select
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                              <option value="Germany">Germany</option>
                              <option value="France">France</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700 font-medium">
                        I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevStep}
                      className="rounded-full px-6 border-gray-300 hover:bg-gray-50"
                    >
                      Back to Account
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-accent hover:bg-accent/90 rounded-full px-6 py-2.5 font-medium shadow-sm text-white"
                    >
                      Review Order
                    </Button>
                  </div>
                </form>
              </Tab.Panel>
              
              {/* Confirmation Panel */}
              <Tab.Panel>
                <div className="p-6">
                  <div className="p-4 bg-green-50 rounded-md border border-green-100 mb-6">
                    <h3 className="text-green-700 font-medium flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Almost done! Please review your subscription details
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Subscription Details</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 font-medium">Plan:</span>
                          <span className="font-medium">{subscriptionPlans[selectedPlan].name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 font-medium">Price:</span>
                          <span className="font-medium">{subscriptionPlans[selectedPlan].price}/{subscriptionPlans[selectedPlan].frequency}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 font-medium">Billing Cycle:</span>
                          <span className="font-medium">Monthly</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                          <span className="text-gray-700 font-medium">Total:</span>
                          <span className="font-bold">{subscriptionPlans[selectedPlan].price}/{subscriptionPlans[selectedPlan].frequency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Account Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="mb-2">
                            <span className="text-gray-700 font-medium">Username:</span>
                            <span className="font-medium block">{formData.username || 'Not provided'}</span>
                          </div>
                          <div className="mb-2">
                            <span className="text-gray-700 font-medium">Email:</span>
                            <span className="font-medium block">{formData.email || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-gray-700 font-medium">Name:</span>
                            <span className="font-medium block">
                              {formData.firstName && formData.lastName
                                ? `${formData.firstName} ${formData.lastName}`
                                : 'Not provided'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="mb-2">
                            <span className="text-gray-700 font-medium">Card:</span>
                            <span className="font-medium block">
                              {formData.cardNumber
                                ? `**** **** **** ${formData.cardNumber.slice(-4)}`
                                : 'Not provided'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-700 font-medium">Billing Address:</span>
                            <span className="font-medium block">
                              {formData.billingAddress
                                ? `${formData.billingAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                                : 'Not provided'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700 font-medium mb-6">
                        By clicking "Complete Subscription", you agree to subscribe to the {subscriptionPlans[selectedPlan].name}. Your payment method will be charged {subscriptionPlans[selectedPlan].price} monthly until you cancel. You can cancel anytime from your account settings.
                      </p>
                      
                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevStep}
                          className="rounded-full px-6 border-gray-300 hover:bg-gray-50"
                        >
                          Back to Payment
                        </Button>
                        
                        <Button
                          type="button"
                          onClick={handleSubmit}
                          className="bg-accent hover:bg-accent/90 rounded-full px-6 py-2.5 font-medium shadow-sm text-white"
                        >
                          Complete Subscription
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscribe;