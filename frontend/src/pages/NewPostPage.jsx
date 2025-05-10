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
  ArrowRight,
  Camera,
  PencilSimple,
} from "@phosphor-icons/react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { postSchema } from "@/utils/postValidation"

export default function NewPostPage() {
  const navigate = useNavigate()
  const { createPost, loading, error, clearErrors } = postStore()
  const { isAuthenticated, user } = userStore()
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [activeStep, setActiveStep] = useState("details")

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

  const createNewPost = async (data) => {
    if (images.length === 0) {
      setSubmitError("Veuillez ajouter au moins une image")
      setActiveStep("photos")
      return
    }

    setSubmitError(null)

    try {
      const post = await createPost(data, images)
      setSubmitSuccess(true)

      setTimeout(() => {
        navigate(`/annonce/${post.id}`)
      }, 2000)
    } catch (error) {
      setSubmitError("Une erreur est survenue lors de la création de l'annonce")
      window.scrollTo(0, 0)
    }
  }

  const moveImage = (index, direction) => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === previewImages.length - 1)) return

    const newIndex = direction === "up" ? index - 1 : index + 1

    // Update preview images
    const newPreviewImages = [...previewImages]
    ;[newPreviewImages[index], newPreviewImages[newIndex]] = [newPreviewImages[newIndex], newPreviewImages[index]]
    setPreviewImages(newPreviewImages)

    // Update actual images
    const newImages = [...images]
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="container max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" weight="fill" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">Annonce publiée avec succès !</h1>

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <Navbar />

      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-4xl mx-auto px-8 md:px-12 lg:px-16">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-muted-foreground hover:text-foreground group"
            >
              <CaretLeft className="mr-1 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Créer une nouvelle annonce</h1>
                <p className="text-muted-foreground mt-2">
                  Remplissez le formulaire ci-dessous pour publier votre annonce
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

          <Tabs value={activeStep} onValueChange={setActiveStep} className="mb-8">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <TextT className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Camera className="h-4 w-4 mr-2" />
                Photos
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(createNewPost)} className="space-y-8">
                <TabsContent value="details" className="mt-0">
                  <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary mb-4">
                          <Info weight="fill" className="h-5 w-5" />
                          <h2 className="font-medium">Informations sur votre article</h2>
                        </div>

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                Titre de l'annonce *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: iPhone 13 Pro Max 256 Go"
                                  {...field}
                                  className="focus-visible:ring-primary"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <TextT className="h-4 w-4 text-primary" />
                                Description *
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Décrivez votre article en détail (état, caractéristiques, etc.)"
                                  className="min-h-32 focus-visible:ring-primary"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <CurrencyCircleDollar className="h-4 w-4 text-primary" />
                                  Prix *
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="focus-visible:ring-primary pl-7"
                                      min="0"
                                      onKeyDown={(e) => {
                                        if ((e.key === "-")) {
                                          e.preventDefault()
                                        }
                                      }}
                                      {...field}
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                      €
                                    </span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary" />
                                  Localisation *
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      placeholder="Ex: Paris, Lyon, Marseille"
                                      className="focus-visible:ring-primary pl-9"
                                      {...field}
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button
                          type="button"
                          onClick={() => setActiveStep("photos")}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Continuer vers les photos
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="photos" className="mt-0">
                  <Card className="border-none shadow-md">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                              <ImageSquare className="h-5 w-5 text-primary" />
                              Photos
                              <span className="text-sm font-normal text-muted-foreground">
                                ({previewImages.length}/10)
                              </span>
                            </h3>

                            <div className="relative">
                              <input
                                type="file"
                                id="image-upload-button"
                                multiple
                                accept="image/*"
                                onChange={addImages}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                className="text-sm"
                                disabled={previewImages.length >= 10}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Ajouter des photos
                              </Button>
                            </div>
                          </div>

                          {previewImages.length === 0 ? (
                            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center bg-primary/5">
                              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <ImageSquare className="h-8 w-8 text-primary/60" />
                              </div>
                              <h3 className="font-medium mb-2">Aucune photo ajoutée</h3>
                              <p className="text-sm text-muted-foreground mb-4">
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
                                <Button type="button" className="bg-primary hover:bg-primary/90 text-white">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Parcourir mes fichiers
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
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
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                    >
                                      <XCircle className="h-5 w-5 text-red-500" />
                                    </button>
                                    {index > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => moveImage(index, "up")}
                                        className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                      >
                                        <ArrowRight className="h-5 w-5 text-primary rotate-[-90deg]" />
                                      </button>
                                    )}
                                    {index < previewImages.length - 1 && (
                                      <button
                                        type="button"
                                        onClick={() => moveImage(index, "down")}
                                        className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                      >
                                        <ArrowRight className="h-5 w-5 text-primary rotate-90" />
                                      </button>
                                    )}
                                  </div>
                                  {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-primary text-white text-xs py-1 px-2 rounded-full">
                                      Principale
                                    </div>
                                  )}
                                </div>
                              ))}

                              {previewImages.length < 10 && (
                                <div className="relative aspect-square bg-muted-foreground/5 rounded-md border border-dashed flex flex-col items-center justify-center p-4 hover:bg-primary/5 transition-colors">
                                  <input
                                    type="file"
                                    id="image-upload"
                                    multiple
                                    accept="image/*"
                                    onChange={addImages}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  <ImageSquare className="h-8 w-8 text-primary/60 mb-2" weight="thin" />
                                  <span className="text-xs text-center text-muted-foreground">
                                    Ajouter plus de photos
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground mt-4 bg-muted/50 p-3 rounded-md">
                            <ul className="list-disc pl-4 space-y-1">
                              <li>Formats acceptés : JPG, JPEG, PNG</li>
                              <li>Taille maximale par image : 5 Mo</li>
                              <li>La première image sera utilisée comme aperçu principal</li>
                              <li>Vous pouvez réorganiser vos photos en survolant chaque image</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
                        <Button type="button" variant="outline" onClick={() => setActiveStep("details")}>
                          <CaretLeft className="mr-2 h-4 w-4" />
                          Retour aux informations
                        </Button>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button type="button" variant="outline" onClick={() => navigate("/")}>
                            Annuler
                          </Button>
                          <Button
                            type="submit"
                            className="bg-primary hover:bg-primary/90 text-white"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Publication en cours...
                              </>
                            ) : (
                              <>
                                <PencilSimple className="mr-2 h-4 w-4" />
                                Publier l'annonce
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
