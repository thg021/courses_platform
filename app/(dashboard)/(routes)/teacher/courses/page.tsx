import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function CoursesPages() {
    return (
        <div>
            <Link href="/teacher/create">
                <Button>
                    Create course
                </Button>
            </Link>
        </div>
    )
}
