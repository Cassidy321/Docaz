import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import {
    ArrowLeft,
    PlusCircle,
    MapPin,
    Clock,
    Eye,
    House,
    Warning,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 py-6 md:py-10">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                                className="mb-3 text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="mr-1 h-4 w-4" weight="bold" />
                                Accueil
                            </Button>
                            <h1 className="text-2xl md:text-3xl font-bold">Mes annonces</h1>
                            <p className="text-muted-foreground mt-1">
                                Consultez vos annonces publiées sur le site
                            </p>
                        </div>

                        <Button
                            className="hidden md:flex"
                            onClick={() => navigate("/annonce/creation")}
                        >
                            <PlusCircle className="mr-2 h-5 w-5" weight="bold" />
                            Créer une annonce
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <Warning className="h-5 w-5" weight="bold" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((idx) => (
                                <div key={idx} className="bg-white p-4 rounded-md border">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="w-full md:w-32 h-32 bg-muted rounded-md flex-shrink-0">
                                            <Skeleton className="h-full w-full" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <div className="flex justify-between items-end mt-4">
                                                <Skeleton className="h-5 w-24" />
                                                <Skeleton className="h-9 w-28" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-white rounded-lg p-8 text-center mt-8">
                            <div className="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                <House className="h-10 w-10 text-muted-foreground" weight="thin" />
                            </div>
                            <h2 className="text-xl font-medium mb-2">Vous n'avez pas encore d'annonces</h2>
                            <p className="text-muted-foreground mb-6">
                                Commencez à vendre en publiant votre première annonce.
                            </p>
                            <Button
                                onClick={() => navigate("/annonce/creation")}
                                className="mx-auto"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" weight="bold" />
                                Créer une annonce
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white p-4 rounded-md border hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <Link to={`/annonce/${post.id}`} className="block w-full md:w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            {post.mainImage ? (
                                                <img
                                                    src={post.mainImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                                    Pas d'image
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex-1">
                                            <div className="flex flex-col h-full">
                                                <div>
                                                    <Link to={`/annonce/${post.id}`} className="text-lg font-medium hover:text-primary transition-colors">
                                                        {post.title}
                                                    </Link>

                                                    <p className="text-primary font-bold mt-1">
                                                        {formatPrice(post.price)}
                                                    </p>

                                                    <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground mt-2">
                                                        {post.location && (
                                                            <div className="flex items-center">
                                                                <MapPin className="mr-1 h-3 w-3" weight="fill" />
                                                                <span className="truncate max-w-[150px]">{post.location}</span>
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
                                                </div>
                                                <div className="flex justify-between items-center mt-auto pt-3">
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        Active
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="fixed bottom-8 right-8 md:hidden">
                        <Button
                            onClick={() => navigate("/annonce/creation")}
                            className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90"
                        >
                            <PlusCircle className="h-8 w-8" weight="bold" />
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}