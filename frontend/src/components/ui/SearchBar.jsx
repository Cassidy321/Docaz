import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MagnifyingGlass } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchBar({ className = "", placeholder = "" }) {
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className={`relative ${className}`}>
            <Input
                type="text"
                placeholder={placeholder}
                className="pl-4 pr-12 h-10 w-full rounded-full bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
                <MagnifyingGlass className="h-4 w-4 text-white" weight="bold" />
            </Button>
        </form>
    )
}