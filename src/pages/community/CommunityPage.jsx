import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useCommunityHome } from "../../hooks/useCommunityHome"
import { getPosts } from "../../services/community.service"
import { useNavigate } from "react-router-dom"
import { PlusCircle, Loader, Hash, MessageCircle, ThumbsUp, Folder, Users, Star } from "lucide-react"
import Navbar from "../../components/layout/Navbar"; 


// Componente principal del portal comunitario
const CommunityPage = () => {
  const { isAuthenticated } = useAuth()
  const { forums, feed, loading, error } = useCommunityHome()

  const [displayedPosts, setDisplayedPosts] = useState([])
  const [activeForum, setActiveForum] = useState("general")
  const [activeFilter, setActiveFilter] = useState("recent")
  const navigate = useNavigate()

  // Clases reutilizables
  const CARD_SURFACE_CLASS =
    "bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 group h-full"

  const TEXT_PRIMARY = "text-gray-900 dark:text-white"
  const TEXT_SECONDARY = "text-gray-500 dark:text-gray-400"

  // Inicializa las publicaciones
  useEffect(() => {
    if (feed && feed.length > 0) {
      setDisplayedPosts(feed)
    }
  }, [feed])

  // Filtrado por foro
  const handleForumClick = async (forumId) => {
    setActiveForum(forumId)
    setActiveFilter("recent")

    try {
      if (forumId === "all") {
        const allPosts = await getPosts({})
        setDisplayedPosts(allPosts)
        return
      }

      const topicId = forumId === "general" ? "general" : forumId
      const filteredPosts = await getPosts({ topicId })
      setDisplayedPosts(filteredPosts)
    } catch (err) {
      console.error("Error filtrando posts:", err)
    }
  }

  // Filtrar por popularidad
  const filterPopular = () => {
    setActiveFilter("popular")
    const sorted = [...displayedPosts].sort(
      (a, b) => (b.commentCount || 0) - (a.commentCount || 0)
    )
    setDisplayedPosts(sorted)
  }

  // Filtrar por publicaciones recientes
  const filterRecent = () => {
    setActiveFilter("recent")
    const sorted = [...displayedPosts].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
    setDisplayedPosts(sorted)
  }

  // Calcula tiempo transcurrido
  const timeAgo = (dateString) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de una hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Hace 1 día"
    return `Hace ${diffInDays} días`
  }

  // Estado de carga
  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#0A0A0A] font-display flex flex-col justify-center items-center">
        <div className="flex flex-col items-center p-8">
          <Loader size={48} className="animate-spin text-amber-500 mb-4" />
          <h2 className={`text-2xl font-bold ${TEXT_PRIMARY}`}>Cargando el Portal Comunitario</h2>
          <p className={`${TEXT_SECONDARY} mt-2`}>Obteniendo foros y publicaciones recientes...</p>
        </div>
      </main>
    )
  }

  if (error) return <div className="p-4 text-red-600">Error al cargar datos.</div>


