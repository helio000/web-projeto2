document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      descricao: document.getElementById("descricao").value
    };
    const resposta = await fetch("http://localhost:3000/api/formulario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();
    alert(resultado.mensagem);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      descricao: document.getElementById("descricao").value
    };
    const resposta = await fetch("http://localhost:3000/api/formulario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const resultado = await resposta.json();
    alert(resultado.mensagem);
  });
});

