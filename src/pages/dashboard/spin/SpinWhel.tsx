import React, { useRef, useState } from "react";
import { ChevronDown, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSpinWheelMutation } from "../../../redux/features/spin/spinApi";

type TCategory =
  | "arts-crafts"
  | "nature"
  | "family"
  | "sport"
  | "friends"
  | "meditation";

type TSpinResult = {
  message: string;
  task: {
    _id: string;
    title: string;
    description: string;
    category: TCategory;
    points: number;
  };
};

const CATEGORIES = [
  { value: "arts-crafts", label: "Arts and Craft" },
  { value: "nature", label: "Nature" },
  { value: "family", label: "Family" },
  { value: "sport", label: "Sport" },
  { value: "friends", label: "Friends" },
  { value: "meditation", label: "Meditation" },
];

const WHEEL_SEGMENTS = [
  { label: "Friends", color: "#90EE90", angle: 0 },
  { label: "Sport", color: "#4A90E2", angle: 60 },
  { label: "Family", color: "#B8CCE8", angle: 120 },
  { label: "Nature", color: "#FFA500", angle: 180 },
  { label: "Arts and Craft", color: "#FFB366", angle: 240 },
  { label: "Meditation", color: "#32CD32", angle: 300 },
];

const SpinWheel = () => {
  const [selectedCategories, setSelectedCategories] = useState<TCategory[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<TSpinResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [spinWheel, { isLoading }] = useSpinWheelMutation();
  const handleCategoryChange = (category: TCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSpin = async () => {
    if (selectedCategories.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const spins = 5;
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + finalAngle;

    setRotation((prev) => prev + totalRotation);

    try {
      const res = await spinWheel({ categories: selectedCategories }).unwrap();
      console.log(res);
      setTimeout(() => {
        setSpinResult(res.data);
        setIsSpinning(false);
      }, 3000);
    } catch (error) {
      console.error("Spin failed:", error);
      setIsSpinning(false);
      alert("Failed to spin wheel. Please try again.");
    }
  };

  const handleGoToTask = () => {
    console.log("click");
    if (spinResult?.task?._id) {
      navigate(`/dashboard/tasks/${spinResult.task._id}`);
      alert(`Navigating to task: ${spinResult.task.title}`);
    }
  };

  const getCategoryLabel = (value: string) =>
    CATEGORIES.find((c) => c.value === value)?.label || value;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 md:p-8 w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Spin Wheel
          </h1>

          {/* Multi-Select Dropdown */}
          <div className="relative w-full lg:w-80">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Task Category
            </label>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={isSpinning}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">
                {selectedCategories.length > 0
                  ? selectedCategories.map(getCategoryLabel).join(", ")
                  : "Select Category"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
            </button>
            {showDropdown && (
              <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full p-2 max-h-60 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded text-sm sm:text-base"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(
                        cat.value as TCategory
                      )}
                      onChange={() =>
                        handleCategoryChange(cat.value as TCategory)
                      }
                      className="w-4 h-4"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spin Wheel Container */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4 sm:mb-8">
            {/* Wheel Container */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative">
              {/* Pointer at top */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 -translate-y-1 z-20">
                <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] sm:border-l-[20px] sm:border-r-[20px] sm:border-b-[30px] border-transparent border-b-green-600"></div>
              </div>

              {/* Main Wheel */}
              <div
                ref={wheelRef}
                className="w-full h-full rounded-full border-4 sm:border-8 md:border-[10px] border-red-600 relative overflow-hidden transition-transform duration-[3s] ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: `conic-gradient(
                    #90EE90 0deg 60deg,
                    #4A90E2 60deg 120deg,
                    #B8CCE8 120deg 180deg,
                    #FFA500 180deg 240deg,
                    #FFB366 240deg 300deg,
                    #32CD32 300deg 360deg
                  )`,
                }}
              >
                {/* Category Labels */}
                {WHEEL_SEGMENTS.map((segment, index) => {
                  const radius = 100; // Distance from center to middle of slice
                  const angleRad = (segment.angle + 55) * (Math.PI / 180); // +30 to center text in segment

                  return (
                    <div
                      key={segment.label}
                      className="absolute text-black font-bold text-center pointer-events-none"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) translate(${
                          Math.cos(angleRad) * radius
                        }px, ${Math.sin(angleRad) * radius}px)`,
                      }}
                    >
                      <span
                        className="text-xs md:text-sm lg:text-base block font-semibold leading-tight"
                        style={{
                          transform: `rotate(${segment.angle + 55}deg)`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {segment.label}
                      </span>
                    </div>
                  );
                })}

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full  transform -translate-x-1/2 -translate-y-1/2 z-10" />

                {/* Decorative Red Dots */}
                {/* {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
                    style={{
                      top: "4px",
                      left: "50%",
                      transform: `translateX(-50%) rotate(${i * 30}deg)`,
                      transformOrigin: "50% 210px",
                    }}
                  />
                ))} */}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <p className="text-center mt-2 sm:mt-4 text-gray-500 text-sm sm:text-base px-4">
            Spin Wheel to pick your task
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={handleSpin}
              disabled={selectedCategories.length === 0 || isSpinning}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSpinning ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Spinning...
                </>
              ) : (
                <>
                  <span>Spin</span> 🎡
                </>
              )}
            </button>

            {spinResult && !isSpinning && (
              <button
                onClick={handleGoToTask}
                className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition text-sm sm:text-base"
              >
                Go To Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
