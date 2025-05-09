import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    SignIn,
    UserCircle,
    MagnifyingGlass,
    PlusCircle,
    Heart,
    ChatDots,
    Package
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import userStore from "@/stores/userStore";

export default function Navbar() {
    const { isAuthenticated, user } = userStore();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const searchBar = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const redirectToLogin = (path) => {
        if (!isAuthenticated) {
            navigate("/connexion", {
                state: { from: path, message: "Veuillez vous connecter pour accéder à cette section" }
            });
        } else {
            navigate(path);
        }
    };

    const getUserInitial = () => {
        if (!user || !user.firstName) return "?";
        return user.firstName.charAt(0).toUpperCase();
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-background shadow-sm py-2">
            <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-16">
                <div className="flex items-center">
                    <Link to="/" className="flex-shrink-0 mr-6">
                        <span className="text-2xl font-bold text-primary">Docaz</span>
                    </Link>

                    <div className="mr-4">
                        <Button
                            onClick={() => redirectToLogin("/annonce/creation")}
                            className="bg-primary hover:bg-primary/90 text-white font-medium px-4 rounded-full h-10"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" weight="bold" />
                            <span>Déposer une annonce</span>
                        </Button>
                    </div>

                    <div className="relative flex-grow max-w-[45%]">
                        <form onSubmit={searchBar} className="relative w-full">
                            <Input
                                type="text"
                                placeholder="Rechercher sur Docaz"
                                className="pl-4 pr-10 h-12 w-full rounded-full bg-gray-100 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary"
                            >
                                <MagnifyingGlass className="h-5 w-5 text-white" weight="bold" />
                            </Button>
                        </form>
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                        <div
                            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() => redirectToLogin("/mes-annonces")}
                        >
                            <Package className="h-6 w-6 mb-1" weight="regular" />
                            <span>Mes annonces</span>
                        </div>

                        <div
                            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() => redirectToLogin("/mes-favoris")}
                        >
                            <Heart className="h-6 w-6 mb-1" weight="regular" />
                            <span>Favoris</span>
                        </div>

                        <div
                            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary cursor-pointer"
                            onClick={() => redirectToLogin("/messages")}
                        >
                            <ChatDots className="h-6 w-6 mb-1" weight="regular" />
                            <span>Messages</span>
                        </div>

                        {!isAuthenticated ? (
                            <Link to="/connexion" className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary">
                                <UserCircle className="h-6 w-6 mb-1" weight="regular" />
                                <span>Se connecter</span>
                            </Link>
                        ) : (
                            <Link to="/profil" className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary">
                                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mb-1">
                                    {getUserInitial()}
                                </div>
                                <span>{user?.firstName || "Profil"}</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}