import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import { formatPostDate } from "@/utils/dateUtils";
import { formatPrice } from "@/utils/priceUtils";
import {
    CaretLeft,
    MapPin,
    Clock,
    Heart,
    Warning,
    MagnifyingGlass,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UserFavoritesPage() {
    const navigate = useNavigate();
    const { loading, error, getUserFavorites, toggleFavorite } = postStore();
    const { isAuthenticated } = userStore();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const userFavorites = await getUserFavorites();
            setFavorites(userFavorites);
        } catch (error) {
            console.error("Erreur lors du chargement des favoris:", error);
        }
    };

    const togglePostFavorite = async (e, postId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await toggleFavorite(postId);
            loadFavorites();
        } catch (error) {
            console.error("Erreur toggle favori:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">
                    <div className="mb-6 sm:mb-8 lg:mb-10 xl:mb-12 2xl:mb-16">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                        >
                            <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour à l'accueil
                        </Button>

                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Mes favoris</h1>
                            <p className="text-gray-600 mt-1 lg:text-lg">
                                Retrouvez toutes vos annonces favorites
                            </p>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6 xl:mb-8 2xl:mb-10">
                            <Warning className="h-5 w-5" weight="bold" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
                            {[...Array(16)].map((_, index) => (
                                <div key={`skeleton-${index}`} className="w-full">
                                    <div className="bg-white rounded-lg shadow-sm">
                                        <Skeleton className="aspect-square rounded-t-lg" />
                                        <div className="p-3">
                                            <Skeleton className="h-6 w-2/3 mb-2" />
                                            <Skeleton className="h-4 w-full mb-1" />
                                            <Skeleton className="h-4 w-full mb-3" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 lg:p-12 xl:p-16 2xl:p-20 text-center shadow-sm border max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto">
                            <div className="mx-auto h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 2xl:h-28 2xl:w-28 bg-gray-100 rounded-full flex items-center justify-center mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                <Heart className="h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 text-gray-400" weight="thin" />
                            </div>
                            <h2 className="text-lg lg:text-xl font-medium mb-2">Aucun favori pour le moment</h2>
                            <p className="text-gray-600 mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                Parcourez les annonces et ajoutez-les à vos favoris en cliquant sur le cœur
                            </p>
                            <Button
                                onClick={() => navigate("/")}
                                className="bg-primary hover:bg-primary/90 text-white lg:px-6 lg:py-3"
                            >
                                <MagnifyingGlass className="mr-2 h-5 w-5" weight="bold" />
                                Découvrir les annonces
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                            {favorites.map((favorite) => (
                                <Link
                                    key={favorite.id}
                                    to={`/annonce/${favorite.post.id}`}
                                    className="group block w-full"
                                >
                                    <div className="relative bg-white h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                        {isAuthenticated && (
                                            <button
                                                className="absolute z-10 top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 text-primary hover:text-primary/80"
                                                onClick={(e) => togglePostFavorite(e, favorite.post.id)}
                                                title="Retirer des favoris"
                                            >
                                                <Heart
                                                    className="h-5 w-5"
                                                    weight="fill"
                                                />
                                            </button>
                                        )}

                                        <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                                            {favorite.post.mainImage ? (
                                                <img
                                                    src={favorite.post.mainImage}
                                                    alt={favorite.post.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">Pas d'image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">
                                            <p className="font-bold text-lg text-primary mb-1">
                                                {formatPrice(favorite.post.price)}
                                            </p>

                                            <h3 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-primary transition-colors mb-2">
                                                {favorite.post.title}
                                            </h3>

                                            <div className="space-y-1">
                                                {favorite.post.location && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin className="h-3 w-3 flex-shrink-0" weight="fill" />
                                                        <span className="truncate">{favorite.post.location}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="h-3 w-3 flex-shrink-0" weight="fill" />
                                                    <span>
                                                        {formatPostDate(favorite.post.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}