"use client"; // Permet l'interactivité du composant

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "../../api/register";


//Pour l'inscription 
export default function Register({}) {

  const router = useRouter();

  const [formData, setFormData] = useState({ //Utilisation du hook use state pour mettre à jour formData
    name:'',
    email:'',
    password:'',
    password_confirm:''
  })

  //Fonction appelé quand un champ du formulaire est modifier 
  //Le type React.ChangeEvent<HTMLInputElement> signifie que l'evenement provient d'un élément de type entrée (input)
  //React.ChangeEvent est un type d'événement dans React qui représente un événement déclenché par des éléments de formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const {name, value} = e.target; //destructuration ça prend les attributs de l'input name et value
    setFormData({ //Mise à jour de l'objet
      ...formData, //copie toutes les propriétés existantes de l'objet formData actuel.
      [name] : value, //Ici, on met à jour dynamiquement la propriété name de l'objet formData avec la nouvelle valeur value.
    })
  }

  const verifyPassword = (password:string,password_confirm:string): boolean => {
    if(password !== password_confirm){
      alert('Les mots de passe ne correspondent pas');
      return false;
    }else{
      return true;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const checkMotDePasse = verifyPassword(formData.password,formData.password_confirm);
    if(!checkMotDePasse){
      return;
    }

    try {
      const user = await createUser(formData.name,formData.email,formData.password);
      console.log("Utilisateur crée : ", user)
      // Redirige l'utilisateur ou affiche un message de succès
      router.push('/auth/login');
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur", error);
    }

}

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center vh-100">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header text-center">
              <h3>S'inscrire</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Adresse mail </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Confirmer Mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_confirm"
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">S'inscrire</button>
                </form>
                <hr />
                <div className="text-center mt-2">
                  <button

                    className="btn btn-dark w-100 mb-2"

                    onClick={() => router.push('/auth/login')}

                  >
                    Déjà inscrit ? Connectez-vous
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
