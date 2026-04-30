import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "@/lib/jwt";
export async function POST(req: NextRequest) {
  try {
    const {email,password}=await req.json();
    const [user]=await db.select().from(users).where(eq(users.email,email.toLowerCase())).limit(1);
    if(!user?.password||!await bcrypt.compare(password,user.password))return NextResponse.json({error:"Неверный email или пароль"},{status:401});
    return NextResponse.json({token:signToken({userId:user.id,email:user.email,role:user.role!}),user:{id:user.id,email:user.email,name:user.name,role:user.role}});
  } catch(err){console.error(err);return NextResponse.json({error:"Internal server error"},{status:500});}
}