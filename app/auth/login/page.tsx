"use client"; // Permet l'interactivité du composant
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/app/api/actions";
import { SignInResponse } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function SignIn({}) {

  const router = useRouter();
  const [error, setError] = useState('');
  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Empêche le rechargement de la page
    try {
        const formData = new FormData(event.currentTarget);
        console.log("Form Data:", formData);
        console.log("Email:", formData.get("email"));
        console.log("Password:", formData.get("password"));
        const response: SignInResponse | undefined = await doCredentialLogin(formData);
        console.log('reponse',response)
        if (response?.error) {
            // Handle the error (e.g., display an error message to the user)
            setError(response.error)
        } else {
            router.push('/');
        }
    } catch (err) {
        console.error("An unexpected error occurred:", err);
    }
}

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header text-center">
              <h3>Se connecter</h3>
            </div>
            <div className="card-body">
              <div className="text-xl text-red-500">{error}</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Adresse email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Entrez votre email"
                    name="email"//très important pour le formulaire (objet formData) attribut name
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Mot de passe" 
                    name="password"//très important pour le formulaire (objet formData) attribut password
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Se connecter
                </button>
              </form>

              <hr />

              <div className="text-center mt-2">
                  <button

                    className="btn btn-dark w-100 mb-2"

                    onClick={() => router.push('/auth/register')}

                  >
                    Pas encore de compte ? Créez-en un !
                  </button>
                </div>
                <hr/>

              <div className="text-center mt-2">
                <button 
                  className="btn btn-outline-dark w-100 mb-2" 
                  onClick={() => signIn('github', { callbackUrl: '/' })}
                >
                  <i className="bi bi-github me-2"></i>
                  Continuer avec Github
                </button>
                <button 
                  className="btn btn-outline-danger w-100" 
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                >
                  <i className="bi bi-google me-2"></i>
                  Continuer avec Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
