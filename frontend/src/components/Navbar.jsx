import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserCircle, MagnifyingGlass, PlusCircle, Heart, ChatDots, Package } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import userStore from "@/stores/userStore"

export default function Navbar() {
  const { isAuthenticated, user } = userStore()
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const searchBar = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const redirectToLogin = (path) => {
    if (!isAuthenticated) {
      navigate("/connexion", {
        state: { from: path, message: "Veuillez vous connecter pour accéder à cette section" },
      })
    } else {
      navigate(path)
    }
  }

  const getUserInitial = () => {
    if (!user || !user.firstName) return "?"
    return user.firstName.charAt(0).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm shadow-md py-3 border-b">
      <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
              <span className="text-2xl font-bold text-primary">Docaz</span>
            </Link>

            <Button
              onClick={() => redirectToLogin("/annonce/creation")}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-5 rounded-full h-10 transition-all duration-200 shadow-sm hover:shadow-md hidden sm:flex"
            >
              <PlusCircle className="h-5 w-5 mr-2" weight="bold" />
              <span>Déposer une annonce</span>
            </Button>

            <Button
              onClick={() => redirectToLogin("/annonce/creation")}
              className="bg-primary hover:bg-primary/90 text-white font-medium p-2 rounded-full h-10 w-10 transition-all duration-200 shadow-sm hover:shadow-md sm:hidden flex items-center justify-center"
              aria-label="Déposer une annonce"
            >
              <PlusCircle className="h-5 w-5" weight="bold" />
            </Button>
          </div>

          <div className="relative flex-grow max-w-[45%] mx-4">
            <form onSubmit={searchBar} className="relative w-full">
              <Input
                type="text"
                placeholder="Rechercher sur Docaz"
                className="pl-4 pr-10 h-12 w-full rounded-full bg-gray-100/80 border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                <MagnifyingGlass className="h-5 w-5 text-white" weight="bold" />
                <span className="sr-only">Rechercher</span>
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div
              className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200 group"
              onClick={() => redirectToLogin("/mes-annonces")}
            >
              <div className="relative p-1.5 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                <Package
                  className="h-6 w-6 mb-0.5 group-hover:scale-110 transition-transform duration-200"
                  weight="regular"
                />
              </div>
              <span className="hidden sm:block">Mes annonces</span>
            </div>

            <div
              className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200 group"
              onClick={() => redirectToLogin("/mes-favoris")}
            >
              <div className="relative p-1.5 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                <Heart
                  className="h-6 w-6 mb-0.5 group-hover:scale-110 transition-transform duration-200"
                  weight="regular"
                />
              </div>
              <span className="hidden sm:block">Favoris</span>
            </div>

            <div
              className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors duration-200 group"
              onClick={() => redirectToLogin("/messages")}
            >
              <div className="relative p-1.5 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                <ChatDots
                  className="h-6 w-6 mb-0.5 group-hover:scale-110 transition-transform duration-200"
                  weight="regular"
                />
              </div>
              <span className="hidden sm:block">Messages</span>
            </div>

            {!isAuthenticated ? (
              <Link
                to="/connexion"
                className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary transition-colors duration-200 group"
              >
                <div className="relative p-1.5 rounded-full group-hover:bg-primary/10 transition-colors duration-200">
                  <UserCircle
                    className="h-6 w-6 mb-0.5 group-hover:scale-110 transition-transform duration-200"
                    weight="regular"
                  />
                </div>
                <span className="hidden sm:block">Connexion</span>
              </Link>
            ) : (
              <Link
                to="/profil"
                className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium mb-0.5 border-2 border-transparent group-hover:border-primary/20 transition-all duration-200 shadow-sm">
                  {getUserInitial()}
                </div>
                <span className="hidden sm:block">{user?.firstName || "Profil"}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
