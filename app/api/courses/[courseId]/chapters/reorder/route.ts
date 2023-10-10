import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; } }
) {
  try {
    const { userId } = auth();
    const { list } = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if(!list) return new NextResponse("BadRequest", { status: 400 })

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const promises = []

    for (let item of list) {
        promises.push( db.chapter.update({
            where: { id: item.id },
            data: { position: item.position }
        }))
    }
    await Promise.all(promises)

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}