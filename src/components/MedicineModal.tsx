"use client";

interface IMedicine {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  stock: number;
}

interface ModalProps {
  medicine: IMedicine | null;
  onClose: () => void;
}

const MedicineModal = ({ medicine, onClose }: ModalProps) => {
  if (!medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4">💊</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{medicine.name}</h2>
          <p className="text-blue-500 font-medium mb-6">{medicine.manufacturer}</p>
        </div>

        <div className="space-y-4 border-t border-b py-6 my-6">
          <div className="flex justify-between text-lg">
            <span className="text-gray-500">Unit Price:</span>
            <span className="font-bold text-green-600">৳ {medicine.price}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-500">Available Stock:</span>
            <span className={`font-bold ${medicine.stock > 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {medicine.stock} Units
            </span>
          </div>
          <div className="text-sm text-gray-400">
            * Consult a doctor before taking any medicine. Always check the expiry date.
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default MedicineModal;