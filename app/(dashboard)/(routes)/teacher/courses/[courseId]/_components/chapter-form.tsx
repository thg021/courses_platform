'use client'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Form, FormMessage, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Pencil, PlusCircle, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Chapter, Course } from '@prisma/client'
import { Input } from '@/components/ui/input'

interface ChapterForm {
    initialData: Course & { chapters: Chapter[] }
    courseId: string
}

const ChapterFormSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required'
    })
})

type ChapterFormData = z.infer<typeof ChapterFormSchema>


export function ChapterForm({ initialData, courseId }: ChapterForm) {
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const router = useRouter()
    const form = useForm<ChapterFormData>({
        resolver: zodResolver(ChapterFormSchema),
        defaultValues: {
            title: ""
        }
    })

    function toggleCreating() {
        setIsCreating(current => !current)
    }

    const { handleSubmit, control, formState: { isSubmitting, isValid } } = form

    async function handleEditDescriptionCourse(params: ChapterFormData) {
        try {
            console.log(params)
            await axios.post(`/api/courses/${courseId}/chapters`, params)
            toast.success('Title created')
            toggleCreating()
            router.refresh()
        } catch (error) {
            console.log("Something went wrong")
            toast.error("Something went wrong!")
        }
    }


    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className="font-medium flex items-center justify-between">
                Courses chapters
                <Button
                    onClick={toggleCreating}
                    variant="ghost"
                >
                    {isCreating ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleEditDescriptionCourse)}
                        className='space-y-4 mt-4'
                    >

                        <FormField
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course...'"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={!isValid || isSubmitting} size='sm'>Create</Button>

                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && "No chapter"}
                    {/*TODO: Add a list of chapters */}
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reaoder the chapter
                </p>
            )}
        </div>
    )
}
