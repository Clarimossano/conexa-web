import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useDocumentTypes } from "../../../hooks/useDocumentTypes";

const PublicationDocumentsStep2 = ({
  transactionType,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const { groupedDocuments, loading, categoryLabels } = useDocumentTypes();
  const [selectedIds, setSelectedIds] = useState([]);

  // Lógica de Filtrado
  const getFilteredCategories = () => {
    if (transactionType === "offer") return ["LEGAL", "CARGO"];
    if (transactionType === "request")
      return ["LEGAL", "DRIVER", "VEHICLE", "CARGO"];
    return [];
  };
  const allowedCategories = getFilteredCategories();

  const toggleDoc = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="p-20 text-center font-bold text-xl dark:text-white">
        Cargando catálogo...
      </div>
    );

  // --- ESTILOS ---
  const checkboxClass = `
    h-5 w-5 shrink-0 appearance-none rounded border-2 
    border-neutral-400 dark:border-neutral-600 
    bg-transparent text-amber-500 
    checked:border-amber-500 checked:bg-amber-500 
    focus:outline-none focus:ring-amber-500/50 focus:ring-offset-2 dark:focus:ring-offset-neutral-900
    transition-all cursor-pointer flex items-center justify-center
  `;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      <div className="flex h-full grow flex-col items-center">
        <div className="flex w-full max-w-4xl flex-col px-4 sm:px-6 lg:px-8">
          {/* 1. TOP NAVBAR (Solo Botón Volver) */}
          <header className="flex items-center py-6">
            <button
              onClick={onBack}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-neutral-800/50 text-gray-600 dark:text-neutral-300 transition-colors hover:bg-gray-300 dark:hover:bg-neutral-800"
            >
              <ArrowLeft size={20} />
            </button>
          </header>

          {/* 2. MAIN CONTENT */}
          <main className="flex-1 pb-12">
            {/* Page Heading */}
            <div className="mb-8 px-1">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-gray-50 min-w-72">
                Seleccionar Documentación
              </h1>
              <p className="text-gray-500 dark:text-neutral-400 mt-2 text-base">
                Marque los documentos que exigirá a la contraparte para validar
                la operación.
              </p>
            </div>

            {/* Grupos de Documentos */}
            <div className="space-y-8">
              {Object.entries(groupedDocuments).map(([category, docs]) => {
                if (!allowedCategories.includes(category)) return null;

                return (
                  <div key={category} className="animate-fadeIn">
                    <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 text-gray-900 dark:text-neutral-100 uppercase">
                      {categoryLabels[category] || category}
                    </h3>

                    <div className="flex flex-col">
                      {docs.map((doc) => {
                        const isChecked = selectedIds.includes(doc.id);
                        return (
                          <label
                            key={doc.id}
                            className="flex cursor-pointer gap-x-4 p-4 transition-colors hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg group"
                          >
                            {/* Checkbox Custom */}
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={isChecked}
                                onChange={() => toggleDoc(doc.id)}
                              />
                              <Check
                                size={14}
                                className={`absolute text-black pointer-events-none transition-opacity duration-200 ${
                                  isChecked ? "opacity-100" : "opacity-0"
                                }`}
                                strokeWidth={4}
                              />
                            </div>

                            {/* Textos */}
                            <div>
                              <p
                                className={`text-base font-medium leading-normal transition-colors ${
                                  isChecked
                                    ? "text-amber-600 dark:text-amber-500"
                                    : "text-gray-900 dark:text-neutral-100"
                                }`}
                              >
                                {doc.name}
                              </p>
                              <p className="text-sm font-normal leading-normal text-gray-500 dark:text-neutral-400">
                                {doc.description ||
                                  "Documento requerido para validación estándar."}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. ACTION BUTTON (Al final del flujo, no fijo) */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-neutral-800">
              <button
                onClick={() => onSubmit(selectedIds)}
                disabled={isSubmitting}
                className="flex w-full h-14 items-center justify-center rounded-lg bg-amber-500 text-black text-lg font-bold transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-background-dark disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? "Procesando..." : "Confirmar Selección"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PublicationDocumentsStep2;
