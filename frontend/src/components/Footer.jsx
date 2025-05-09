import { Link } from "react-router-dom";
import {
    Copyright,
    HeartStraight,
    InstagramLogo,
    FacebookLogo,
    TwitterLogo,
    Phone,
    Envelope,
    BookOpen,
    Question,
    NewspaperClipping,
    Handshake,
    FileText,
    LockKey,
    Cookie,
    Buildings
} from "@phosphor-icons/react";

export default function Footer() {
    return (
        <footer className="bg-background pt-10 pb-6">
            <div className="container mx-auto max-w-7xl px-8 md:px-12 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center hover:text-primary">
                            <span className="text-xl font-bold">Docaz</span>
                        </Link>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Votre plateforme de confiance pour acheter et vendre entre particuliers.
                        </p>
                    </div>

                    <div className="md:col-span-1">
                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <BookOpen weight="duotone" className="h-4 w-4 text-primary/70" />
                            Liens utiles
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/about" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    À propos de Docaz
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <Question className="h-4 w-4" />
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <NewspaperClipping className="h-4 w-4" />
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    Comment ça marche
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <FileText weight="duotone" className="h-4 w-4 text-primary/70" />
                            Informations légales
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/terms" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <FileText className="h-4 w-4" />
                                    Conditions d'utilisation
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <LockKey className="h-4 w-4" />
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <Cookie className="h-4 w-4" />
                                    Gestion des cookies
                                </Link>
                            </li>
                            <li>
                                <Link to="/legal" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <Buildings className="h-4 w-4" />
                                    Mentions légales
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Envelope weight="duotone" className="h-4 w-4 text-primary/70" />
                            Nous contacter
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/contact" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <Envelope className="h-4 w-4" />
                                    Formulaire de contact
                                </Link>
                            </li>
                            <li>
                                <a href="tel:+33123456789" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <Phone className="h-4 w-4" />
                                    01 23 45 67 89
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@docaz.fr" className="hover:text-primary flex items-center gap-2 transition-colors">
                                    <Envelope className="h-4 w-4" />
                                    contact@docaz.fr
                                </a>
                            </li>
                        </ul>
                        <div className="mt-4 flex items-center gap-4">
                            <a href="https://instagram.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                <InstagramLogo weight="fill" className="h-5 w-5" />
                            </a>
                            <a href="https://facebook.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                <FacebookLogo weight="fill" className="h-5 w-5" />
                            </a>
                            <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                                <TwitterLogo weight="fill" className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Copyright className="h-4 w-4" />
                        <span>2025 Docaz. Tous droits réservés.</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>France</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}