"use client";

import { Section, SectionHeader } from "../../components/ui/Section";
import { Target, Users, Award, TrendingUp, Heart, Star, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Active Members", value: "10,000+", icon: Users, color: "text-blue-600" },
    { label: "Products", value: "130+", icon: Award, color: "text-amber-600" },
    { label: "Success Stories", value: "500+", icon: TrendingUp, color: "text-emerald-600" },
    { label: "Years Experience", value: "5+", icon: Target, color: "text-violet-600" },
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality First",
      description: "We partner with trusted brands to bring you premium fitness equipment",
      color: "border-blue-200"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Your Success",
      description: "Your fitness journey is our mission. We provide personalized coaching",
      color: "border-amber-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Join a thriving community of fitness enthusiasts who motivate each other",
      color: "border-emerald-200"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "Leveraging technology and ML for personalized recommendations",
      color: "border-violet-200"
    },
  ];

  const team = [
    {
      name: "Rassil",
      role: "Founder & CEO",
      image: "https://ui-avatars.com/api/?name=Rassil&background=3B82F6&color=ffffff&size=200",
      bio: "Passionate about fitness and technology",
    },
    {
      name: "Alex Morgan",
      role: "Head of Coaching",
      image: "https://ui-avatars.com/api/?name=Alex+Morgan&background=F59E0B&color=ffffff&size=200",
      bio: "Certified fitness expert with 10+ years experience",
    },
    {
      name: "Sarah Chen",
      role: "Product Manager",
      image: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10B981&color=ffffff&size=200",
      bio: "Curating the best fitness equipment for you",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-blue-500"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 shadow-sm">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-700 font-medium">SINCE 2019</span>
          </div>
          
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-amber-600 to-blue-600 bg-clip-text text-transparent">
              About FitHub
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Empowering fitness journeys worldwide with premium equipment, expert coaching, 
            and a community that celebrates every victory.
          </p>
          
          <div className="flex items-center justify-center gap-6">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <div className="text-gray-500 font-medium">• Elevate Your Potential •</div>
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse delay-150"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-2xl p-8 text-center group hover:border-gray-300 hover:shadow-xl transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-100 mb-6 ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="font-bold text-4xl text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"></div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Mission</span>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"></div>
            </div>
            <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Transforming Lives Through <span className="text-blue-600">Fitness</span>
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  At FitHub, we believe that everyone deserves access to quality fitness equipment 
                  and expert guidance. Our mission is to make fitness accessible, enjoyable, and 
                  effective for people of all levels.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We combine cutting-edge technology with human expertise to provide personalized 
                  recommendations, coaching plans, and a supportive community that helps you reach 
                  your goals.
                </p>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-amber-500 rounded-2xl blur-xl opacity-10"></div>
                  <div className="relative p-8 bg-white rounded-xl border border-gray-200">
                    <Heart className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <p className="text-gray-700 text-center text-lg italic">
                      "Every journey begins with a single step. We're here for every step of yours."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-3">
              Our <span className="text-blue-600">Core Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 border ${value.color} hover:shadow-xl transition-all duration-300 group`}
              >
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-gray-800">
                    {value.icon}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"></div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"></div>
            </div>
            <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-3">
              Passionate <span className="text-blue-600">Experts</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The dedicated team behind your fitness success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-amber-500 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-6 border border-gray-200 group-hover:border-gray-300 group-hover:shadow-xl transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full blur opacity-20"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-24 h-24 rounded-full mx-auto border-4 border-white group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 text-center mb-2">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium text-center mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-3">
                Our <span className="text-blue-600">Story</span>
              </h2>
              <p className="text-gray-600">How FitHub transformed from an idea into a movement</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 mt-2"></div>
                <p className="text-gray-700">
                  FitHub started in 2019 with a simple idea: make quality fitness equipment and expert coaching accessible to everyone. Our founder, passionate about both fitness and technology, noticed that many people struggled to find the right equipment and guidance for their fitness journey.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 mt-2"></div>
                <p className="text-gray-700">
                  We partnered with leading brands to curate a selection of premium equipment. But we didn't stop there – we built a platform that uses machine learning to provide personalized product recommendations based on your goals and preferences.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-amber-500 mt-2"></div>
                <p className="text-gray-700">
                  Today, FitHub serves thousands of fitness enthusiasts with our e-commerce platform and personalized coaching services. We're proud to be part of your fitness transformation and committed to helping you achieve your goals, one rep at a time.
                </p>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 italic text-lg">
                  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}