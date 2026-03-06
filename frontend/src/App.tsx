import { useState, useEffect } from "react";

type Estado = "PENDIENTE" | "EN_PROCESO" | "FINALIZADO";

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Estado;
  fechaEntrega: string;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<Estado>("PENDIENTE");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [errorTitulo, setErrorTitulo] = useState("");
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [errorFecha, setErrorFecha] = useState("");
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<number | null>(null);

  

  useEffect(() => {
    fetch("http://localhost:3000/tareas")
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((err) => console.error(err));
  }, []);
    const obtenerColorUrgencia = (fechaEntrega: string) => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const entrega = new Date(fechaEntrega);
      entrega.setHours(0, 0, 0, 0);

      const diffTime = entrega.getTime() - hoy.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "bg-gray-400";       
      if (diffDays <= 3) return "bg-red-600";      
      if (diffDays <= 6) return "bg-yellow-500";    
      return "bg-green-600";                      
    };

    const [loading, setLoading] = useState(false);
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-lg font-semibold">Cargando...</p>
          </div>
        </div>
      )}

    const crearTarea = async () => {
      setErrorTitulo("");
      setErrorDescripcion("");
      setErrorFecha("");
      setMensajeConfirmacion("");

      let hayError = false;
      if (!titulo.trim()) { setErrorTitulo("El título es obligatorio."); hayError = true; }
      if (!descripcion.trim()) { setErrorDescripcion("La descripción es obligatoria."); hayError = true; }
      if (!fechaEntrega) { setErrorFecha("La fecha límite es obligatoria."); hayError = true; }
      else {
        const fechaSeleccionada = new Date(fechaEntrega);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaSeleccionada < hoy) { setErrorFecha("La fecha límite no puede ser del pasado."); hayError = true; }
      }
      if (hayError) return;

      const [year, month, day] = fechaEntrega.split("-").map(Number);
      const fechaISO = new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
      const tareaPayload = { titulo, descripcion, estado, fechaEntrega: fechaISO };

      try {
        setLoading(true); // mostrar overlay de carga

        let url = "http://localhost:3000/tareas";
        let method = "POST";
        if (editandoId !== null) { url += `/${editandoId}`; method = "PUT"; }

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tareaPayload),
        });

        if (!res.ok) throw new Error("Error en la solicitud");

        // Actualizamos estado localmente para que se vea instantáneo
        const tareaRespuesta = await res.json();
        if (editandoId !== null) setTareas(tareas.map(t => t.id === editandoId ? tareaRespuesta : t));
        else setTareas([...tareas, tareaRespuesta]);

        // Reset formulario
        setTitulo(""); setDescripcion(""); setEstado("PENDIENTE"); setFechaEntrega(""); setShowModal(false);

        // Esperamos un momento y recargamos suavemente
        setTimeout(() => window.location.reload(), 500);

      } catch (error) {
        console.error(error);
        alert("Ocurrió un error al guardar la tarea. Intenta de nuevo.");
      } finally {
        setLoading(false); // ocultar overlay
      }
    };

    const confirmarEliminar = (id: number) => {
  setTareaAEliminar(id);
};

const eliminarTarea = () => {
  if (tareaAEliminar === null) return;
  fetch(`http://localhost:3000/tareas/${tareaAEliminar}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok && res.status !== 404) throw new Error("Error al eliminar");
      setTareas(tareas.filter((t) => t.id !== tareaAEliminar));

      setMensajeConfirmacion("¡Tarea eliminada correctamente!");
      setTimeout(() => setMensajeConfirmacion(""), 3000);  // ESTO ACABO DE AGREGAR

      setTareaAEliminar(null);
    })
    .catch((err) => {
      console.error(err);
      setTareaAEliminar(null);
    });
};

    const editarTarea = (tarea: Tarea) => {
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion);
      setEstado(tarea.estado);
      setFechaEntrega(tarea.fechaEntrega.split("T")[0]);
      setEditandoId(tarea.id);
      setShowModal(true);
    };

    const renderColumna = (estadoColumna: Estado) => {
      const tareasFiltradas = tareas.filter((t) => t.estado === estadoColumna);

      return (
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold mb-4">{estadoColumna}</h2>

          <div className="flex-1 space-y-3">
            {tareasFiltradas.length === 0 && (
              <p className="text-gray-500">Sin tareas</p>
            )}

            {tareasFiltradas.map((tarea) => (
              <div
                key={tarea.id}
                className="relative bg-white rounded-lg p-4 shadow-md"
              >
                {tarea.fechaEntrega && (
                  <div
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow-md ${obtenerColorUrgencia(tarea.fechaEntrega)}`}
                    title={`Entrega: ${new Date(tarea.fechaEntrega).toLocaleDateString()}`}
                  ></div>
                )}

                <h3 className="font-semibold text-lg">{tarea.titulo}</h3>
                <p className="text-sm text-gray-600">{tarea.descripcion}</p>

                {tarea.fechaEntrega && (
                  <p className="text-xs text-gray-500 mt-2">
                    📅 Entrega: {new Date(tarea.fechaEntrega).toLocaleDateString()}
                  </p>
                )}

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => editarTarea(tarea)}
                    className="text-blue-500 text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => confirmarEliminar(tarea.id)}
                    className="text-red-500 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

  return (
    <div className="relative min-h-screen p-8 overflow-hidden">

      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      <div className="relative z-10">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            Gestor de Tareas
          </h1>

          <button
            onClick={() => {
              setEditandoId(null);
              setShowModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
            + Agregar tarea
          </button>
        </div>

        {mensajeConfirmacion && (
          <p className="text-green-600 font-semibold mb-4 bg-green-100 p-2 rounded">
            {mensajeConfirmacion}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[80vh]">
          {renderColumna("PENDIENTE")}
          {renderColumna("EN_PROCESO")}
          {renderColumna("FINALIZADO")}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">
              {editandoId ? "Editar tarea" : "Nueva tarea"}
            </h2>

            <input
              type="text"
              placeholder="Título (obligatorio)"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-1"
            />
            {errorTitulo && (
              <p className="text-red-600 text-sm mb-3">{errorTitulo}</p>
            )}

            <textarea
              placeholder="Descripción (obligatoria)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-1"
            />
            {errorDescripcion && (
              <p className="text-red-600 text-sm mb-3">{errorDescripcion}</p>
            )}

            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-1"
            />
            {errorFecha && (
              <p className="text-red-600 text-sm mb-3">{errorFecha}</p>
            )}

              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as Estado)}
                disabled={editandoId === null}
                className="w-full border rounded-lg px-4 py-2 mb-4 disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PROCESO">En proceso</option>
                <option value="FINALIZADO">Finalizado</option>
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

      {tareaAEliminar !== null && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">
    <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl text-center">
      <h2 className="text-xl font-semibold mb-2">¿Eliminar tarea?</h2>
      <p className="text-gray-600 mb-6">Esta acción no se puede deshacer.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setTareaAEliminar(null)}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          onClick={eliminarTarea}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}

      

    </div>

  );
}

export default App;