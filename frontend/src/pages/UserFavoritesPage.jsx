import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import postStore from "@/stores/postStore";
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

    const onToggleFavorite = async (e, postId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await toggleFavorite(postId);
            loadFavorites();
        } catch (error) {
            console.error("Erreur toggle favori:", error);
        }
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "Prix non défini";

        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-6 sm:py-8 md:py-10">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
                    <div className="mb-6 sm:mb-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="mb-4 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                        >
                            <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour à l'accueil
                        </Button>

                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Mes favoris</h1>
                            <p className="text-gray-600 mt-1">
                                Retrouvez toutes vos annonces favorites
                            </p>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <Warning className="h-5 w-5" weight="bold" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="aspect-square bg-gray-100">
                                        <Skeleton className="h-full w-full" />
                                    </div>
                                    <div className="p-3 space-y-2">
                                        <Skeleton className="h-5 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-3 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center shadow-sm border max-w-md mx-auto">
                            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Heart className="h-8 w-8 text-gray-400" weight="thin" />
                            </div>
                            <h2 className="text-lg font-medium mb-2">Aucun favori pour le moment</h2>
                            <p className="text-gray-600 mb-4">
                                Parcourez les annonces et ajoutez-les à vos favoris en cliquant sur le cœur
                            </p>
                            <Button
                                onClick={() => navigate("/")}
                                className="bg-primary hover:bg-primary/90 text-white"
                            >
                                <MagnifyingGlass className="mr-2 h-4 w-4" weight="bold" />
                                Découvrir les annonces
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            {favorites.map((favorite) => (
                                <Link
                                    key={favorite.id}
                                    to={`/annonce/${favorite.post.id}`}
                                    className="group block w-full"
                                >
                                    <div className="relative bg-white h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                        <button
                                            onClick={(e) => onToggleFavorite(e, favorite.post.id)}
                                            className="absolute z-10 top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 text-primary hover:text-primary/80"
                                            title="Retirer des favoris"
                                        >
                                            <Heart
                                                className="h-5 w-5"
                                                weight="fill"
                                            />
                                        </button>

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

                                            <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
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
                                                        Ajouté {formatDistanceToNow(parseISO(favorite.createdAt), {
                                                            addSuffix: true,
                                                            locale: fr,
                                                        })}
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