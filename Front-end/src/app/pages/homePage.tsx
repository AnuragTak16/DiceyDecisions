import React, { useState, useEffect, useRef } from "react";
import {
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Users,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Heart,
  Triangle,
  Square,
  Circle,
} from "lucide-react";

export default function DiceyDecisionsHome() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [diceSequence, setDiceSequence] = useState([Dice1, Dice6]);
  const [particleCount, setParticleCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  const handlesignupClick = () => {
    console.log("Navigate to signup");
  };
  const handlesigninClick = () => {
    console.log("Navigate to login");
  };

  const quotes = [
    {
      text: "Stop overthinking, start deciding!",
      emoji: "🎲",
      color: "from-purple-400 to-pink-500",
    },
    {
      text: "Where friends meet, decisions get made!",
      emoji: "✨",
      color: "from-blue-400 to-purple-500",
    },
    {
      text: "Turn group chaos into fun choices!",
      emoji: "🎯",
      color: "from-pink-400 to-purple-500",
    },
    {
      text: "Let fate decide when you can't!",
      emoji: "🎪",
      color: "from-purple-500 to-blue-500",
    },
    {
      text: "Democracy meets randomness!",
      emoji: "🗳️",
      color: "from-blue-500 to-pink-500",
    },
  ];

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const shapes = [Triangle, Square, Circle, Heart, Star];

  const features = [
    {
      icon: Users,
      text: "Group Decision Making",
      description: "Bring everyone together",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      text: "Instant Results",
      description: "No more endless debates",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: Clock,
      text: "Save Time & Energy",
      description: "Quick & efficient choices",
      gradient: "from-pink-500 to-blue-500",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const dice1 = diceIcons[Math.floor(Math.random() * diceIcons.length)];
      const dice2 = diceIcons[Math.floor(Math.random() * diceIcons.length)];
      setDiceSequence([dice1, dice2]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const createParticleBurst = () => {
    setParticleCount((prev) => prev + 1);
    setTimeout(() => setParticleCount((prev) => prev - 1), 3000);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
          rgba(147, 51, 234, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, 
          #1e1b4b 0%, 
          #581c87 25%, 
          #be185d 50%, 
          #3730a3 75%, 
          #1e1b4b 100%)
        `,
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern
              id="dice-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="20"
                cy="20"
                r="3"
                fill="white"
                className="animate-pulse"
              />
              <circle
                cx="50"
                cy="50"
                r="2"
                fill="white"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <circle
                cx="80"
                cy="20"
                r="3"
                fill="white"
                className="animate-pulse"
                style={{ animationDelay: "2s" }}
              />
              <circle
                cx="20"
                cy="80"
                r="2"
                fill="white"
                className="animate-pulse"
                style={{ animationDelay: "3s" }}
              />
              <rect
                x="40"
                y="40"
                width="20"
                height="20"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                className="animate-spin-slow"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dice-pattern)" />
        </svg>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((Shape, index) => (
          <div
            key={`shape-${index}`}
            className="absolute motion-safe:animate-float-complex"
            style={{
              top: `${index * 20 + 10}%`,
              left: `${index * 25 + 5}%`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${6 + index}s`,
              transform: `translate(${mousePosition.x * 30 - scrollY * 0.1}px, ${mousePosition.y * 30}px) rotate(${scrollY * 0.1}deg)`,
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Shape
              className="w-12 h-12 text-white opacity-20 motion-safe:animate-pulse-smooth"
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          </div>
        ))}

        {/* Particle Burst Effects */}
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute motion-safe:animate-particle-burst"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%)`,
            }}
          >
            {[...Array(16)].map((_, j) => (
              <div
                key={j}
                className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full motion-safe:animate-particle-float"
                style={{
                  transform: `translate(${Math.cos((j * 22.5 * Math.PI) / 180) * 120}px, ${Math.sin((j * 22.5 * Math.PI) / 180) * 120}px)`,
                  animationDelay: `${j * 0.05}s`,
                  opacity: 0.8,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="flex justify-center items-center mb-8 perspective-1000">
            <div
              className="motion-safe:animate-dice-3d mr-8"
              style={{
                transform: `rotateY(${scrollY * 0.5}deg) rotateX(${mousePosition.y * 10}deg)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              {React.createElement(diceSequence[0], {
                className:
                  "w-24 h-24 text-purple-400 drop-shadow-2xl filter brightness-110",
              })}
            </div>

            <div className="relative">
              <h1
                className="text-6xl md:text-9xl font-black text-transparent bg-clip-text motion-safe:animate-gradient-wave"
                style={{
                  backgroundImage:
                    "linear-gradient(-45deg, #8b5cf6, #ec4899, #3b82f6, #a855f7, #f97316, #8b5cf6)",
                  backgroundSize: "400% 400%",
                  transform: `scale(${1 + Math.sin(Date.now() * 0.001) * 0.05})`,
                }}
              >
                DiceyDecisions
              </h1>
              <div className="absolute inset-0 motion-safe:animate-pulse-glow">
                <h1 className="text-6xl md:text-9xl font-black text-white opacity-10 blur-sm">
                  DiceyDecisions
                </h1>
              </div>
            </div>

            <div
              className="motion-safe:animate-dice-3d-reverse ml-8"
              style={{
                transform: `rotateY(${-scrollY * 0.5}deg) rotateX(${-mousePosition.y * 10}deg)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              {React.createElement(diceSequence[1], {
                className:
                  "w-24 h-24 text-pink-400 drop-shadow-2xl filter brightness-110",
              })}
            </div>
          </div>

          {/* Dynamic Quotes */}
          <div className="h-32 flex items-center justify-center relative">
            <div
              key={currentQuote}
              className="absolute inset-0 flex items-center justify-center motion-safe:animate-fade-in-scale"
            >
              <div
                className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${quotes[currentQuote].color} bg-clip-text text-transparent flex items-center space-x-4`}
              >
                <span className="text-4xl motion-safe:animate-bounce-smooth">
                  {quotes[currentQuote].emoji}
                </span>
                <span className="motion-safe:animate-text-wave">
                  {quotes[currentQuote].text}
                </span>
                <span
                  className="text-4xl motion-safe:animate-bounce-smooth"
                  style={{ animationDelay: "0.5s" }}
                >
                  {quotes[currentQuote].emoji}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="text-center mb-20">
          <div className="relative">
            <h2
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight motion-safe:animate-float-gentle"
              style={{
                transform: `translateY(${scrollY * -0.1}px)`,
                textShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
              }}
            >
              Gamified Decision Making
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent motion-safe:animate-gradient-wave">
                  For Friend Groups
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 motion-safe:animate-pulse-glow rounded-full"></div>
              </span>
            </h2>
            <p
              className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed motion-safe:animate-fade-in-up"
              style={{
                animationDelay: "0.3s",
                transform: `translateY(${scrollY * -0.05}px)`,
              }}
            >
              Stop wasting time on group decisions! Create rooms, vote
              anonymously, and let dice, spinners, or coin flips break the ties
              with{" "}
              <span className="text-pink-400 font-semibold motion-safe:animate-pulse-smooth">
                spectacular style
              </span>
              .
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden motion-safe:animate-slide-in-stagger"
              style={{
                animationDelay: `${index * 200}ms`,
                transform: `translateY(${scrollY * -0.02}px)`,
              }}
            >
              <div className="relative bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 text-center transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 border border-white border-opacity-20 hover:border-opacity-40 motion-safe:animate-fade-in-up shadow-2xl hover:shadow-purple-500/25">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700 rounded-3xl motion-safe:animate-pulse-glow`}
                ></div>

                <div className="relative mb-6">
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-700 motion-safe:animate-float-gentle`}
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <feature.icon className="w-10 h-10 text-white group-hover:scale-125 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 motion-safe:animate-shimmer-wave"></div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors duration-500">
                  {feature.text}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold py-6 px-12 rounded-full text-xl transform hover:scale-110 transition-all duration-700 shadow-2xl hover:shadow-purple-500/50 flex items-center motion-safe:animate-pulse-rainbow"
              onMouseEnter={() => {
                setIsHovered(true);
                createParticleBurst();
              }}
              onMouseLeave={() => setIsHovered(false)}
              onClick={createParticleBurst}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-0 ${isHovered ? "motion-safe:animate-shimmer-wave opacity-40" : ""}`}
              ></div>
              <Sparkles className="w-7 h-7 mr-3 group-hover:animate-spin transition-transform duration-700" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-3 transition-transform duration-700" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="group bg-transparent border-2 border-purple-400 text-purple-300 font-semibold py-4 px-8 rounded-full hover:bg-purple-400 hover:text-white transition-all duration-700 transform hover:scale-105 hover:rotate-1 relative overflow-hidden shadow-lg hover:shadow-purple-400/30"
              onClick={handlesignupClick}
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            <button
              className="group bg-white bg-opacity-10 backdrop-blur-lg text-gray-200 font-semibold py-4 px-8 rounded-full hover:bg-opacity-20 transition-all duration-700 transform hover:scale-105 hover:-rotate-1 border border-white border-opacity-20 hover:border-opacity-40 shadow-lg hover:shadow-pink-400/20"
              onClick={handlesigninClick}
            >
              <span className="group-hover:animate-pulse">Login</span>
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24 text-center">
          <div
            className="bg-white bg-opacity-10 backdrop-blur-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-white border-opacity-20 motion-safe:animate-fade-in-up shadow-2xl"
            style={{
              transform: `translateY(${scrollY * -0.03}px)`,
            }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-10 motion-safe:animate-gradient-wave bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              How The Magic Works
            </h3>
            <div className="space-y-6">
              {[
                {
                  num: 1,
                  text: "Create a decision room with your burning question",
                  icon: "🏠",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  num: 2,
                  text: "Invite friends and let everyone submit their options",
                  icon: "👥",
                  color: "from-pink-500 to-blue-500",
                },
                {
                  num: 3,
                  text: "Vote anonymously and watch the suspense build",
                  icon: "🗳️",
                  color: "from-blue-500 to-purple-500",
                },
                {
                  num: 4,
                  text: "Let dice, spinners, or coins break ties with flair!",
                  icon: "🎲",
                  color: "from-purple-400 to-pink-400",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-center text-left group hover:scale-105 transition-all duration-500 motion-safe:animate-slide-in-stagger"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`bg-gradient-to-r ${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-6 group-hover:animate-spin-gentle transition-all duration-500 shadow-lg motion-safe:animate-pulse-smooth`}
                    style={{ animationDelay: `${index * 0.3}s` }}
                  >
                    {step.num}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className="text-2xl motion-safe:animate-bounce-gentle"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    >
                      {step.icon}
                    </span>
                    <span className="text-gray-200 text-lg group-hover:text-white transition-colors duration-500">
                      {step.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-wave {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes dice-3d {
          0% {
            transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
          }
          33% {
            transform: rotateY(120deg) rotateX(120deg) rotateZ(60deg);
          }
          66% {
            transform: rotateY(240deg) rotateX(240deg) rotateZ(120deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(360deg) rotateZ(180deg);
          }
        }

        @keyframes dice-3d-reverse {
          0% {
            transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
          }
          33% {
            transform: rotateY(-120deg) rotateX(-120deg) rotateZ(-60deg);
          }
          66% {
            transform: rotateY(-240deg) rotateX(-240deg) rotateZ(-120deg);
          }
          100% {
            transform: rotateY(-360deg) rotateX(-360deg) rotateZ(-180deg);
          }
        }

        @keyframes float-complex {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) translateX(10px) rotate(5deg);
          }
          50% {
            transform: translateY(-15px) translateX(-10px) rotate(-3deg);
          }
          75% {
            transform: translateY(-40px) translateX(5px) rotate(2deg);
          }
        }

        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }

        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-stagger {
          0% {
            opacity: 0;
            transform: translateX(-50px) rotate(-5deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0) rotate(0deg);
          }
        }

        @keyframes shimmer-wave {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(139, 92, 246, 0.4),
              0 0 40px rgba(236, 72, 153, 0.2);
          }
          50% {
            box-shadow:
              0 0 40px rgba(139, 92, 246, 0.6),
              0 0 80px rgba(236, 72, 153, 0.4);
          }
        }

        @keyframes pulse-rainbow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
            filter: hue-rotate(0deg);
          }
          25% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.6);
            filter: hue-rotate(90deg);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.7);
            filter: hue-rotate(180deg);
          }
          75% {
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
            filter: hue-rotate(270deg);
          }
        }

        @keyframes pulse-smooth {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes text-wave {
          0%,
          100% {
            transform: translateY(0px);
          }
          25% {
            transform: translateY(-2px);
          }
          75% {
            transform: translateY(2px);
          }
        }

        @keyframes particle-burst {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(2) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes particle-float {
          0% {
            transform: scale(0) translateY(0px);
            opacity: 1;
          }
          50% {
            transform: scale(1) translateY(-20px);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) translateY(-40px);
            opacity: 0;
          }
        }

        @keyframes bounce-smooth {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes spin-gentle {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-gradient-wave {
          animation: gradient-wave 4s ease infinite;
        }
        .animate-dice-3d {
          animation: dice-3d 8s linear infinite;
        }
        .animate-dice-3d-reverse {
          animation: dice-3d-reverse 8s linear infinite;
        }
        .animate-float-complex {
          animation: float-complex 6s ease-in-out infinite;
        }
        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 3s ease-in-out infinite;
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-slide-in-stagger {
          animation: slide-in-stagger 0.8s ease-out forwards;
        }
        .animate-shimmer-wave {
          animation: shimmer-wave 2s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-pulse-rainbow {
          animation: pulse-rainbow 3s ease-in-out infinite;
        }
        .animate-pulse-smooth {
          animation: pulse-smooth 2s ease-in-out infinite;
        }
        .animate-text-wave {
          animation: text-wave 2s ease-in-out infinite;
        }
        .animate-particle-burst {
          animation: particle-burst 3s ease-out forwards;
        }
        .animate-particle-float {
          animation: particle-float 2s ease-out forwards;
        }
        .animate-bounce-smooth {
          animation: bounce-smooth 2s ease-in-out infinite;
        }
        .animate-spin-gentle {
          animation: spin-gentle 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        /* Motion reduction for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-gradient-wave,
          .motion-safe\\:animate-dice-3d,
          .motion-safe\\:animate-dice-3d-reverse,
          .motion-safe\\:animate-float-complex,
          .motion-safe\\:animate-float-gentle,
          .motion-safe\\:animate-bounce-gentle,
          .motion-safe\\:animate-fade-in-scale,
          .motion-safe\\:animate-fade-in-up,
          .motion-safe\\:animate-slide-in-stagger,
          .motion-safe\\:animate-shimmer-wave,
          .motion-safe\\:animate-pulse-glow,
          .motion-safe\\:animate-pulse-rainbow,
          .motion-safe\\:animate-pulse-smooth,
          .motion-safe\\:animate-text-wave,
          .motion-safe\\:animate-particle-burst,
          .motion-safe\\:animate-particle-float,
          .motion-safe\\:animate-bounce-smooth {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
