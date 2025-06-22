import { useState } from "react";
import { Calendar, Plus, Trash2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  status: string;
  category: string;
  userImage: string | null;
}

export default function TaskListPage() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "All Task",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const navigate = useNavigate();

  const tasks: Task[] = [
    {
      id: 1,
      title: "Art and Craft",
      description:
        "Select the role that you want to candidates for and upload your job description",
      date: "Friday, April 19 - 2024",
      status: "Pending",
      category: "arts-crafts",
      userImage: null,
    },
    {
      id: 2,
      title: "Nature Photography",
      description:
        "Capture beautiful moments in nature and create a photo album",
      date: "Monday, April 22 - 2024",
      status: "In Progress",
      category: "nature",
      userImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      title: "Family Dinner",
      description:
        "Plan and organize weekly family dinner with home cooked meals",
      date: "Sunday, April 21 - 2024",
      status: "Done",
      category: "family",
      userImage: null,
    },
    {
      id: 4,
      title: "Morning Meditation",
      description:
        "Daily meditation practice to start the day with mindfulness",
      date: "Tuesday, April 23 - 2024",
      status: "Ongoing",
      category: "meditation",
      userImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b19c?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 5,
      title: "Basketball Practice",
      description: "Weekly basketball training session with the local team",
      date: "Wednesday, April 24 - 2024",
      status: "Pending",
      category: "sport",
      userImage: null,
    },
    {
      id: 6,
      title: "Friends Meetup",
      description:
        "Monthly gathering with old friends for dinner and conversation",
      date: "Friday, April 26 - 2024",
      status: "Collaboration Task",
      category: "friends",
      userImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
  ];

  const categories = [
    "arts-crafts",
    "nature",
    "family",
    "sport",
    "friends",
    "meditation",
  ];
  const statuses = [
    "All Task",
    "Ongoing",
    "Pending",
    "Collaboration Task",
    "Done",
  ];

  const handleStatusChange = (status: string) => {
    if (status === "All Task") {
      setSelectedStatuses(["All Task"]);
    } else {
      const newStatuses = selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s !== status && s !== "All Task")
        : [...selectedStatuses.filter((s) => s !== "All Task"), status];
      setSelectedStatuses(
        newStatuses.length === 0 ? ["All Task"] : newStatuses
      );
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#E343E6";
      case "in progress":
        return "#DD9221";
      case "done":
        return "#21D789";
      case "ongoing":
        return "#DD9221";
      case "collaboration task":
        return "#E343E6";
      default:
        return "#E343E6";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      selectedStatuses.includes("All Task") ||
      selectedStatuses.includes(task.status);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(task.category);
    return statusMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div
          style={{
            borderRadius: "15px",
            background: "#FFF",
            boxShadow:
              "0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 23px 44px 0px rgba(176, 183, 195, 0.14)",
            padding: "30px",
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <h1 className="text-gray-900 text-2xl font-semibold">
              All Task List
            </h1>
            <div className="flex flex-col items-center sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-600 text-sm">
                    {selectedCategories.length === 0
                      ? "Select Task Category"
                      : `${selectedCategories.length} selected`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm text-gray-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-600 text-sm">
                    {selectedStatuses.includes("All Task")
                      ? "All Task"
                      : `${selectedStatuses.length} selected`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                    {statuses.map((status) => (
                      <label
                        key={status}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={() => handleStatusChange(status)}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-green-400 text-gray-900 font-semibold">
                <Plus className="w-4 h-4" />
                <span>Add New Task</span>
              </button>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => navigate(`${task.id}`, { state: { task } })}
                className="relative group border border-gray-200 rounded-lg bg-white p-5 shadow-sm cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-10 h-10 bg-[#60E5AE] rounded-full"
                      style={{
                        backgroundImage: `url("/public/images/color-swatch.svg")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    ></div>
                    <h3 className="text-gray-800 font-semibold text-lg">
                      {task.title}
                    </h3>
                  </div>
                  <button className="p-1">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  {task.description}...
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {task.userImage ? (
                      <img
                        src={task.userImage}
                        alt="User"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <Calendar className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-500">{task.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{task.status}</span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    ></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
