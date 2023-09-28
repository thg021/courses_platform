'use client'
import React from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const CreateCourseFormSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required'
    })
})

type CreateCourseFormData = z.infer<typeof CreateCourseFormSchema>

export default function CreatePage() {
    const router = useRouter()
    const form = useForm<CreateCourseFormData>({
        resolver: zodResolver(CreateCourseFormSchema),
        defaultValues: {
            title: ""
        }
    })

    const { handleSubmit, control, formState: { isSubmitting, isValid } } = form

    async function handleCreateCourse(params: CreateCourseFormData) {
        try {
            const response = await axios.post("/api/course", params)
            router.push(`/teacher/courses/${response.data.id}`)
        } catch (error) {
            console.log("Something went wrong")
            toast.error("Something went wrong!")
        }
    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full">
            <div>
                <h1 className="text-2xl">Name your course</h1>
                <p>What would you like to name your course? Don't worry, you can change this later.</p>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleCreateCourse)}
                        className='space-y-8 mt-8'
                    >

                        <FormField
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Advanced web development'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button type="button" variant="ghost" size='sm'>Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting} size='sm'>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
