import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ArrowRight, PaperPlaneTilt, LinkSimple, Timer } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EmailVerifiedPage() {
    const { token } = useParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const hasVerified = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (hasVerified.current || !token) {
                if (!token) {
                    setStatus('error');
                    setMessage('Token de vérification manquant ou invalide.');
                }
                return;
            }
            hasVerified.current = true;

            await new Promise(resolve => setTimeout(resolve, 1500));

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-email/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Ce lien est invalide ou a expiré.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Impossible de contacter le serveur. Veuillez réessayer.');
            }
        };
        verifyEmail();
    }, [token]);

    const renderStatusContent = () => {
        const baseIconContainerClass = "p-4 rounded-full inline-block bg-gradient-to-br";
        const animationClass = "animate-in fade-in zoom-in-75 duration-500";

        switch (status) {
            case 'success':
                return (
                    <div className={animationClass}>
                        <div className={`${baseIconContainerClass} from-green-50 to-green-200`}>
                            <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-green-600" weight="duotone" />
                        </div>
                        <CardTitle className="text-3xl sm:text-4xl font-bold mt-4">Email vérifié !</CardTitle>
                        <CardDescription className="text-base sm:text-lg text-muted-foreground">Votre compte est maintenant actif.</CardDescription>
                    </div>
                );
            case 'error':
                return (
                    <div className={animationClass}>
                        <div className={`${baseIconContainerClass} from-red-50 to-red-200`}>
                            <XCircle className="h-12 w-12 sm:h-14 sm:w-14 text-red-600" weight="duotone" />
                        </div>
                        <CardTitle className="text-3xl sm:text-4xl font-bold mt-4">Erreur de vérification</CardTitle>
                        <CardDescription className="text-base sm:text-lg text-muted-foreground">Ce lien ne semble pas valide.</CardDescription>
                    </div>
                );
            default:
                return (
                    <div>
                        <div className={`${baseIconContainerClass} from-gray-100 to-gray-200`}>
                            <Clock className="h-12 w-12 sm:h-14 sm:w-14 text-primary animate-spin [animation-duration:2s]" weight="duotone" />
                        </div>
                        <CardTitle className="text-3xl sm:text-4xl font-bold mt-4">Vérification...</CardTitle>
                        <CardDescription className="text-base sm:text-lg text-muted-foreground">Nous validons votre demande.</CardDescription>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-8 sm:py-12">
                <div className="container px-4 sm:px-6 mx-auto w-full max-w-md sm:max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="card border-0 shadow-lg sm:shadow-xl overflow-hidden">
                        <CardHeader className="text-center space-y-2 sm:space-y-4 py-8 sm:py-12">
                            {renderStatusContent()}
                        </CardHeader>

                        <CardContent className="card-content space-y-6 sm:space-y-8">
                            {message && (
                                <Alert variant={status === 'error' ? 'destructive' : 'default'} className={`bg-opacity-60 ${status === 'success' ? 'bg-green-50' : ''}`}>
                                    <AlertDescription className="text-center text-sm sm:text-base">{message}</AlertDescription>
                                </Alert>
                            )}

                            {status === 'success' && (
                                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-700">
                                    <div className="bg-secondary p-4 sm:p-5 rounded-lg border border-border text-center">
                                        <h3 className="font-bold text-lg sm:text-xl text-secondary-foreground mb-2">Félicitations !</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">
                                            Bienvenue sur Docaz ! Vous pouvez désormais vous connecter et explorer notre plateforme.
                                        </p>
                                    </div>
                                    <Button asChild className="w-full bg-primary text-primary-foreground h-12 sm:h-14 text-base sm:text-lg">
                                        <Link to="/connexion">
                                            Accéder à mon compte
                                            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-700">
                                    <div className="bg-amber-50/80 p-4 sm:p-5 rounded-lg border border-amber-200">
                                        <h3 className="font-semibold text-amber-900 mb-3 text-base sm:text-lg">Que faire maintenant ?</h3>
                                        <ul className="text-amber-800 text-sm sm:text-base space-y-3 sm:space-y-4">
                                            <li className="flex items-start space-x-2.5 sm:space-x-3">
                                                <Timer weight="bold" className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 text-amber-600" />
                                                <span>Vérifiez que le lien n'a pas expiré (valide 24h).</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5 sm:space-x-3">
                                                <LinkSimple weight="bold" className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 text-amber-600" />
                                                <span>Assurez-vous d'utiliser le lien de vérification le plus récent.</span>
                                            </li>
                                            <li className="flex items-start space-x-2.5 sm:space-x-3">
                                                <PaperPlaneTilt weight="bold" className="h-5 w-5 sm:h-6 sm:w-6 mt-0.5 text-amber-600" />
                                                <span>Demandez un nouveau lien depuis la page de connexion.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4 pt-2">
                                        <Button asChild className="w-full bg-primary text-primary-foreground h-12 sm:h-14 text-base sm:text-lg">
                                            <Link to="/connexion">Demander un nouveau lien</Link>
                                        </Button>
                                        <Button asChild variant="outline" className="w-full h-12 sm:h-14 text-base sm:text-lg">
                                            <Link to="/">Retour à l'accueil</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}