import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ChevronDown, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const PublicationFormStep1 = ({ initialData, onSubmit, allowedType }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (allowedType) setValue("type", allowedType);
  }, [allowedType, setValue]);

  const onStepSubmit = (data) => {
    const dateFieldName = data.type === "offer" ? "availableDate" : "readyDate";
    const dateValue = data[dateFieldName];
    if (dateValue) data[dateFieldName] = new Date(dateValue).toISOString();
    onSubmit(data);
  };

  // --- ESTILOS REUTILIZABLES (Basados en Stitch) ---

  // Inputs: Altura 14 (56px), fondo oscuro específico #191919, borde sutil #333333
  const inputStyles = `
    flex w-full flex-1 resize-none overflow-hidden rounded-lg 
    h-14 p-[15px] text-base font-normal leading-normal transition-colors duration-200 outline-none
    
    text-gray-900 bg-white border border-gray-200 placeholder:text-gray-400
    focus:border-primary focus:ring-2 focus:ring-primary/20
    
    dark:text-white dark:bg-[#191919] dark:border-[#333333] dark:placeholder:text-[#888888]
  `;

  // Labels: Texto mediano, color gris claro en dark mode
  const labelStyles = `
    text-base font-medium leading-normal pb-2
    text-gray-700 dark:text-[#E0E0E0]
  `;

  // Select Wrapper (para posicionar la flecha custom)
  const selectWrapperStyles = "relative w-full";
  const selectArrowStyles =
    "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-[#888888]";

  return (
    <div className="flex flex-col items-center px-4 sm:px-10 md:px-20 py-5 sm:py-10">
      <div className="w-full max-w-[960px]">
        {/* HEADER */}
        <div className="mb-8 gap-3 flex flex-col">
          <Link
            to="/marketplace"
            className="inline-flex items-center text-gray-500 dark:text-[#888888] hover:text-primary transition-colors mb-2 w-fit"
          >
            <ArrowLeft size={20} className="mr-2" /> Volver
          </Link>
          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
            Crear Nueva Oferta o Demanda
          </h1>
          <p className="text-gray-500 dark:text-[#888888] text-base font-normal">
            Complete los siguientes campos para publicar su requerimiento en la
            plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit(onStepSubmit)}>
          {/* 1. SELECTOR DE TIPO (Toggle Pill) */}
          <div className="flex mb-8">
            <div
              className="flex flex-1 h-12 w-full sm:w-auto sm:min-w-[300px] items-center justify-center rounded-lg p-1 border transition-colors
              bg-gray-100 border-gray-200 
              dark:bg-[#191919] dark:border-[#333333]"
            >
              {["offer", "request"].map((type) => {
                const isActive = selectedType === type;
                const isDisabled = allowedType && allowedType !== type;

                if (isDisabled) return null; // Ocultar si no está permitido por rol

                return (
                  <label
                    key={type}
                    className={`
                    flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-6 text-sm font-medium leading-normal transition-all duration-200
                    ${
                      isActive
                        ? "dark:bg-amber-500 bg-[#005A9C] text-white dark:text-black shadow-[0_0_4px_rgba(245,159,10,0.3)] font-bold"
                        : "text-gray-500 dark:text-[#E0E0E0] hover:bg-gray-200 dark:hover:bg-[#333333]"
                    }
                  `}
                  >
                    <span className="truncate">
                      {type === "offer" ? "Oferta" : "Demanda"}
                    </span>
                    <input
                      type="radio"
                      value={type}
                      {...register("type")}
                      className="hidden"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. SECCIÓN RUTA */}
          <section className="mb-8">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4 text-gray-900 dark:text-white">
              Sección de Ruta
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>Origen</p>
                <input
                  {...register("origin", { required: true })}
                  className={inputStyles}
                  placeholder="Ciudad o puerto de origen"
                />
                {errors.origin && (
                  <span className="text-red-500 text-xs mt-1">Requerido</span>
                )}
              </label>
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>Destino</p>
                <input
                  {...register("destination", { required: true })}
                  className={inputStyles}
                  placeholder="Ciudad o puerto de destino"
                />
              </label>
            </div>
          </section>

          {/* 3. SECCIÓN CARGA / VEHÍCULO */}
          <section className="mb-8">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4 text-gray-900 dark:text-white">
              Sección de Carga/Vehículo
            </h3>

            {/* Fila 1: Tipo de Carga y Vehículo */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>Tipo de Mercancía</p>
                <div className={selectWrapperStyles}>
                  <select
                    {...register("cargoType", { required: true })}
                    className={`${inputStyles} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Seleccione un tipo
                    </option>
                    <option value="carga general">Carga General</option>
                    <option value="perecederos">Perecederos</option>
                    <option value="granel">Granel</option>
                    <option value="embalada">Embalada</option>
                  </select>
                  <ChevronDown size={20} className={selectArrowStyles} />
                </div>
              </label>

              <label className="flex flex-col flex-1">
                <p className={labelStyles}>
                  {selectedType === "offer"
                    ? "Vehículo Ofrecido"
                    : "Vehículo Requerido"}
                </p>
                <div className={selectWrapperStyles}>
                  <select
                    {...register(
                      selectedType === "offer"
                        ? "vehicleType"
                        : "requiredVehicleType",
                      { required: true }
                    )}
                    className={`${inputStyles} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Seleccione un tipo
                    </option>
                    <option value="semiremolque">Semiremolque</option>
                    <option value="camion_rigido">Camión Rígido</option>
                    <option value="frigorifico">Frigorífico</option>
                    <option value="cisterna">Cisterna</option>
                    <option value="plataforma">Plataforma</option>
                  </select>
                  <ChevronDown size={20} className={selectArrowStyles} />
                </div>
              </label>
            </div>

            {/* Fila 2: Peso y Volumen */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>Peso (kg)</p>
                <input
                  type="number"
                  {...register("weightKg", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className={inputStyles}
                  placeholder="e.g., 20000"
                />
              </label>
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>Volumen (m³)</p>
                <input
                  type="number"
                  {...register("volumeM3", { valueAsNumber: true })}
                  className={inputStyles}
                  placeholder="e.g., 33"
                />
              </label>
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>Cantidad Vehículos</p>
                <input
                  type="number"
                  defaultValue={1}
                  {...register("numberOfVehicles", {
                    required: true,
                    valueAsNumber: true,
                    min: 1,
                  })}
                  className={inputStyles}
                />
              </label>
            </div>

            {/* Fila 3: Textarea */}
            <label className="flex flex-col w-full">
              <p className={labelStyles}>Detalles Adicionales (Opcional)</p>
              <textarea
                {...register("notes")}
                className={`${inputStyles} h-32 resize-y py-3`}
                placeholder="Instrucciones especiales, dimensiones, tipo de embalaje, etc."
              ></textarea>
            </label>
          </section>

          {/* 4. SECCIÓN FECHAS */}
          <section className="mb-8">
            <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] pb-4 text-gray-900 dark:text-white">
              Sección de Fechas y Disponibilidad
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <label className="flex flex-col flex-1">
                <p className={labelStyles}>
                  {selectedType === "offer"
                    ? "Fecha de Disponibilidad"
                    : "Carga Lista Desde"}
                </p>
                <div className={selectWrapperStyles}>
                  <input
                    type="datetime-local"
                    {...register(
                      selectedType === "offer" ? "availableDate" : "readyDate",
                      { required: true }
                    )}
                    className={`${inputStyles} pr-10`}
                    // El input date nativo tiene su propio icono, pero podemos forzar el estilo oscuro con CSS global si es necesario
                  />
                  <Calendar size={20} className={selectArrowStyles} />
                </div>
              </label>
            </div>
          </section>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-end gap-4 py-4 mt-4 border-t border-gray-200 dark:border-[#333333]">
            <Link to="/marketplace">
              <button
                type="button"
                className="flex items-center justify-center font-bold h-12 px-6 rounded-lg transition-colors duration-200 text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-100 dark:text-[#E0E0E0] dark:border-[#333333] dark:hover:bg-[#191919]"
              >
                Cancelar
              </button>
            </Link>

            {/* CAMBIO: Texto explícito de 'Continuar' */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 font-bold bg-[#005A9C] dark:bg-amber-500 text-white dark:text-black bg-primary h-12 px-8 rounded-lg hover:brightness-110 transition-all duration-200 shadow-lg"
            >
              <span>Continuar a Documentación</span>
              <ArrowLeft className="rotate-180" size={20} />{" "}
              {/* Flecha derecha */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicationFormStep1;
