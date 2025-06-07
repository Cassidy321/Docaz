import { Link } from "react-router-dom";
import {
    Copyright,
    InstagramLogo,
    FacebookLogo,
    TwitterLogo,
    Phone,
    Envelope,
    BookOpen,
    Question,
    FileText,
    LockKey,
    Cookie,
    Buildings
} from "@phosphor-icons/react";

export default function Footer() {
    return (
        <footer className="bg-gray-100 pt-8 pb-6">
            <div className="px-4 mx-auto max-w-7xl">
                {/* < 640px */}
                <div className="grid grid-cols-2 gap-6 sm:hidden mb-6">
                    <div>
                        <Link to="/" className="flex items-center hover:text-primary">
                            <span className="text-xl font-bold">Docaz</span>
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Votre plateforme de confiance pour acheter et vendre entre particuliers.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm mb-3">Liens utiles</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="" className="hover:text-primary transition-colors">À propos de Docaz</Link></li>
                            <li><Link to="" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm mb-3">Informations légales</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="" className="hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
                            <li><Link to="" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
                            <li><Link to="" className="hover:text-primary transition-colors">Gestion des cookies</Link></li>
                            <li><Link to="" className="hover:text-primary transition-colors">Mentions légales</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm mb-3">Nous contacter</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="" className="hover:text-primary transition-colors">Formulaire de contact</Link></li>
                            <li><a className="hover:text-primary transition-colors">01 23 45 67 89</a></li>
                            <li><a href="mailto:contact@docaz.fr" className="hover:text-primary transition-colors">contact@docaz.fr</a></li>
                        </ul>
                        <div className="mt-3 flex items-center gap-3">
                            <a className="text-muted-foreground hover:text-primary transition-colors">
                                <InstagramLogo className="h-5 w-5" />
                            </a>
                            <a className="text-muted-foreground hover:text-primary transition-colors">
                                <FacebookLogo className="h-5 w-5" />
                            </a>
                            <a className="text-muted-foreground hover:text-primary transition-colors">
                                <TwitterLogo className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 640px - 1023px */}
                <div className="hidden sm:block lg:hidden mb-6">
                    <div className="mb-6">
                        <Link to="" className="flex items-center hover:text-primary">
                            <span className="text-xl font-bold">Docaz</span>
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground max-w-md">
                            Votre plateforme de confiance pour acheter et vendre entre particuliers.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                                <BookOpen weight="duotone" className="h-4 w-4 text-primary/70" />
                                Liens utiles
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="" className="hover:text-primary transition-colors">À propos de Docaz</Link></li>
                                <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Question className="h-4 w-4" />FAQ</Link></li>
                                <li><Link to="" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                                <FileText weight="duotone" className="h-4 w-4 text-primary/70" />
                                Informations légales
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><FileText className="h-4 w-4" />Conditions d'utilisation</Link></li>
                                <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><LockKey className="h-4 w-4" />Politique de confidentialité</Link></li>
                                <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Cookie className="h-4 w-4" />Gestion des cookies</Link></li>
                                <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Buildings className="h-4 w-4" />Mentions légales</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                                <Envelope weight="duotone" className="h-4 w-4 text-primary/70" />
                                Nous contacter
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Envelope className="h-4 w-4" />Formulaire de contact</Link></li>
                                <li><a className="hover:text-primary flex items-center gap-2 transition-colors"><Phone className="h-4 w-4" />01 23 45 67 89</a></li>
                                <li><a href="mailto:contact@docaz.fr" className="hover:text-primary flex items-center gap-2 transition-colors"><Envelope className="h-4 w-4" />contact@docaz.fr</a></li>
                            </ul>
                            <div className="mt-4 flex items-center gap-3">
                                <a className="text-muted-foreground hover:text-primary transition-colors">
                                    <InstagramLogo className="h-5 w-5" />
                                </a>
                                <a className="text-muted-foreground hover:text-primary transition-colors">
                                    <FacebookLogo className="h-5 w-5" />
                                </a>
                                <a className="text-muted-foreground hover:text-primary transition-colors">
                                    <TwitterLogo className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* >= 1024px */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-8 mb-6">
                    <div>
                        <Link to="" className="flex items-center hover:text-primary">
                            <span className="text-xl font-bold">Docaz</span>
                        </Link>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Votre plateforme de confiance pour <br/> acheter et vendre entre particuliers.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <BookOpen weight="duotone" className="h-4 w-4 text-primary/70" />
                            Liens utiles
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="" className="hover:text-primary transition-colors">À propos de Docaz</Link></li>
                            <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Question className="h-4 w-4" />FAQ</Link></li>
                            <li><Link to="" className="hover:text-primary transition-colors">Comment ça marche</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <FileText weight="duotone" className="h-4 w-4 text-primary/70"/>
                            Informations légales
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><FileText className="h-4 w-4" />Conditions d'utilisation</Link></li>
                            <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><LockKey className="h-4 w-4" />Politique de confidentialité</Link></li>
                            <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Cookie className="h-4 w-4" />Gestion des cookies</Link></li>
                            <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Buildings className="h-4 w-4" />Mentions légales</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <Envelope weight="duotone" className="h-4 w-4 text-primary/70"/>
                            Nous contacter
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="" className="hover:text-primary flex items-center gap-2 transition-colors"><Envelope className="h-4 w-4" />Formulaire de contact</Link></li>
                            <li><a className="hover:text-primary flex items-center gap-2 transition-colors"><Phone className="h-4 w-4" />01 23 45 67 89</a></li>
                            <li><a href="mailto:contact@docaz.fr" className="hover:text-primary flex items-center gap-2 transition-colors"><Envelope className="h-4 w-4" />contact@docaz.fr</a></li>
                        </ul>
                        <div className="mt-4 flex items-center gap-4">
                            <a className="text-muted-foreground hover:text-primary transition-colors">
                                <InstagramLogo className="h-5 w-5" />
                            </a>
                            <a className="text-muted-foreground hover:text-primary transition-colors">
                                <FacebookLogo className="h-5 w-5" />
                            </a>
                            <a className="text-muted-foreground hover:text-primary transition-colors">
                                <TwitterLogo className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
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