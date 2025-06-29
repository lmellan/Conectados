"use client"

const ConfirmationModal = ({
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  showCancel = true,
  isDestructive = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            {showCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md text-white ${
                isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
