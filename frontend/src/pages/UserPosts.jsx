import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import {
    CaretLeft,
    PlusCircle,
    MapPin,
    Clock,
    House,
    Warning,
    Pencil,
    Trash,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UserPostsPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = userStore();
    const { posts, loading, error, getUserPosts } = postStore();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/connexion", {
                state: { from: "/mes-annonces", message: "Veuillez vous connecter pour accéder à vos annonces" }
            });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            getUserPosts();
        }
    }, [isAuthenticated, getUserPosts]);

    const formatPrice = (price) => {
        if (price === undefined || price === null) return "Prix non défini";

        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-6 sm:py-8">
                <div className="container max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="mb-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="mb-4 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                        >
                            <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour à l'accueil
                        </Button>

                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">Mes annonces</h1>
                                <p className="text-muted-foreground mt-1">
                                    Consultez vos annonces publiées sur le site
                                </p>
                            </div>

                            <Button
                                className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
                                onClick={() => navigate("/annonce/creation")}
                            >
                                <PlusCircle className="mr-2 h-5 w-5" weight="bold" />
                                Créer une annonce
                            </Button>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((idx) => (
                                <div key={idx} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                    <div className="h-48 sm:h-56 bg-gray-100">
                                        <Skeleton className="h-full w-full" />
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-16 w-full" />
                                        <div className="flex justify-between items-center pt-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center mt-8 shadow-sm border">
                            <div className="mx-auto h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                                <House className="h-10 w-10 text-muted-foreground" weight="thin" />
                            </div>
                            <h2 className="text-xl font-medium mb-2">Vous n'avez pas encore d'annonces</h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Commencez à vendre en publiant votre première annonce. C'est simple, rapide et efficace !
                            </p>
                            <Button
                                onClick={() => navigate("/annonce/creation")}
                                className="mx-auto bg-primary hover:bg-primary/90 text-white"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" weight="bold" />
                                Créer une annonce
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                    onClick={() => navigate(`/annonce/${post.id}`)}
                                >
                                    <div className="relative bg-gray-100 overflow-hidden">
                                        {post.mainImage ? (
                                            <img
                                                src={post.mainImage}
                                                alt={post.title}
                                                className="w-full h-auto max-h-64 sm:max-h-72 object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-48 sm:h-56 flex items-center justify-center text-muted-foreground text-sm">
                                                Pas d'image
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <h2 className="text-lg font-medium line-clamp-2 flex-1">
                                                {post.title}
                                            </h2>
                                            <div className="bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
                                                <span className="text-primary font-bold text-sm">
                                                    {formatPrice(post.price)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                                            {post.location && (
                                                <div className="flex items-center">
                                                    <MapPin className="mr-1 h-3 w-3" weight="fill" />
                                                    <span>{post.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-3 w-3" weight="fill" />
                                                <span>
                                                    {formatDistanceToNow(parseISO(post.createdAt), {
                                                        addSuffix: true,
                                                        locale: fr,
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-9 text-sm font-medium border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Modifier
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 h-9 text-sm font-medium border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                                            >
                                                <Trash className="mr-2 h-4 w-4" />
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}