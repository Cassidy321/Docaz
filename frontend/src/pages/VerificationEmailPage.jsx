import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Envelope, ArrowRight, Timer } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerificationEmailPage() {
    const location = useLocation();
    const email = location.state?.email || "votre adresse email";
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [resendError, setResendError] = useState(false);

    const resendEmail = async () => {
        if (email === "votre adresse email") {
            setResendError(true);
            setResendMessage("Impossible de renvoyer l'email : adresse email non trouvée.");
            return;
        }

        setResendLoading(true);
        setResendError(false);
        setResendMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resend-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setResendError(false);
                setResendMessage(data.message);
            } else {
                setResendError(true);
                setResendMessage(data.error || 'Erreur lors du renvoi de l\'email');
            }
        } catch (error) {
            setResendError(true);
            setResendMessage('Impossible de contacter le serveur. Veuillez réessayer.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
                <div className="container px-4 sm:px-6 mx-auto w-full max-w-md sm:max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="card border-0 shadow-lg sm:shadow-xl">
                        <CardHeader className="text-center space-y-4 sm:space-y-6 pb-6 sm:pb-8">
                            <div className="flex justify-center">
                                <div className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-200 rounded-full">
                                    <CheckCircle weight="duotone" className="h-12 w-12 sm:h-14 sm:w-14 text-green-600" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl sm:text-4xl font-bold">Inscription réussie !</CardTitle>
                            <CardDescription className="text-base sm:text-lg text-muted-foreground">
                                Un email de vérification est en route.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="card-content space-y-8 sm:space-y-10">
                            <div className="bg-secondary p-4 sm:p-5 rounded-lg border border-border">
                                <div className="flex items-start space-x-3 sm:space-x-4">
                                    <Envelope className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5" weight="duotone" />
                                    <div className="space-y-1 sm:space-y-2">
                                        <p className="font-medium text-secondary-foreground text-sm sm:text-base">Email envoyé à :</p>
                                        <p className="text-muted-foreground font-mono text-sm sm:text-base break-all">{email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">Prochaines étapes :</h3>
                                <div className="relative space-y-5 sm:space-y-6 pl-10 sm:pl-12 border-l-2 border-dashed border-primary/30">
                                    <div className="flex items-center space-x-4">
                                        <div className="absolute -left-[13px] sm:-left-[15px] w-6 h-6 sm:w-7 sm:h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-bold ring-4 ring-muted">1</div>
                                        <p className="text-gray-700 text-sm sm:text-base">Vérifiez votre boîte de réception (et les spams).</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="absolute -left-[13px] sm:-left-[15px] w-6 h-6 sm:w-7 sm:h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-bold ring-4 ring-muted">2</div>
                                        <p className="text-gray-700 text-sm sm:text-base">Cliquez sur le lien pour activer votre compte.</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="absolute -left-[13px] sm:-left-[15px] w-6 h-6 sm:w-7 sm:h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-bold ring-4 ring-muted">3</div>
                                        <p className="text-gray-700 text-sm sm:text-base">Connectez-vous pour commencer !</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50/80 p-4 sm:p-5 rounded-lg border border-amber-200 flex items-center space-x-3 sm:space-x-4">
                                <Timer weight="duotone" className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 flex-shrink-0" />
                                <p className="text-amber-800 text-sm sm:text-base">
                                    <span className="font-semibold">Important :</span> Le lien de vérification expire dans 24 heures.
                                </p>
                            </div>

                            {resendMessage && (
                                <Alert variant={resendError ? 'destructive' : 'default'} className={`${resendError ? '' : 'bg-green-50'}`}>
                                    <AlertDescription className="text-sm sm:text-base">{resendMessage}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-border">
                                <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 h-12 sm:h-14 text-base sm:text-lg">
                                    <Link to="/connexion">
                                        J'ai vérifié, me connecter
                                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                    </Link>
                                </Button>
                                <div className="text-center pt-2">
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Vous n'avez rien reçu ?{" "}
                                        <Button
                                            variant="link"
                                            className="text-primary p-0 h-auto text-sm sm:text-base"
                                            onClick={resendEmail}
                                            disabled={resendLoading}
                                        >
                                            {resendLoading ? "Envoi en cours..." : "Renvoyer l'email"}
                                        </Button>
                                    </p>
                                </div>
                                <Button asChild variant="ghost" className="w-full h-12 sm:h-14 text-base sm:text-lg">
                                    <Link to="/">Retour à l'accueil</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}