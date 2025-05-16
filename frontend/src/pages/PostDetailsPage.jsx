import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import {
    CaretLeft,
    MapPin,
    Calendar,
    Heart,
    ShareNetwork,
    Phone,
    Warning,
    Pencil,
    Trash,
    User,
    ArrowsClockwise,
    CaretRight,
    CaretLeft as PrevIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentPost, loading, error, getPostById, deletePost } = postStore();
    const { user, isAuthenticated } = userStore();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-muted">
                <Navbar />

                <main className="flex-1 py-6">
                    <div className="container max-w-6xl mx-auto px-4">
                        <div className="mb-6">
                            <Button
                                variant="ghost"
                                onClick={() => navigate(-1)}
                                className="mb-4 text-muted-foreground hover:text-foreground"
                            >
                                <CaretLeft className="mr-1 h-4 w-4" weight="bold" />
                                Retour
                            </Button>

                            <Skeleton className="h-10 w-3/4 mb-2" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden">
                                    <Skeleton className="h-full w-full" />
                                </div>

                                <div className="flex overflow-x-auto gap-2 pb-2">
                                    {[1, 2, 3, 4].map((index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 h-20 w-20 rounded bg-muted"
                                        >
                                            <Skeleton className="h-full w-full" />
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-1/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-md border shadow-sm">
                                    <Skeleton className="h-8 w-2/3 mb-6" />
                                    <Skeleton className="h-5 w-full mb-4" />
                                    <Skeleton className="h-5 w-1/2 mb-8" />
                                    <Skeleton className="h-10 w-full" />
                                </div>

                                <div className="bg-white p-6 rounded-md border shadow-sm">
                                    <Skeleton className="h-6 w-2/3 mb-4" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-full mb-4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    if (error || !currentPost) {
        return (
            <div className="min-h-screen flex flex-col bg-muted">
                <Navbar />

                <main className="flex-1 py-6">
                    <div className="container max-w-6xl mx-auto px-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-4 text-muted-foreground hover:text-foreground"
                        >
                            <CaretLeft className="mr-1 h-4 w-4" weight="bold" />
                            Retour
                        </Button>

                        <Alert variant="destructive" className="mb-6">
                            <Warning className="h-5 w-5" weight="fill" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>
                                {error || "Cette annonce n'existe pas ou a été supprimée."}
                            </AlertDescription>
                        </Alert>

                        <div className="flex justify-center mt-8">
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
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 py-6">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="mb-4 text-muted-foreground hover:text-foreground"
                        >
                            <CaretLeft className="mr-1 h-4 w-4" weight="bold" />
                            Retour
                        </Button>

                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{currentPost.title}</h1>
                        <div className="flex items-center text-sm text-muted-foreground gap-x-4">
                            <div className="flex items-center">
                                <MapPin className="mr-1 h-4 w-4" weight="fill" />
                                {currentPost.location}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" weight="fill" />
                                {formatDistanceToNow(parseISO(currentPost.createdAt), {
                                    addSuffix: true,
                                    locale: fr,
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="relative">
                                <div className="aspect-[4/3] bg-white rounded-md overflow-hidden border flex items-center justify-center">
                                    {currentPost.images && currentPost.images.length > 0 ? (
                                        <img
                                            src={currentPost.images[selectedImageIndex].url}
                                            alt={currentPost.title}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-muted-foreground">Pas d'image disponible</div>
                                    )}

                                    {currentPost.images && currentPost.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={previousImage}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
                                                aria-label="Image précédente"
                                            >
                                                <PrevIcon className="h-5 w-5" weight="bold" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-gray-700 hover:bg-white"
                                                aria-label="Image suivante"
                                            >
                                                <CaretRight className="h-5 w-5" weight="bold" />
                                            </button>

                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs py-1 px-3 rounded-full">
                                                {selectedImageIndex + 1} / {currentPost.images.length}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {currentPost.images && currentPost.images.length > 1 && (
                                    <div className="flex overflow-x-auto gap-2 pt-4 pb-2 snap-x">
                                        {currentPost.images.map((image, index) => (
                                            <div
                                                key={index}
                                                className={`flex-shrink-0 h-16 md:h-20 w-16 md:w-20 cursor-pointer rounded overflow-hidden border-2 snap-start ${selectedImageIndex === index
                                                    ? "border-primary"
                                                    : "border-transparent"
                                                    }`}
                                                onClick={() => selectImage(index)}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${currentPost.title} - image ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Description</h2>
                                <div className="text-sm md:text-base whitespace-pre-line">
                                    {currentPost.description}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-md border shadow-sm">
                                <h2 className="text-2xl font-bold text-primary mb-6">
                                    {formatPrice(currentPost.price)}
                                </h2>

                                <div className="space-y-4">
                                    <Button className="w-full gap-2" disabled={isOwner}>
                                        {isOwner ? (
                                            "Votre annonce"
                                        ) : (
                                            <>
                                                <Heart className="h-5 w-5" />
                                                Ajouter aux favoris
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: currentPost.title,
                                                    text: `Découvrez cette annonce : ${currentPost.title}`,
                                                    url: window.location.href,
                                                });
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                            }
                                        }}
                                    >
                                        <ShareNetwork className="h-5 w-5" />
                                        Partager
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-md border shadow-sm">
                                <h2 className="text-lg font-semibold mb-4">Vendeur</h2>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-muted-foreground" weight="fill" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            {currentPost.author.firstName} {currentPost.author.lastName.charAt(0)}.
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Membre depuis mai 2024
                                        </p>
                                    </div>
                                </div>

                                {!isOwner && (
                                    <Button className="w-full">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Contacter
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}