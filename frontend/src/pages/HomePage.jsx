import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import postStore from "@/stores/postStore";
import userStore from "@/stores/userStore";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Funnel,
    PlusCircle,
    MapPin,
    Clock,
    WarningCircle,
    X,
    MagnifyingGlass,
    Heart,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
    const { posts, loading, error, getPosts } = postStore();
    const { isAuthenticated } = userStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        priceMin: "",
        priceMax: "",
        location: "",
        sortBy: "recent",
    });

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

        if (filters.priceMin) {
            result = result.filter(post => post.price >= Number(filters.priceMin));
        }

        if (filters.priceMax) {
            result = result.filter(post => post.price <= Number(filters.priceMax));
        }

        if (filters.location) {
            result = result.filter(post =>
                post.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.sortBy === "recent") {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filters.sortBy === "price-asc") {
            result.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sortBy === "price-desc") {
            result.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        setFilteredPosts(result);
    }, [posts, searchTerm, filters]);

    const resetFilters = () => {
        setFilters({
            category: "",
            priceMin: "",
            priceMax: "",
            location: "",
            sortBy: "recent",
        });
        setSearchTerm("");
        setFiltersOpen(false);
        setSearchParams({});
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
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 py-6">
                <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-16">
                    <section className="mb-6">
                        <div className="flex md:hidden items-center justify-between mb-4">
                            <h1 className="text-xl font-bold">Annonces récentes</h1>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className={`${filtersOpen ? 'bg-primary/10 text-primary' : ''}`}
                            >
                                <Funnel className="h-5 w-5" weight={filtersOpen ? "fill" : "regular"} />
                            </Button>
                        </div>

                        <div className="hidden md:block mb-4">
                            <h1 className="text-2xl font-bold">Annonces récentes</h1>
                            {searchTerm && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Résultats pour: "{searchTerm}"
                                </p>
                            )}
                        </div>

                        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen} className="mb-6">
                            <CollapsibleTrigger asChild>
                                <div className="hidden">
                                    <Button>Toggle</Button>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="p-4 bg-white rounded-lg border shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-medium">Filtres</h2>
                                        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-primary">
                                            <X className="h-4 w-4 mr-1" weight="bold" />
                                            <span>Réinitialiser</span>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Prix minimum</label>
                                            <Input
                                                type="number"
                                                placeholder="0 €"
                                                value={filters.priceMin}
                                                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                                                className="focus-visible:ring-primary"
                                                min="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Prix maximum</label>
                                            <Input
                                                type="number"
                                                placeholder="Max €"
                                                value={filters.priceMax}
                                                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                                                className="focus-visible:ring-primary"
                                                min="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Localisation</label>
                                            <Input
                                                type="text"
                                                placeholder="Ville, département..."
                                                value={filters.location}
                                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                                className="focus-visible:ring-primary"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Trier par</label>
                                            <Select
                                                value={filters.sortBy}
                                                onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                                            >
                                                <SelectTrigger className="focus:ring-primary">
                                                    <SelectValue placeholder="Trier par" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="recent">Plus récent</SelectItem>
                                                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                                                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        {error && (
                            <Alert variant="destructive" className="mb-4 border-primary/40 bg-primary/5">
                                <WarningCircle className="h-4 w-4 text-primary" weight="fill" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {loading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                                {[...Array(12)].map((_, index) => (
                                    <div key={`skeleton-${index}`} className="w-full" style={{ maxWidth: "170px" }}>
                                        <div className="bg-white rounded-sm">
                                            <div className="relative h-44 bg-muted rounded-sm overflow-hidden">
                                                <Skeleton className="h-full w-full" />
                                            </div>
                                            <div className="p-2 pb-3">
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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
                                {filteredPosts.map((post) => (
                                    <Link key={post.id} to={`/annonce/${post.id}`} className="group block w-full" style={{ maxWidth: "170px" }}>
                                        <div className="relative bg-white h-full rounded-sm hover:shadow-sm transition-shadow duration-200 pb-2">
                                            <button className="absolute z-10 top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-600 hover:text-primary">
                                                <Heart className="h-5 w-5" weight="regular" />
                                            </button>

                                            <div className="relative h-44 overflow-hidden rounded-t-sm">
                                                {post.mainImage ? (
                                                    <img
                                                        src={post.mainImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                        <span className="text-xs text-muted-foreground">Pas d'image</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-2">
                                                <p className="font-bold text-base text-primary">
                                                    {formatPrice(post.price)}
                                                </p>

                                                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mt-1 mb-2">
                                                    {post.title}
                                                </h3>

                                                {post.location && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="h-3 w-3 flex-shrink-0" weight="fill" />
                                                        <span className="truncate">{post.location}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
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
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-sm p-8 mx-auto max-w-lg">
                                <div className="mx-auto h-20 w-20 text-muted-foreground mb-4 flex items-center justify-center rounded-full bg-muted">
                                    <MagnifyingGlass className="h-10 w-10" weight="light" />
                                </div>
                                <h3 className="text-xl font-medium mb-2">Aucune annonce trouvée</h3>
                                <p className="text-muted-foreground">
                                    {posts.length === 0
                                        ? "Aucune annonce n'est disponible pour le moment."
                                        : "Aucune annonce ne correspond à votre recherche."}
                                </p>
                                {searchTerm || filters.priceMin || filters.priceMax || filters.location ? (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="mt-4 hover:text-primary"
                                    >
                                        Réinitialiser les filtres
                                    </Button>
                                ) : null}
                            </div>
                        )}
                    </section>

                    {isAuthenticated && (
                        <div className="fixed bottom-8 right-8 md:hidden">
                            <Link to="/annonce/creation">
                                <Button className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90">
                                    <PlusCircle className="h-8 w-8" weight="bold" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}