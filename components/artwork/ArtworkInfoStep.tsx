import { ArtworkInfoData } from '@/app/form-schemas/artwork-info'
import { FormControl, FormField, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface ArtworkInfoStepProps {
  form: UseFormReturn<ArtworkInfoData>
  artworks: ArtworkInfoData[]
  handleExistingArtworkSelect: (artwork: ArtworkInfoData) => void
}


function ExistingArtworkSelector({ form, artworks }: { form: UseFormReturn<ArtworkInfoData>, artworks: ArtworkInfoData[] }) {
  const [selectedArtwork, setSelectedArtwork] = useState<string>('')

  useEffect(() => {
    if (selectedArtwork) {
      const artwork = artworks.find(a => a.uuid === selectedArtwork)
      if (artwork) {
        form.setValue('title', artwork.title)
        form.setValue('description', artwork.description)
        // Add other fields as necessary
      }
    }
  }, [selectedArtwork, artworks, form])

  return (
    <FormItem>
      <FormLabel>Existing artwork</FormLabel>
      <FormDescription>Select one if you want to update an existing artwork</FormDescription>
      <Select onValueChange={setSelectedArtwork} value={selectedArtwork}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select an existing artwork" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {artworks && artworks.length > 0 ? (
            artworks.map((artwork) => (
              <SelectItem key={artwork.uuid} value={artwork.uuid}>
                {artwork.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="error" disabled>No artworks found</SelectItem>
          )}
        </SelectContent>
      </Select>
    </FormItem>
  )
}

export function ArtworkInfoStep({ form, handleExistingArtworkSelect }: ArtworkInfoStepProps) {
  const { user } = useAuth();

  const { data: artworks, isLoading, error } = useQuery({
    queryKey: ['artworks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/artworks/by-uploader?uploaderId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Title of your artwork" {...field} />
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description of your artwork" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isLoading && <p>Loading existing artworks...</p>}
      {error && <p>Error loading existing artworks. Please try again.</p>}
      {artworks && <ExistingArtworkSelector form={form} artworks={artworks} />}
    </>
  )
}
