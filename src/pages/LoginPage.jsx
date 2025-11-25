import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"

const LogoIcon = () => (
  <svg
    className="mx-auto h-12 w-auto text-amber-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664l.143.256a1.107 1.107 0 0 0 .57 1.664l.143.048a1.107 1.107 0 0 0 1.161.886l.51.766c.319.48.126 1.121-.216 1.49l-1.068.89a1.125 1.125 0 0 0-.405.864v.568a1.125 1.125 0 0 0 2.25 0v-.568a1.125 1.125 0 0 0-.405-.864l-1.068-.89a.458.458 0 0 1-.086-.596l.51-.766a.458.458 0 0 1 .464-.354l.143.048a1.107 1.107 0 0 0 1.161-.886l.143-.256a1.107 1.107 0 0 0-.57-1.664l-.143-.048a1.107 1.107 0 0 0-1.161-.886l-.51-.766a.458.458 0 0 1 .086-.596l1.068-.89a1.125 1.125 0 0 0 .405-.864v-.568a1.125 1.125 0 0 0-2.25 0Z" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
)

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const [accountDeletedMsg, setAccountDeletedMsg] = useState(null)
  
  useEffect(() => {
    let timer

    if (localStorage.getItem("accountDeleted") === "true") {
      setAccountDeletedMsg("Tu cuenta ha sido eliminada exitosamente.")

      timer = setTimeout(() => {
        setAccountDeletedMsg(null)
        localStorage.removeItem("accountDeleted")
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [])
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm()

  const { signin } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoginError(null)
    try {
      await signin(data)
      navigate("/profile")
    } catch (error) {
      console.error("Error in login:", error)
      const errorMsg = error.response?.data?.message || "Email o contraseña incorrectos."
      setLoginError(errorMsg)
    }
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="animate-fadeIn flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center p-4">
      {accountDeletedMsg && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg text-sm mb-6">
          {accountDeletedMsg}
        </div>
      )}
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <LogoIcon />
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100">
            Iniciar Sesión
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {loginError && (
            <div className="rounded-lg border border-red-400 bg-red-100 p-3 text-center text-sm text-red-700 dark:border-red-600 dark:bg-red-950 dark:text-red-300">
              {loginError}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block pb-2 text-base font-medium leading-normal text-neutral-900 dark:text-neutral-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              className="form-input h-14 w-full rounded-lg border-none bg-neutral-100 p-4 text-base text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400"
              {...register("email", {
                required: "El email es requerido"
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block pb-2 text-base font-medium leading-normal text-neutral-900 dark:text-neutral-200"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                className="form-input h-14 w-full rounded-lg border-none bg-neutral-100 p-4 pr-12 text-base text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400"
                {...register("password", {
                  required: "La contraseña es requerida"
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full justify-center rounded-lg bg-amber-500 px-4 py-4 text-base font-semibold leading-6 text-neutral-900 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </form>

        <p className="text-center text-base text-neutral-500 dark:text-neutral-400">
          ¿Aún no tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold leading-6 text-amber-500 hover:text-amber-400"
          >
            Regístrate Gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage