import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeSlash,
    CaretLeft,
    WarningCircle,
    Lock,
    LockKey,
    CheckCircle
} from "@phosphor-icons/react";

import { resetPasswordSchema, passwordErrors } from "@/utils/passwordResetValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(resetPasswordSchema)
    });

    useEffect(() => {
        if (!token) {
            navigate('/connexion');
        }
    }, [token, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: data.password })
            });

            const result = await response.json();

            if (response.ok) {
                setIsSuccess(true);
            } else {
                setError(result.error || passwordErrors.serverError);
            }
        } catch (error) {
            setError(passwordErrors.networkError);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col bg-muted">
                <Navbar />
                <main className="flex-1 flex items-center justify-center py-8">
                    <div className="container px-4 mx-auto w-full max-w-md">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="text-center space-y-4 pb-6">
                                <div className="flex justify-center">
                                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-200 rounded-full">
                                        <CheckCircle weight="duotone" className="h-12 w-12 text-green-600" />
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-bold">Mot de passe réinitialisé !</CardTitle>
                                <CardDescription className="text-base text-muted-foreground">
                                    Votre nouveau mot de passe a été défini avec succès
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="bg-secondary p-4 rounded-lg border border-border text-center">
                                    <h3 className="font-bold text-lg text-secondary-foreground mb-2">Parfait ! 🎉</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                                    </p>
                                </div>

                                <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 h-12 text-base">
                                    <Link to="/connexion">
                                        Se connecter maintenant
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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
                        <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/5 rounded-full blur-xl z-0"></div>
                        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-xl z-0"></div>

                        <Card className="card relative z-10 border-0 shadow-lg">
                            <CardHeader className="space-y-1 pb-5">
                                <div className="flex justify-center mb-3">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <LockKey weight="duotone" className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-bold text-center">Nouveau mot de passe</CardTitle>
                                <CardDescription className="text-center text-base">
                                    Créez un mot de passe sécurisé pour votre compte
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

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="form-group space-y-2">
                                        <div className="flex items-center ml-1">
                                            <Lock className="h-4 w-4 text-primary/80 mr-2" weight="duotone" />
                                            <Label htmlFor="password" className="font-medium text-sm">
                                                Nouveau mot de passe
                                            </Label>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                aria-invalid={!!errors.password}
                                                className="focus-visible:ring-primary text-sm"
                                                {...register("password")}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent hover:text-primary cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlash className="h-4 w-4" weight="regular" />
                                                ) : (
                                                    <Eye className="h-4 w-4" weight="regular" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-xs text-primary">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div className="form-group space-y-2">
                                        <div className="flex items-center ml-1">
                                            <Lock className="h-4 w-4 text-primary/80 mr-2" weight="duotone" />
                                            <Label htmlFor="confirmPassword" className="font-medium text-sm">
                                                Confirmer le mot de passe
                                            </Label>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                aria-invalid={!!errors.confirmPassword}
                                                className="focus-visible:ring-primary text-sm"
                                                {...register("confirmPassword")}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent hover:text-primary cursor-pointer"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeSlash className="h-4 w-4" weight="regular" />
                                                ) : (
                                                    <Eye className="h-4 w-4" weight="regular" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-xs text-primary">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>



                                    <Button
                                        type="submit"
                                        className="w-full border border-primary bg-primary text-white hover:bg-primary/90 hover:border-primary/90 cursor-pointer text-sm h-12"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
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