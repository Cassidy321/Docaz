import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import postStore from "@/stores/postStore"
import userStore from "@/stores/userStore"
import Location from "@/services/location"
import {
  Upload,
  XCircle,
  MapPin,
  CaretLeft,
  CheckCircle,
  Warning,
  ImageSquare,
  Tag,
  TextT,
  CurrencyCircleDollar,
  Info,
  Camera,
  PencilSimple,
  ArrowUp,
  ArrowDown,
  LightbulbFilament,
} from "@phosphor-icons/react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { postSchema } from "@/utils/postValidation"

export default function NewPostPage() {
  const navigate = useNavigate()
  const { createPost, loading, error, clearErrors } = postStore()
  const { isAuthenticated } = userStore()
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/connexion", {
        state: {
          from: "/annonce/creation",
          message: "Veuillez vous connecter pour publier une annonce",
        },
      })
    }
    clearErrors()
  }, [isAuthenticated, navigate, clearErrors])

  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
    },
    mode: "onSubmit",
  })

  const addImages = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (images.length + selectedFiles.length > 10) {
      setSubmitError("Vous ne pouvez pas ajouter plus de 10 images au total")
      return
    }

    const validFiles = selectedFiles.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024
      return isValidType && isValidSize
    })

    if (validFiles.length !== selectedFiles.length) {
      setSubmitError("Certains fichiers ont été ignorés (type non valide ou taille > 5 MB)")
    } else {
      setSubmitError(null)
    }

    setImages((prev) => [...prev, ...validFiles])
    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviewImages((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImage = (index, direction) => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === previewImages.length - 1)) return
    const newIndex = direction === "up" ? index - 1 : index + 1

    const newPreviewImages = [...previewImages]
      ;[newPreviewImages[index], newPreviewImages[newIndex]] = [newPreviewImages[newIndex], newPreviewImages[index]]
    setPreviewImages(newPreviewImages)

    const newImages = [...images]
      ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  const searchCities = useCallback(async (query) => {
    if (query.length < 2) {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
      return
    }

    setLoadingLocation(true)
    try {
      const suggestions = await Location.searchCities(query)
      setLocationSuggestions(suggestions)
      setShowLocationSuggestions(suggestions.length > 0)
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error)
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
    } finally {
      setLoadingLocation(false)
    }
  }, [])

  const debounce = useCallback((func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(null, args), delay)
    }
  }, [])

  const debouncedSearchCities = useCallback(debounce(searchCities, 300), [searchCities, debounce])

  const handleLocationChange = (value) => {
    form.setValue('location', value)
    debouncedSearchCities(value)
  }

  const selectLocation = (suggestion) => {
    form.setValue('location', suggestion.name)
    setLocationSuggestions([])
    setShowLocationSuggestions(false)
  }

  const createNewPost = async (data) => {
    if (images.length === 0) {
      setSubmitError("Veuillez ajouter au moins une image")
      const photoSection = document.getElementById("photo-section")
      if (photoSection) photoSection.scrollIntoView({ behavior: "smooth" })
      return
    }

    setSubmitError(null)
    try {
      const post = await createPost(data, images)
      setSubmitSuccess(true)
      setTimeout(() => navigate(`/annonce/${post.id}`), 2000)
    } catch (error) {
      setSubmitError("Une erreur est survenue lors de la création de l'annonce")
      window.scrollTo(0, 0)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <Navbar />
        <main className="flex-1 py-10 xl:py-12">
          <div className="container max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-8 xl:px-10">
            <div className="max-w-lg xl:max-w-xl mx-auto text-center">
              <div className="w-20 h-20 xl:w-22 xl:h-22 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 xl:h-11 xl:w-11 text-green-600" weight="fill" />
              </div>
              <h1 className="text-2xl sm:text-3xl xl:text-3xl font-bold mb-4">Annonce publiée avec succès !</h1>
              <Alert className="bg-green-50 border-green-200 mb-8">
                <AlertDescription className="text-green-700">
                  Votre annonce a été créée et sera visible par les autres utilisateurs. Vous allez être redirigé vers
                  votre annonce...
                </AlertDescription>
              </Alert>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/")} className="flex items-center xl:px-6">
                  Retour à l'accueil
                </Button>
                <Button onClick={() => navigate("/mes-annonces")} className="bg-primary hover:bg-primary/90 text-white xl:px-6">
                  Voir mes annonces
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-muted/30">
      <Navbar />
      <main className="flex-1 py-6 sm:py-8 md:py-10 xl:py-12">
        <div className="container max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-18">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-3 md:mb-4 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary group"
            >
              <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-3xl font-bold">Créer une nouvelle annonce</h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base xl:mt-3">
                  Complétez les informations ci-dessous pour mettre votre article en vente
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <span>* champs obligatoires</span>
                </div>
              </div>
            </div>
          </div>
          {(error || submitError) && (
            <Alert variant="destructive" className="mb-6">
              <Warning className="h-5 w-5" weight="fill" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error || submitError}</AlertDescription>
            </Alert>
          )}
          <div className="block lg:hidden mb-4 xl:mb-6">
            <Button
              variant="outline"
              className="w-full py-2 xl:py-3 flex justify-between items-center border-primary/20 bg-primary/5 text-primary/90"
              onClick={() => setShowTips(!showTips)}
              size="sm"
            >
              <div className="flex items-center">
                <LightbulbFilament className="h-4 w-4 xl:h-5 xl:w-5 text-primary mr-2" weight="fill" />
                <span className="text-sm xl:text-base">Conseils pour votre annonce</span>
              </div>
              <span className="xl:text-lg">{showTips ? '−' : '+'}</span>
            </Button>

            {showTips && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 md:p-4 xl:p-6 mt-2 xl:mt-3">
                <ul className="text-xs md:text-sm xl:text-base text-primary/80 space-y-1.5 md:space-y-2 xl:space-y-3">
                  <li className="flex items-start gap-1.5 md:gap-2 xl:gap-3">
                    <span className="font-bold text-xs md:text-sm xl:text-base bg-primary/20 text-primary/90 rounded-full size-4 md:size-5 xl:size-6 flex items-center justify-center flex-shrink-0">1</span>
                    <span>Titre clair avec marque et caractéristiques</span>
                  </li>
                  <li className="flex items-start gap-1.5 md:gap-2 xl:gap-3">
                    <span className="font-bold text-xs md:text-sm xl:text-base bg-primary/20 text-primary/90 rounded-full size-4 md:size-5 xl:size-6 flex items-center justify-center flex-shrink-0">2</span>
                    <span>Détaillez l'état et les spécificités</span>
                  </li>
                  <li className="flex items-start gap-1.5 md:gap-2 xl:gap-3">
                    <span className="font-bold text-xs md:text-sm xl:text-base bg-primary/20 text-primary/90 rounded-full size-4 md:size-5 xl:size-6 flex items-center justify-center flex-shrink-0">3</span>
                    <span>Photos sous différents angles, bon éclairage</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="hidden lg:block mb-6 xl:mb-8 bg-primary/5 border border-primary/20 rounded-lg p-4 xl:p-6 relative">
            <div className="flex items-start gap-3 xl:gap-4">
              <div className="bg-primary/10 rounded-full p-2 xl:p-3">
                <LightbulbFilament className="h-5 w-5 xl:h-6 xl:w-6 text-primary" weight="fill" />
              </div>
              <div>
                <h3 className="font-medium text-primary/90 mb-2 xl:mb-3 xl:text-lg">Conseils pour une annonce efficace</h3>
                <ul className="text-sm xl:text-base text-primary/80 space-y-1.5 xl:space-y-2 ml-1">
                  <li className="flex items-start gap-2 xl:gap-3">
                    <span className="font-bold text-xs xl:text-sm bg-primary/20 text-primary/90 rounded-full size-4 xl:size-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Choisissez un titre clair et précis incluant la marque et les caractéristiques principales</span>
                  </li>
                  <li className="flex items-start gap-2 xl:gap-3">
                    <span className="font-bold text-xs xl:text-sm bg-primary/20 text-primary/90 rounded-full size-4 xl:size-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Détaillez l'état, l'âge et les spécificités de votre article dans la description</span>
                  </li>
                  <li className="flex items-start gap-2 xl:gap-3">
                    <span className="font-bold text-xs xl:text-sm bg-primary/20 text-primary/90 rounded-full size-4 xl:size-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Ajoutez plusieurs photos sous différents angles avec un bon éclairage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createNewPost)}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="bg-primary/5 px-4 sm:px-6 xl:px-8 py-3 sm:py-4 xl:py-5 border-b border-primary/10">
                    <h2 className="font-semibold text-primary flex items-center gap-2 text-sm sm:text-base xl:text-lg">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6" weight="fill" />
                      Informations sur votre article
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6 xl:p-8 space-y-4 sm:space-y-6 xl:space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 text-sm sm:text-base xl:text-lg">
                            <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary" />
                            Titre de l'annonce *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: iPhone 13 Pro Max 256 Go"
                              {...field}
                              className="text-sm sm:text-base xl:text-lg xl:py-3 xl:px-4 focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm xl:text-base" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 text-sm sm:text-base xl:text-lg">
                            <TextT className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary" />
                            Description *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre article en détail (état, caractéristiques, etc.)"
                              className="min-h-24 sm:min-h-32 md:min-h-40 xl:min-h-48 text-sm sm:text-base xl:text-lg xl:p-4 focus-visible:ring-primary focus:border-primary/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm xl:text-base" />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 xl:gap-8 items-start">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 text-sm sm:text-base xl:text-lg">
                              <CurrencyCircleDollar className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary" />
                              Prix *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="pl-6 sm:pl-7 text-sm sm:text-base focus-visible:ring-primary"
                                  min="0"
                                  onKeyDown={(e) => {
                                    if (e.key === "-") e.preventDefault()
                                  }}
                                  {...field}
                                />
                                <span className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">
                                  €
                                </span>
                              </div>
                            </FormControl>
                            <div className="min-h-[20px]">
                              <FormMessage className="text-xs sm:text-sm xl:text-base" />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 text-sm sm:text-base xl:text-lg">
                              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 text-primary" />
                              Localisation *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Ex: Paris, Lyon, Marseille"
                                  className="pl-7 sm:pl-9 text-sm sm:text-base focus-visible:ring-primary"
                                  value={field.value}
                                  onChange={(e) => {
                                    handleLocationChange(e.target.value)
                                  }}
                                  onBlur={() => {
                                    setTimeout(() => setShowLocationSuggestions(false), 150)
                                  }}
                                  onFocus={() => {
                                    if (locationSuggestions.length > 0) {
                                      setShowLocationSuggestions(true)
                                    }
                                  }}
                                />
                                <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                                {loadingLocation && (
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}

                                {showLocationSuggestions && locationSuggestions.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {locationSuggestions.map((suggestion, index) => (
                                      <button
                                        key={`${suggestion.code}-${index}`}
                                        type="button"
                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 text-sm"
                                        onClick={() => selectLocation(suggestion)}
                                      >
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                          <div>
                                            <div className="font-medium text-gray-900">{suggestion.name}</div>
                                            {suggestion.department && (
                                              <div className="text-xs text-gray-500">{suggestion.department}</div>
                                            )}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <div className="min-h-[20px]">
                              <FormMessage className="text-xs sm:text-sm xl:text-base" />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-4 sm:mt-6 xl:mt-8 overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="bg-primary/5 px-4 sm:px-6 xl:px-8 py-3 sm:py-4 xl:py-5 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-primary flex items-center gap-2 text-sm sm:text-base xl:text-lg">
                        <Camera className="h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6" />
                        Photos
                        <span className="text-xs xl:text-sm font-normal bg-primary/20 text-primary rounded-full px-1.5 py-0.5 xl:px-2 xl:py-1 ml-1.5">
                          {previewImages.length}/10
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div id="photo-section" className="p-4 sm:p-6 xl:p-8">
                    {previewImages.length === 0 ? (
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 sm:p-6 md:p-8 xl:p-12 text-center bg-primary/5">
                        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 xl:w-20 xl:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 xl:mb-6">
                          <ImageSquare className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 xl:h-10 xl:w-10 text-primary/60" />
                        </div>
                        <h3 className="font-medium mb-2 xl:mb-3 text-sm sm:text-base xl:text-lg">Aucune photo ajoutée</h3>
                        <p className="text-xs sm:text-sm xl:text-base text-muted-foreground mb-3 sm:mb-4 xl:mb-6">
                          Ajoutez au moins une photo pour votre annonce
                        </p>
                        <div className="relative inline-block">
                          <input
                            type="file"
                            id="image-upload-empty"
                            multiple
                            accept="image/*"
                            onChange={addImages}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Button type="button" size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm xl:text-base xl:px-6 xl:py-3">
                            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 xl:h-5 xl:w-5 mr-1.5 sm:mr-2 xl:mr-3" />
                            Ajouter des photos
                          </Button>
                        </div>

                        <div className="text-[10px] sm:text-xs xl:text-sm text-muted-foreground mt-4 xl:mt-6 bg-muted/50 p-2 sm:p-3 xl:p-4 rounded-md text-left">
                          <ul className="list-disc pl-3 sm:pl-4 xl:pl-5 space-y-0.5 sm:space-y-1 xl:space-y-1.5">
                            <li>Formats acceptés : JPG, JPEG, PNG</li>
                            <li>Taille maximale par image : 5 Mo</li>
                            <li>La première image sera utilisée comme aperçu principal</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 xl:gap-6">
                          {previewImages.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square bg-muted-foreground/5 rounded-md overflow-hidden border group"
                            >
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={`Aperçu ${index}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 xl:top-3 right-2 xl:right-3">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="p-1.5 xl:p-2 hover:bg-primary rounded-full transition-all"
                                >
                                  <XCircle className="h-4 w-4 xl:h-5 xl:w-5 text-black/60 hover:text-black drop-shadow-sm" weight="bold" />
                                </button>
                              </div>
                              {index === 0 && (
                                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 xl:top-3 xl:left-3 bg-primary text-white text-[10px] sm:text-xs xl:text-sm py-0.5 px-1.5 sm:py-1 sm:px-2 xl:py-1.5 xl:px-3 rounded-full">
                                  Principale
                                </div>
                              )}
                            </div>
                          ))}

                          {previewImages.length < 10 && (
                            <div className="relative aspect-square bg-muted-foreground/5 rounded-md border border-dashed flex flex-col items-center justify-center">
                              <input
                                type="file"
                                id="image-upload"
                                multiple
                                accept="image/*"
                                onChange={addImages}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <ImageSquare className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 xl:h-10 xl:w-10 text-primary/60 mb-1 sm:mb-2 xl:mb-3" weight="thin" />
                              <span className="text-[10px] sm:text-xs xl:text-sm text-center text-muted-foreground px-1">
                                Ajouter
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] sm:text-xs xl:text-sm text-muted-foreground mt-4 xl:mt-6 bg-muted/50 p-2 sm:p-3 xl:p-4 rounded-md">
                          <div className="font-medium mb-1 xl:mb-2">Informations :</div>
                          <ul className="list-disc pl-4 xl:pl-5 space-y-1 xl:space-y-1.5">
                            <li>Formats acceptés : JPG, JPEG, PNG</li>
                            <li>Taille maximale par image : 5 Mo</li>
                            <li>La première image sera utilisée comme aperçu principal</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 sm:mt-6 xl:mt-8 flex flex-row justify-between sm:flex-row sm:justify-between md:justify-center gap-3 md:gap-4 xl:gap-6">
                <Button type="button" variant="outline" onClick={() => navigate("/")} className="flex-1 sm:flex-1 md:w-40 lg:w-44 xl:w-48 xl:py-3 xl:text-lg">
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-1 md:w-40 lg:w-44 xl:w-48 xl:py-3 xl:text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 xl:h-5 xl:w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 xl:mr-3"></div>
                      <span className="block sm:hidden">Publication...</span>
                      <span className="hidden sm:block">Publication en cours...</span>
                    </>
                  ) : (
                    <>
                      <PencilSimple className="mr-2 xl:mr-3 h-4 w-4 xl:h-5 xl:w-5" />
                      Publier l'annonce
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
      <Footer />
    </div>
  )
}