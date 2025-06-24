import { useState, useEffect } from "react";
import { Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import {
  useGetTaskByIdQuery,
  useUpdateTaskByIdMutation,
  useDeleteTaskByIdMutation,
  useUpdateTaskStatusMutation,
} from "../../../redux/features/task/taskApi";
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

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "collaborativeTask", label: "Collaboration Task" },
];

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Get task data from location state or fetch by ID
  const taskFromState = location.state?.task;
  const {
    data: fetchedTask,
    isLoading,
    refetch,
  } = useGetTaskByIdQuery(id, {
    skip: !!taskFromState,
  });

  const task = taskFromState || fetchedTask;

  const [updateTaskById, { isLoading: isUpdating }] =
    useUpdateTaskByIdMutation();
  const [deleteTaskById, { isLoading: isDeleting }] =
    useDeleteTaskByIdMutation();
  const [updateTaskStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTaskStatusMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task?.status || "pending");
  const [points, setPoints] = useState(task?.points || 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (task) {
      setCurrentStatus(task.status);
      setPoints(task.points || 0);
      // Set form values for editing
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("category", task.category);
      setValue("points", task.points);
      if (task.dueDate) {
        setValue("dueDate", new Date(task.dueDate).toISOString().split("T")[0]);
      }
    }
  }, [task, setValue]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 mt-10">
            No task data found!
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteTaskById(task._id).unwrap();
      toast.success("Task deleted successfully");
      setShowDeleteModal(false);
      navigate(-1);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
  };

  const handleStatusUpdate = async () => {
    try {
      if (currentStatus === "done") {
        const updateData = {
          id: task._id,
          status: currentStatus,
          points: task.points || 10,
        };

        await updateTaskStatus(updateData).unwrap();
        setPoints(task.points || 10);
        setShowCongratsModal(true);
        toast.success("Task completed successfully!");
        // Refetch task data to update the UI
        if (!taskFromState) {
          refetch();
        }
      } else {
        const updateData = {
          id: task._id,
          status: currentStatus,
        };
        console.log("Payload for other status:", updateData);
        await updateTaskStatus(updateData).unwrap();
        toast.success("Status updated successfully");
        // Refetch task data to update the UI
        if (!taskFromState) {
          refetch();
        }
      }
    } catch (error) {
      console.error("Status update error:", error);
      console.error("Full error details:", JSON.stringify(error, null, 2));
      toast.error("Failed to update status");
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const updateData = {
      id: task._id,
      points: data.points ? Number(data.points) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      ...data,
    };

    try {
      const res = (await updateTaskById(updateData)) as TResponse<FieldValues>;
      if (res.error) {
        toast.error(res.error.data.message);
      } else {
        toast.success("Task updated successfully");
        setShowEditModal(false);
        navigate(-1);
        // window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
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

  const isDone = currentStatus === "done";

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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1F1F1F]">
              Task Details
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Points Display */}
              {isDone && points > 0 && (
                <div className="order-first sm:order-none">
                  <p className="text-base sm:text-lg font-bold text-[#C716F3]">
                    Points: {points}
                  </p>
                </div>
              )}

              {!isDone && (
                <Button
                  variant="outline"
                  className="border border-[#FFAB00] text-[#FFAB00] bg-[rgba(255,171,0,0.1)] rounded-lg px-4 py-2 hover:bg-[rgba(255,171,0,0.2)]"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Task
                </Button>
              )}
              <Button
                variant="outline"
                className=" text-black bg-[#60E5AE] rounded-lg px-4 py-2 hover:bg-[rgba(255,171,0,0.2)]"
                onClick={() => navigate("/dashboard/tasks")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-6 sm:mb-8"></div>

          {/* Content */}
          <div className="space-y-6">
            {/* Title and Icon */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-[#60E5AE] rounded-full flex items-center justify-center flex-shrink-0">
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url(/images/color-swatch.svg)`,
                  }}
                ></div>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#1F1F1F] break-words">
                {task.title}
              </h2>
            </div>

            {/* Description */}
            <div className="pl-14 sm:pl-16">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Date and Status Row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pl-14 sm:pl-16">
              {/* Date Section */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">End Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600">
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              {/* Vertical Divider - Hidden on mobile */}
              <div className="hidden sm:block w-[2px] bg-gray-200 h-12"></div>

              {/* Status Display Section */}
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-gray-700"></p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getStatusColor(currentStatus) }}
                  ></div>
                  <span
                    className="text-xl font-medium"
                    style={{ color: getStatusColor(currentStatus) }}
                  >
                    {getStatusDisplayName(currentStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Update Section - Only show if not done */}
            {!isDone && (
              <div className="pl-14 sm:pl-16">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Change Status
                  </p>
                  <select
                    className="w-full sm:w-64 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pl-14 sm:pl-16 pt-4">
              {!isDone && (
                <>
                  <Button
                    variant="outline"
                    className="border border-red-500 text-red-500 px-4 py-2 hover:bg-red-50"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Task"}
                  </Button>
                  <Button
                    className="bg-[#60E5AE] text-black px-4 py-2 hover:bg-[#50d49e]"
                    onClick={handleStatusUpdate}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? "Updating..." : "Submit"}
                  </Button>
                </>
              )}
              {isDone && (
                <div className="text-center py-4">
                  <p className="text-green-600 font-semibold text-lg">
                    🎉 Task Completed Successfully! 🎉
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    This task cannot be modified as it's already completed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal - Only show if not done */}
      {!isDone && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="rounded-lg max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Edit Task
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  id="edit-title"
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
                  htmlFor="edit-description"
                  className="block text-sm font-medium mb-1"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
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
                  htmlFor="edit-category"
                  className="block text-sm font-medium mb-1"
                >
                  Category
                </label>
                <select
                  id="edit-category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
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
                  htmlFor="edit-dueDate"
                  className="block text-sm font-medium mb-1"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="edit-dueDate"
                  {...register("dueDate")}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-points"
                  className="block text-sm font-medium mb-1"
                >
                  Points
                </label>
                <input
                  type="number"
                  id="edit-points"
                  {...register("points")}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                disabled={isUpdating}
              >
                {isUpdating ? "Updating Task..." : "Update Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Congratulations Modal */}
      <Dialog open={showCongratsModal} onOpenChange={setShowCongratsModal}>
        <DialogContent className="text-center rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-green-600">
              Congratulations!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img
              src="/images/congratilation.png"
              alt="Congratulations"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
            />
            <p className="text-gray-600 mb-4">
              Successfully Completed the Task!
            </p>
            <p className="text-lg font-bold text-green-600">
              You earned {points} points!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="text-center rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-600">
              Are you sure?
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img
              src="/images/delete.png"
              alt="Delete confirmation"
              className="mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-4"
            />
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the
              task.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2"
              >
                No, Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
