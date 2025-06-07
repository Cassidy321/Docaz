import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
    MapPin,
    Clock,
    WarningCircle,
    MagnifyingGlass,
    Heart,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function HomePage() {
    const { posts, loading, error, getPosts } = postStore();
    const { isAuthenticated } = userStore();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                await getPosts();
            } catch (error) {
                console.error("Erreur lors du chargement des annonces:", error);
            }
        };

        loadPosts();

        const urlSearchTerm = searchParams.get("search");
        if (urlSearchTerm) {
            setSearchTerm(urlSearchTerm);
        }
    }, [getPosts, searchParams]);

    useEffect(() => {
        let result = [...posts];

        if (searchTerm) {
            result = result.filter(
                post =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFilteredPosts(result);
    }, [posts, searchTerm]);

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

            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 relative overflow-hidden">
                <div className="px-4 mx-auto max-w-7xl py-10 sm:py-14 md:py-20">
                    <div className="relative z-10 text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                            Bienvenue sur Docaz
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                            Vendez rapidement et facilement sur Docaz
                        </p>
                        <Link to="/annonce/creation">
                            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-5 sm:px-12 sm:py-6 rounded-full text-lg sm:text-xl md:text-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group">
                                Déposer votre annonce
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                </div>
            </div>

            <main className="flex-1 py-6 sm:py-8">
                <div className="px-4 mx-auto max-w-7xl">
                    <section>
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Les annonces les plus récentes
                            </h2>
                            {searchTerm && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Résultats pour : "{searchTerm}"
                                </p>
                            )}
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                                <WarningCircle className="h-4 w-4" weight="fill" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                {[...Array(12)].map((_, index) => (
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
                        ) : filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                {filteredPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={`/annonce/${post.id}`}
                                        className="group block w-full"
                                    >
                                        <div className="relative bg-white h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                            <button
                                                className="absolute z-10 top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                <Heart className="h-5 w-5" weight="regular" />
                                            </button>

                                            <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                                                {post.mainImage ? (
                                                    <img
                                                        src={post.mainImage}
                                                        alt={post.title}
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
                                                    {formatPrice(post.price)}
                                                </p>

                                                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors mb-2">
                                                    {post.title}
                                                </h3>

                                                <div className="space-y-1">
                                                    {post.location && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin className="h-3 w-3 flex-shrink-0" weight="fill" />
                                                            <span className="truncate">{post.location}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="h-3 w-3 flex-shrink-0" weight="fill" />
                                                        <span>
                                                            {formatDistanceToNow(new Date(post.createdAt), {
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
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg shadow-sm p-8 mx-auto max-w-md">
                                <div className="mx-auto h-20 w-20 text-gray-400 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                                    <MagnifyingGlass className="h-10 w-10" weight="light" />
                                </div>
                                <h3 className="text-xl font-medium mb-2 text-gray-900">Aucune annonce trouvée</h3>
                                <p className="text-gray-600">
                                    {posts.length === 0
                                        ? "Aucune annonce n'est disponible pour le moment."
                                        : "Aucune annonce ne correspond à votre recherche."}
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}