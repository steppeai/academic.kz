import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "@/lib/jwt";
export async function POST(req: NextRequest) {
  try {
    const {email,name,password}=await req.json();
    if(!email||!password)return NextResponse.json({error:"Email и пароль обязательны"},{status:400});
    const [ex]=await db.select({id:users.id}).from(users).where(eq(users.email,email.toLowerCase())).limit(1);
    if(ex)return NextResponse.json({error:"Email уже занят"},{status:409});
    const [user]=await db.insert(users).values({email:email.toLowerCase(),name,password:await bcrypt.hash(password,12)}).returning({id:users.id,email:users.email,name:users.name,role:users.role});
    return NextResponse.json({token:signToken({userId:user.id,email:user.email,role:user.role!}),user},{status:201});
  } catch(err){console.error(err);return NextResponse.json({error:"Internal server error"},{status:500});}
}