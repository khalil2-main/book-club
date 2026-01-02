
import toast from "react-hot-toast";
import api from "../api/api";

const useConfirmDelete = () => {
  const confirmDelete = ({ endpoint, onSuccess,onStart, onFinally }) => {
    onStart?.();
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-700">
            Are you sure you want to delete this?
          </span>

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  
                  await api.delete(endpoint);
                  onSuccess?.();
                  toast.success("Deleted successfully");
                } catch {
                  toast.error("Delete failed");
                }
                finally{
                  onFinally?.()
                }
              }}
            >
              Yes
            </button>

            <button
              className="px-3 py-1 bg-gray-300 rounded text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return confirmDelete;
};

export default useConfirmDelete;
