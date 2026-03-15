"use client";

const steps = ["Cart", "Shipping", "Payment"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center my-6">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < current;
        const isActive = stepNum === current;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isCompleted ? "bg-green-600 border-green-600 text-white" : ""}
                  ${isActive ? "bg-white border-green-600 text-green-600" : ""}
                  ${!isCompleted && !isActive ? "bg-white border-gray-300 text-gray-400" : ""}
                `}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-green-700" : isCompleted ? "text-green-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
