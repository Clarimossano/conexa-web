import { Link } from "react-router-dom"

function HomePage() {
  return (
    <main className="animate-fadeIn grow">
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div
            className="absolute inset-0 z-0 opacity-10"
            style={{
              backgroundImage: "url('https://source.unsplash.com/random/1600x900/?logistics,mountains')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%)"
            }}
          ></div>
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white sm:text-6xl">
              El Motor Digital del Corredor Capricornio
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-white/80">
              Optimizamos la logística B2B y conectamos a las comunidades en una
              sola plataforma.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/marketplace"
                className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-amber-500 px-6 text-base font-bold leading-normal tracking-wide text-black transition-transform hover:scale-105 sm:w-auto"
              >
                <span className="truncate">Buscar Carga Ahora</span>
              </Link>
              <Link
                to="/community"
                className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-cyan-400 px-6 text-base font-bold leading-normal tracking-wide text-black transition-transform hover:scale-105 sm:w-auto"
              >
                <span className="truncate">Explorar Portal Comunitario</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-white sm:text-4xl">
              Una plataforma, dos soluciones integradas
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-white/70">
              Descubra cómo nuestra plataforma dual impulsa la eficiencia
              logística y fortalece los lazos comunitarios a lo largo del
              corredor.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <span className="material-symbols-outlined text-3xl">
                  local_shipping
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold leading-tight text-neutral-900 dark:text-white">
                  Mercado Logístico B2B
                </h3>
                <p className="text-base font-normal leading-normal text-neutral-600 dark:text-white/70">
                  Conecte con transportistas, encuentre cargas y optimice sus
                  operaciones de transporte de manera eficiente y segura.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex size-12 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <span className="material-symbols-outlined text-3xl">
                  groups
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold leading-tight text-neutral-900 dark:text-white">
                  Centro Comunitario
                </h3>
                <p className="text-base font-normal leading-normal text-neutral-600 dark:text-white/70">
                  Participe en foros, acceda a recursos y colabore en proyectos
                  que impulsan el desarrollo local y regional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 dark:bg-white/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-white sm:text-4xl">
              Cómo Funciona el Mercado B2B
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-white/70">
              Un proceso simple en tres pasos para conectar la oferta y la
              demanda logística de forma transparente.
            </p>
          </div>
          <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="absolute inset-x-0 top-1/2 hidden h-0.5 -translate-y-1/2 bg-neutral-300 dark:bg-white/10 md:block"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 bg-white dark:bg-neutral-950 text-xl font-bold text-amber-500">
                01
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900 dark:text-white">
                Publicar y Buscar
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
                Empresas publican sus necesidades de carga y transportistas
                buscan oportunidades disponibles.
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 bg-white dark:bg-neutral-950 text-xl font-bold text-amber-500">
                02
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900 dark:text-white">
                Conectar y Negociar
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
                Nuestra plataforma facilita la conexión directa para acordar
                términos, precios y condiciones.
              </p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-500 bg-white dark:bg-neutral-950 text-xl font-bold text-amber-500">
                03
              </div>
              <h3 className="mt-6 text-lg font-bold text-neutral-900 dark:text-white">
                Transportar y Seguir
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-white/70">
                Realice el transporte con la confianza de un seguimiento
                integrado y gestión de pagos seguros.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-xl bg-linear-to-r from-amber-500/80 to-amber-500 p-8 text-center md:p-12">
          <h2 className="text-3xl font-extrabold tracking-tighter text-black">
            Regístrese en 2 minutos y comience a optimizar
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-black/80">
            Únase a la red logística y comunitaria que está transformando el
            corredor.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="flex h-12 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-black px-6 text-base font-bold leading-normal text-white transition-transform hover:scale-105"
            >
              <span className="truncate">Registrarse Gratis</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
