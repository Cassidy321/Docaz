import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userStore from "@/stores/userStore";
import { formatPostDate } from "@/utils/dateUtils";
import {
    CaretLeft,
    User,
    Envelope,
    Phone,
    MapPin,
    PencilSimple,
    Check,
    Warning,
    Info,
    Calendar,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MyProfilePage() {
    const navigate = useNavigate();
    const { user, loading, error, getUser, updateProfile } = userStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user && !loading) {
            navigate("/connexion");
            return;
        }

        if (!user) {
            getUser();
        } else {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                bio: user.bio || '',
            });
        }
    }, [user, loading, getUser, navigate]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const saveProfile = async () => {
        setIsSubmitting(true);
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Erreur sauvegarde profil:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelEdit = () => {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || '',
            city: user.city || '',
            bio: user.bio || '',
        });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 py-6 lg:py-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-sm lg:text-base">Chargement de votre profil...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-4 sm:py-6 lg:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

                    <div className="mb-4 sm:mb-6 lg:mb-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="mb-3 sm:mb-4 lg:mb-6 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group text-sm sm:text-base lg:text-base w-full sm:w-auto justify-center sm:justify-start"
                        >
                            <CaretLeft className="mr-1 h-4 w-4 lg:h-5 lg:w-5 group-hover:-translate-x-1 transition-transform" />
                            Retour à l'accueil
                        </Button>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">Mon profil</h1>
                                <p className="text-gray-600 mt-1 lg:mt-2 text-sm sm:text-base lg:text-lg">
                                    Gérez vos informations personnelles
                                </p>
                            </div>

                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto lg:px-6 xl:px-8 lg:py-3"
                                >
                                    <PencilSimple className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                                    Modifier
                                </Button>
                            )}
                        </div>
                    </div>

                    {user && !user.isProfileComplete && (
                        <Alert className="mb-4 sm:mb-6 lg:mb-8 border-orange-200 bg-orange-50">
                            <Info className="h-5 w-5 lg:h-6 lg:w-6" weight="fill" />
                            <AlertTitle className="text-sm sm:text-base lg:text-lg">Profil incomplet</AlertTitle>
                            <AlertDescription className="text-sm lg:text-base">
                                Complétez votre téléphone et ville pour pouvoir créer des annonces.
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-4 sm:mb-6 lg:mb-8">
                            <Warning className="h-5 w-5 lg:h-6 lg:w-6" weight="bold" />
                            <AlertTitle className="text-sm sm:text-base lg:text-lg">Erreur</AlertTitle>
                            <AlertDescription className="text-sm lg:text-base">{error}</AlertDescription>
                        </Alert>
                    )}

                    <Card className="overflow-hidden border-none shadow-sm lg:shadow-md">
                        <CardContent className="p-0">
                            <div className="bg-primary/5 px-3 sm:px-4 lg:px-6 py-3 lg:py-4 border-b border-primary/10">
                                <h2 className="font-semibold text-primary flex items-center gap-2 text-sm lg:text-base">
                                    <User className="h-4 w-4 lg:h-5 lg:w-5" weight="fill" />
                                    Mon profil
                                </h2>
                            </div>

                            <div className="p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-5 lg:space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                    <div>
                                        <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                            Prénom *
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.firstName || ''}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                placeholder="Votre prénom"
                                                className="text-sm lg:text-base focus-visible:ring-primary lg:py-3 lg:px-4"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md">
                                                {user?.firstName || 'Non renseigné'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                            Nom *
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.lastName || ''}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                placeholder="Votre nom"
                                                className="text-sm lg:text-base focus-visible:ring-primary lg:py-3 lg:px-4"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md">
                                                {user?.lastName || 'Non renseigné'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                        <Envelope className="h-4 w-4 lg:h-5 lg:w-5 text-primary" weight="fill" />
                                        Adresse e-mail *
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="votre@email.com"
                                            className="text-sm lg:text-base focus-visible:ring-primary lg:py-3 lg:px-4"
                                        />
                                    ) : (
                                        <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md break-all">
                                            {user?.email || 'Non renseigné'}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                            <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-primary" weight="fill" />
                                            Téléphone
                                            {(!user?.phone && !user?.isProfileComplete) && (
                                                <span className="text-orange-600 ml-1">*</span>
                                            )}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                type="tel"
                                                value={formData.phone || ''}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                placeholder="06 12 34 56 78"
                                                className="text-sm lg:text-base focus-visible:ring-primary lg:py-3 lg:px-4"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md">
                                                {user?.phone || (
                                                    <span className="text-orange-600 italic text-xs sm:text-sm lg:text-base">
                                                        Requis pour créer des annonces
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                            <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary" weight="fill" />
                                            Ville
                                            {(!user?.city && !user?.isProfileComplete) && (
                                                <span className="text-orange-600 ml-1">*</span>
                                            )}
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.city || ''}
                                                onChange={(e) => updateField('city', e.target.value)}
                                                placeholder="Paris, Lyon, Marseille..."
                                                className="text-sm lg:text-base focus-visible:ring-primary lg:py-3 lg:px-4"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md">
                                                {user?.city || (
                                                    <span className="text-orange-600 italic text-xs sm:text-sm lg:text-base">
                                                        Requis pour créer des annonces
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                        <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-primary" weight="fill" />
                                        Membre depuis
                                    </label>
                                    <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md">
                                        {user?.createdAt ? formatPostDate(user.createdAt) : 'Non disponible'}
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                                        <PencilSimple className="h-4 w-4 lg:h-5 lg:w-5 text-primary" weight="fill" />
                                        À propos de moi
                                    </label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.bio || ''}
                                            onChange={(e) => updateField('bio', e.target.value)}
                                            placeholder="Parlez-nous de vous..."
                                            className="min-h-20 lg:min-h-24 text-sm lg:text-base focus-visible:ring-primary lg:p-4"
                                        />
                                    ) : (
                                        <p className="text-sm lg:text-base text-gray-900 py-2 lg:py-3 px-3 lg:px-4 bg-gray-50 rounded-md min-h-20 lg:min-h-24">
                                            {user?.bio || (
                                                <span className="text-gray-400 italic">
                                                    Aucune description pour le moment
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {isEditing && (
                        <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row gap-3 lg:gap-4 sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={cancelEdit}
                                disabled={isSubmitting}
                                className="px-6 py-2 lg:px-8 lg:py-3 text-sm lg:text-base order-2 sm:order-1 w-full sm:w-auto"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={saveProfile}
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 lg:px-8 lg:py-3 text-sm lg:text-base order-1 sm:order-2 w-full sm:w-auto"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 lg:h-5 lg:w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4 lg:h-5 lg:w-5" weight="bold" />
                                        Sauvegarder
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}