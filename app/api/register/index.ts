"use server"

import bcrypt from 'bcrypt';
import  prisma  from "@/src/lib/prisma";

export async function createUser(name: string, email: string, password: string) {
    const saltRounds = 10; // Le nombre de tours pour le salage du hash
  
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword, // Enregistre le mot de passe hashé
        },
      });
      return user;
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur :", error);
      throw error;
    }
  }