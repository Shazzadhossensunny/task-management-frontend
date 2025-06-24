import { useState } from "react";
import { Calendar, Plus, Trash2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useCreateTaskMutation,
  useGetAllTasksQuery,
} from "../../../redux/features/task/taskApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import type { TTaskCategory } from "../../../type/task.type";
import type { TResponse } from "../../../type/global.type";

const categories: TTaskCategory[] = [
  "arts-crafts",
  "nature",
  "family",
  "sport",
  "friends",
  "meditation",
];

const statuses: string[] = [
  "All Task",
  "pending",
  "inprogress",
  "done",
  "collaborativeTask",
];

export type TTaskStatus =
  | "pending"
  | "inprogress"
  | "done"
  | "collaborativeTask";

export default function TaskListPage() {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useGetAllTasksQuery([]);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    "All Task",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<TTaskCategory[]>(
    []
  );
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const taskData = {
      ...data,
      points: data.points ? Number(data.points) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };

    try {
      const res = (await createTask(taskData)) as TResponse<FieldValues>;

      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        setShowCreateModal(false);
        toast.success("Task created successfully");
      }
    } catch (error) {
      toast.error("Failed to create task");
    }
    reset();
  };

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

  const handleCategoryChange = (category: TTaskCategory) => {
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
      case "inprogress":
        return "#DD9221";
      case "done":
        return "#21D789";
      case "collaborativetask":
        return "#E343E6";
      default:
        return "#E343E6";
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending";
      case "inprogress":
        return "In Progress";
      case "done":
        return "Done";
      case "collaborativetask":
        return "Collaboration Task";
      default:
        return status;
    }
  };

  const filteredTasks = tasks?.data?.result?.filter((task: any) => {
    const statusMatch =
      selectedStatuses.includes("All Task") ||
      selectedStatuses.some(
        (selectedStatus) =>
          selectedStatus.toLowerCase() === task.status.toLowerCase()
      );
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(task.category);
    return statusMatch && categoryMatch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div
          className="rounded-[15px] bg-white shadow p-4 sm:p-6 lg:p-8"
          style={{
            boxShadow:
              "0px 1px 3px 0px rgba(0, 0, 0, 0.12), 0px 23px 44px 0px rgba(176, 183, 195, 0.14)",
          }}
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-gray-900 text-xl sm:text-2xl font-semibold">
              All Task List
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center justify-between w-full sm:w-52 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-600 text-sm">
                    {selectedCategories.length === 0
                      ? "Select Task Category"
                      : `${selectedCategories.length} selected`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
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
                        <span className="text-sm text-gray-700 capitalize">
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
                  className="flex items-center justify-between w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-600 text-sm">
                    {selectedStatuses.includes("All Task")
                      ? "All Task"
                      : `${selectedStatuses.length} selected`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2">
                    {statuses.map((status: string) => (
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
                        <span className="text-sm text-gray-700">
                          {status === "All Task"
                            ? status
                            : getStatusDisplayName(status)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 rounded-lg bg-green-400 text-gray-900 font-semibold hover:bg-green-500"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add New Task</span>
                <span className="sm:hidden">Add Task</span>
              </Button>
            </div>
          </div>

          {/* Task Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : filteredTasks?.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center">
                <img
                  src="/images/no-task.png"
                  alt="No tasks available"
                  className="w-32 h-32 sm:w-48 sm:h-48 mb-4 object-contain"
                />
                <p className="text-gray-500 text-lg font-medium">
                  No Task is Available yet, Please Add your New Task
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredTasks?.map((task: any) => (
                <div
                  key={task._id}
                  onClick={() => navigate(`${task._id}`, { state: { task } })}
                  className="relative group border border-gray-200 rounded-lg bg-white p-4 sm:p-5 shadow-sm cursor-pointer transition-all hover:shadow-md"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#60E5AE] rounded-full flex items-center justify-center">
                        <div
                          className="w-4 h-4 sm:w-6 sm:h-6 bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url(/images/color-swatch.svg)`,
                          }}
                        ></div>
                      </div>
                      <h3 className="text-gray-800 font-semibold text-base sm:text-lg truncate">
                        {task.title}
                      </h3>
                    </div>
                    <button className="p-1 cursor-pointer">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {/* Description */}
                  <div className="pl-14 sm:pl-11">
                    <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {task.profileImage ? (
                        <img
                          src={task.profileImage}
                          alt="User Profile"
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                        />
                      ) : (
                        <Calendar className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-xs sm:text-sm text-gray-500 truncate">
                        {task.dueDate
                          ? formatDate(task.dueDate)
                          : "No due date"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      ></span>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {getStatusDisplayName(task.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Task Modal */}
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogContent className="rounded-lg max-w-md mx-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create New Task
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.title?.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.description?.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="capitalize"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors?.category?.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    {...register("dueDate")}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="points"
                    className="block text-sm font-medium mb-1"
                  >
                    Points
                  </label>
                  <input
                    type="number"
                    id="points"
                    {...register("points")}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating Task..." : "Create Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
