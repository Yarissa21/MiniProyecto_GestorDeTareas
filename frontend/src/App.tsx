import { useState } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Gestor de Tareas
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Agregar tarea
        </button>
      </div>

      {/* Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[80vh]">
        {/* Pendiente */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Pendiente</h2>
          <div className="flex-1">
            <p className="text-gray-500">Sin tareas</p>
          </div>
        </div>

        {/* En proceso */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4">En proceso</h2>
          <div className="flex-1">
            <p className="text-gray-500">Sin tareas</p>
          </div>
        </div>

        {/* Finalizado */}
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Finalizado</h2>
          <div className="flex-1">
            <p className="text-gray-500">Sin tareas</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Nueva tarea</h2>

            <input
              type="text"
              placeholder="Título"
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <textarea
              placeholder="Descripción"
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;