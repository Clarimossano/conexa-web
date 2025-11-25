import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { createOffer, createRequest } from "../../services/market.service"
import PublicationFormStep1 from "./components/PublicationFormStep1"
import PublicationDocumentsStep2 from "./components/PublicationDocumentsStep2"
import { CheckCircle2, XCircle } from "lucide-react" // Iconos para el modal

const CreatePublicationPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Estado del Wizard
  const [step, setStep] = useState(1)

  // Estado global del formulario
  const [formData, setFormData] = useState({
    type: "offer",
    requiredDocuments: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // ESTADO PARA EL MODAL DE RESULTADO (Reemplazo de alert)
  const [modalStatus, setModalStatus] = useState({
    isOpen: false,
    type: "success", // 'success' | 'error'
    title: "",
    message: "",
  })

  // Lógica de Tipo Permitido
  const allowedType =
    user?.rol === "operador_dual"
      ? null
      : user?.rol === "transportista"
      ? "offer"
      : "request"

  // Handler paso 1
  const handleStep1Submit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setStep(2)
  }

  // --- HANDLER FINAL MODIFICADO ---
  const handleFinalSubmit = async (docIds) => {
    setIsSubmitting(true)
    try {
      const finalPayload = {
        ...formData,
        requiredDocuments: docIds,
      }

      if (formData.type === "offer") {
        await createOffer(finalPayload)
      } else {
        await createRequest(finalPayload)
      }

      // ÉXITO: Abrir modal en modo success
      setModalStatus({
        isOpen: true,
        type: "success",
        title: "¡Publicación creada!",
        message:
          "Tu publicación ha sido registrada exitosamente y ya es visible en el mercado.",
      })
    } catch (error) {
      console.error("Error creando publicación", error)
      const msg =
        error.response?.data?.message ||
        "Hubo un problema al procesar tu solicitud."

      // ERROR: Abrir modal en modo error
      setModalStatus({
        isOpen: true,
        type: "error",
        title: "Error al crear",
        message: msg,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Acción al cerrar el modal
  const handleCloseModal = () => {
    if (modalStatus.type === "success") {
      navigate("/marketplace") // Solo redirigir si fue éxito
    } else {
      setModalStatus((prev) => ({ ...prev, isOpen: false })) // Solo cerrar si fue error para corregir
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white relative">
      {/* WIZARD */}
      {step === 1 ? (
        <PublicationFormStep1
          initialData={formData}
          onSubmit={handleStep1Submit}
          allowedType={allowedType}
        />
      ) : (
        <PublicationDocumentsStep2
          transactionType={formData.type}
          onBack={() => setStep(1)}
          onSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* --- MODAL DE ESTADO (SUCCESS / ERROR) --- */}
      {modalStatus.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200 dark:border-white/10 transform transition-all scale-100 flex flex-col items-center text-center">
            {/* Icono Dinámico */}
            <div
              className={`mb-6 p-4 rounded-full ${
                modalStatus.type === "success"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {modalStatus.type === "success" ? (
                <CheckCircle2 size={48} strokeWidth={2} />
              ) : (
                <XCircle size={48} strokeWidth={2} />
              )}
            </div>

            {/* Textos */}
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {modalStatus.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-base leading-relaxed">
              {modalStatus.message}
            </p>

            {/* Botón de Acción */}
            <button
              onClick={handleCloseModal}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${
                modalStatus.type === "success"
                  ? "bg-green-600 hover:bg-green-700 shadow-green-900/20"
                  : "bg-red-600 hover:bg-red-700 shadow-red-900/20"
              }`}
            >
              {modalStatus.type === "success"
                ? "Ir al Mercado"
                : "Cerrar y Corregir"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatePublicationPage
