import { ArtworkInfoData } from '@/app/form-schemas/artwork-info'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UseFormReturn } from 'react-hook-form'

interface ArtworkInfoStepProps {
  form: UseFormReturn<ArtworkInfoData>
  artworks: ArtworkInfoData[]
  handleExistingArtworkSelect: (artwork: ArtworkInfoData) => void
}

export function ArtworkInfoStep({ form, artworks, handleExistingArtworkSelect }: ArtworkInfoStepProps) {
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
      {artworks.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Or select an existing artwork:</h3>
          {artworks.map((artwork) => (
            <Button
              key={artwork.uuid}
              onClick={() => handleExistingArtworkSelect(artwork)}
              variant="outline"
              className="w-full mb-2"
            >
              {artwork.title}
            </Button>
          ))}
        </div>
      )}
    </>
  )
}
