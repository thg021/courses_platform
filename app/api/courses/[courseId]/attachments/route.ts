import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

interface AddAttachmentRequest {
    params: {
        courseId: string
    }
}

export async function POST(req: Request, { params }: AddAttachmentRequest){

    try {
        const { userId } = auth()
        const { courseId } = params
        const {url} = await req.json()

        if(!userId) return new NextResponse('Unauthorized', { status: 401 })
        if(!url) return new NextResponse("BadRequest", { status: 400 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId, 
                userId
            }
        })

        if(!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

        const attachment = await db.attachment.create({
            data: {
                url, 
                name: url.split('/').pop(), 
                courseId
            }
        })

        return NextResponse.json(attachment)
        
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error)
        return new NextResponse("Internal Error", { status: 500 })
    }

}