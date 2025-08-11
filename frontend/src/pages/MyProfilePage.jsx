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

                </div>
            </main>

            <Footer />
        </div>
    );
}