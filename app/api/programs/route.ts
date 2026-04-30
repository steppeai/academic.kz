import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { programs, universities } from "@/db/schema";
import { eq, and, lte, sql, asc, desc } from "drizzle-orm";
export async function GET(req: NextRequest) {
  try {
    const sp = new URL(req.url).searchParams;
    const query=sp.get("q")||"",city=sp.get("city")||"",field=sp.get("field")||"";
    const lang=sp.get("lang")||"",country=sp.get("country")||"";
    const bolashak=sp.get("bolashak")==="true";
    const maxCost=parseInt(sp.get("maxCost")||"999999");
    const sortBy=sp.get("sort")||"rating";
    const page=parseInt(sp.get("page")||"1"),limit=parseInt(sp.get("limit")||"12");
    const isKazakh=sp.get("isKazakh");
    const offset=(page-1)*limit;
    const rows=await db.select({
      id:programs.id,title:programs.title,titleRu:programs.titleRu,
      field:programs.field,language:programs.language,cost:programs.cost,costUsd:programs.costUsd,
      duration:programs.duration,deadline:programs.deadline,bolashak:programs.bolashak,
      tags:programs.tags,description:programs.description,requirements:programs.requirements,
      documents:programs.documents,rating:programs.rating,students:programs.students,
      universityId:universities.id,universityName:universities.nameRu,
      city:universities.city,country:universities.country,isKazakh:universities.isKazakh,
      ranking:universities.ranking,website:universities.website,
    }).from(programs).innerJoin(universities,eq(programs.universityId,universities.id))
    .where(and(
      query?sql`(${programs.title} ILIKE ${"%" + query + "%"} OR ${programs.titleRu} ILIKE ${"%" + query + "%"} OR ${universities.nameRu} ILIKE ${"%" + query + "%"})`:undefined,
      city?eq(universities.city,city):undefined,
      field?eq(programs.field,field):undefined,
      country?eq(universities.country,country):undefined,
      bolashak?eq(programs.bolashak,true):undefined,
      isKazakh==="true"?eq(universities.isKazakh,true):undefined,
      isKazakh==="false"?eq(universities.isKazakh,false):undefined,
      lte(programs.cost,maxCost),
      lang?sql`${programs.language}::text ILIKE ${"%" + lang + "%"}`:undefined,
    ))
    .orderBy(sortBy==="cost-asc"?asc(programs.cost):sortBy==="cost-desc"?desc(programs.cost):sortBy==="deadline"?asc(programs.deadline):desc(programs.rating))
    .limit(limit).offset(offset);
    const [{count}]=await db.select({count:sql<number>`count(*)`}).from(programs).innerJoin(universities,eq(programs.universityId,universities.id));
    return NextResponse.json({data:rows,meta:{total:Number(count),page,limit,pages:Math.ceil(Number(count)/limit)}});
  } catch(err){console.error(err);return NextResponse.json({error:"Internal server error"},{status:500});}
}