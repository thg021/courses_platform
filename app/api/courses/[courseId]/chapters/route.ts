import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

interface CreateChapterRequest {
    params: {
        courseId: string
    }
}
export async function POST(req: Request,  { params }: CreateChapterRequest ){
    try {
        const { userId } = auth()
        const { courseId } = params
        const { title } = await req.json()

        if(!title) return new NextResponse("BadRequest", { status: 400 })
        if(!userId) return new NextResponse('Unauthorized', { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId, 
                userId
            }
        })

        if(!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId
            }, 
            orderBy: {
                position: 'desc'
            }
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1

        const chapter = await db.chapter.create({
            data: { courseId, title, position: newPosition }
        })

        return NextResponse.json(chapter)
    } catch (error) {
        console.log('[CHAPTERS]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}