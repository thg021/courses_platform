import React from 'react'

interface ChaptersIdPageProps {
    params: {
        chapterId: string
    }
}

function ChaptersIdPage({ params }: ChaptersIdPageProps) {
    return (
        <div>ChaptersIdPage {params.chapterId}</div>
    )
}

export default ChaptersIdPage