import React, { useState } from "react";
import { useMyPublications } from "../../hooks/useMyPublications";
import PublicationCard from "../../components/market/PublicationCard";
import { Link } from "react-router-dom";
import { PlusCircle, Search, Filter, ListFilter } from "lucide-react";

const MyPublicationsPage = () => {
  const { data, loading, error, refetchData } = useMyPublications();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Normalización de datos
  const finalPublications = data?.publications || [];
  const normalizedRole =
    data?.role === "transportista"
      ? "offer"
      : data?.role === "empresa"
      ? "request"
      : "dual";

  // Lógica de Filtrado
  const filterList = (list) => {
    return list.filter((item) => {
      // Filtro de Texto
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        (item.origin || "").toLowerCase().includes(term) ||
        (item.destination || "").toLowerCase().includes(term);

      // Filtro de Tipo (Solo para Dual)
      let matchesType = true;
      if (normalizedRole === "dual") {
        if (filter === "offers") matchesType = !!item.vehicle_type;
        if (filter === "requests") matchesType = !!item.required_vehicle_type;
      }

      return matchesSearch && matchesType;
    });
  };

  const displayedPublications = filterList(finalPublications);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Cargando...
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] font-display text-gray-900 dark:text-gray-200 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* HEADER CLEAN */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
              Mis Publicaciones
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Gestiona y edita tus ofertas y solicitudes activas.
            </p>
          </div>

          <Link
            to="/marketplace/create"
            className="flex items-center justify-center gap-2 bg-[#005A9C] hover:bg-[#004a80] text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <PlusCircle size={20} />
            <span>Nueva Publicación</span>
          </Link>
        </div>

        {/* BARRA DE HERRAMIENTAS */}
        <div className="bg-white dark:bg-[#111111] p-2 rounded-xl shadow-sm border border-gray-200 dark:border-white/5 mb-6 flex flex-col md:flex-row gap-2 items-center">
          {/* Buscador Estilizado */}
          <div className="relative grow w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por origen o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
            />
          </div>

          {/* Separador Vertical (Desktop) */}
          <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-white/10 mx-2"></div>

          {/* Filtros (Solo Dual) */}
          {normalizedRole === "dual" && (
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  filter === "all"
                    ? "bg-white dark:bg-[#222] text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Todo
              </button>
              <button
                onClick={() => setFilter("offers")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  filter === "offers"
                    ? "bg-white dark:bg-[#222] text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Ofertas
              </button>
              <button
                onClick={() => setFilter("requests")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  filter === "requests"
                    ? "bg-white dark:bg-[#222] text-black dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Demandas
              </button>
            </div>
          )}

          <div className="flex gap-2 w-full md:w-auto justify-end px-2">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
              <Filter size={18} />{" "}
              <span className="hidden sm:inline">Estado</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
              <ListFilter size={18} />{" "}
              <span className="hidden sm:inline">Fecha</span>
            </button>
          </div>
        </div>

        {/* LISTADO DE TARJETAS */}
        <div className="space-y-4">
          {displayedPublications.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No se encontraron resultados
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Intenta ajustar los filtros o crea una nueva publicación.
              </p>
            </div>
          ) : (
            displayedPublications.map((item) => (
              <PublicationCard
                key={item.id}
                item={item}
                onUpdate={refetchData}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPublicationsPage;
