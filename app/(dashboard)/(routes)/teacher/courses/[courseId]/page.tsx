import React from 'react'

interface CourseIdPros {
    params: {
        courseId: string
    }
}
export default function CourseIdPage({ params: { courseId } }: CourseIdPros) {
    return (
        <div>CourseIdPage {courseId}</div>
    )
}
