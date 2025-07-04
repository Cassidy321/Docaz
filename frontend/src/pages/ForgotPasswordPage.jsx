import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
    CaretLeft,
    WarningCircle,
    Envelope,
    LockKey
} from "@phosphor-icons/react";

import { forgotPasswordSchema, passwordErrors } from "@/utils/passwordResetValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const handleForgotPassword = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/forgot-password`, data);

            if (response.status === 200) {
                console.log('succès');
            }
        } catch (error) {
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError(passwordErrors.networkError);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-8">
                <div className="container px-4 mx-auto w-full max-w-md">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/connexion")}
                        className="mb-6 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
                    >
                        <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Retour à la connexion
                    </Button>

                    <div className="relative">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-xl z-0"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/5 rounded-full blur-xl z-0"></div>

                        <Card className="card relative z-10 border-0 shadow-lg">
                            <CardHeader className="space-y-1 pb-5">
                                <div className="flex justify-center mb-3">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <LockKey weight="duotone" className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
                                <CardDescription className="text-center text-base">
                                    Entrez votre email pour recevoir un lien de réinitialisation
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="card-content">
                                {error && (
                                    <Alert variant="destructive" className="mb-4 border-primary/40 bg-primary/5">
                                        <WarningCircle className="h-4 w-4" weight="fill" />
                                        <AlertTitle>Erreur</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
                                    <div className="form-group space-y-2">
                                        <div className="flex items-center ml-1">
                                            <Envelope className="h-4 w-4 text-primary/80 mr-2" weight="duotone" />
                                            <Label htmlFor="email" className="font-medium text-sm">
                                                Adresse email
                                            </Label>
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="exemple@email.com"
                                            aria-invalid={!!errors.email}
                                            className="focus-visible:ring-primary text-sm"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-primary">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full border border-primary bg-primary text-white hover:bg-primary/90 hover:border-primary/90 cursor-pointer text-sm h-12"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                                    </Button>
                                </form>
                            </CardContent>

                            <CardFooter className="border-t border-gray-100 pt-6">
                                <p className="text-center text-sm text-muted-foreground w-full">
                                    <span className="block">Vous vous souvenez de votre mot de passe ?</span>{" "}
                                    <Link to="/connexion" className="text-primary hover:underline font-medium cursor-pointer whitespace-nowrap">
                                        Se connecter
                                    </Link>
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}