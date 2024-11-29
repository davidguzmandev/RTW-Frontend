import { useState } from "react";

const PopupModal = ({ isOpen, onClose, elapsedTime, onSubmit }) => {
  const [comment, setComment] = useState("")
  if (!isOpen) return null; // No renderiza nada si el modal no está abierto

  const handleSubmit = () => {
    onSubmit(comment); // Pasa el comentario al submit
    setComment(""); // Limpia el textarea después de enviar
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-black">End Shift</h2>
        <p className="text-center text-sm text-black">
          Elapsed Time <br />
          <span className="font-bold text-2xl">
            {elapsedTime || "Calculating..."}
          </span>
        </p>

        <textarea
          className="w-full border rounded mb-4 text-black mt-4 p-2"
          placeholder="Enter your comment..."
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Actualiza el estado
        ></textarea>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-500 text-white px-4 py-2 rounded">
            End Shift
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
