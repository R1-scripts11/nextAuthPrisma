import type { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        CredentialsProvider({
            //Le nom qui va s'affiche sur le formulaire d'enregistrement
            name: "Credentials",
            credentials: {
                username:{
                    label: "Username",
                    type: "text",
                    placeholder: "your-cool-username"
                },
                password:{
                    label: "Password", 
                    type: "password",
                    placeholder: "your-cool-password"
                }
            },
            async authorize(credentials) {
                const user = {id:"1",name:'erwan',password:"test"}//EXEMPLE USER IN BDD

                if (credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                }else{
                    return null
                }
            }
        })
    ],
    adapter: PrismaAdapter(prisma),
}