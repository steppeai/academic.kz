import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { programs, universities } from "@/db/schema";
import { eq } from "drizzle-orm";
export async function GET(_req: NextRequest,{params}:{params:Promise<{id:string}>}) {
  try {
    const {id:idStr}=await params;const id=parseInt(idStr);
    if(isNaN(id))return NextResponse.json({error:"Invalid ID"},{status:400});
    const [row]=await db.select({
      id:programs.id,title:programs.title,titleRu:programs.titleRu,field:programs.field,
      language:programs.language,cost:programs.cost,costUsd:programs.costUsd,duration:programs.duration,
      deadline:programs.deadline,bolashak:programs.bolashak,tags:programs.tags,description:programs.description,
      requirements:programs.requirements,documents:programs.documents,rating:programs.rating,students:programs.students,
      universityId:universities.id,universityName:universities.nameRu,city:universities.city,
      country:universities.country,isKazakh:universities.isKazakh,ranking:universities.ranking,website:universities.website,
    }).from(programs).innerJoin(universities,eq(programs.universityId,universities.id)).where(eq(programs.id,id)).limit(1);
    if(!row)return NextResponse.json({error:"Not found"},{status:404});
    return NextResponse.json({data:row});
  } catch(err){console.error(err);return NextResponse.json({error:"Internal server error"},{status:500});}
}