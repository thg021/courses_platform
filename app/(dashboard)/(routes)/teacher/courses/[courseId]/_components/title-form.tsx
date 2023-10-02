'use client'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Form, FormMessage, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Pencil, X } from 'lucide-react'
import { useState } from 'react'

interface TitleForm {
    initialData: {
        title: string
    }
    courseId: string
}

const TitleFormSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required'
    })
})

type TitleFormData = z.infer<typeof TitleFormSchema>


export function TitleForm({ initialData, courseId }: TitleForm) {
    const [isEditing, setIsEditing] = useState(false)

    const router = useRouter()
    const form = useForm<TitleFormData>({
        resolver: zodResolver(TitleFormSchema),
        defaultValues: initialData
    })

    function toggleEdit() {
        setIsEditing(current => !current)
    }

    const { handleSubmit, control, formState: { isSubmitting, isValid } } = form

    async function handleEditTitleCourse(params: TitleFormData) {
        try {
            console.log(params)
            await axios.patch(`/api/courses/${courseId}`)
            toast.success('Title updated')
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
                Course title
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
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing ? (
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleEditTitleCourse)}
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
                                            placeholder="e.g. 'Advanced web development'"
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
