"use client";

import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Check, Star, Users, Target, Calendar, MessageSquare, Award, Clock } from "lucide-react";

export default function CoachingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 299,
      period: "month",
      description: "Perfect for beginners starting their fitness journey",
      features: [
        "3 personalized workouts per week",
        "Basic nutrition guidelines",
        "Email support",
        "Progress tracking",
        "Mobile app access",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 599,
      period: "month",
      description: "For serious athletes ready to transform",
      features: [
        "5 personalized workouts per week",
        "Custom meal plans",
        "Priority email & chat support",
        "Weekly progress reviews",
        "Video form checks",
        "Supplement recommendations",
      ],
      popular: true,
    },
    {
      id: "elite",
      name: "Elite",
      price: 999,
      period: "month",
      description: "Ultimate 1-on-1 coaching experience",
      features: [
        "Daily personalized workouts",
        "Fully customized meal plans",
        "24/7 coach access",
        "Bi-weekly video calls",
        "Advanced analytics dashboard",
        "Supplement stack guidance",
      ],
    },
  ];

  const coaches = [
    {
      name: "Sarah Martinez",
      specialty: "Strength & Conditioning",
      experience: "8 years",
      clients: "200+",
      image: "https://ui-avatars.com/api/?name=Sarah+Martinez&background=3B82F6&color=ffffff&size=200",
      rating: 4.9,
    },
    {
      name: "Michael Chen",
      specialty: "Weight Loss & Nutrition",
      experience: "10 years",
      clients: "350+",
      image: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=ffffff&size=200",
      rating: 4.8,
    },
    {
      name: "Emma Johnson",
      specialty: "Athletic Performance",
      experience: "6 years",
      clients: "150+",
      image: "https://ui-avatars.com/api/?name=Emma+Johnson&background=F59E0B&color=ffffff&size=200",
      rating: 4.9,
    },
  ];

  const benefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Plans",
      description: "Custom workout and nutrition plans tailored to your specific goals",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Flexible Scheduling",
      description: "Workout on your own time with plans that fit your lifestyle",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Expert Support",
      description: "Direct access to certified coaches for guidance and motivation",
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Proven Results",
      description: "Join hundreds of clients who have achieved their fitness goals",
      color: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 rounded-full">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">TRUSTED BY 1,000+ CLIENTS</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Personal <span className="bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">Fitness Coaching</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Get 1-on-1 guidance from certified experts. Achieve your fitness goals with personalized plans and continuous support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">FitHub Coaching</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a successful fitness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex p-4 rounded-2xl ${benefit.color} mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, <span className="text-blue-600">Transparent</span> Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your goals and budget
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-amber-600 text-white font-bold text-sm rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-blue-600">Expert Coaches</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Certified professionals dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coaches.map((coach) => (
              <div 
                key={coach.name}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md"
                  />
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(coach.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-gray-600 text-sm ml-2">{coach.rating}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900">{coach.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">{coach.specialty}</p>
                  
                  <div className="flex gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{coach.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{coach.clients}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}