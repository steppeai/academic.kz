import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { universities } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
export async function GET(req: NextRequest) {
  try {
    const sp=new URL(req.url).searchParams;
    const isKazakh=sp.get("isKazakh"),country=sp.get("country")||"";
    const rows=await db.select().from(universities)
      .where(isKazakh==="true"?eq(universities.isKazakh,true):isKazakh==="false"?eq(universities.isKazakh,false):country?eq(universities.country,country):undefined)
      .orderBy(asc(universities.ranking));
    return NextResponse.json({data:rows,total:rows.length});
  } catch(err){console.error(err);return NextResponse.json({error:"Internal server error"},{status:500});}
}