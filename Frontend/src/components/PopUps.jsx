import React from 'react';

const PopUps = ({ isOpen, type, file, inputValue, setInputValue, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-xl border border-gray-800 w-80">
        <h3 className="text-white text-lg font-medium mb-4 capitalize">
          {type === "addMember" ? "Add Member" : `${type} File`}
        </h3>
        <form onSubmit={onSubmit}>
          {type === "addMember" ? (
             <input
              type="email"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="User Email..."
              className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
            />
          ) : type !== "delete" ? (
            <input
              type="text"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Filename..."
              className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none mb-4"
            />
          ) : (
            <p className="text-gray-300 text-sm mb-4">
              Are you sure you want to delete <span className="font-bold text-white">{file?.name}</span>?
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm text-white rounded transition-colors ${
                type === "delete"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {type === "delete" ? "Delete" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopUps;
