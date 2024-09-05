import { ArtworkInfoData } from '@/app/form-schemas/artwork-info'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

interface ArtworkInfoStepProps {
  form: UseFormReturn<ArtworkInfoData>
  artworks: ArtworkInfoData[]
  setIsNewArtwork: (isNewArtwork: boolean) => void
}

function ExistingArtworkSelector({ form, artworks }: {
  form: UseFormReturn<ArtworkInfoData>,
  artworks: ArtworkInfoData[],
}) {
  const [selectedArtwork, setSelectedArtwork] = useState<string>('')

  useEffect(() => {
    if (selectedArtwork) {
      const artwork = artworks.find(a => a.uuid === selectedArtwork)
      if (artwork) {
        form.reset(artwork)
      }
    }
  }, [selectedArtwork, artworks, form])

  return (
    <FormItem>
      <FormLabel>Existing artwork</FormLabel>
      <FormDescription>Select one if you want to update an existing artwork</FormDescription>
      <Select onValueChange={
        (value) => {
          setSelectedArtwork(value)
          const selectedArtwork = artworks.find(a => a.uuid === value)
          if (selectedArtwork) {
            form.reset(selectedArtwork)
          }
        }
      } defaultValue=''>
        <FormControl>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {artworks && artworks.length > 0 ? (
            artworks.map((artwork) => (
              <SelectItem key={artwork.uuid} value={artwork.uuid}>
                {artwork.title} (UUID: {artwork.uuid})
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

export function ArtworkInfoStep({ form, artworks, setIsNewArtwork: parentSetIsNewArtwork }: ArtworkInfoStepProps) {
  const { user } = useAuth();
  const [isNewArtwork, setIsNewArtwork] = useState(true);

  const { data: fetchedArtworks, isLoading, error } = useQuery({
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

  useEffect(() => {
    // Set the uuid field based on whether it's a new artwork or not
    form.setValue('uuid', isNewArtwork ? '' : form.getValues('uuid'));
  }, [isNewArtwork, form]);

  return (
    <>
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">
            {isNewArtwork ? 'New Artwork' : 'Existing Artwork'}
          </FormLabel>
          <FormDescription>
            {isNewArtwork ? 'Create a new artwork' : 'Select an existing artwork'}
          </FormDescription>
        </div>
        <FormControl>
          <Switch
            checked={isNewArtwork}
            onCheckedChange={(checked) => {
              setIsNewArtwork(checked);
              parentSetIsNewArtwork(checked);
              if (checked) {
                form.reset({ uuid: '', title: '', description: '' });
                setIsNewArtwork(true);
                parentSetIsNewArtwork(true);
              }
            }}
          />
        </FormControl>
      </FormItem>

      {isNewArtwork ? (
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
        </>
      ) : (
        <>
          {isLoading && <p>Loading existing artworks...</p>}
          {error && <p>Error loading existing artworks. Please try again.</p>}
          {fetchedArtworks && <ExistingArtworkSelector form={form} artworks={fetchedArtworks} />}
        </>
      )}
    </>
  )
}
