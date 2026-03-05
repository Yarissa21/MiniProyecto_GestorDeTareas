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

  useEffect(() => {
    fetch("http://localhost:3000/tareas")
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((err) => console.error(err));
  }, []);

  const crearTarea = () => {
    setErrorTitulo("");
    setErrorDescripcion("");
    setErrorFecha("");
    setMensajeConfirmacion("");

    let hayError = false;

    if (!titulo.trim()) {
      setErrorTitulo("El título es obligatorio.");
      hayError = true;
    }

    if (!descripcion.trim()) {
      setErrorDescripcion("La descripción es obligatoria.");
      hayError = true;
    }

    if (!fechaEntrega) {
      setErrorFecha("La fecha límite es obligatoria.");
      hayError = true;
    } else {
      const fechaSeleccionada = new Date(fechaEntrega);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaSeleccionada < hoy) {
        setErrorFecha("La fecha límite no puede ser del pasado.");
        hayError = true;
      }
    }

    if (hayError) return;

    const fechaObj = new Date(fechaEntrega);
    fechaObj.setHours(23, 59, 0, 0);
    const fechaISO = fechaObj.toISOString();

    const nuevaTarea = {
      titulo,
      descripcion,
      estado,
      fechaEntrega: fechaISO,
    };

    if (editandoId !== null) {
      fetch(`http://localhost:3000/tareas/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea),
      })
        .then((res) => res.json())
        .then(() => {
          fetch("http://localhost:3000/tareas")
            .then((res) => res.json())
            .then((data) => setTareas(data));

          setEditandoId(null);
          setTitulo("");
          setDescripcion("");
          setEstado("PENDIENTE");
          setFechaEntrega("");
          setShowModal(false);
          setMensajeConfirmacion("Tarea actualizada correctamente.");
        })
        .catch((err) => console.error(err));

      return;
    }

    fetch("http://localhost:3000/tareas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaTarea),
    })
      .then((res) => res.json())
      .then((tareaCreada) => {
        setTareas([...tareas, tareaCreada]);
        setTitulo("");
        setDescripcion("");
        setEstado("PENDIENTE");
        setFechaEntrega("");
        setShowModal(false);
        setMensajeConfirmacion("Tarea creada exitosamente.");
      })
      .catch((err) => {
        console.error("Error al crear tarea:", err);
      });
  };

  const eliminarTarea = (id: number) => {
    fetch(`http://localhost:3000/tareas/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTareas(tareas.filter((t) => t.id !== id));
      })
      .catch((err) => console.error(err));
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
              className="bg-white rounded-lg p-4 shadow-md"
            >
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
                  onClick={() => eliminarTarea(tarea.id)}
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
              className="w-full border rounded-lg px-4 py-2 mb-4"
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

    </div>
  );
}

export default App;