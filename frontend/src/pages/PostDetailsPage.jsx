import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import {
    CaretLeft,
    MapPin,
    Heart,
    Warning,
    CaretRight,
    CaretLeft as PrevIcon,
    ChatCircle,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentPost, loading, error, getPostById, deletePost, toggleFavorite } = postStore();
    const { user, isAuthenticated } = userStore();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                await getPostById(id);
            } catch (error) {
                console.error("Erreur lors du chargement de l'annonce:", error);
            }
        };

        loadPost();
        window.scrollTo(0, 0);
    }, [id, getPostById]);

    useEffect(() => {
        if (currentPost && user) {
            setIsOwner(currentPost.author.id === user.id);
        } else {
            setIsOwner(false);
        }
    }, [currentPost, user]);

    const togglePostFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await toggleFavorite(parseInt(id));
        } catch (error) {
            console.error("Erreur toggle favori:", error);
        }
    };

    const selectImage = (index) => {
        setSelectedImageIndex(index);
    };

    const nextImage = () => {
        if (currentPost && currentPost.images.length > 0) {
            setSelectedImageIndex((prev) =>
                prev === currentPost.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const previousImage = () => {
        if (currentPost && currentPost.images.length > 0) {
            setSelectedImageIndex((prev) =>
                prev === 0 ? currentPost.images.length - 1 : prev - 1
            );
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

    const getInitials = (firstName) => {
        if (!firstName) return "?";
        return firstName.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1">
                    <div className="sticky top-0 z-40 bg-white border-b px-4 py-3">
                        <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="min-h-80 bg-gray-100">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div className="bg-white">
                        <div className="px-4 py-4">
                            <Skeleton className="h-8 w-3/4 mb-2" />
                            <Skeleton className="h-6 w-1/3 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !currentPost) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 py-4">
                    <div className="container mx-auto px-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="mb-4 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                        >
                            <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </Button>

                        <Alert variant="destructive" className="mb-4">
                            <Warning className="h-5 w-5" weight="fill" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>
                                {error || "Cette annonce n'existe pas ou a été supprimée."}
                            </AlertDescription>
                        </Alert>

                        <div className="flex justify-center mt-6">
                            <Button onClick={() => navigate("/")}>
                                Retour à l'accueil
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 sm:container sm:mx-auto sm:max-w-2xl sm:px-4 md:max-w-4xl md:px-6 lg:max-w-5xl lg:px-8 xl:max-w-6xl xl:px-10">
                <div className="flex items-center justify-between px-4 py-4 sm:px-0">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                    >
                        <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Retour
                    </Button>
                </div>
                <div className="relative bg-white">
                    <div className="relative bg-gray-100 h-80 md:h-96 lg:h-[450px] w-full overflow-hidden">
                        {isAuthenticated && (
                            <button
                                onClick={togglePostFavorite}
                                className={`absolute z-10 top-3 right-3 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${currentPost.isFavorite
                                        ? 'text-primary hover:text-primary/80'
                                        : 'text-gray-600 hover:text-primary'
                                    }`}
                                title={currentPost.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                            >
                                <Heart
                                    className="h-6 w-6 md:h-7 md:w-7"
                                    weight={currentPost.isFavorite ? "fill" : "regular"}
                                />
                            </button>
                        )}

                        {currentPost.images && currentPost.images.length > 0 ? (
                            <>
                                <img
                                    src={currentPost.images[selectedImageIndex].url}
                                    alt={currentPost.title}
                                    className="w-full h-full object-contain"
                                />
                                {currentPost.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={previousImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                                        >
                                            <PrevIcon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" weight="bold" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/30 transition-colors"
                                        >
                                            <CaretRight className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" weight="bold" />
                                        </button>
                                        <div className="absolute bottom-3 md:bottom-4 lg:bottom-6 xl:bottom-8 left-1/2 -translate-x-1/2 flex gap-1 md:gap-1.5 lg:gap-2 xl:gap-3">
                                            {currentPost.images.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`h-1.5 md:h-2 lg:h-2.5 xl:h-3 rounded-full transition-all ${selectedImageIndex === index
                                                        ? "bg-primary w-4 md:w-6 lg:w-8 xl:w-10"
                                                        : "bg-primary/50 w-1.5 md:w-2 lg:w-2.5 xl:w-3"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                Pas d'image disponible
                            </div>
                        )}
                    </div>
                    {currentPost.images && currentPost.images.length > 1 && (
                        <div className="flex gap-1 p-2 overflow-x-auto sm:p-3 sm:gap-2 sm:justify-center md:p-4 md:gap-3 lg:p-6 lg:gap-4 xl:p-8 xl:gap-5">
                            {currentPost.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => selectImage(index)}
                                    className={`flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32 rounded overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                        ? "border-primary opacity-100"
                                        : "border-transparent opacity-70"
                                        }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={`${currentPost.title} - ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-white mt-2">
                    <div className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 md:px-8 md:pt-8 md:pb-6 lg:px-10 lg:pt-10 lg:pb-8 xl:px-12 xl:pt-12 xl:pb-10">
                        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4">
                            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl font-bold flex-1">{currentPost.title}</h1>
                            <div className="text-right">
                                <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold text-primary">
                                    {formatPrice(currentPost.price)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 sm:text-sm md:text-base lg:text-base xl:text-base">
                            <MapPin className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5" weight="fill" />
                            <span>{currentPost.location}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
                        <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10">
                            <Link
                                to={`/user/${currentPost.author.id}`}
                                className="flex items-center gap-3 md:gap-4 lg:gap-5 xl:gap-6 flex-1 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                            >
                                <div className="h-12 w-12 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-14 lg:w-14 xl:h-16 xl:w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl font-semibold text-primary">
                                        {getInitials(currentPost.author.firstName)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium sm:text-base md:text-lg lg:text-lg xl:text-lg">
                                        {currentPost.author.firstName}
                                    </p>
                                </div>
                                <CaretRight className="h-5 w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5 text-gray-400" />
                            </Link>
                        </div>
                        {!isOwner && (
                            <Button
                                className="w-full md:text-base lg:text-base xl:text-base lg:py-3 xl:py-3"
                                size="lg"
                            >
                                <ChatCircle className="mr-2 h-5 w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5" weight="fill" />
                                Contacter le vendeur
                            </Button>
                        )}
                    </div>
                </div>
                <div className="bg-white mt-2 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
                    <h2 className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-xl font-semibold mb-3 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed sm:text-base sm:leading-6 md:text-base md:leading-6 lg:text-base lg:leading-6 xl:text-base xl:leading-6">
                        {currentPost.description}
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}