return (
 <>
  {!isAuthenticated && <Navbar />}
    <main className="min-h-screen bg-white dark:bg-[#0A0A0A] font-display flex flex-col">
      <div className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-8">
        <div className="flex flex-col w-full max-w-7xl mx-auto gap-8">

          {/* Encabezado */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">Portal de la Comunidad</h1>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">Un espacio para la colaboración y discusión de ideas</p>
            </div>
          </div>

          {/* Foros */}
          <section className="flex flex-col gap-4">
            <h2 className={`text-[22px] font-bold px-4 pb-3 pt-5 ${TEXT_PRIMARY}`}>Foros de Discusión</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">

              {/* Ver Todo */}
              <div
                onClick={() => handleForumClick("all")}
                className={`flex flex-1 gap-3 rounded-xl p-4 flex-col cursor-pointer transition-all ${CARD_SURFACE_CLASS} ${activeForum === "all" ? "border-amber-500 ring-2 ring-amber-500/50 shadow-lg" : "hover:shadow-lg"}`}
              >
                <div className="text-amber-500 text-xl flex items-center"><Star size={24} /></div>
                <div className="flex flex-col gap-1">
                  <h3 className={`text-base font-bold ${TEXT_PRIMARY}`}>Ver Todo</h3>
                  <p className={`text-sm ${TEXT_SECONDARY}`}>Todas las publicaciones</p>
                </div>
              </div>

              {/* General */}
              <div 
                onClick={() => handleForumClick("general")}
                className={`flex flex-1 gap-3 rounded-xl p-4 flex-col cursor-pointer transition-all ${CARD_SURFACE_CLASS} ${activeForum === "general" ? "border-amber-500 ring-2 ring-amber-500/50 shadow-lg" : "hover:shadow-lg"}`}
              >
                <div className="text-amber-500 text-xl flex items-center"><Users size={24} /></div>
                <div className="flex flex-col gap-1">
                  <h3 className={`text-base font-bold ${TEXT_PRIMARY}`}>General</h3>
                  <p className={`text-sm ${TEXT_SECONDARY}`}>{"Conversaciones Generales"}</p>
                </div>
              </div>

              {/* Foros dinámicos */}
              {forums.map((forum) => (
                <div
                  key={forum.id}
                  onClick={() => handleForumClick(forum.id)}
                  className={`flex flex-1 gap-3 rounded-xl p-4 flex-col cursor-pointer transition-all ${CARD_SURFACE_CLASS} ${activeForum === forum.id ? "border-amber-500 ring-2 ring-amber-500/50 shadow-lg" : "hover:shadow-lg"}`}
                >
                  <div className="text-amber-500 text-xl flex items-center"><Folder size={24} /></div>
                  <div className="flex flex-col gap-1">
                    <h3 className={`text-base font-bold ${TEXT_PRIMARY}`}>{forum.title}</h3>
                    <p className={`text-sm ${TEXT_SECONDARY}`}>{forum.description || "Sin descripción"}</p>
                    <p className={`text-xs mt-2 ${TEXT_SECONDARY}`}>{forum.postCount || 0} discusiones</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Publicaciones */}
          <section className="flex flex-col gap-4 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 pb-3 pt-5">
              <h2 className={`text-[22px] font-bold ${TEXT_PRIMARY}`}>
                {activeForum === "general"
                  ? "Publicaciones Generales"
                  : activeForum === "all"
                  ? "Todas las Publicaciones"
                  : `Posts en: ${forums.find((f) => f.id === activeForum)?.title || "Foro"}`}
              </h2>

              <div className="flex gap-2 p-1 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-[#0A0A0A]">
                <button
                  onClick={filterRecent}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${activeFilter === "recent" ? "bg-amber-500 text-white shadow-md" : `bg-transparent ${TEXT_SECONDARY} hover:bg-gray-100 dark:hover:bg-neutral-800`}`}
                >
                  Más recientes
                </button>

                <button
                  onClick={filterPopular}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${activeFilter === "popular" ? "bg-amber-500 text-white shadow-md" : `bg-transparent ${TEXT_SECONDARY} hover:bg-gray-100 dark:hover:bg-neutral-800`}`}
                >
                  Más populares
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-4">
              {displayedPosts.length === 0 ? (
                <div className={`p-6 rounded-xl text-center ${CARD_SURFACE_CLASS} border-dashed`}>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-neutral-900 mb-4">
                    <Hash size={24} className={TEXT_SECONDARY} />
                  </div>
                  <h3 className={`text-lg font-medium ${TEXT_PRIMARY}`}>No se encontraron publicaciones</h3>
                  <p className={`${TEXT_SECONDARY} mt-1`}>Intenta cambiar el foro o el filtro.</p>
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/community/post/${post.id}`)}
                    className={`flex flex-col gap-4 p-6 rounded-xl cursor-pointer ${CARD_SURFACE_CLASS}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url('${post.author?.avatar || "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22%3E%3Ccircle cx=%2212%22 cy=%2212%22 r=%2210%22 fill=%22%23ccc%22/%3E%3C/circle%3E%3C/svg%3E"}')`
                        }}
                      />

                      <div className="flex flex-col gap-[2px]">
                        <p className={`font-semibold text-sm ${TEXT_PRIMARY}`}>{post.author?.name || "Anónimo"}</p>
                        <p className={`text-sm ${TEXT_SECONDARY}`}>{timeAgo(post.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className={`text-lg font-bold ${TEXT_PRIMARY} hover:text-amber-500 transition-colors`}>
                        {post.title}
                      </h3>
                      <p className={`text-sm leading-relaxed line-clamp-2 ${TEXT_SECONDARY}`}>
                        {post.description || post.content || "Sin descripción"}
                      </p>
                    </div>

                    <div className={`flex items-center gap-6 ${TEXT_SECONDARY} pt-2`}>
                      <div className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                        <ThumbsUp size={20} />
                        <span className="text-sm font-medium">{post.likeCount || 0} Me gusta</span>
                      </div>

                      <div className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">{post.commentCount || 0} Comentarios</span>
                      </div>

                      {post.topic && (
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-medium bg-amber-500/10 px-2 py-1 rounded-full">
                          <Hash size={16} />
                          {post.topic.title}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  </>  
  )
}

export default CommunityPage