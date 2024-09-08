import { ArtworkInfoData } from '@/app/form-schemas/artwork-info'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface ArtworkInfoStepProps {
  form: UseFormReturn<ArtworkInfoData>
  artworks: ArtworkInfoData[]
  setIsNewArtwork: (isNewArtwork: boolean) => void
}

function ExistingArtworkSelector({ form, artworks }: {
  form: UseFormReturn<ArtworkInfoData>,
  artworks: ArtworkInfoData[],
}) {
  // State
  const [selectedArtwork, setSelectedArtwork] = useState<string>('')
  // I18n
  const { t } = useTranslation(['ArtworkInfoStep'], { keyPrefix: 'ExistingArtworkSelector' })

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
      <FormLabel>{t('label')}</FormLabel>
      <FormDescription>{t('description')}</FormDescription>
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
            <SelectItem value="error" disabled>{t('noArtworksFound')}</SelectItem>
          )}
        </SelectContent>
      </Select>
    </FormItem>
  )
}

export function ArtworkInfoStep({ form, artworks, setIsNewArtwork: parentSetIsNewArtwork }: ArtworkInfoStepProps) {
  // State
  const { user } = useAuth();
  const [isNewArtwork, setIsNewArtwork] = useState(true);
  // I18n
  const { t } = useTranslation(['ArtworkInfoStep'])

  const { data: fetchedArtworks, isLoading, error } = useQuery({
    queryKey: ['artworks', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.warn("No user id found to fetch artworks");
        return [];
      }
      const response = await fetch(`/api/artworks/by-uploader?uploaderId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }
      const data = await response.json();
      console.log("Fetched artworks for user:", user.id, data);
      return data.artworks;
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
            {isNewArtwork ? t('isNewArtwork.labelTrue') : t('isNewArtwork.labelFalse')}
          </FormLabel>
          <FormDescription>
            {isNewArtwork ? t('isNewArtwork.descriptionTrue') : t('isNewArtwork.descriptionFalse')}
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
                <FormLabel>{t('title.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('title.placeholder')} {...field} />
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
                <FormLabel>{t('description.label')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('description.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <>
          {isLoading && 
            // Muted text with loading icon
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-muted-foreground">{t('loadingExistingArtworks')}</span>
            </div>
          }
          {error && <p>{t('ExistingArtworkSelector.error')}</p>}
          {fetchedArtworks && <ExistingArtworkSelector form={form} artworks={fetchedArtworks} />}
        </>
      )}
    </>
  )
}
