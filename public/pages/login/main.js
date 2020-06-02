import { signInGoogle, signIn } from "./data.js";

export const signInPage = () => {
  const container = document.createElement("div");
  container.classList.add("page-login")
  window.location.href = "#login"
  container.innerHTML = `
    <aside class="aside">
      <section class="container">
        <img src="./assets/logo.png" alt="logo home page">
        <h1>Catarse</h1>
      </section>
    </aside>
    <main class="main">
      <section class="container">
        <form action="" id="form-login" class="form-login">
          <input type="email" id="email" class="form-input" placeholder="Email">
          <input type="password" id="password" class="form-input" placeholder="Password">
          <input type="submit" id="btn-login" class="btn btn-send" "Enviar>
        </form>
        <div class="register-info">
          <button id="login-google" class="btn-login-google"></button>
          <p>Não tem uma conta? <a href="#register">Registre-se</a></p>
        </div>
        </section>
    </main>
  `;
  
  container.querySelector("#btn-login").addEventListener("click", () => {
    const emailInput = container.querySelector("#email").value;
    const passwordInput = container.querySelector("#password").value;
    signIn(emailInput, passwordInput);
  });

  container.querySelector("#login-google").addEventListener("click", () => {
    signInGoogle();
  })

  return container;
};