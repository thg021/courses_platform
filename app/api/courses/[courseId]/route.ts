import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

interface UpdateCourseRequest {
    params: { courseId: string }
}

export async function PATCH(req: Request, { params }: UpdateCourseRequest) {

    try {
        const { userId } = auth()
        const { courseId } = params
        const values = await req.json()

        if(!userId) return new NextResponse('Unauthorized', { status: 401 })
        if(!values) return new NextResponse("BadRequest", { status: 400 })
        
        const course = await db.course.update({
            where: {
                id: courseId, 
                userId
            }, 
            data: {
                ...values
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        console.log('[COURSES_ID]', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}