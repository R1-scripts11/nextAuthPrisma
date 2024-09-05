import type { NextAuthOptions } from "next-auth";
import bcrypt from 'bcrypt';

//PROVIDERS (MOYEN de connexion)
import GitHubProvider from 'next-auth/providers/github' //GITHUB
import GoogleProvider from 'next-auth/providers/google' //GOOGLE
import CredentialsProvider from 'next-auth/providers/credentials' //REEL COMPTE 

import { PrismaAdapter } from "@next-auth/prisma-adapter" //Adapter prisma pour next-auth
import { PrismaClient } from "@prisma/client"            //Prisma

import { getUserByEmail } from "@/src/data/users";

const prisma = new PrismaClient() //Instance de prisma
export const options: NextAuthOptions = {
    session: {
        strategy: 'jwt' //JSON WEB TOKEN
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Veuillez remplir les champs')
                    return null;  // Dans le cas ou les credentials sont mauvais
                }                
                const user = await getUserByEmail(credentials?.email);
                if(user && user.password){// Vérifie que l'utilisateur et son mot de passe existent
                     // Comparer le mot de passe en texte clair avec le hash dans la base de données
                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    if (isMatch){
                        return user;
                    }else{
                        throw new Error('Mot de passe incorrect')
                    }
                }else{
                    throw new Error('Utilisateur introuvable')
                }
            },
        }),
        GitHubProvider({ 
            clientId: process.env.GITHUB_ID as string,  //ID du client à changer si le domaine change
            clientSecret: process.env.GITHUB_SECRET as string //Clé secrète 
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
    ],
    
    callbacks: {},  
    adapter: PrismaAdapter(prisma)
}