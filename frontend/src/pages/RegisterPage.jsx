import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeSlash,
    CaretLeft,
    CheckCircle,
    WarningCircle,
    User,
    Envelope,
    Lock,
    UserCircle,
} from "@phosphor-icons/react";

import userStore from "@/stores/userStore";
import { registerSchema } from "@/utils/formValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [serverError, setServerError] = useState(false);

    const navigate = useNavigate();
    const { register: registerUser, loading, error, clearErrors } = userStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    const registerNewUser = async (data) => {
        clearErrors();
        setServerError(false);

        try {
            const result = await registerUser(data);
            if (result) {
                navigate(`/verification-email/${encodeURIComponent(data.email)}`);
            }
        } catch (error) {
            if (error.response?.status >= 500) {
                setServerError(true);
                const errorDetails = {
                    component: 'RegisterPage',
                    action: 'RegisterNewUser',
                    status: error.response?.status,
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    userData: { email: data.email },
                };

                if (process.env.NODE_ENV !== 'production') {
                    console.error("Erreur d'inscription détaillée:", errorDetails);
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12">
                <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto w-full max-w-md lg:max-w-7xl">
                    <div className="mx-auto max-w-md">
                        <Button variant="ghost" size="sm" asChild className="mb-4 sm:mb-6 hover:text-primary">
                            <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors cursor-pointer">
                                <CaretLeft className="h-4 w-4" weight="bold" />
                                Retour à l'accueil
                            </Link>
                        </Button>

                        <div className="relative">
                            <div className="absolute -top-4 sm:-top-6 md:-top-6 lg:-top-6 -left-4 sm:-left-6 md:-left-6 lg:-left-6 w-16 sm:w-20 md:w-24 lg:w-24 h-16 sm:h-20 md:h-24 lg:h-24 bg-primary/5 rounded-full blur-xl z-0"></div>
                            <div className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 lg:-bottom-10 -right-6 sm:-right-8 md:-right-10 lg:-right-10 w-20 sm:w-24 md:w-32 lg:w-32 h-20 sm:h-24 md:h-32 lg:h-32 bg-primary/5 rounded-full blur-xl z-0"></div>

                            <Card className="card relative z-10 border-0 shadow-md lg:shadow-lg">
                                <div className="absolute top-0 left-0 w-12 sm:w-14 md:w-16 lg:w-16 h-12 sm:h-14 md:h-16 lg:h-16 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-12 sm:w-14 md:w-16 lg:w-16 h-12 sm:h-14 md:h-16 lg:h-16 bg-primary/10 transform -rotate-45 -translate-x-6 sm:-translate-x-7 md:-translate-x-8 lg:-translate-x-8 -translate-y-6 sm:-translate-y-7 md:-translate-y-8 lg:-translate-y-8"></div>
                                </div>

                                <CardHeader className="space-y-1 pb-4 sm:pb-5 md:pb-6">
                                    <div className="flex justify-center mb-2 lg:mb-3">
                                        <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                                            <UserCircle weight="duotone" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl sm:text-2xl font-bold text-center">Créer un compte</CardTitle>
                                    <CardDescription className="text-center text-sm sm:text-base">
                                        Rejoignez Docaz pour acheter et vendre entre particuliers
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="card-content lg:px-8">
                                    {error && (
                                        <Alert variant="destructive" className="mb-3 sm:mb-4 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4" weight="fill" />
                                            <AlertTitle>Erreur</AlertTitle>
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {serverError && (
                                        <Alert variant="destructive" className="mb-3 sm:mb-4 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4" weight="fill" />
                                            <AlertTitle>Erreur serveur</AlertTitle>
                                            <AlertDescription>
                                                Nos serveurs rencontrent actuellement des difficultés. Veuillez réessayer dans quelques instants.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit(registerNewUser)} className="space-y-3 sm:space-y-4 lg:space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                                            <div className="form-group space-y-1 lg:space-y-2">
                                                <div className="flex items-center ml-1">
                                                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/80 mr-2" weight="duotone" />
                                                    <Label htmlFor="firstName" className="font-medium text-sm lg:text-base">
                                                        Prénom
                                                    </Label>
                                                </div>
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    aria-invalid={!!errors.firstName}
                                                    className="focus-visible:ring-primary text-sm lg:text-base lg:py-3"
                                                    {...register("firstName")}
                                                />
                                                {errors.firstName && (
                                                    <p className="mt-1 text-xs lg:text-sm text-primary">{errors.firstName.message}</p>
                                                )}
                                            </div>

                                            <div className="form-group space-y-1 lg:space-y-2">
                                                <div className="flex items-center ml-1">
                                                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/80 mr-2" weight="duotone" />
                                                    <Label htmlFor="lastName" className="font-medium text-sm lg:text-base">
                                                        Nom
                                                    </Label>
                                                </div>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    aria-invalid={!!errors.lastName}
                                                    className="focus-visible:ring-primary text-sm lg:text-base lg:py-3"
                                                    {...register("lastName")}
                                                />
                                                {errors.lastName && (
                                                    <p className="mt-1 text-xs lg:text-sm text-primary">{errors.lastName.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group space-y-1 lg:space-y-2">
                                            <div className="flex items-center ml-1">
                                                <Envelope className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/80 mr-2" weight="duotone" />
                                                <Label htmlFor="email" className="font-medium text-sm lg:text-base">
                                                    Adresse email
                                                </Label>
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="exemple@email.com"
                                                aria-invalid={!!errors.email}
                                                className="focus-visible:ring-primary text-sm lg:text-base lg:py-3"
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs lg:text-sm text-primary">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="form-group space-y-1 lg:space-y-2">
                                            <div className="flex items-center ml-1">
                                                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/80 mr-2" weight="duotone" />
                                                <Label htmlFor="password" className="font-medium text-sm lg:text-base">
                                                    Mot de passe
                                                </Label>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    aria-invalid={!!errors.password}
                                                    className="focus-visible:ring-primary text-sm lg:text-base lg:py-3"
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
                                                        <EyeSlash className="h-3.5 w-3.5 sm:h-4 sm:w-4" weight="regular" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" weight="regular" />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.password && (
                                                <p className="mt-1 text-xs lg:text-sm text-primary">{errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="form-group space-y-1 lg:space-y-2">
                                            <div className="flex items-center ml-1">
                                                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/80 mr-2" weight="duotone" />
                                                <Label htmlFor="confirmPassword" className="font-medium text-sm lg:text-base">
                                                    Confirmer le mot de passe
                                                </Label>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    aria-invalid={!!errors.confirmPassword}
                                                    className="focus-visible:ring-primary text-sm lg:text-base lg:py-3"
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
                                                        <EyeSlash className="h-3.5 w-3.5 sm:h-4 sm:w-4" weight="regular" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" weight="regular" />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="mt-1 text-xs lg:text-sm text-primary">{errors.confirmPassword.message}</p>
                                            )}
                                        </div>

                                        <div className="bg-primary/5 p-3 lg:p-4 rounded-md border border-primary/20">
                                            <div className="flex items-start space-x-3">
                                                <div className="relative mt-1">
                                                    <Checkbox
                                                        id="acceptTerms"
                                                        aria-invalid={!!errors.acceptTerms}
                                                        className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-300 bg-white/90 rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                                                        {...register("acceptTerms", {
                                                            setValueAs: (value) => value === "on" || value === true
                                                        })}
                                                    />
                                                </div>
                                                <div className="grid gap-1.5 leading-none">
                                                    <Label
                                                        htmlFor="acceptTerms"
                                                        className="text-sm lg:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        J'accepte les conditions d'utilisation
                                                    </Label>
                                                    <p className="text-xs lg:text-sm text-muted-foreground">
                                                        En créant un compte, vous acceptez nos{" "}
                                                        <Link to="/terms" className="text-primary hover:underline cursor-pointer">
                                                            Conditions d'utilisation
                                                        </Link>
                                                        {" "}et notre{" "}
                                                        <Link to="/privacy" className="text-primary hover:underline cursor-pointer">
                                                            Politique de confidentialité
                                                        </Link>
                                                    </p>
                                                    {errors.acceptTerms && (
                                                        <p className="text-xs lg:text-sm text-primary">{errors.acceptTerms.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full border border-primary bg-primary text-white hover:bg-primary/90 hover:border-primary/90 cursor-pointer text-sm lg:text-base lg:py-3"
                                            disabled={loading}
                                        >
                                            {loading ? "Inscription en cours..." : "S'inscrire"}
                                        </Button>
                                    </form>
                                </CardContent>

                                <CardFooter className="border-t border-gray-100 pt-4 sm:pt-6 lg:px-8">
                                    <p className="text-center text-sm lg:text-base text-muted-foreground w-full">
                                        <span className="block xs:inline">Vous avez déjà un compte ?</span>{" "}
                                        <Link to="/connexion" className="text-primary hover:underline font-medium cursor-pointer whitespace-nowrap">
                                            Se connecter
                                        </Link>
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}