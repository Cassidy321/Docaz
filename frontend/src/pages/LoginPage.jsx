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
    const [offlineError, setOfflineError] = useState(false);
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
        setOfflineError(false);
        setServerError(false);

        if (!navigator.onLine) {
            setOfflineError(true);
            return;
        }

        try {
            const result = await login(data.email, data.password);
            if (result) {
                navigate("/");
            }
        } catch (error) {
            if (!navigator.onLine) {
                setOfflineError(true);
            } else if (error.response?.status >= 500) {
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

            <main className="flex-1 flex items-center justify-center py-12">
                <div className="container px-8 md:px-12 lg:px-16 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-md">
                        <Button variant="ghost" size="sm" asChild className="mb-6 hover:text-primary">
                            <Link to="/" className="flex items-center gap-2 text-muted-foreground transition-colors cursor-pointer">
                                <CaretLeft className="h-4 w-4" weight="bold" />
                                Retour à l'accueil
                            </Link>
                        </Button>

                        <div className="relative">
                            {/* Élément décoratif en arrière-plan */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl z-0"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl z-0"></div>

                            <Card className="card relative z-10 border-0 shadow-md">
                                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
                                </div>

                                <CardHeader className="space-y-1 pb-6">
                                    <div className="flex justify-center mb-2">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <SignIn weight="duotone" className="h-8 w-8 text-primary" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                                    <CardDescription className="text-center">
                                        Accédez à votre compte Docaz
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="card-content">
                                    {error && (
                                        <Alert variant="destructive" className="mb-4 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4 text-primary" weight="fill" />
                                            <AlertTitle>Erreur</AlertTitle>
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    {offlineError && (
                                        <Alert variant="destructive" className="mb-4 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4 text-primary" weight="fill" />
                                            <AlertTitle>Pas de connexion</AlertTitle>
                                            <AlertDescription>
                                                Vous semblez être hors ligne. Veuillez vérifier votre connexion internet et réessayer.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {serverError && (
                                        <Alert variant="destructive" className="mb-4 border-primary/40 bg-primary/5">
                                            <WarningCircle className="h-4 w-4 text-primary" weight="fill" />
                                            <AlertTitle>Erreur serveur</AlertTitle>
                                            <AlertDescription>
                                                Nos serveurs rencontrent actuellement des difficultés. Veuillez réessayer dans quelques instants.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="form-group space-y-1">
                                            <div className="flex items-center ml-1"> {/* Ajout de ml-1 */}
                                                <Envelope className="h-4 w-4 text-primary/80 mr-2" weight="duotone" />
                                                <Label htmlFor="email" className="font-medium">
                                                    Adresse email
                                                </Label>
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="exemple@email.com"
                                                aria-invalid={!!errors.email}
                                                className="focus-visible:ring-primary"
                                                {...register("email")}
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-primary">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="form-group space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center ml-1"> {/* Ajout de ml-1 */}
                                                    <Lock className="h-4 w-4 text-primary/80 mr-2" weight="duotone" />
                                                    <Label htmlFor="password" className="font-medium">
                                                        Mot de passe
                                                    </Label>
                                                </div>
                                                <Link to="/forgot-password" className="text-xs text-primary hover:underline cursor-pointer">
                                                    Mot de passe oublié ?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    aria-invalid={!!errors.password}
                                                    className="focus-visible:ring-primary"
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

                                        {/* Case à cocher améliorée */}
                                        <div className="bg-primary/5 p-3 rounded-md border border-primary/20">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    <Checkbox
                                                        id="remember"
                                                        className="h-5 w-5 border-2 border-gray-300 bg-white/90 rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                                                    />
                                                </div>
                                                <Label
                                                    htmlFor="remember"
                                                    className="text-sm font-medium leading-none cursor-pointer"
                                                >
                                                    Se souvenir de moi
                                                </Label>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full border border-primary bg-primary text-white hover:bg-primary/90 hover:border-primary/90 cursor-pointer"
                                            disabled={loading}
                                        >
                                            {loading ? "Connexion en cours..." : "Se connecter"}
                                        </Button>
                                    </form>
                                </CardContent>

                                <CardFooter className="border-t border-gray-100 pt-6">
                                    <p className="text-center text-sm text-muted-foreground w-full">
                                        Vous n'avez pas de compte ?{" "}
                                        <Link to="/inscription" className="text-primary hover:underline font-medium cursor-pointer">
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