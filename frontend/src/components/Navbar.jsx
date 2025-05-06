import { Link } from "react-router-dom";
import { SignIn, UserCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-40 w-full bg-background shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto max-w-5xl">
                <Link to="/" className="flex items-center transition-colors hover:text-primary">
                    <span className="text-2xl font-bold">Docaz</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link to="/connexion">
                        <Button variant="ghost" size="sm" className="gap-2 hover:bg-red-50 hover:text-primary cursor-pointer">
                            <SignIn className="h-5 w-5" weight="regular" />
                            <span className="hidden md:inline">Connexion</span>
                        </Button>
                    </Link>

                    <Link to="/inscription">
                        <Button variant="outline" size="sm" className="gap-2 border-primary/70 text-primary hover:bg-red-50 hover:border-primary cursor-pointer">
                            <UserCircle className="h-5 w-5" weight="regular" />
                            <span className="hidden md:inline">S'inscrire</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}