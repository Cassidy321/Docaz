import { CircleNotch, CircleDashed } from "@phosphor-icons/react";

export default function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                    <CircleDashed
                        weight="light"
                        className="h-16 w-16 text-gray-200 animate-pulse"
                    />
                    <CircleNotch
                        weight="bold"
                        className="h-16 w-16 text-primary animate-spin absolute top-0 left-0"
                    />
                </div>
                <p className="text-muted-foreground text-sm animate-pulse">
                    Chargement en cours...
                </p>
            </div>
        </div>
    );
}