import { useState, Fragment, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const LogoIcon = () => (
  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
  </svg>
)

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { isAuthenticated, user, signout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    signout()
    setIsDropdownOpen(false)
    closeMobileMenu()
    navigate("/")
  }

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev)
  }

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const userInitial = user?.enterpriseName?.[0] || user?.email?.[0] || "U"

  return (
    <Fragment>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between border-b border-neutral-200 dark:border-white/10">
            <Link
              to={isAuthenticated ? "/mercado" : "/"}
              className="flex items-center gap-4"
            >
              <div className="size-6 text-amber-500">
                <LogoIcon />
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-tight text-neutral-900 dark:text-white">
                CONEXA
              </h2>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {!isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-neutral-600 dark:text-white/80 transition-colors hover:text-neutral-900 dark:hover:text-amber-400"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-amber-500 px-4 text-sm font-bold leading-normal tracking-wide text-black transition-opacity hover:opacity-90"
                  >
                    <span className="truncate">Registrarse</span>
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleToggleDropdown}
                    className="flex size-10 items-center justify-center rounded-full overflow-hidden ring-2 ring-transparent ring-offset-2 ring-offset-white transition-all focus:outline-none focus:ring-amber-600 dark:ring-offset-neutral-950"
                  >
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex w-full h-full items-center justify-center bg-amber-500 text-xl font-bold text-black">
                        {userInitial.toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800 dark:ring-white/10">
                      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                        <p className="text-sm text-neutral-700 dark:text-neutral-200">
                          Conectado como:
                        </p>
                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                          {user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                          Mi Perfil
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100 dark:text-red-400 dark:hover:bg-neutral-700"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={handleToggleMobileMenu}
                className="rounded-md p-2 text-neutral-900 dark:text-white"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 z-40 w-full border-b border-neutral-200 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-neutral-950 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              to="/mercado"
              onClick={closeMobileMenu}
              className="block rounded px-3 py-2 text-base font-medium text-neutral-600 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Mercado Logístico
            </Link>
            <Link
              to="/community"
              onClick={closeMobileMenu}
              className="block rounded px-3 py-2 text-base font-medium text-neutral-600 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Portal Comunitario
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block rounded px-3 py-2 text-base font-medium text-neutral-600 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              Nosotros
            </Link>
          </nav>

          <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-white/10">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block rounded px-3 py-2 text-base font-medium text-neutral-600 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-amber-500 px-4 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  <span className="truncate">Registrarse</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="block rounded px-3 py-2 text-base font-medium text-neutral-600 dark:text-white/80 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-red-500"
                >
                  <span className="truncate">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Navbar