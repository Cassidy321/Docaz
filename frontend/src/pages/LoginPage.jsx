import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Eye,
    EyeSlash,
    CaretLeft,
    WarningCircle,
    Envelope,
    Lock,
    SignIn
} from "@phosphor-icons/react";
import userStore from "@/stores/userStore";
import { loginSchema } from "@/utils/formValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(false);

    const navigate = useNavigate();
    const { login, loading, error, clearErrors } = userStore();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        clearErrors();
        setServerError(false);

        try {
            const result = await login(data.email, data.password);
            if (result) {
                navigate("/");
            }
        } catch (error) {
            if (error.response?.status >= 500) {
                setServerError(true);
                const errorDetails = {
                    component: 'LoginPage',
                    action: 'onSubmit',
                    status: error.response?.status,
                    message: error.message,
                    timestamp: new Date().toISOString(),
                    userData: { email: data.email },
                };

                if (process.env.NODE_ENV !== 'production') {
                    console.error("Erreur de connexion détaillée:", errorDetails);
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 xl:py-16">
                <div className="container px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto w-full max-w-md lg:max-w-7xl">
                    <div className="mx-auto max-w-md xl:max-w-lg">
                        <Button variant="ghost" size="sm" asChild className="mb-4 sm:mb-6 xl:mb-8 hover:text-primary">
                            <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors cursor-pointer">
                                <CaretLeft className="h-4 w-4 xl:h-5 xl:w-5" weight="bold" />
                                <span className="text-sm xl:text-base">Retour à l'accueil</span>
                            </Link>
                        </Button>

                        <div className="relative">
                            <div className="absolute -top-4 sm:-top-6 md:-top-6 lg:-top-6 xl:-top-8 -right-4 sm:-right-6 md:-right-6 lg:-right-6 xl:-right-8 w-16 sm:w-20 md:w-24 lg:w-24 xl:w-28 h-16 sm:h-20 md:h-24 lg:h-24 xl:h-28 bg-primary/5 rounded-full blur-xl z-0"></div>
                            <div className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 lg:-bottom-10 xl:-bottom-12 -left-6 sm:-left-8 md:-left-10 lg:-left-10 xl:-left-12 w-20 sm:w-24 md:w-32 lg:w-32 xl:w-36 h-20 sm:h-24 md:h-32 lg:h-32 xl:h-36 bg-primary/5 rounded-full blur-xl z-0"></div>

                            <Card className="card relative z-10 border-0 shadow-md lg:shadow-lg xl:shadow-xl">
                                <div className="absolute top-0 right-0 w-12 sm:w-14 md:w-16 lg:w-16 xl:w-18 h-12 sm:h-14 md:h-16 lg:h-16 xl:h-18 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-12 sm:w-14 md:w-16 lg:w-16 xl:w-18 h-12 sm:h-14 md:h-16 lg:h-16 xl:h-18 bg-primary/10 transform rotate-45 translate-x-6 sm:translate-x-7 md:translate-x-8 lg:translate-x-8 xl:translate-x-9 -translate-y-6 sm:-translate-y-7 md:-translate-y-8 lg:-translate-y-8 xl:-translate-y-9"></div>
                                </div>

                                <CardHeader className="space-y-1 pb-4 sm:pb-5 md:pb-6 xl:pb-8">
                                    <div className="flex justify-center mb-2 lg:mb-3 xl:mb-4">
                                        <div className="p-2 md:p-3 xl:p-4 bg-primary/10 rounded-full">
                                            <SignIn weight="duotone" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 xl:h-9 xl:w-9 text-primary" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl sm:text-2xl xl:text-3xl font-bold text-center">Connexion</CardTitle>
                                    <CardDescription className="text-center text-sm sm:text-base xl:text-lg xl:mt-2">
                                        Accédez à votre compte Docaz
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="card-content lg:px-8 xl:px-10">
                                    {error && (
                                        <Alert variant="destructive" className="mb-3 sm:mb-4 xl:mb-6 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4 xl:h-5 xl:w-5" weight="fill" />
                                            <AlertTitle className="xl:text-lg">Erreur</AlertTitle>
                                            <AlertDescription className="xl:text-base">{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {serverError && (
                                        <Alert variant="destructive" className="mb-3 sm:mb-4 xl:mb-6 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4 xl:h-5 xl:w-5" weight="fill" />
                                            <AlertTitle className="xl:text-lg">Erreur serveur</AlertTitle>
                                            <AlertDescription className="xl:text-base">
                                                Nos serveurs rencontrent actuellement des difficultés. Veuillez réessayer dans quelques instants.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-6">
                                        <div className="form-group space-y-1 lg:space-y-2 xl:space-y-3">
                                            <div className="flex items-center ml-1">
                                                <Envelope className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary/80 mr-2" weight="duotone" />
                                                <Label htmlFor="email" className="font-medium text-sm lg:text-base xl:text-lg">
                                                    Adresse email
                                                </Label>
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="exemple@email.com"
                                                aria-invalid={!!errors.email}
                                                className="focus-visible:ring-primary text-sm lg:text-base xl:text-lg lg:py-3 xl:py-4"
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs lg:text-sm xl:text-base text-primary">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="form-group space-y-1 lg:space-y-2 xl:space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center ml-1">
                                                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary/80 mr-2" weight="duotone" />
                                                    <Label htmlFor="password" className="font-medium text-sm lg:text-base xl:text-lg">
                                                        Mot de passe
                                                    </Label>
                                                </div>
                                                <Link to="/forgot-password" className="text-xs lg:text-sm xl:text-base text-primary hover:underline cursor-pointer">
                                                    Mot de passe oublié ?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    aria-invalid={!!errors.password}
                                                    className="focus-visible:ring-primary text-sm lg:text-base xl:text-lg lg:py-3 xl:py-4"
                                                    {...register("password")}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 xl:px-4 py-1 hover:bg-transparent hover:text-primary cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeSlash className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5" weight="regular" />
                                                    ) : (
                                                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5" weight="regular" />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.password && (
                                                <p className="mt-1 text-xs lg:text-sm xl:text-base text-primary">{errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="bg-primary/5 p-3 lg:p-4 xl:p-6 rounded-md border border-primary/20">
                                            <div className="flex items-center space-x-3 xl:space-x-4">
                                                <div className="relative">
                                                    <Checkbox
                                                        id="remember"
                                                        className="h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6 border-2 border-gray-300 bg-white/90 rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                                                    />
                                                </div>
                                                <Label
                                                    htmlFor="remember"
                                                    className="text-sm lg:text-base xl:text-lg font-medium leading-none cursor-pointer"
                                                >
                                                    Se souvenir de moi
                                                </Label>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full border border-primary bg-primary text-white hover:bg-primary/90 hover:border-primary/90 cursor-pointer text-sm lg:text-base xl:text-lg lg:py-3 xl:py-4"
                                            disabled={loading}
                                        >
                                            {loading ? "Connexion en cours..." : "Se connecter"}
                                        </Button>
                                    </form>
                                </CardContent>

                                <CardFooter className="border-t border-gray-100 pt-4 sm:pt-6 xl:pt-8 lg:px-8 xl:px-10">
                                    <p className="text-center text-sm lg:text-base xl:text-lg text-muted-foreground w-full">
                                        <span className="block xs:inline">Vous n'avez pas de compte ?</span>{" "}
                                        <Link to="/inscription" className="text-primary hover:underline font-medium cursor-pointer whitespace-nowrap">
                                            S'inscrire
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