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
    }, [user, getUser]);

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

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 py-6">
                <div className="container mx-auto px-4 max-w-6xl">

                    <div className="mb-6">
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="mb-4 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                        >
                            <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Retour à l'accueil
                        </Button>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Mon profil</h1>
                                <p className="text-gray-600 mt-1">
                                    Gérez vos informations personnelles
                                </p>
                            </div>

                            {!isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-primary hover:bg-primary/90 text-white"
                                >
                                    <PencilSimple className="mr-2 h-4 w-4" />
                                    Modifier
                                </Button>
                            )}
                        </div>
                    </div>

                    {user && !user.isProfileComplete && (
                        <Alert className="mb-6 border-orange-200 bg-orange-50">
                            <Info className="h-5 w-5" weight="fill" />
                            <AlertTitle>Profil incomplet</AlertTitle>
                            <AlertDescription>
                                Complétez votre téléphone et ville pour pouvoir créer des annonces.
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <Warning className="h-5 w-5" weight="bold" />
                            <AlertTitle>Erreur</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Card className="overflow-hidden border-none shadow-sm">
                        <CardContent className="p-0">
                            <div className="bg-primary/5 px-4 py-3 border-b border-primary/10">
                                <h2 className="font-semibold text-primary flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4" weight="fill" />
                                    Mon profil
                                </h2>
                            </div>

                            <div className="p-4 space-y-4">

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prénom *
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.firstName || ''}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                placeholder="Votre prénom"
                                                className="text-sm focus-visible:ring-primary"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                                                {user?.firstName || 'Non renseigné'}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom *
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.lastName || ''}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                placeholder="Votre nom"
                                                className="text-sm focus-visible:ring-primary"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                                                {user?.lastName || 'Non renseigné'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Envelope className="h-4 w-4 text-primary" weight="fill" />
                                        Adresse e-mail *
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="votre@email.com"
                                            className="text-sm focus-visible:ring-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                                            {user?.email || 'Non renseigné'}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="h-4 w-4 text-primary" weight="fill" />
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
                                                className="text-sm focus-visible:ring-primary"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                                                {user?.phone || (
                                                    <span className="text-orange-600 italic">
                                                        Requis pour créer des annonces
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="h-4 w-4 text-primary" weight="fill" />
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
                                                className="text-sm focus-visible:ring-primary"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                                                {user?.city || (
                                                    <span className="text-orange-600 italic">
                                                        Requis pour créer des annonces
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="h-4 w-4 text-primary" weight="fill" />
                                        Membre depuis
                                    </label>
                                    <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                                        {user?.createdAt ? formatPostDate(user.createdAt) : 'Non disponible'}
                                    </p>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        <PencilSimple className="h-4 w-4 text-primary" weight="fill" />
                                        À propos de moi
                                    </label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.bio || ''}
                                            onChange={(e) => updateField('bio', e.target.value)}
                                            placeholder="Parlez-nous de vous..."
                                            className="min-h-20 text-sm focus-visible:ring-primary"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900 py-2 px-3 bg-gray-50 rounded-md min-h-20">
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
                        <div className="mt-6 flex flex-col gap-3">
                            <Button
                                variant="outline"
                                onClick={cancelEdit}
                                disabled={isSubmitting}
                                className="px-6 py-2 text-sm"
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={saveProfile}
                                disabled={isSubmitting}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 text-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" weight="bold" />
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