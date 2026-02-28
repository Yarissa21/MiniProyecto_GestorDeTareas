import { useState } from "react";

type Estado = "Pendiente" | "En proceso" | "Finalizado";

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Estado;
  fecha: string;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<Estado>("Pendiente");
  const [fecha, setFecha] = useState("");

  const crearTarea = () => {
    if (!titulo.trim()) return;

    const nuevaTarea: Tarea = {
      id: Date.now(),
      titulo,
      descripcion,
      estado,
      fecha,
    };

    setTareas([...tareas, nuevaTarea]);

    setTitulo("");
    setDescripcion("");
    setEstado("Pendiente");
    setFecha("");
    setShowModal(false);
  };

  const eliminarTarea = (id: number) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  const renderColumna = (estadoColumna: Estado) => {
    const tareasFiltradas = tareas.filter(
      (t) => t.estado === estadoColumna
    );

    return (
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          {estadoColumna}
        </h2>

        <div className="flex-1 space-y-3">
          {tareasFiltradas.length === 0 && (
            <p className="text-gray-500">Sin tareas</p>
          )}

          {tareasFiltradas.map((tarea) => (
            <div
              key={tarea.id}
              className="bg-white rounded-lg p-4 shadow-md"
            >
              <h3 className="font-semibold text-lg">
                {tarea.titulo}
              </h3>

              <p className="text-sm text-gray-600">
                {tarea.descripcion}
              </p>

              {tarea.fecha && (
                <p className="text-xs text-gray-500 mt-2">
                  📅 Entrega: {tarea.fecha}
                </p>
              )}

              <button
                onClick={() => eliminarTarea(tarea.id)}
                className="text-red-500 text-sm mt-3"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
        {renderColumna("Pendiente")}
        {renderColumna("En proceso")}
        {renderColumna("Finalizado")}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              Nueva tarea
            </h2>

            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <select
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as Estado)
              }
              className="w-full border rounded-lg px-4 py-2 mb-4"
            >
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Finalizado</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>

              <button
                onClick={crearTarea}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
              >
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