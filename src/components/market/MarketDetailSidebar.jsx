import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation
import {
  X,
  Calendar,
  Package,
  Truck,
  Scale,
  Box,
  FileText,
  CheckCircle2,
  MessageSquare, // Added Icon
} from "lucide-react";
import { getListingById } from "../../services/market.service";
import { initConversation } from "../../services/chat.service"; // Chat Service
import { useAuth } from "../../context/AuthContext"; // Auth Context

const MarketDetailSidebar = ({ item, onClose, isOpen }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [fullData, setFullData] = useState(item);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [contactLoading, setContactLoading] = useState(false); // State for button loading

  const isOffer = !!item.vehicle_type;

  // Check if the current user is the owner of the publication
  // We check both item (prop) and fullData (fetched) to be sure
  const ownerId = item.user_id || fullData.user_id;
  const isOwner = user?.id === ownerId;

  // --- SCROLL LOCK LOGIC ---
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // --- FETCH FULL DETAILS ---
  useEffect(() => {
    if (isOpen && item.id) {
      setLoadingDetails(true);
      const type = isOffer ? "offer" : "request";
      getListingById(type, item.id)
        .then((data) => setFullData(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingDetails(false));
    }
  }, [item, isOpen, isOffer]);

  // --- CONTACT HANDLER ---
  const handleContact = async () => {
    if (isOwner) return;

    setContactLoading(true);
    try {
      // 1. Init conversation (REST)
      const conversation = await initConversation(user.id, ownerId);
      const contextMessage = `Hola, estoy interesado en tu ${isOffer ? "oferta de transporte" : "solicitud de carga"}: ${item.origin} ➝ ${item.destination} (${item.cargo_type}).`
      
      // 2. Redirect to Inbox with state (Magic Jump)
      navigate("/messages", { 
        state: { 
          selectedChatId: conversation.id,
          initialMessage: contextMessage
        }
      });
    } catch (error) {
      console.error("Error initiating chat:", error);
      // Optional: Add a toast notification here
    } finally {
      setContactLoading(false);
    }
  };

  if (!isOpen) return null;

  // Labels
  const typeLabel = isOffer ? "OFERTA DE TRANSPORTE" : "SOLICITUD DE CARGA";
  // If user is owner, show different text, else show action
  const actionLabel = isOffer ? "Me Interesa" : "Ofertar Servicio";

  // Styles
  const typeBadgeClass = isOffer
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border-amber-200 dark:border-amber-800";

  // Dynamic Button Class
  const getButtonClass = () => {
    if (isOwner) {
      return "bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-gray-500 cursor-not-allowed";
    }
    return isOffer
      ? "bg-[#005A9C] hover:bg-[#004a80] dark:bg-amber-600 dark:hover:bg-amber-500 text-white"
      : "bg-amber-500 hover:bg-amber-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-black";
  };

  const mapImageUrl = item.mapUrl;

  const headerIconClasses = isOffer
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";

  return (
    <>
      {/* 1. BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 2. SIDEBAR CONTAINER */}
      <div className="animate-fadeIn fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-white dark:bg-[#111] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-gray-200 dark:border-white/10">
        
        {/* --- TOP: MAP HEADER --- */}
        <div className="relative h-56 w-full shrink-0">
          {mapImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${mapImageUrl}')` }}
            >
              <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
            </div>
          ) : (
            <div
              className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${headerIconClasses} border-0`}
            >
              {isOffer ? (
                <Truck size={28} className="mb-1 opacity-80" />
              ) : (
                <Package size={28} className="mb-1 opacity-80" />
              )}
              <span className="text-sm font-black uppercase tracking-widest opacity-90 leading-none">
                {isOffer ? "OFERTA" : "PEDIDO"}
              </span>
              <span className="text-[10px] font-bold opacity-70 mt-1 uppercase tracking-wide leading-tight">
                {isOffer ? "Transporte" : "Carga"}
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-gray-800 dark:text-white rounded-full transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- MAIN CONTENT (SCROLLABLE) --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white dark:bg-[#111]">
          {/* 1. TITLES & ROUTE */}
          <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${typeBadgeClass}`}
              >
                {typeLabel}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  item.status === "open"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.status === "open" ? "ACTIVA" : item.status}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-1">
                {item.origin}
              </h2>
              <div className="pl-1 border-l-2 border-gray-300 dark:border-gray-700 ml-1 my-1 py-1">
                <p className="text-xs text-gray-400 font-mono ml-2">
                  RUTA DIRECTA
                </p>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {item.destination}
              </h2>
            </div>
          </div>

          {/* 2. DATES & TYPE */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                Fecha Salida
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Calendar size={18} className="text-amber-500" />
                {new Date(
                  item.available_date || item.ready_date
                ).toLocaleDateString()}
              </div>
            </div>
            <div className="h-10 w-px bg-gray-200 dark:bg-white/10"></div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                Carga
              </span>
              <div className="flex items-center justify-end gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <span className="capitalize">{item.cargo_type}</span>
                <Package size={18} className="text-amber-500" />
              </div>
            </div>
          </div>

          {/* 3. TECHNICAL SPECS */}
          <section>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <Truck size={16} /> Especificaciones de Carga
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div className="p-4 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-black/20">
                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                  Peso Total
                </span>
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Scale size={20} className="text-gray-400" />
                  {item.weight_kg}{" "}
                  <span className="text-xs font-normal text-gray-500 self-end mb-1">
                    kg
                  </span>
                </div>
              </div>

              {/* Volume */}
              <div className="p-4 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-black/20">
                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                  Volumen
                </span>
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Box size={20} className="text-gray-400" />
                  {item.volume_m3 || "-"}{" "}
                  <span className="text-xs font-normal text-gray-500 self-end mb-1">
                    m³
                  </span>
                </div>
              </div>

              {/* Vehicle */}
              <div className="col-span-2 p-4 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-black/20 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">
                    {isOffer ? "Vehículo Ofrecido" : "Vehículo Requerido"}
                  </span>
                  <p className="text-base font-bold text-gray-900 dark:text-white capitalize">
                    {isOffer ? item.vehicle_type : item.required_vehicle_type}
                  </p>
                </div>
                <Truck size={24} className="text-gray-300 dark:text-gray-600" />
              </div>
            </div>
          </section>

          {/* 4. NOTES */}
          {item.notes && (
            <section>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Notas del Usuario
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-4 rounded-lg border-l-4 border-amber-500">
                "{item.notes}"
              </div>
            </section>
          )}

          {/* 5. DOCUMENTS */}
          <section className="pb-8">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText size={16} /> Requisitos Documentales
            </h3>

            {loadingDetails ? (
              <div className="flex items-center gap-2 text-sm text-gray-500 p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Cargando requisitos...
              </div>
            ) : (
              <div className="space-y-3">
                {fullData.requiredDocuments &&
                fullData.requiredDocuments.length > 0 ? (
                  fullData.requiredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-white/10"
                    >
                      <CheckCircle2
                        className="text-green-500 mt-0.5 shrink-0"
                        size={18}
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {doc.name}
                        </p>
                        {doc.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-center">
                    <p className="text-sm text-gray-500">
                      No se requiere documentación específica.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* --- 3. FOOTER ACTION (STICKY BOTTOM) --- */}
        <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-white/10 shrink-0 z-10">
          <button
            onClick={handleContact}
            disabled={contactLoading || isOwner}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${getButtonClass()}`}
          >
            {contactLoading ? (
              <span className="flex items-center gap-2">
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                 Iniciando Chat...
              </span>
            ) : isOwner ? (
               "Es tu publicación"
            ) : (
              <>
                 <MessageSquare size={20} className={isOffer ? "text-white" : "text-black"} />
                 {actionLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default MarketDetailSidebar;