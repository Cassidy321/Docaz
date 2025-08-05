import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import {
    CaretLeft,
    PlusCircle,
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

                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Mes annonces</h1>
                                <p className="text-gray-600 mt-1 lg:text-lg">
                                    Consultez vos annonces publiées sur le site
                                </p>
                            </div>

                            <Button
                                className="mt-4 sm:mt-0 w-full sm:w-auto group bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5 px-5 py-2.5 lg:px-8 lg:py-4 xl:px-10 xl:py-5 text-base lg:text-lg xl:text-xl font-semibold rounded-xl transition-all duration-200"
                                onClick={() => navigate("/annonce/creation")}
                            >
                                <PlusCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform duration-200" />
                                Poster une annonce
                            </Button>
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
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="h-48 sm:h-56 md:h-52 lg:h-48 xl:h-52 2xl:h-56 bg-gray-100">
                                        <Skeleton className="h-full w-full" />
                                    </div>
                                    <div className="p-3 lg:p-4 xl:p-5 2xl:p-6 space-y-2">
                                        <Skeleton className="h-5 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-3 w-3/4" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 lg:p-12 xl:p-16 2xl:p-20 text-center shadow-sm border max-w-md xl:max-w-lg 2xl:max-w-xl mx-auto">
                            <div className="mx-auto h-16 w-16 lg:h-20 lg:w-20 xl:h-24 xl:w-24 2xl:h-28 2xl:w-28 bg-gray-100 rounded-full flex items-center justify-center mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                <House className="h-8 w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 text-gray-400" weight="thin" />
                            </div>
                            <h2 className="text-lg lg:text-xl font-medium mb-2">Vous n'avez pas encore d'annonces</h2>
                            <p className="text-gray-600 mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                                Commencez à vendre en publiant votre première annonce. C'est simple, rapide et efficace !
                            </p>
                            <Button
                                onClick={() => navigate("/annonce/creation")}
                                className="bg-primary hover:bg-primary/90 text-white lg:px-6 lg:py-3"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" weight="bold" />
                                Créer une annonce
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="block w-full"
                                >
                                    <div className="relative bg-white h-full rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                                        <div
                                            className="aspect-square overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer"
                                            onClick={() => navigate(`/annonce/${post.id}`)}
                                        >
                                            {post.mainImage ? (
                                                <img
                                                    src={post.mainImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-xs lg:text-sm text-gray-400">Pas d'image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 lg:p-4 xl:p-5 2xl:p-6">
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => navigate(`/annonce/${post.id}`)}
                                            >
                                                <p className="font-bold text-lg text-primary mb-1">
                                                    {formatPrice(post.price)}
                                                </p>

                                                <h3 className="font-medium text-sm lg:text-base text-gray-900 line-clamp-1 hover:text-primary transition-colors mb-2">
                                                    {post.title}
                                                </h3>

                                                {post.description && (
                                                    <p className="text-xs lg:text-sm text-gray-500 line-clamp-1 mb-3">
                                                        {post.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100/50">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        navigate(`/annonce/edition/${post.id}`);
                                                    }}
                                                    className="group flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 border border-gray-200/20 hover:border-gray-300/30 transition-all duration-300"
                                                >
                                                    <Pencil className="h-3.5 w-3.5 text-gray-700 group-hover:text-violet-600 group-hover:rotate-6 transition-all duration-300" weight="duotone" />
                                                    <span className="text-xs font-medium text-gray-700 group-hover:text-violet-600 transition-colors duration-300">Modifier</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('Supprimer annonce:', post.id);
                                                    }}
                                                    className="group flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-red-500/5 to-rose-600/5 hover:from-red-500/10 hover:to-rose-600/10 border border-red-200/20 hover:border-red-300/30 transition-all duration-300"
                                                >
                                                    <Trash className="h-3.5 w-3.5 text-red-600 group-hover:scale-110 transition-transform duration-300" weight="duotone" />
                                                    <span className="text-xs font-medium text-red-600">Supprimer</span>
                                                </button>
                                            </div>
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