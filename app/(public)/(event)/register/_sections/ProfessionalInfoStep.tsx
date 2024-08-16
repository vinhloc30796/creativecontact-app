import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { UseFormReturn } from 'react-hook-form'
import { FormData } from './formSchema'

interface ProfessionalInfoStepProps {
    form: UseFormReturn<FormData>
}

const industries = [
    'Advertising',
    'Architecture',
    'Arts and Crafts',
    'Design',
    'Fashion',
    'Film, Video, and Photography',
    'Music',
    'Performing Arts',
    'Publishing',
    'Software and Interactive',
    'Television and Radio',
    'Visual Arts',
    'Other'
]

const experienceLevels = [
    'Entry',
    'Junior',
    'Mid-level',
    'Senior',
    'Manager',
    'C-level'
]

export function ProfessionalInfoStep({ form }: ProfessionalInfoStepProps) {
    return (
        <>
            <FormField
                control={form.control}
                name="industries"
                render={() => (
                    <FormItem>
                        <FormLabel>Industry (Choose all that apply)</FormLabel>
                        <div className="space-y-2">
                            {industries.map((industry) => (
                                <FormField
                                    key={industry}
                                    control={form.control}
                                    name="industries"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={industry}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(industry)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, industry])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== industry
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {industry}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience (Choose one)</FormLabel>
                        <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                            >
                                {experienceLevels.map((level) => (
                                    <FormItem className="flex items-center space-x-3 space-y-0" key={level}>
                                        <FormControl>
                                            <RadioGroupItem value={level} />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            {level}
                                        </FormLabel>
                                    </FormItem>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Field</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Enter your specific field or area of expertise"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-500">
                            Please provide your specific field or area of expertise within your industry. 
                            For example: &quot;Consumer Goods&quot;, &quot;Financial Markets&quot;, &quot;Front-end Development&quot;, etc.
                        </p>
                    </FormItem>
                )}
            />
        </>
    )
}