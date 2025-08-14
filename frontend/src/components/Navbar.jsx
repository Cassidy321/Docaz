import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserCircle, PlusCircle, Heart, ChatDots, Package, List, X, MagnifyingGlass } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import userStore from "@/stores/userStore"
import SearchBar from "./ui/SearchBar"

export default function Navbar() {
    const { isAuthenticated, user } = userStore()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const redirectToLogin = (path) => {
        setMobileMenuOpen(false)
        if (!isAuthenticated) {
            navigate("/connexion", {
                state: { from: path },
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
        <>
            <header className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
                <div className="px-4 mx-auto max-w-7xl">
                    <div className="flex items-center py-3 sm:hidden">
                        <Link to="/" className="text-xl font-bold text-primary flex-shrink-0">
                            Docaz
                        </Link>
                        <div className="flex-1 mx-4">
                            <SearchBar placeholder="Rechercher sur Docaz..." />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(true)}
                            className="h-8 w-8 flex-shrink-0"
                        >
                            <List className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* 640px - 767px */}
                    <div className="hidden sm:flex md:hidden items-center py-3">
                        <Link to="/" className="text-xl font-bold text-primary flex-shrink-0">
                            Docaz
                        </Link>
                        <Button
                            onClick={() => redirectToLogin("/annonce/creation")}
                            className="bg-primary hover:bg-primary/90 text-white font-medium px-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-sm ml-4 flex-shrink-0"
                        >
                            <PlusCircle className="h-4 w-4 " weight="bold" />
                            Déposer
                        </Button>
                        <div className="flex-1 mx-4">
                            <SearchBar placeholder="Rechercher sur Docaz..." />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(true)}
                            className="h-8 w-8 flex-shrink-0"
                        >
                            <List className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* 768px - 1023px */}
                    <div className="hidden md:flex lg:hidden items-center py-3">
                        <Link to="/" className="text-xl font-bold text-primary flex-shrink-0">
                            Docaz
                        </Link>
                        <Button
                            onClick={() => redirectToLogin("/annonce/creation")}
                            className="bg-primary hover:bg-primary/90 text-white font-medium px-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-sm ml-4 flex-shrink-0"
                        >
                            <PlusCircle className="h-4 w-4 " weight="bold" />
                            Déposer une annonce
                        </Button>
                        <div className="flex-1 mx-4">
                            <SearchBar placeholder="Rechercher sur Docaz..." />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(true)}
                            className="h-8 w-8 flex-shrink-0"
                        >
                            <List className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* 1024px - 1279px */}
                    <div className="hidden lg:flex xl:hidden items-center py-4 gap-4">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
                                Docaz
                            </Link>
                        </div>
                        <div className="flex-shrink-0">
                            <Button
                                onClick={() => redirectToLogin("/annonce/creation")}
                                className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap text-sm"
                            >
                                <PlusCircle className="h-4 w-4" weight="bold" />
                                Déposer une annonce
                            </Button>
                        </div>
                        <div className="flex-1 max-w-2xl mx-4">
                            <SearchBar placeholder="Rechercher sur Docaz..." />
                        </div>
                        <div className="flex items-center gap-6">
                            <NavButton
                                icon={Package}
                                label="Mes annonces"
                                onClick={() => redirectToLogin("/mes-annonces")}
                            />
                            <NavButton
                                icon={Heart}
                                label="Favoris"
                                onClick={() => redirectToLogin("/mes-favoris")}
                            />
                            <NavButton
                                icon={ChatDots}
                                label="Messages"
                                onClick={() => redirectToLogin("/messages")}
                            />
                            <div className="ml-1">
                                {!isAuthenticated ? (
                                    <Link
                                        to="/connexion"
                                        className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <UserCircle className="h-6 w-6 mb-1" />
                                        Connexion
                                    </Link>
                                ) : (
                                    <Link
                                        to="/profil"
                                        className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold mb-1">
                                            {getUserInitial()}
                                        </div>
                                        {user?.firstName || "Profil"}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 1280px - 1535px */}
                    <div className="hidden xl:flex 2xl:hidden items-center py-4 gap-6">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
                                Docaz
                            </Link>
                        </div>
                        <div className="flex-shrink-0">
                            <Button
                                onClick={() => redirectToLogin("/annonce/creation")}
                                className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap text-sm"
                            >
                                <PlusCircle className="h-4 w-4" weight="bold" />
                                Déposer une annonce
                            </Button>
                        </div>
                        <div className="flex-1 max-w-3xl mx-8">
                            <SearchBar placeholder="Rechercher sur Docaz..." />
                        </div>
                        <div className="flex items-center gap-8">
                            <NavButton
                                icon={Package}
                                label="Mes annonces"
                                onClick={() => redirectToLogin("/mes-annonces")}
                            />
                            <NavButton
                                icon={Heart}
                                label="Favoris"
                                onClick={() => redirectToLogin("/mes-favoris")}
                            />
                            <NavButton
                                icon={ChatDots}
                                label="Messages"
                                onClick={() => redirectToLogin("/messages")}
                            />
                            <div className="ml-2">
                                {!isAuthenticated ? (
                                    <Link
                                        to="/connexion"
                                        className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <UserCircle className="h-6 w-6 mb-1" />
                                        Connexion
                                    </Link>
                                ) : (
                                    <Link
                                        to="/profil"
                                        className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors text-sm font-medium"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold mb-1">
                                            {getUserInitial()}
                                        </div>
                                        {user?.firstName || "Profil"}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 1536px+ */}
                    <div className="hidden 2xl:flex items-center py-4 gap-8">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-3xl font-bold text-primary hover:text-primary/90 transition-colors">
                                Docaz
                            </Link>
                        </div>
                        <div className="flex-shrink-0">
                            <Button
                                onClick={() => redirectToLogin("/annonce/creation")}
                                className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                            >
                                <PlusCircle className="h-5 w-5" weight="bold" />
                                Déposer une annonce
                            </Button>
                        </div>
                        <div className="flex-1 max-w-4xl mx-10">
                            <SearchBar placeholder="Rechercher sur Docaz..." />
                        </div>
                        <div className="flex items-center gap-10">
                            <NavButton
                                icon={Package}
                                label="Mes annonces"
                                onClick={() => redirectToLogin("/mes-annonces")}
                            />
                            <NavButton
                                icon={Heart}
                                label="Favoris"
                                onClick={() => redirectToLogin("/mes-favoris")}
                            />
                            <NavButton
                                icon={ChatDots}
                                label="Messages"
                                onClick={() => redirectToLogin("/messages")}
                            />
                            <div className="ml-4">
                                {!isAuthenticated ? (
                                    <Link
                                        to="/connexion"
                                        className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors font-medium"
                                    >
                                        <UserCircle className="h-7 w-7 mb-1" />
                                        <span className="text-sm">Connexion</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/profil"
                                        className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors font-medium"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold mb-1">
                                            {getUserInitial()}
                                        </div>
                                        <span className="text-sm">{user?.firstName || "Profil"}</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 2xl:hidden">
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                        D
                                    </div>
                                    <span className="font-bold text-lg text-primary">Docaz</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="h-8 w-8"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="flex-1 p-4 space-y-1">
                                <div className="sm:hidden">
                                    <MenuItem
                                        icon={PlusCircle}
                                        label="Déposer une annonce"
                                        onClick={() => redirectToLogin("/annonce/creation")}
                                        primary
                                    />
                                    <div className="h-4" />
                                </div>

                                <MenuItem
                                    icon={Package}
                                    label="Mes annonces"
                                    onClick={() => redirectToLogin("/mes-annonces")}
                                />
                                <MenuItem
                                    icon={Heart}
                                    label="Mes favoris"
                                    onClick={() => redirectToLogin("/mes-favoris")}
                                />
                                <MenuItem
                                    icon={ChatDots}
                                    label="Messages"
                                    onClick={() => redirectToLogin("/messages")}
                                />

                                <div className="border-t my-4" />

                                {!isAuthenticated ? (
                                    <MenuItem
                                        icon={UserCircle}
                                        label="Se connecter"
                                        onClick={() => {
                                            setMobileMenuOpen(false)
                                            navigate("/connexion")
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => {
                                            setMobileMenuOpen(false)
                                            navigate("/profil")
                                        }}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                            {getUserInitial()}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user?.firstName || "Mon profil"}</div>
                                            <div className="text-sm text-gray-500">Voir mon profil</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function NavButton({ icon: Icon, label, onClick }) {
    return (
        <div
            className="flex flex-col items-center text-gray-700 hover:text-primary cursor-pointer transition-colors text-sm font-medium"
            onClick={onClick}
        >
            <Icon className="h-6 w-6 mb-1" />
            <span>{label}</span>
        </div>
    )
}

function MenuItem({ icon: Icon, label, onClick, primary = false }) {
    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${primary
                ? "bg-primary text-white hover:bg-primary/90"
                : "hover:bg-gray-50"
                }`}
            onClick={onClick}
        >
            <Icon className={`h-6 w-6 ${primary ? "text-white" : "text-primary"}`} />
            <span className="font-medium">{label}</span>
        </div>
    )
}