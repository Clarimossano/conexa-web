import { useState, useEffect, useRef } from "react"
import {
  Pencil,Trash2, Truck, Package, Save, X, ChevronDown,
  ChevronUp, FileText, Loader2, CheckCircle2,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { useDocumentTypes } from "../../hooks/useDocumentTypes"
import {
  updateListingContent,
  updateOfferDocuments,
  updateRequestDocuments,
  deleteOffer,
  deleteRequest,
  getListingById,
} from "../../services/market.service"

const PublicationCard = ({ item, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Estado para el Modal de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estado para carga de detalles
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Refs para scroll
  const cardRef = useRef(null)

  const { register, handleSubmit, reset } = useForm()

  const isOffer = !!item.vehicle_type

  // Hooks de documentos (Catálogo para el selector)
  const { groupedDocuments, loading: loadingDocs } = useDocumentTypes()

  // --- CORRECCIÓN DE ESTADO ---
  // Guardamos los objetos completos (con nombre) para mostrar en modo lectura
  const [currentDocs, setCurrentDocs] = useState([])
  // Guardamos solo los IDs para el manejo del formulario de edición
  const [editDocIds, setEditDocIds] = useState([])

  const getAllowedCategories = () => {
    if (isOffer) return ["LEGAL", "CARGO"]
    return ["LEGAL", "DRIVER", "VEHICLE", "CARGO"]
  }
  const allowedCategories = getAllowedCategories()

  // --- EFECTO: Cargar detalles al expandir o editar ---
  useEffect(() => {
    if (isExpanded || isEditing) {
      // CORRECCIÓN: Verificar currentDocs en lugar de currentDocIds
      if (currentDocs.length > 0 && !isEditing) return

      setIsLoadingDetails(true)
      const type = isOffer ? "offer" : "request"

      getListingById(type, item.id)
        .then((fullData) => {
          // CORRECCIÓN: Guardar objetos completos
          const docs = fullData.requiredDocuments || []
          setCurrentDocs(docs)

          // Extraer IDs para el estado de edición
          const ids = docs.map((d) => d.id)
          setEditDocIds(ids)

          if (isEditing) {
            reset({
              origin: fullData.origin,
              destination: fullData.destination,
              weight_kg: fullData.weight_kg,
              volume_m3: fullData.volume_m3,
              notes: fullData.notes,
              cargo_type: fullData.cargo_type,
            })
          }
        })
        .catch((err) => console.error("Error cargando detalles", err))
        .finally(() => setIsLoadingDetails(false))
    }
  }, [isExpanded, isEditing, item.id, isOffer, reset])

  useEffect(() => {
    if (isEditing && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [isEditing])

  // --- HANDLERS ---
  const handleEditClick = (e) => {
    e.stopPropagation()
    setIsExpanded(true)
    setIsEditing(true)
  }

  const onEditSubmit = async (data) => {
    try {
      const type = isOffer ? "offer" : "request"
      await updateListingContent(type, item.id, data)

      if (isOffer) await updateOfferDocuments(item.id, editDocIds)
      else await updateRequestDocuments(item.id, editDocIds)

      setIsEditing(false)
      if (onUpdate) onUpdate()
    } catch (e) {
      console.error(e)
      alert("Error al actualizar la publicación")
    }
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      if (isOffer) await deleteOffer(item.id)
      else await deleteRequest(item.id)

      setIsDeleteModalOpen(false)
      if (onUpdate) onUpdate()
    } catch {
      alert("Error al eliminar")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleDoc = (docId) => {
    setEditDocIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    )
  }

  const toggleExpand = (e) => {
    if (["INPUT", "BUTTON", "TEXTAREA", "LABEL"].includes(e.target.tagName))
      return
    if (!isEditing) setIsExpanded(!isExpanded)
  }

  // --- ESTILOS ---
  const statusColor =
    item.status === "open"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-gray-100 text-gray-800"
  const statusLabel = item.status === "open" ? "Activa" : item.status

  const Icon = isOffer ? Truck : Package
  const typeBadgeClass = isOffer
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"

  const iconColorClass = isOffer 
  ? "text-blue-700 dark:text-blue-300" 
  : "text-amber-700 dark:text-amber-300"

  const inputClass =
    "w-full px-3 py-1.5 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"

  // Botones reutilizables
  const ActionButtons = () => (
    <div className="flex items-center gap-3">
      <button
        onClick={handleEditClick}
        className="flex items-center gap-1.5 text-sm font-bold text-[#005A9C] hover:text-blue-700 dark:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/10"
      >
        <Pencil size={14} /> Editar
      </button>
      <div className="w-px h-4 bg-gray-300 dark:bg-white/10"></div>
      <button
        onClick={handleDeleteClick}
        className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-800 dark:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        <Trash2 size={14} /> Eliminar
      </button>
    </div>
  )

  return (
    <>
      <div
        ref={cardRef}
        className={`bg-white dark:bg-[#111111] rounded-xl border transition-all duration-200 overflow-hidden 
        ${
          isExpanded
            ? "border-primary ring-1 ring-primary shadow-md"
            : "border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm"
        }`}
      >
        {/* --- HEADER (Resumen) --- */}
        <div
          className="p-5 flex flex-col gap-4 cursor-pointer relative"
          onClick={toggleExpand}
        >
          {/* Badge Superior */}
          <div className="flex justify-between items-center">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${typeBadgeClass}`}
            >
              {isOffer ? "Oferta de Transporte" : "Solicitud de Carga"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Icono */}
            <div className={`h-12 w-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0 ${iconColorClass} mt-1`}>
              <Icon size={24} strokeWidth={1.5} />
            </div>

            {/* Info Principal */}
            <div className="grow min-w-0">
              <div>
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-2 mb-3 w-full animate-fadeIn">
                    <input
                      {...register("origin")}
                      className={inputClass}
                      placeholder="Origen"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="hidden sm:inline text-gray-400 self-center">
                      ➝
                    </span>
                    <input
                      {...register("destination")}
                      className={inputClass}
                      placeholder="Destino"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate leading-tight mb-3">
                    {item.origin} <span className="text-gray-400 mx-1">➝</span>{" "}
                    {item.destination}
                  </h3>
                )}

                {/* Detalles Verticales + Botones alineados */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex flex-col gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold w-24 text-gray-500 dark:text-gray-400">
                        Fecha:
                      </span>
                      {new Date(
                        item.available_date || item.ready_date
                      ).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold w-24 text-gray-500 dark:text-gray-400">
                        Tipo de carga:
                      </span>
                      <span className="capitalize">{item.cargo_type}</span>
                    </p>
                  </div>

                  {/* BOTONES DE ACCIÓN (Visibles cuando NO se edita y NO está expandido) */}
                  {!isEditing && !isExpanded && <ActionButtons />}
                </div>
              </div>
            </div>

            {/* Flecha Toggle */}
            <div className="self-center">
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- BODY EXPANDIBLE --- */}
        {isExpanded && (
          <div className="px-6 pb-6 pt-0 animate-fadeIn">
            <div className="border-t border-gray-200 dark:border-neutral-800 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* COL 1: DETALLES TÉCNICOS */}
              <div className="space-y-5">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Package size={14} /> Detalles de la Operación
                </h4>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-500 dark:text-gray-400 block mb-1 text-xs">
                      Peso Total
                    </label>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          {...register("weight_kg")}
                          className={inputClass}
                        />
                        <span className="text-gray-500">kg</span>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.weight_kg} kg
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-500 dark:text-gray-400 block mb-1 text-xs">
                      Volumen
                    </label>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          {...register("volume_m3")}
                          className={inputClass}
                        />
                        <span className="text-gray-500">m³</span>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.volume_m3 || "-"} m³
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-500 dark:text-gray-400 block mb-1 text-xs">
                      {isOffer ? "Vehículo Ofrecido" : "Vehículo Requerido"}
                    </label>
                    <p className="font-medium text-gray-900 dark:text-white capitalize bg-gray-50 dark:bg-white/5 p-2 rounded border border-gray-100 dark:border-white/5">
                      {isOffer ? item.vehicle_type : item.required_vehicle_type}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 dark:text-gray-400 block mb-1 text-xs">
                    Notas Adicionales
                  </label>
                  {isEditing ? (
                    <textarea
                      {...register("notes")}
                      className={`${inputClass} min-h-20 resize-none`}
                    />
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-3 rounded-lg border border-gray-200 dark:border-white/5 leading-relaxed">
                      {item.notes || (
                        <span className="italic opacity-50">
                          Sin notas adicionales.
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* COL 2: DOCUMENTACIÓN & ACCIONES */}
              <div className="flex flex-col h-full">
                <div className="grow">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText size={14} /> Documentación Requerida
                  </h4>

                  {/* LOADING STATE PARA DOCS */}
                  {isLoadingDetails && !isEditing && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                      <Loader2 className="animate-spin" size={14} /> Cargando
                      documentos...
                    </div>
                  )}

                  {/* MODO LECTURA: LISTA DE NOMBRES (CORREGIDO) */}
                  {!isEditing && !isLoadingDetails && (
                    <div className="space-y-2">
                      {currentDocs.length === 0 ? (
                        <p className="text-sm text-gray-500 italic bg-gray-50 dark:bg-white/5 p-2 rounded">
                          No se requieren documentos específicos.
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {currentDocs.map((doc) => (
                            <li
                              key={doc.id}
                              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                              <CheckCircle2
                                size={14}
                                className="text-green-500 mt-0.5 shrink-0"
                              />
                              <span>{doc.name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* MODO EDICIÓN DE DOCS (SELECTOR) */}
                  {isEditing && (
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-4 border border-gray-200 dark:border-neutral-700 rounded-lg p-3 bg-gray-50 dark:bg-black/20">
                      {loadingDocs ? (
                        <p className="text-xs text-center py-4">
                          Cargando catálogo...
                        </p>
                      ) : (
                        Object.entries(groupedDocuments).map(([cat, docs]) => {
                          if (!allowedCategories.includes(cat)) return null
                          return (
                            <div key={cat}>
                              <h5 className="text-xs font-bold text-gray-400 mb-2 uppercase">
                                {cat}
                              </h5>
                              <div className="space-y-1">
                                {docs.map((doc) => (
                                  <label
                                    key={doc.id}
                                    className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 p-1.5 rounded select-none"
                                  >
                                    <input
                                      type="checkbox"
                                      className="rounded text-primary focus:ring-primary bg-white dark:bg-neutral-800 border-gray-300 dark:border-gray-600"
                                      checked={editDocIds.includes(doc.id)}
                                      onChange={() => toggleDoc(doc.id)}
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                      {doc.name}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* BOTONES FINALES (SOLO EN MODO EDICIÓN O EXPANDIDO) */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setIsExpanded(false)
                        }}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-bold transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSubmit(onEditSubmit)}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-bold shadow-sm transition-colors"
                      >
                        <Save size={16} /> Guardar Cambios
                      </button>
                    </>
                  ) : (
                    // Botones visibles al expandir
                    <ActionButtons />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DE ELIMINACIÓN --- */}
        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-white/10 transform transition-all scale-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Eliminar Publicación
                </h2>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  ¿Estás seguro de que deseas eliminar esta publicación
                  permanentemente?
                </p>
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {item.origin} ➝ {item.destination}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PublicationCard
