import React, { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  dueDate: z.string().min(1, "La fecha de entrega es obligatoria"),
});

type TaskForm = z.infer<typeof taskSchema>;

export default function App() {
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

  const abrirModal = () => {
    reset();
    setShowModal(true);
  };

  const onSubmit = (data: TaskForm) => {
    console.log("Tarea creada:", data);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestor de Tareas</h1>

        <button
          onClick={abrirModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Agregar tarea
        </button>
      </header>


      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              aria-label="Cerrar"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">Nueva tarea</h2>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  type="text"
                  placeholder="Título *"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="Descripción *"
                  className={`w-full border rounded-lg px-3 py-2 min-h-[90px] ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Fecha de entrega *
                </label>
                <input
                  type="date"
                  className={`w-full border rounded-lg px-3 py-2 ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("dueDate")}
                />
                {errors.dueDate && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Estado actual</label>
                <input
                  type="text"
                  disabled
                  value="Pendiente"
                  className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Guardar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}