import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";

type Estado = "PENDIENTE" | "EN_PROCESO" | "FINALIZADO";

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: Estado;
  fechaEntrega: string;
}

function App() {

  /* ---------------------- ESTADOS ---------------------- */

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

  const [busqueda, setBusqueda] = useState("");

  const [filtro, setFiltro] = useState<Estado | "TODAS">("TODAS");

  const [loading, setLoading] = useState(false);


const total = tareas.length;
const pendientes = tareas.filter((t) => t.estado === "PENDIENTE").length;
const enProceso = tareas.filter((t) => t.estado === "EN_PROCESO").length;
const finalizadas = tareas.filter((t) => t.estado === "FINALIZADO").length;

  /* ---------------------- USE EFFECT ---------------------- */

  useEffect(() => {
    fetch("http://localhost:3000/tareas")
      .then(res => res.json())
      .then(data => {
        if (data.mensaje) {
          setMensajeConfirmacion(data.mensaje);
          setTareas([]);
          return;
        }
        setTareas(data);
      })
      .catch(() => setMensajeConfirmacion("Error al obtener tareas."));
  }, []);

  useEffect(() => {
    let url = "http://localhost:3000/tareas";

    if (busqueda.trim()) {
      url = `http://localhost:3000/tareas/buscar?texto=${busqueda}`;
    } else if (filtro !== "TODAS") {
      url = `http://localhost:3000/tareas/filtrar?estado=${filtro}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.mensaje) {
          setMensajeConfirmacion(data.mensaje);
          setTareas([]);
          return;
        }
        setTareas(data);
      })
      .catch(() => setMensajeConfirmacion("Error al obtener tareas"));
  }, [busqueda, filtro]);

  /* ---------------------- UTILIDADES ---------------------- */

  const obtenerColorUrgencia = (fechaEntrega: string) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [year, month, day] = fechaEntrega.split("T")[0].split("-");
    const entrega = new Date(Number(year), Number(month) - 1, Number(day));
    entrega.setHours(0, 0, 0, 0);
    entrega.setHours(0, 0, 0, 0);

    const diffTime = entrega.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "bg-gray-400";
    if (diffDays <= 3) return "bg-red-600";
    if (diffDays <= 6) return "bg-yellow-500";
    return "bg-green-600";
  };

  /* ---------------------- CREAR / EDITAR ---------------------- */

  const crearTarea = async () => {
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
      const [year, month, day] = fechaEntrega.split("-").map(Number);
      const fechaSeleccionada = new Date(year, month - 1, day);
      fechaSeleccionada.setHours(0, 0, 0, 0);      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaSeleccionada < hoy) {
        setErrorFecha("La fecha límite no puede ser del pasado.");
        hayError = true;
      }
    }

    if (hayError) return;

    const fechaISO = fechaEntrega;
    const tareaPayload = {
      titulo,
      descripcion,
      estado,
      fechaEntrega: fechaISO,
    };

    try {
      setLoading(true);

      let url = "http://localhost:3000/tareas";
      let method = "POST";

      if (editandoId !== null) {
        url += `/${editandoId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tareaPayload),
      });

      if (!res.ok) throw new Error("Error en la solicitud");

      const tareaRespuesta = await res.json();

      if (tareaRespuesta.mensaje) {
        setMensajeConfirmacion(tareaRespuesta.mensaje);
        return;
      }

      const nuevasTareas =
        editandoId !== null
          ? tareas.map((t) => (t.id === editandoId ? tareaRespuesta : t))
          : [...tareas, tareaRespuesta];

      nuevasTareas.sort(
        (a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime()
      );

      setTareas(nuevasTareas);

      setMensajeConfirmacion(
        editandoId !== null ? "¡Tarea actualizada correctamente!" : "¡Tarea creada correctamente!"
      );
      setTimeout(() => setMensajeConfirmacion(""), 3000);

      setTitulo("");
      setDescripcion("");
      setEstado("PENDIENTE");
      setFechaEntrega("");
      setShowModal(false);
      setEditandoId(null);

    } catch (error) {
      console.error(error);
      setMensajeConfirmacion("Ocurrió un error al guardar la tarea.");
      setTimeout(() => setMensajeConfirmacion(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------- ELIMINAR ---------------------- */

  const confirmarEliminar = (id: number) => {
    setTareaAEliminar(id);
  };

  const eliminarTarea = () => {
    if (tareaAEliminar === null) return;

    fetch(`http://localhost:3000/tareas/${tareaAEliminar}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok && res.status !== 404)
          throw new Error("Error al eliminar");

        setTareas(tareas.filter((t) => t.id !== tareaAEliminar));

        setMensajeConfirmacion("¡Tarea eliminada correctamente!");

        setTimeout(() => setMensajeConfirmacion(""), 3000);

        setTareaAEliminar(null);
      })
      .catch((err) => {
        console.error(err);
        setTareaAEliminar(null);
      });
  };

  /* ---------------------- EDITAR ---------------------- */

  const editarTarea = (tarea: Tarea) => {
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEstado(tarea.estado);
    setFechaEntrega(tarea.fechaEntrega.split("T")[0]);
    setEditandoId(tarea.id);
    setShowModal(true);
  };

  /* ---------------------- DRAG ---------------------- */

  const DraggableTarea = ({ tarea }: { tarea: Tarea }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id: tarea.id });

    const style = {
      transform: transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : undefined,
      zIndex: isDragging ? 9999 : 1,
      position: "relative" as const,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="relative bg-white rounded-lg p-4 shadow-md"
      >
        <h3
          {...listeners}
          {...attributes}
          className="font-semibold text-lg cursor-grab active:cursor-grabbing"
        >
          {tarea.titulo}
        </h3>

        <p className="text-sm text-gray-600">{tarea.descripcion}</p>

        {tarea.fechaEntrega && (
          <p className="text-xs text-gray-500 mt-2">
          📅 Entrega: {tarea.fechaEntrega.split("T")[0]}          </p>
        )}

        {tarea.estado === "FINALIZADO" ? (
          <div
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md"
            title="Tarea finalizada"
          >
            ✔
          </div>
        ) : (
          tarea.fechaEntrega && (
            <div
              className={`absolute top-2 right-2 w-8 h-8 rounded-full shadow-md ${obtenerColorUrgencia(
                tarea.fechaEntrega
              )}`}
                title={`Entrega: ${tarea.fechaEntrega.split("T")[0]}`}
            ></div>
          )
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
    );
  };

  /* ---------------------- DROPPABLE ---------------------- */

  const DroppableColumna = ({
    estado,
    children,
  }: {
    estado: string;
    children: React.ReactNode;
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id: estado });

    return (
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 ${
          isOver ? "bg-purple-100 rounded-lg transition" : ""
        }`}
      >
        {children}
      </div>
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const nuevoEstado = over.id as Estado;
    const tareaId = active.id as number;

    const tarea = tareas.find((t) => t.id === tareaId);
    if (!tarea || tarea.estado === nuevoEstado) return;

    const res = await fetch(`http://localhost:3000/tareas/${tareaId}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: nuevoEstado,
      }),
    });

    if (res.ok) {
      setTareas(
        tareas.map((t) =>
          t.id === tareaId ? { ...t, estado: nuevoEstado } : t
        )
      );
    }
  };

  /* ---------------------- COLUMNAS ---------------------- */

  const renderColumna = (estadoColumna: Estado, lista: Tarea[]) => {
    return (
      <div className="bg-white/80 rounded-xl p-6 shadow-xl flex flex-col">
        <h2 className="text-xl font-semibold mb-4">{estadoColumna}</h2>

        <DroppableColumna estado={estadoColumna}>
          {lista.length === 0 && <p className="text-gray-500">Sin tareas</p>}

          {lista.map((tarea) => (
            <DraggableTarea key={tarea.id} tarea={tarea} />
          ))}
        </DroppableColumna>
      </div>
    );
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <div className="relative min-h-screen p-8 overflow-hidden">

      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-lg font-semibold">Cargando...</p>
          </div>
        </div>
      )}

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
              setTitulo("");
              setDescripcion("");
              setEstado("PENDIENTE");
              setFechaEntrega("");
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

        <input
          type="text"
          placeholder="🔍 Buscar tarea..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border bg-white/80 mb-4 shadow-sm"
        />

        <div className="flex gap-2 mb-4">

          {(["TODAS", "PENDIENTE", "EN_PROCESO", "FINALIZADO"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  filtro === f
                    ? "bg-purple-600 text-white"
                    : "bg-white/70 text-gray-700 hover:bg-white"
                }`}
              >
                {f === "TODAS"
                  ? `Todas (${total})`
                  : f === "PENDIENTE"
                  ? `Pendiente (${pendientes})`
                  : f === "EN_PROCESO"
                  ? `En proceso (${enProceso})`
                  : `Finalizado (${finalizadas})`}
              </button>
            )
          )}

        </div>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[80vh]">

            {(filtro === "TODAS" || filtro === "PENDIENTE") &&
              renderColumna(
                "PENDIENTE",
                tareas.filter((t) => t.estado === "PENDIENTE")
              )}

            {(filtro === "TODAS" || filtro === "EN_PROCESO") &&
              renderColumna(
                "EN_PROCESO",
                tareas.filter((t) => t.estado === "EN_PROCESO")
              )}

            {(filtro === "TODAS" || filtro === "FINALIZADO") &&
              renderColumna(
                "FINALIZADO",
                tareas.filter((t) => t.estado === "FINALIZADO")
              )}

          </div>

        </DndContext>

      </div>

      {/* MODAL */}

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
                onClick={() => {
                  setShowModal(false);
                  setErrorTitulo("");
                  setErrorDescripcion("");
                  setErrorFecha("");
                  setMensajeConfirmacion("");
                  setTitulo("");
                  setDescripcion("");
                  setEstado("PENDIENTE");
                  setFechaEntrega("");
                  setEditandoId(null);
                }}
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

      {/* MODAL ELIMINAR */}

      {tareaAEliminar !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30">

          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl text-center">

            <h2 className="text-xl font-semibold mb-2">
              ¿Eliminar tarea?
            </h2>

            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>

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