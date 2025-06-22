import { useState } from "react";
import { Calendar, Edit, Trash2, ChevronDown, ArrowLeft } from "lucide-react";

import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;

  if (!task) {
    return (
      <div className="text-center text-red-500 mt-10">No task data found!</div>
    );
  }
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [points, setPoints] = useState(0);

  const handleDelete = () => {
    // TODO: Add delete logic
    toast.success("Task deleted");
    setShowDeleteModal(false);
  };

  const handleSubmit = () => {
    if (status === "Done") {
      setPoints(20);
      setShowCongratsModal(true);
    } else {
      toast.success("Status updated");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="rounded-[15px] bg-white shadow p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-[#1F1F1F]">
              Task Detail
            </h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border border-[#FFAB00] text-[#FFAB00] bg-[rgba(255,171,0,0.1)] rounded-lg px-4 py-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                variant="outline"
                className="border border-[#FFAB00] text-[#FFAB00] bg-[rgba(255,171,0,0.1)] rounded-lg px-4 py-2"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Task
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8"></div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#60E5AE] rounded-full flex items-center justify-center">
                  <Calendar className="text-white w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-[#1F1F1F]">
                  {task.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm mb-8">{task.description}</p>

              <div className="flex gap-8">
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-gray-700">End Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{task.date}</span>
                  </div>
                </div>

                <div className="w-px bg-gray-200"></div>

                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {[
                      "All Task",
                      "Ongoing",
                      "Pending",
                      "Collaboration Task",
                      "Done",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  className="border border-red-500 text-red-500 px-4 py-2"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Task
                </Button>
                <Button
                  variant="default"
                  className="bg-[#60E5AE] text-white px-4 py-2"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>

              {status === "Done" && (
                <p className="mt-4 text-lg font-bold text-green-600">
                  Points: {points}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Congrats Modal */}
      <Dialog open={showCongratsModal} onOpenChange={setShowCongratsModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
          </DialogHeader>
          <img
            src="/images/congrats-vector.png"
            alt="congrats"
            className="mx-auto w-32 h-32"
          />
          <p className="mt-4 text-gray-600">Successfully Completed the Task!</p>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <img
            src="/images/warning-vector.png"
            alt="warning"
            className="mx-auto w-32 h-32"
          />
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
