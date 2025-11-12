import fetch from "node-fetch";

const payload = {
  tipoUsuario: "PAI_RESPONSAVEL",
  nome: "Teste Cadastro",
  cpf: "11122233344",
  email: "teste.cadastro@exemplo.com",
  telefone: "41999999999",
  senha: "123456",
  cep: "80000000",
  logradouro: "Rua Teste",
  numero: "123",
  bairro: "Centro",
  cidade: "Curitiba",
  estado: "PR"
};

(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log(res.status, res.statusText);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
