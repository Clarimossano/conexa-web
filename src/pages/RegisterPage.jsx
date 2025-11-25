import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"
import { ArrowRight, ArrowLeft } from 'lucide-react'

const LogoIcon = () => (
  <svg
    className="mx-auto h-12 w-auto text-amber-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.256a1.107 1.107 0 0 0 .57 1.664l.143.048a1.107 1.107 0 0 0 1.161.886l.51.766c.319.48.126 1.121-.216 1.49l-1.068.89a1.125 1.125 0 0 0-.405.864v.568a1.125 1.125 0 0 0 2.25 0v-.568a1.125 1.125 0 0 0-.405-.864l-1.068-.89a.458.458 0 0 1-.086-.596l.51-.766a.458.458 0 0 1 .464-.354l.143.048a1.107 1.107 0 0 0 1.161-.886l.143-.256a1.107 1.107 0 0 0-.57-1.664l-.143-.048a1.107 1.107 0 0 0-1.161-.886l-.51-.766a.458.458 0 0 1 .086-.596l1.068-.89a1.125 1.125 0 0 0 .405-.864v-.568a1.125 1.125 0 0 0-2.25 0Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [registerError, setRegisterError] = useState(null)

  const {
    register,
    handleSubmit,
    trigger, // Necesario para validar el paso 1 antes de avanzar
    formState: { errors, isSubmitting }
  } = useForm({
    mode: "onChange" // Validación en tiempo real para la contraseña
  })

  const { signup } = useAuth()
  const navigate = useNavigate()

  // --- MANEJO DE PASOS ---
  const handleNextStep = async () => {
    // Validar solo los campos del paso 1
    const isValid = await trigger(["nombreEmpresa", "email", "password", "tipoCuenta"])
    if (isValid) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  // --- ENVÍO FINAL ---
  const onSubmit = async (data) => {
    setRegisterError(null)
    try {
      const userData = {
        email: data.email,
        password: data.password,
        role: data.tipoCuenta,
        enterpriseName: data.nombreEmpresa,
        fiscalId: data.cuitRut,
        // Campos opcionales del Paso 2
        contactPerson: data.contactPerson,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country
      }

      await signup(userData)
      // Redirigir a perfil para completar datos faltantes o dashboard
      navigate("/profile") 
    } catch (error) {
      console.error("Error in registration:", error)
      const errorMsg = error.response?.data?.message || "Error al registrar la cuenta. Intente de nuevo."
      setRegisterError(errorMsg)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  // --- CLASES COMUNES ---
  const labelClass = "block pb-2 text-base font-medium leading-normal text-neutral-900 dark:text-neutral-200"
  const inputClass = "form-input h-14 w-full rounded-lg border-none bg-neutral-100 p-4 text-base text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400"
  const errorClass = "mt-1 text-sm text-red-600 dark:text-red-400"

  return (
    <div className="animate-fadeIn flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        <div className="text-center">
          <LogoIcon />
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
            {step === 1 ? "Crear una cuenta" : "Detalles del Perfil"}
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Paso {step} de 2
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {registerError && (
            <div className="rounded-lg border border-red-400 bg-red-100 p-3 text-center text-sm text-red-700 dark:border-red-600 dark:bg-red-950 dark:text-red-300">
              {registerError}
            </div>
          )}

          {/* ================= PASO 1: CUENTA Y SEGURIDAD ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Nombre Empresa */}
              <div>
                <label htmlFor="nombre-empresa" className={labelClass}>
                  Nombre de la Empresa
                </label>
                <input
                  id="nombre-empresa"
                  type="text"
                  placeholder="Ingresa el nombre de tu empresa"
                  className={inputClass}
                  {...register("nombreEmpresa", {
                    required: "El nombre de la empresa es requerido"
                  })}
                />
                {errors.nombreEmpresa && <p className={errorClass}>{errors.nombreEmpresa.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className={inputClass}
                  {...register("email", {
                    required: "El email es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email no válido"
                    }
                  })}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Debe contener mínimo 8 caracteres"
                    className={`${inputClass} pr-12`}
                    {...register("password", {
                      required: "La contraseña es requerida",
                      pattern: {
                        // Regex: Min 8 chars, 1 upper, 1 lower, 1 number, 1 special
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                        message: "Debe tener 8+ caracteres, mayúscula, minúscula, número y símbolo."
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 dark:text-neutral-400"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
              </div>

              {/* Tipo de Cuenta */}
              <div>
                <label className={labelClass}>Tipo de Cuenta</label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="transportista"
                      type="radio"
                      value="transportista"
                      className="form-radio accent-amber-400 h-4 w-4 border-neutral-400 bg-neutral-100 text-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-900"
                      {...register("tipoCuenta", { required: true })}
                      defaultChecked
                    />
                    <label htmlFor="transportista" className="ml-3 block text-base font-medium text-neutral-900 dark:text-neutral-200">
                      Soy Transportista
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="empresa"
                      type="radio"
                      value="empresa"
                      className="form-radio accent-amber-400 h-4 w-4 border-neutral-400 bg-neutral-100 text-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-900"
                      {...register("tipoCuenta", { required: true })}
                    />
                    <label htmlFor="empresa" className="ml-3 block text-base font-medium text-neutral-900 dark:text-neutral-200">
                      Necesito Enviar Carga (Empresa)
                    </label>
                  </div>
                  {/* NUEVO ROL DUAL */}
                  <div className="flex items-center">
                    <input
                      id="dual"
                      type="radio"
                      value="operador_dual"
                      className="form-radio accent-amber-400 h-4 w-4 border-neutral-400 bg-neutral-100 text-amber-500 focus:ring-amber-500 dark:border-neutral-600 dark:bg-neutral-900"
                      {...register("tipoCuenta", { required: true })}
                    />
                    <label htmlFor="dual" className="ml-3 block text-base font-medium text-neutral-900 dark:text-neutral-200">
                      Soy Operador Dual (Ambos)
                    </label>
                  </div>
                </div>
              </div>

              {/* Botón Continuar */}
              <div>
                <button
                  type="button" // Importante: type button para no enviar form
                  onClick={handleNextStep}
                  className="flex w-full justify-center items-center gap-2 rounded-lg bg-amber-500 px-4 py-4 text-base font-semibold leading-6 text-neutral-900 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                >
                  Continuar <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ================= PASO 2: DETALLES Y PERFIL ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* CUIT / RUT (Obligatorio) */}
              <div>
                <label htmlFor="cuit-rut" className={labelClass}>
                  CUIT / RUT <span className="text-amber-500">*</span>
                </label>
                <input
                  id="cuit-rut"
                  type="text"
                  placeholder="Identificador Fiscal"
                  className={inputClass}
                  {...register("cuitRut", {
                    required: "El CUIT o RUT es requerido para operar"
                  })}
                />
                {errors.cuitRut && <p className={errorClass}>{errors.cuitRut.message}</p>}
              </div>

              {/* Persona de Contacto (Opcional) */}
              <div>
                <label htmlFor="contactPerson" className={labelClass}>
                  Persona de Contacto <span className="text-sm font-normal text-gray-500">(Opcional)</span>
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  placeholder="Nombre completo del representante"
                  className={inputClass}
                  {...register("contactPerson")}
                />
              </div>

              {/* Teléfono (Opcional) */}
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Teléfono <span className="text-sm font-normal text-gray-500">(Opcional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+54 9 11 ..."
                  className={inputClass}
                  {...register("phone")}
                />
              </div>

              {/* Dirección (Opcional) */}
              <div>
                <label htmlFor="address" className={labelClass}>
                  Dirección Legal <span className="text-sm font-normal text-gray-500">(Opcional)</span>
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="Calle, Número, Ciudad"
                  className={inputClass}
                  {...register("address")}
                />
              </div>

              {/* Botones Navegación */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex flex-1 justify-center items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-4 text-base font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <ArrowLeft size={20} /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 justify-center items-center gap-2 rounded-lg bg-amber-500 px-4 py-4 text-base font-semibold text-neutral-900 shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Registrando..." : "Completar Registro"}
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Link Login */}
        <p className="text-center text-base text-neutral-500 dark:text-neutral-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-amber-500 hover:text-amber-400"
          >
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage