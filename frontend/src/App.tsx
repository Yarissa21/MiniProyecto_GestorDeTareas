import { useState } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestor de Tareas
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Agregar tarea
        </button>
      </header>

      {/* Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-10">
        {/* Pendiente */}
        <div className="bg-white rounded-2xl shadow p-6 min-h-[500px]">
          <h2 className="text-lg font-semibold mb-4">Pendiente</h2>
          <p className="text-gray-400">Sin tareas</p>
        </div>

        {/* En proceso */}
        <div className="bg-white rounded-2xl shadow p-6 min-h-[500px]">
          <h2 className="text-lg font-semibold mb-4">En proceso</h2>
          <p className="text-gray-400">Sin tareas</p>
        </div>

        {/* Finalizado */}
        <div className="bg-white rounded-2xl shadow p-6 min-h-[500px]">
          <h2 className="text-lg font-semibold mb-4">Finalizado</h2>
          <p className="text-gray-400">Sin tareas</p>
        </div>
      </div>

      {/* Modal simple */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Nueva tarea</h2>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;