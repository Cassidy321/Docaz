import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import postStore from "@/stores/postStore"
import userStore from "@/stores/userStore"
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
  const isMobile = window.innerWidth < 768

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
    mode: "onChange",
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
        <main className="flex-1 py-10">
          <div className="container max-w-4xl mx-auto px-4 sm:px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" weight="fill" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">Annonce publiée avec succès !</h1>
              <Alert className="bg-green-50 border-green-200 mb-8">
                <AlertDescription className="text-green-700">
                  Votre annonce a été créée et sera visible par les autres utilisateurs. Vous allez être redirigé vers
                  votre annonce...
                </AlertDescription>
              </Alert>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/")} className="flex items-center">
                  Retour à l'accueil
                </Button>
                <Button onClick={() => navigate("/mes-annonces")} className="bg-primary hover:bg-primary/90 text-white">
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
      <main className="flex-1 py-6 sm:py-8">
        <div className="container max-w-5xl mx-auto px-4 sm:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-3 text-muted-foreground hover:text-foreground group"
            >
              <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Button>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Créer une nouvelle annonce</h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Complétez les informations ci-dessous pour mettre votre article en vente
                </p>
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
          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full py-2 flex justify-between items-center border-primary/20 bg-primary/5 text-primary/90"
              onClick={() => setShowTips(!showTips)}
              size="sm"
            >
              <div className="flex items-center">
                <LightbulbFilament className="h-4 w-4 text-primary mr-2" weight="fill" />
                <span className="text-sm">Conseils pour votre annonce</span>
              </div>
              <span>{showTips ? '−' : '+'}</span>
            </Button>

            {showTips && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-2">
                <ul className="text-xs text-primary/80 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-xs bg-primary/20 text-primary/90 rounded-full size-4 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Titre clair avec marque et caractéristiques</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-xs bg-primary/20 text-primary/90 rounded-full size-4 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Détaillez l'état et les spécificités</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-xs bg-primary/20 text-primary/90 rounded-full size-4 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Photos sous différents angles, bon éclairage</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(createNewPost)}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="bg-primary/5 px-4 sm:px-6 py-3 sm:py-4 border-b border-primary/10">
                    <h2 className="font-semibold text-primary flex items-center gap-2 text-sm sm:text-base">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5" weight="fill" />
                      Informations sur votre article
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                            <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                            Titre de l'annonce *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: iPhone 13 Pro Max 256 Go"
                              {...field}
                              className="text-sm sm:text-base focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                            <TextT className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                            Description *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre article en détail (état, caractéristiques, etc.)"
                              className="min-h-24 sm:min-h-32 text-sm sm:text-base focus-visible:ring-primary focus:border-primary/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                              <CurrencyCircleDollar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
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
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                              Localisation *
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Ex: Paris, Lyon, Marseille"
                                  className="pl-7 sm:pl-9 text-sm sm:text-base focus-visible:ring-primary"
                                  {...field}
                                />
                                <MapPin className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-4 sm:mt-6 overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="bg-primary/5 px-4 sm:px-6 py-3 sm:py-4 border-b border-primary/10">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-primary flex items-center gap-2 text-sm sm:text-base">
                        <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                        Photos
                        <span className="text-xs font-normal bg-primary/20 text-primary rounded-full px-1.5 py-0.5 ml-1.5">
                          {previewImages.length}/10
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div id="photo-section" className="p-4 sm:p-6">
                    {previewImages.length === 0 ? (
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 sm:p-6 text-center bg-primary/5">
                        <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                          <ImageSquare className="h-6 w-6 sm:h-7 sm:w-7 text-primary/60" />
                        </div>
                        <h3 className="font-medium mb-2 text-sm sm:text-base">Aucune photo ajoutée</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
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
                          <Button type="button" size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm">
                            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                            Ajouter des photos
                          </Button>
                        </div>

                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-4 bg-muted/50 p-2 sm:p-3 rounded-md text-left">
                          <ul className="list-disc pl-3 sm:pl-4 space-y-0.5 sm:space-y-1">
                            <li>Formats acceptés : JPG, JPEG, PNG</li>
                            <li>Taille maximale par image : 5 Mo</li>
                            <li>La première image sera utilisée comme aperçu principal</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
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
                              <div className="absolute top-1 right-1 flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="bg-white/90 p-1.5 rounded-full shadow-sm"
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                              <div className="absolute bottom-1 right-1 flex flex-col gap-1">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImage(index, "up")}
                                    className="bg-white/90 p-1.5 rounded-full shadow-sm"
                                  >
                                    <ArrowUp className="h-4 w-4 text-primary" />
                                  </button>
                                )}
                                {index < previewImages.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => moveImage(index, "down")}
                                    className="bg-white/90 p-1.5 rounded-full shadow-sm"
                                  >
                                    <ArrowDown className="h-4 w-4 text-primary" />
                                  </button>
                                )}
                              </div>

                              {index === 0 && (
                                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-primary text-white text-[10px] sm:text-xs py-0.5 px-1.5 sm:py-1 sm:px-2 rounded-full">
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
                              <ImageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60 mb-1 sm:mb-2" weight="thin" />
                              <span className="text-[10px] sm:text-xs text-center text-muted-foreground px-1">
                                Ajouter
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-4 bg-muted/50 p-2 sm:p-3 rounded-md">
                          <div className="font-medium mb-1">Informations :</div>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Formats acceptés : JPG, JPEG, PNG</li>
                            <li>Taille maximale par image : 5 Mo</li>
                            <li>La première image sera utilisée comme aperçu principal</li>
                            <li className="hidden sm:block">Vous pouvez réorganiser vos photos en survolant chaque image</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 sm:mt-6 flex flex-row justify-between sm:justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/")} className="flex-1 sm:flex-1">
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="block sm:hidden">Publication...</span>
                      <span className="hidden sm:block">Publication en cours...</span>
                    </>
                  ) : (
                    <>
                      <PencilSimple className="mr-2 h-4 w-4" />
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