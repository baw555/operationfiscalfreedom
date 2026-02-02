import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft, DollarSign } from "lucide-react";
import costSavingsPreview from "@/assets/images/cost-savings-preview.png";

export function CostSavingsWidget() {
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <>
      <style>{`
        @keyframes flashGreen {
          0%, 100% { 
            background: linear-gradient(to bottom, #16a34a, #15803d);
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
          }
          50% { 
            background: linear-gradient(to bottom, #22c55e, #16a34a);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }
        .animate-flash-green {
          animation: flashGreen 1.5s ease-in-out infinite;
        }
      `}</style>
      <div className="fixed top-[40%] left-0 z-50 flex items-start">
        <div
          className={`bg-slate-900 border border-green-500/30 rounded-r-xl shadow-2xl transition-all duration-300 overflow-hidden ${
            isMinimized ? "w-0 opacity-0" : "w-72 sm:w-80 opacity-100"
          }`}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-green-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Immediate Cost Savings
              </h3>
            </div>
            
            <Link href="/about-nav-perks#pricing-comparison">
              <div className="cursor-pointer group">
                <img
                  src={costSavingsPreview}
                  alt="Cost Savings Comparison"
                  className="w-full rounded-lg border border-slate-700 group-hover:border-green-500/50 transition-all"
                />
                <div className="mt-2 text-center">
                  <span className="text-green-400 text-xs font-medium group-hover:underline">
                    Click to see full comparison →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`text-white px-2 py-4 rounded-r-lg shadow-lg transition-all flex flex-col items-center gap-1 ${
            isMinimized ? "animate-flash-green" : "bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600"
          }`}
          data-testid="cost-savings-toggle"
        >
          {isMinimized ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
          <DollarSign className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider [writing-mode:vertical-rl] [text-orientation:mixed]">
            Savings
          </span>
        </button>
      </div>
    </>
  );
}
