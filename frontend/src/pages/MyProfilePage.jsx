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
                <main className="flex-1 py-6 lg:py-8 2xl:py-12 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-8 w-8 lg:h-10 lg:w-10 2xl:h-12 2xl:w-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-sm lg:text-base 2xl:text-lg">Chargement de votre profil...</p>
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

            <main className="flex-1 py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px]">

                    {user && !user.isProfileComplete && (
                        <Alert className="mb-6 xl:mb-8 2xl:mb-8 border-orange-200 bg-orange-50">
                            <Info className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7" weight="fill" />
                            <AlertTitle className="text-sm sm:text-base lg:text-lg 2xl:text-xl font-semibold">Profil incomplet</AlertTitle>
                            <AlertDescription className="text-sm lg:text-base 2xl:text-lg">
                                Complétez votre téléphone et ville pour pouvoir créer des annonces.
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-6 xl:mb-8 2xl:mb-8">
                            <Warning className="h-5 w-5 lg:h-6 lg:w-6 2xl:h-7 2xl:w-7" weight="bold" />
                            <AlertTitle className="text-sm sm:text-base lg:text-lg 2xl:text-xl font-semibold">Erreur</AlertTitle>
                            <AlertDescription className="text-sm lg:text-base 2xl:text-lg">{error}</AlertDescription>
                        </Alert>
                    )}

                    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 max-w-4xl 2xl:max-w-5xl mx-auto">
                        <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 mb-8 lg:mb-12 xl:mb-14 2xl:mb-16">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 2xl:w-32 2xl:h-32 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 2xl:h-16 2xl:w-16 text-primary" weight="fill" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-bold text-gray-900 mb-2">
                                        {user?.firstName && user?.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : 'Mon profil'
                                        }
                                    </h1>
                                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg 2xl:text-xl">
                                        Gérez vos informations personnelles
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 w-full sm:w-auto">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                onClick={saveProfile}
                                                disabled={isSubmitting}
                                                className="bg-primary hover:bg-primary/90 text-white lg:px-6 xl:px-8 2xl:px-10 lg:py-3 2xl:py-4 text-sm lg:text-base 2xl:text-lg"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Sauvegarde...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="mr-2 h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6" weight="bold" />
                                                        Sauvegarder
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={cancelEdit}
                                                disabled={isSubmitting}
                                                className="lg:px-6 xl:px-8 2xl:px-10 lg:py-3 2xl:py-4 text-sm lg:text-base 2xl:text-lg"
                                            >
                                                Annuler
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-primary hover:bg-primary/90 text-white lg:px-6 xl:px-8 2xl:px-10 lg:py-3 2xl:py-4 text-sm lg:text-base 2xl:text-lg"
                                        >
                                            <PencilSimple className="mr-2 h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6" />
                                            Modifier
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-10 2xl:space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 2xl:gap-8">
                                    <div>
                                        <label className="block text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                            Prénom *
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.firstName || ''}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                placeholder="Votre prénom"
                                                className="text-sm lg:text-base 2xl:text-lg focus-visible:ring-primary py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200">
                                                {user?.firstName || 'Non renseigné'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                            Nom *
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.lastName || ''}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                placeholder="Votre nom"
                                                className="text-sm lg:text-base 2xl:text-lg focus-visible:ring-primary py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200">
                                                {user?.lastName || 'Non renseigné'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                        <Envelope className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 text-primary" weight="fill" />
                                        Adresse e-mail *
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="votre@email.com"
                                            className="text-sm lg:text-base 2xl:text-lg focus-visible:ring-primary py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5"
                                        />
                                    ) : (
                                        <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200 break-all">
                                            {user?.email || 'Non renseigné'}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 2xl:gap-8">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                            <Phone className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 text-primary" weight="fill" />
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
                                                className="text-sm lg:text-base 2xl:text-lg focus-visible:ring-primary py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200">
                                                {user?.phone || (
                                                    <span className="text-orange-600 italic text-xs sm:text-sm lg:text-base 2xl:text-lg">
                                                        Requis pour créer des annonces
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                            <MapPin className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 text-primary" weight="fill" />
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
                                                className="text-sm lg:text-base 2xl:text-lg focus-visible:ring-primary py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5"
                                            />
                                        ) : (
                                            <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200">
                                                {user?.city || (
                                                    <span className="text-orange-600 italic text-xs sm:text-sm lg:text-base 2xl:text-lg">
                                                        Requis pour créer des annonces
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                        <Calendar className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 text-primary" weight="fill" />
                                        Membre depuis
                                    </label>
                                    <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200">
                                        {user?.createdAt ? formatPostDate(user.createdAt) : 'Non disponible'}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm lg:text-base 2xl:text-lg font-medium text-gray-700 mb-2 lg:mb-3 2xl:mb-4">
                                        <PencilSimple className="h-4 w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6 text-primary" weight="fill" />
                                        À propos de moi
                                    </label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.bio || ''}
                                            onChange={(e) => updateField('bio', e.target.value)}
                                            placeholder="Parlez-nous de vous..."
                                            className="min-h-20 lg:min-h-24 2xl:min-h-32 text-sm lg:text-base 2xl:text-lg focus-visible:ring-primary py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm lg:text-base 2xl:text-lg text-gray-900 py-2 lg:py-3 2xl:py-4 px-3 lg:px-4 2xl:px-5 bg-white/60 rounded-lg border border-gray-200 min-h-20 lg:min-h-24 2xl:min-h-32">
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
                </div>
            </main>

            <Footer />
        </div>
    );
}