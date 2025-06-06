/*eslint-disable*/
import React from "react";
import { useNavigate } from "react-router-dom";
import myImage from "assets/img/pattern_react.png";
import Footer from "components/Footers/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
export default function Index() {
  const navigate = useNavigate(); // Initialiser useNavigate

  // Fonction pour naviguer vers la page Choisir
  const handlePasserTest = (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du lien
    navigate("/choisir"); // Navigue vers la page /choisir
  };
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">

             <h2 className="font-semibold text-4xl text-blueGray-600">
                Gestion du cours basée sur l’IA
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
               Conçue pour les élèves de 1ère, 2ème, 3ème année secondaire 
               ainsi que pour  4ème année , elle offre un accès 
               intelligent, structuré et personnalisé 
               aux cours de physique.
              </p>

              <div className="mt-12">
              <a
                  href="#"
                  onClick={handlePasserTest} // Ajouter l'événement onClick
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  PASSER TEST
                </a>
                
              </div>
            </div>
          </div>
        </div>

        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px"
          src={myImage} alt="Pattern React"
        />
      </section>

      <section className="mt-48 md:mt-40 pb-40 relative bg-blueGray-100">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-100 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                  className="w-full align-middle rounded-t-lg"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block h-95-px -top-94-px"
                  >
                    <polygon
                      points="-30,95 583,95 583,65"
                      className="text-lightBlue-500 fill-current"
                    ></polygon>
                  </svg>

                  <h4 className="text-xl font-bold text-white">
                 Parfait pour votre plateforme d’apprentissage intelligente
                  </h4>

                  <p className="text-md font-light mt-2 text-white">
                    Créer et gérer des cours n’a jamais 
                    été aussi simple grâce à des composants
                     alimentés par l’IA. Des parcours personnalisés 
                     aux évaluations automatisées, vous pouvez facilement 
                     personnaliser et construire des cours qui s’adaptent 
                     aux besoins de chaque apprenant. Améliorez l’engagement, 
                     suivez les progrès et offrez une expérience éducative 
                     fluide avec des outils intelligents conçus
                      pour l’avenir de l’éducation.
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 px-4">
                
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                        <i className="fas fa-drafting-compass"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold">
                       Cours Physiques
                      </h6>
                      <p className="mb-4 text-blueGray-500">
                         Des cours complets de physique pour la 1ère, 2ème, 3ème et le baccalauréat, 
                         conçus pour vous aider  à maîtriser 
                         les concepts clés et réussir vos examens.
                      </p>
                    </div>
                  </div>

                </div>
            
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto overflow-hidden pb-20">
       

          <div className="flex flex-wrap items-center pt-32">
            <div className="w-full md:w-6/12 px-4 mr-auto ml-auto mt-32">
              <div className="justify-center flex flex-wrap relative">
                <div className="justify-center flex flex-wrap relative">
              
                <div className="my-4 w-full lg:w-6/12 px-4">


             

                    <a
                      href="https://mathinfo.tn/physique/p1sc.php"
                    target="_blank"
                  >
                    <div className="bg-red-700 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        alt="..."
                        className="shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white"
                        src="https://cdn-icons-png.flaticon.com/512/1231/1231711.png"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                         Cours 1ère Secondaire 
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://mathinfo.tn/physique/p2sci.php"
                    target="_blank"
                      rel="noopener noreferrer"
                  >
                    <div className="bg-lightBlue-500 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        alt="Cours 2ème année"
                        className="shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white"
                        src="https://cdn-icons-png.flaticon.com/512/2907/2907255.png"
                      />
                      <p className="text-lg text-white mt-4 font-semibold">
                       Cours 2 éme année Secondaire 
                      </p>
                    </div>
                  </a>

                      
          

                  
                </div>
                <a
                    href="https://mathinfo.tn/physique/p3si.php"
                    target="_blank"
                  >
                    <div className="bg-blueGray-700 shadow-lg rounded-lg text-center p-8 mt-8">
                      <img
                        ralt="..."
                        className="shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white"
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                       />
                      <p className="text-lg text-white mt-4 font-semibold">
                        Cours 3 éme année Secondaire 
                      </p>
                    </div>
                  </a>

                <div className="my-4 w-full lg:w-6/12 px-4 lg:mt-16">
                  <a
                    href="https://mathinfo.tn/physique/p4sc.php"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="bg-yellow-500 shadow-lg rounded-lg text-center p-8">
                      <img
                      alt="Cours baccalauréat"
                        className="shadow-md rounded-full max-w-full w-16 mx-auto p-2 bg-white"
                        src="https://cdn-icons-png.flaticon.com/512/4144/4144446.png"
                      />
                       <p className="text-lg text-white mt-4 font-semibold">
                        Cours baccalauréat  
                      </p>
                    </div>
                  </a>
                 
                
                </div>
              </div>
            </div>
                  </div>

            <div className="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
              <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                <i className="fas fa-drafting-compass text-xl"></i>
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">
                Cours Physiques
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                Pour offrir une expérience utilisateur riche
                 et intuitive sur notre plateforme de gestion des cours
                 
                 de physique, nous utilisons des composants dynamiques
                  basés sur JavaScript. Cela permet d’enrichir 
                  les contenus, de simplifier la navigation et d’apporter
                   plus de fonctionnalités aux étudiants comme aux 
                   enseignants.
                  Ces composants facilitent l’accès aux cours, 
                  favorisent les interactions pédagogiques et permettent 
                  un suivi personnalisé des apprenants.
              </p>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
               « Nous avons créé un ensemble de composants
                dynamiques conçus pour vous aider. »
              </p>
              <div className="block pb-6">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Bobines
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  RL et RC
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Le pH des solutions aqueuses
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Les electrolytes
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Loi des mailles
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Interaction magnetique
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  Amorties et non amorties 
                </span>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-white uppercase last:mr-0 mr-2 mt-2">
                  RLC
                </span>
              </div>
            
            </div>
          </div>
        </div>

      

      </section>

   

      <section className="py-20 bg-blueGray-600 overflow-hidden">
        <div className="container mx-auto pb-64">
          <div className="flex flex-wrap justify-center">
            <div className="w-full md:w-5/12 px-12 md:px-4 ml-auto mr-auto md:mt-64">
            
             
            
              
             
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto mt-32 relative">
              <i className="fab fa-github text-blueGray-700 absolute -top-150-px -right-100 left-auto opacity-80 text-55"></i>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-blueGray-200 relative pt-32">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10">
            <div className="w-full text-center lg:w-8/12">
              <p className="text-4xl text-center">
                <span role="img" aria-label="love">
                  😍
                </span>
              </p>
              <h3 className="font-semibold text-3xl">
                 Vous aimez cette plateforme ?
              </h3>
              <p className="text-blueGray-500 text-lg leading-relaxed mt-4 mb-4">
                 Si c’est le cas, elle est à votre 
                 portée dès maintenant. Cliquez sur les boutons ci-dessous
                  pour accéder à la version gratuite et commencer
                   votre prochain projet. Créez une nouvelle application 
                 ou donnez un coup de neuf à un projet existant !
              </p>
            
              <div className="text-center mt-16"></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
