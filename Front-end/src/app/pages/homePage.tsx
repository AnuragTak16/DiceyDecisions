import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
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
export const DiceyDecisionsHome = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [diceSequence, setDiceSequence] = useState([Dice1, Dice6]);
  const [particleCount, setParticleCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlesignupClick = () => {
    navigate({ to: "/signup" });
  };
  const handlesigninClick = () => {
    navigate({ to: "/login" });
  };

  const quotes = [
    {
      text: "Stop overthinking, start deciding!",
      emoji: "🎲",
      color: "from-rose-400 to-pink-500",
    },
    {
      text: "Where friends meet, decisions get made!",
      emoji: "✨",
      color: "from-sky-400 to-cyan-500",
    },
    {
      text: "Turn group chaos into fun choices!",
      emoji: "🎯",
      color: "from-emerald-400 to-teal-500",
    },
    {
      text: "Let fate decide when you can't!",
      emoji: "🎪",
      color: "from-violet-400 to-purple-500",
    },
    {
      text: "Democracy meets randomness!",
      emoji: "🗳️",
      color: "from-amber-400 to-orange-500",
    },
  ];

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const shapes = [Triangle, Square, Circle, Heart, Star];

  const features = [
    {
      icon: Users,
      text: "Group Decision Making",
      description: "Bring everyone together",
      gradient: "from-rose-400 to-pink-500",
    },
    {
      icon: Zap,
      text: "Instant Results",
      description: "No more endless debates",
      gradient: "from-amber-400 to-yellow-500",
    },
    {
      icon: Clock,
      text: "Save Time & Energy",
      description: "Quick & efficient choices",
      gradient: "from-emerald-400 to-green-500",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
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
    setTimeout(() => setParticleCount((prev) => prev - 1), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
          rgba(251, 146, 60, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, 
          #fef3f2 0%, 
          #fef7cd 25%, 
          #ecfdf5 50%, 
          #eff6ff 75%, 
          #f3e8ff 100%)
        `,
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((Shape, index) => (
          <div
            key={`shape-${index}`}
            className="absolute animate-float"
            style={{
              top: `${index * 20 + 10}%`,
              left: `${index * 25 + 5}%`,
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${4 + index}s`,
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            }}
          >
            <Shape
              className={`w-8 h-8 text-rose-300 opacity-30 animate-pulse`}
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          </div>
        ))}

        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(144)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-rose-300 to-sky-300 rounded-full animate-pulse"
                style={{
                  animationDelay: `${(i * 0.1) % 5}s`,
                  animationDuration: `${2 + (i % 3)}s`,
                  height: "2px",
                  opacity: Math.random() * 0.4,
                }}
              />
            ))}
          </div>
        </div>

        {[...Array(particleCount)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-ping"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
            }}
          >
            {[...Array(12)].map((_, j) => (
              <div
                key={j}
                className="absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full animate-bounce"
                style={{
                  transform: `translate(${Math.cos((j * 30 * Math.PI) / 180) * 100}px, ${Math.sin((j * 30 * Math.PI) / 180) * 100}px)`,
                  animationDelay: `${j * 0.1}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <header className="text-center mb-16">
          <div className="flex justify-center items-center mb-8 perspective-1000">
            <div className="animate-spin-3d mr-6">
              {React.createElement(diceSequence[0], {
                className:
                  "w-20 h-20 text-rose-500 drop-shadow-2xl filter brightness-110",
              })}
            </div>

            <div className="relative">
              <h1
                className="text-6xl md:text-8xl font-black text-transparent bg-clip-text animate-gradient-x"
                style={{
                  backgroundImage:
                    "linear-gradient(-45deg, #fb7185, #38bdf8, #34d399, #a78bfa, #fbbf24, #f472b6, #22d3ee)",
                  backgroundSize: "400% 400%",
                }}
              >
                DiceyDecisions
              </h1>
              <div className="absolute inset-0 animate-pulse">
                <h1 className="text-6xl md:text-8xl font-black text-gray-300 opacity-20 blur-sm">
                  DiceyDecisions
                </h1>
              </div>
            </div>

            <div className="animate-spin-3d-reverse ml-6">
              {React.createElement(diceSequence[1], {
                className:
                  "w-20 h-20 text-sky-500 drop-shadow-2xl filter brightness-110",
              })}
            </div>
          </div>

          <div className="h-24 flex items-center justify-center relative">
            <div
              key={currentQuote}
              className="absolute inset-0 flex items-center justify-center animate-fade-in-up"
            >
              <div
                className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${quotes[currentQuote].color} bg-clip-text text-transparent flex items-center space-x-4`}
              >
                <span className="text-4xl animate-bounce">
                  {quotes[currentQuote].emoji}
                </span>
                <span>{quotes[currentQuote].text}</span>
                <span
                  className="text-4xl animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  {quotes[currentQuote].emoji}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="text-center mb-20">
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-700 mb-8 leading-tight animate-float">
              Gamified Decision Making
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 bg-clip-text text-transparent animate-gradient-x">
                  For Friend Groups
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-rose-400 to-amber-400 animate-pulse rounded-full"></div>
              </span>
            </h2>
            <p
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Stop wasting time on group decisions! Create rooms, vote
              anonymously, and let dice, spinners, or coin flips break the ties
              with{" "}
              <span className="text-rose-500 font-semibold animate-pulse">
                spectacular style
              </span>
              .
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative bg-white bg-opacity-60 backdrop-blur-xl rounded-3xl p-8 text-center transform hover:scale-110 hover:rotate-3 transition-all duration-500 border border-gray-200 hover:border-gray-300 animate-fade-in-up shadow-lg hover:shadow-2xl">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                ></div>

                <div className="relative mb-6">
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500 animate-bounce-gentle`}
                  >
                    <feature.icon className="w-10 h-10 text-white group-hover:scale-125 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 animate-shimmer"></div>
                </div>

                <h3 className="text-2xl font-bold text-gray-700 mb-3 group-hover:text-rose-600 transition-colors duration-300">
                  {feature.text}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="group relative overflow-hidden bg-gradient-to-r from-rose-400 via-violet-400 to-sky-400 text-white font-bold py-6 px-12 rounded-full text-xl transform hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center animate-pulse-glow"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={createParticleBurst}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-0 ${isHovered ? "animate-shimmer opacity-30" : ""}`}
              ></div>
              <Sparkles className="w-7 h-7 mr-3 group-hover:animate-spin transition-transform duration-300" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="group bg-transparent border-2 border-rose-400 text-rose-500 font-semibold py-4 px-8 rounded-full hover:bg-rose-400 hover:text-white transition-all duration-500 transform hover:scale-105 hover:rotate-1 relative overflow-hidden shadow-md hover:shadow-lg"
              onClick={handlesignupClick}
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-rose-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button
              className="group bg-white bg-opacity-70 backdrop-blur-lg text-gray-600 font-semibold py-4 px-8 rounded-full hover:bg-opacity-90 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
              onClick={handlesigninClick}
            >
              <span className="group-hover:animate-pulse">Login</span>
            </button>
          </div>
        </div>

        <div className="mt-24 text-center">
          <div className="bg-white bg-opacity-70 backdrop-blur-2xl rounded-3xl p-10 max-w-4xl mx-auto border border-gray-200 animate-fade-in-up shadow-xl">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-700 mb-10 animate-gradient-x bg-gradient-to-r from-rose-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              How The Magic Works
            </h3>
            <div className="space-y-6">
              {[
                {
                  num: 1,
                  text: "Create a decision room with your burning question",
                  icon: "🏠",
                  color: "from-rose-400 to-pink-500",
                },
                {
                  num: 2,
                  text: "Invite friends and let everyone submit their options",
                  icon: "👥",
                  color: "from-violet-400 to-purple-500",
                },
                {
                  num: 3,
                  text: "Vote anonymously and watch the suspense build",
                  icon: "🗳️",
                  color: "from-sky-400 to-cyan-500",
                },
                {
                  num: 4,
                  text: "Let dice, spinners, or coins break ties with flair!",
                  icon: "🎲",
                  color: "from-amber-400 to-yellow-500",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-center text-left group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`bg-gradient-to-r ${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-6 group-hover:animate-spin transition-all duration-300 shadow-lg`}
                  >
                    {step.num}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className="text-2xl animate-bounce"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    >
                      {step.icon}
                    </span>
                    <span className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">
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
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes spin-3d {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(90deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(180deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(270deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(360deg);
          }
        }
        @keyframes spin-3d-reverse {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(-90deg) rotateX(-90deg);
          }
          50% {
            transform: rotateY(-180deg) rotateX(-180deg);
          }
          75% {
            transform: rotateY(-270deg) rotateX(-270deg);
          }
          100% {
            transform: rotateY(-360deg) rotateX(-360deg);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
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
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(251, 113, 133, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(251, 113, 133, 0.6);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        .animate-spin-3d {
          animation: spin-3d 4s linear infinite;
        }
        .animate-spin-3d-reverse {
          animation: spin-3d-reverse 4s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};
