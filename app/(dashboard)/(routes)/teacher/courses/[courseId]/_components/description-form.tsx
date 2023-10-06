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
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'

interface DescriptionForm {
    initialData: Course
    courseId: string
}

const DescriptionFormSchema = z.object({
    description: z.string().min(1, {
        message: 'Description is required'
    })
})

type DescriptionFormData = z.infer<typeof DescriptionFormSchema>


export function DescriptionForm({ initialData, courseId }: DescriptionForm) {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()
    const form = useForm<DescriptionFormData>({
        resolver: zodResolver(DescriptionFormSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    })

    function toggleEdit() {
        setIsEditing(current => !current)
    }

    const { handleSubmit, control, formState: { isSubmitting, isValid } } = form

    async function handleEditDescriptionCourse(params: DescriptionFormData) {
        try {
            console.log(params)
            await axios.patch(`/api/courses/${courseId}`, params)
            toast.success('Description updated')
            toggleEdit()
            router.refresh()
        } catch (error) {
            console.log("Something went wrong")
            toast.error("Something went wrong!")
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Course description
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
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {initialData.description || "No description"}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleEditDescriptionCourse)}
                        className='space-y-4 mt-4'
                    >

                        <FormField
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This is course about...'"
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
