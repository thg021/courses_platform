'use client'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Form, FormMessage, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'
import { Course } from '@prisma/client'

interface PriceForm {
    initialData: Course
    courseId: string
}

const PriceFormSchema = z.object({
    price: z.coerce.number()
})

type PriceFormData = z.infer<typeof PriceFormSchema>


export function PriceForm({ initialData, courseId }: PriceForm) {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()
    const form = useForm<PriceFormData>({
        resolver: zodResolver(PriceFormSchema),
        defaultValues: {
            price: initialData?.price || undefined
        }
    })

    function toggleEdit() {
        setIsEditing(current => !current)
    }

    const { handleSubmit, control, formState: { isSubmitting, isValid } } = form

    async function handleEditPriceCourse(params: PriceFormData) {
        try {
            console.log(params)
            await axios.patch(`/api/courses/${courseId}`, params)
            toast.success('Price updated')
            toggleEdit()
            router.refresh()
        } catch (error) {
            console.log("Something went wrong")
            toast.error("Something went wrong!")
        }
    }

    const formattedPrice = initialData.price ? formatPrice(initialData.price) : "No price"


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button
                    onClick={toggleEdit}
                    variant="ghost"
                >
                    {isEditing ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")}>
                    {formattedPrice}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleEditPriceCourse)}
                        className='space-y-4 mt-4'
                    >

                        <FormField
                            control={control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            disabled={isSubmitting}
                                            placeholder="set your price this course"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={!isValid || isSubmitting} size='sm'>Save</Button>
                        </div>
                    </form>
                </Form>
            )}

        </div>
    )
}
