import React, { useRef, useState } from "react";
import axios from "axios";
import "./Home.css";
import Picture348w from "./Images/profile-image-desktop.png";
import Picture646w from "./Images/profile-image-tablet.jpg";
import Picture890w from "./Images/profile-image-mobile.png";
import Ring from "./Images/design.svg";
import Circle from "./Images/Oval1.svg";
import AnimalDesign from "./Images/Dog_sales.jpg";
import SquidGame from "./Images/Squid_game.jpg";
import Invalid from "./Images/icon-invalid.svg";

const Home = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const form = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const sendEmail = (e) => {
      e.preventDefault();
  
      // const formData = {
      //   name: document.getElementById("name").value,
      //   email: document.getElementById("email").value,
      //   message: document.getElementById("message").value,
      // };


      const { name, email, message } = formData;
  
      // Adjust this URL based on your environment
      // const apiUrl =  "https://jegsfolio-backend.vercel.app/send";
      const apiUrl = process.env.NODE_ENV === 'production'
      ? "https://jegsfolio-backend.vercel.app/send"
      : "http://localhost:5000/send";

      axios
      .post(apiUrl, { name, email, message })
      .then((response) => {
        if (response.data.success) {
          alert("Email sent successfully!");
          form.current.reset(); // Clear the form fields
          setFormData({ name: '', email: '', message: '' }); // Reset the formData state
        } else {
          alert("Oops! That didn't go through.");
        }
      })
      .catch((error) => {
        console.error("There was an error sending the email!", error);
        alert("Oops! That didn't go through.");
      });
  };
  
  return (
    <div>
      <header className="header">
        <h2 className="visually_hidden">Header</h2>
        <div className="wrapper">
          <nav className="header_nav">
            <a href="/" className="header_home">
              jegshaddy
              <span className="visually_hidden">{"{to home page}"}</span>
            </a>

            <a href="https://github.com/Jegedeglory" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialGithub"
                role="img"
              >
                <title id="socialGithub">Github</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M12.304 0C5.506 0 0 5.506 0 12.304c0 5.444 3.522 10.042 8.413 11.672.615.108.845-.261.845-.584 0-.292-.015-1.261-.015-2.291-3.091.569-3.891-.754-4.137-1.446-.138-.354-.738-1.446-1.261-1.738-.43-.23-1.046-.8-.016-.815.97-.015 1.661.892 1.892 1.261 1.107 1.86 2.876 1.338 3.584 1.015.107-.8.43-1.338.784-1.646-2.738-.307-5.598-1.368-5.598-6.074 0-1.338.477-2.446 1.26-3.307-.122-.308-.553-1.569.124-3.26 0 0 1.03-.323 3.383 1.26.985-.276 2.03-.415 3.076-.415 1.046 0 2.092.139 3.076.416 2.353-1.6 3.384-1.261 3.384-1.261.676 1.691.246 2.952.123 3.26.784.861 1.26 1.953 1.26 3.307 0 4.721-2.875 5.767-5.613 6.074.446.385.83 1.123.83 2.277 0 1.645-.015 2.968-.015 3.383 0 .323.231.708.846.584a12.324 12.324 0 0 0 8.382-11.672C24.607 5.506 19.101 0 12.304 0Z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jegedeglory"
              className="header_social"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialLinkedIn"
                role="img"
              >
                <title id="socialLinkedIn">LinkedIn</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M5.551 3.304c-1.14 0-2.067.926-2.067 2.064 0 1.14.928 2.066 2.067 2.066a2.066 2.066 0 0 0 0-4.13ZM3.767 8.998v11.453h3.562L7.33 8.998H3.767Zm5.798 0V20.45l3.554.002.002-5.668c0-1.454.253-2.941 2.132-2.941 1.851 0 1.851 1.755 1.851 3.036v5.571l3.559-.001v-6.28c0-2.834-.517-5.457-4.27-5.457-1.763 0-2.916.997-3.368 1.85h-.05V8.997h-3.41ZM22.435 24H1.982c-.976 0-1.77-.777-1.77-1.732V1.731C.212.776 1.006 0 1.982 0h20.453c.98 0 1.777.776 1.777 1.73v20.538c0 .955-.797 1.732-1.777 1.732Z"
                />
              </svg>
            </a>
            <a href="https://x.com/jegshady" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                aria-labelledby="socialTwitter"
                role="img"
              >
                <title id="socialTwitter"> Twitter</title>
                <path
                  fill="#FFF"
                  d="M23.492 2.705a9.563 9.563 0 0 1-2.742.751 4.788 4.788 0 0 0 2.1-2.643 9.536 9.536 0 0 1-3.033 1.159 4.778 4.778 0 0 0-8.14 4.357 13.564 13.564 0 0 1-9.844-4.99 4.774 4.774 0 0 0-.646 2.4 4.778 4.778 0 0 0 2.124 3.977 4.765 4.765 0 0 1-2.163-.598v.061a4.778 4.778 0 0 0 3.832 4.684 4.812 4.812 0 0 1-2.158.082 4.78 4.78 0 0 0 4.462 3.316 9.584 9.584 0 0 1-5.932 2.045c-.38 0-.762-.022-1.14-.067a13.508 13.508 0 0 0 7.32 2.146c8.787 0 13.59-7.277 13.59-13.589 0-.205-.004-.412-.013-.617a9.71 9.71 0 0 0 2.381-2.471l.002-.003Z"
                />
              </svg>
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="wrapper  hero_wrapper bottom_border">
            <div className="hero_content">
              <picture>
                <source media="(min-width: 62.5em)" srcset={Picture348w} />
                <source media="(min-width: 37.5em)" srcset={Picture646w} />
                <img
                  src={Picture890w}
                  className="hero_image"
                  alt=""
                  width={174}
                  height={383}
                />
              </picture>
              <img
                src={Ring}
                alt=""
                width={530}
                height={129}
                className="hero_rings"
              />
              <img
                src={Circle}
                alt=""
                width={129}
                height={129}
                className="hero_circle"
              />
              <div className="hero_text">
                <h1 className="hero_headline header_xl">
                  Welcome on board!
                  <br /> I'm <span>Jegede Glory</span>
                </h1>
                <p className="hero_description">
                  Based in Nigeria, I'm a Software developer, aspiring to build
                  & learn new things about the web that users love
                </p>
                <a
                  href="https://wa.link/slcgup"
                  className="hero_contact underline"
                >
                  {" "}
                  Contact me
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="skills">
          <h2 className="visually_hidden">Skills</h2>
          <h2 className="projects_headline header_xl wrapper">Tech Stacks</h2>
          <div className="wrapper skills_wrapper bottom_border">
<p align="center" style={{display: "inline-flex", gap: "20px"}}> 
  <a href="https://www.figma.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/figma/figma-icon.svg" alt="figma" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> 
    <img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" alt="nextjs" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://sass-lang.com" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg" alt="sass" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <br />
</p>


{/* <div>

            <div className="skills_item">
              <h3 className="skills_title">HTML</h3>
              <p className="skills_description">2 years experience</p>
            </div>
            <div className="skills_item">
              <h3 className="skills_title">CSS</h3>
              <p className="skills_description">2 years experience</p>
            </div>
            <div className="skills_item">
              <h3 className="skills_title">Javascript</h3>
              <p className="skills_description">2 years experience</p>
            </div>
            <div className="skills_item">
              <h3 className="skills_title">React JS</h3>
              <p className="skills_description">2 years experience</p>
            </div>
            <div className="skills_item">
              <h3 className="skills_title">Typescript</h3>
              <p className="skills_description">1 year experience</p>
            </div>
            <div className="skills_item">
              <h3 className="skills_title">Express JS</h3>
              <p className="skills_description">1 year experience</p>
            </div>
          </div> */}
</div>
          <img
            src={Ring}
            alt=""
            width={530}
            height={129}
            className="skills_rings"
          />
        </section>
        <section className="projects">
          <div className="wrapper projects_wrapper">
            <div className="projects_grid">
              <h2 className="projects_headline header_xl">Projects</h2>
              <a
                href="https://wa.link/slcgup"
                className="projects_contact underline"
              >
                {" "}
                Contact me
              </a>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={AnimalDesign} />
                  <img
                    src={AnimalDesign}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">Pet rescue</h3>
                <p className="project_tags">
                  <span>HTML</span>
                  <span>CSS</span>
                </p>
                <div className="projects_links">
                  <a href="/" className="underline">
                    View Project
                  </a>
                  <a href="/" className="underline">
                    View Code
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={SquidGame} />
                  <img
                    src={SquidGame}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">Squid game</h3>
                <p className="project_tags">
                  <span>HTML</span>
                  <span>CSS</span>
                </p>
                <div className="projects_links">
                  <a href="/" className="underline">
                    View Project
                  </a>
                  <a href="/" className="underline">
                    View code
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="contact bg_less_dark">
          <div className="wrapper contact_wrapper bottom_border">
            <div className="contact_text">
              <h2 className="contact_headline header_xl">Contact</h2>
              <p className="contact_description">
                I would really love to hear about your project and how I can be
                of help. Please, feel free to enlighten me about it and I will
                get back to you as soon as possible.
              </p>
            </div>
            <form
              action=""
              ref={form}
              onSubmit={sendEmail}
              className="contact_form"
            >
              <div className="contact_control">
                <label htmlFor="name" className="visually_hidden">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  name="name"
                  required
                />
                <img
                  src={Invalid}
                  alt=""
                  className="contact_invalid_icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="contact_control">
                <label htmlFor="email" className="visually_hidden">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  name="email"
                  required
                />
                <img
                  src={Invalid}
                  alt=""
                  className="contact_invalid_icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="contact_control">
                <label htmlFor="message" className="visually_hidden">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Message"
                  cols={30}
                  rows={3}
                  required
                ></textarea>
                <img
                  src={Invalid}
                  alt=""
                  className="contact_invalid_icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="contact_control align_right">
                <button type="submit">Send Message</button>
              </div>
            </form>
          </div>
          <img
            src={Ring}
            alt=""
            width={530}
            height={129}
            className="contact_rings"
          />
        </section>
      </main>
      <footer className="footer bg_less_dark">
        <h2 className="visually_hidden">Footer</h2>
        <div className="wrapper">
          <nav className="header_nav">
            <a href="/" className="header_home">
              jegshaddy
              <span className="visually_hidden">{"{to home page}"}</span>
            </a>

            <a href="https://github.com/Jegedeglory" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialGithub"
                role="img"
              >
                <title id="socialGithub">Github</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M12.304 0C5.506 0 0 5.506 0 12.304c0 5.444 3.522 10.042 8.413 11.672.615.108.845-.261.845-.584 0-.292-.015-1.261-.015-2.291-3.091.569-3.891-.754-4.137-1.446-.138-.354-.738-1.446-1.261-1.738-.43-.23-1.046-.8-.016-.815.97-.015 1.661.892 1.892 1.261 1.107 1.86 2.876 1.338 3.584 1.015.107-.8.43-1.338.784-1.646-2.738-.307-5.598-1.368-5.598-6.074 0-1.338.477-2.446 1.26-3.307-.122-.308-.553-1.569.124-3.26 0 0 1.03-.323 3.383 1.26.985-.276 2.03-.415 3.076-.415 1.046 0 2.092.139 3.076.416 2.353-1.6 3.384-1.261 3.384-1.261.676 1.691.246 2.952.123 3.26.784.861 1.26 1.953 1.26 3.307 0 4.721-2.875 5.767-5.613 6.074.446.385.83 1.123.83 2.277 0 1.645-.015 2.968-.015 3.383 0 .323.231.708.846.584a12.324 12.324 0 0 0 8.382-11.672C24.607 5.506 19.101 0 12.304 0Z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jegedeglory"
              className="header_social"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialLinkedIn"
                role="img"
              >
                <title id="socialLinkedIn">LinkedIn</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M5.551 3.304c-1.14 0-2.067.926-2.067 2.064 0 1.14.928 2.066 2.067 2.066a2.066 2.066 0 0 0 0-4.13ZM3.767 8.998v11.453h3.562L7.33 8.998H3.767Zm5.798 0V20.45l3.554.002.002-5.668c0-1.454.253-2.941 2.132-2.941 1.851 0 1.851 1.755 1.851 3.036v5.571l3.559-.001v-6.28c0-2.834-.517-5.457-4.27-5.457-1.763 0-2.916.997-3.368 1.85h-.05V8.997h-3.41ZM22.435 24H1.982c-.976 0-1.77-.777-1.77-1.732V1.731C.212.776 1.006 0 1.982 0h20.453c.98 0 1.777.776 1.777 1.73v20.538c0 .955-.797 1.732-1.777 1.732Z"
                />
              </svg>
            </a>
            <a href="https://x.com/jegshady" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                aria-labelledby="socialTwitter"
                role="img"
              >
                <title id="socialTwitter"> Twitter</title>
                <path
                  fill="#FFF"
                  d="M23.492 2.705a9.563 9.563 0 0 1-2.742.751 4.788 4.788 0 0 0 2.1-2.643 9.536 9.536 0 0 1-3.033 1.159 4.778 4.778 0 0 0-8.14 4.357 13.564 13.564 0 0 1-9.844-4.99 4.774 4.774 0 0 0-.646 2.4 4.778 4.778 0 0 0 2.124 3.977 4.765 4.765 0 0 1-2.163-.598v.061a4.778 4.778 0 0 0 3.832 4.684 4.812 4.812 0 0 1-2.158.082 4.78 4.78 0 0 0 4.462 3.316 9.584 9.584 0 0 1-5.932 2.045c-.38 0-.762-.022-1.14-.067a13.508 13.508 0 0 0 7.32 2.146c8.787 0 13.59-7.277 13.59-13.589 0-.205-.004-.412-.013-.617a9.71 9.71 0 0 0 2.381-2.471l.002-.003Z"
                />
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;
