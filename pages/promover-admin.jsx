import { useState } from "react";
import { useRouter } from "next/router";

export default function PromoverAdmin() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const router = useRouter();

  const promoverUsuario = async (e) => {
    e.preventDefault();
    setMensagem("");

    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMensagem(data.message || "Erro ao promover.");
  };

  const removerAdmin = async () => {
    setMensagem("");

    const res = await fetch("/api/admin/demote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMensagem(data.message || "Erro ao remover.");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <button
        onClick={() => router.push("/")}
        style={{
          float: "right",
          background: "transparent",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <h1>Gerenciar Administradores</h1>

      <form onSubmit={promoverUsuario} style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email do usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}>
          Promover a Admin
        </button>
        <button
          type="button"
          onClick={removerAdmin}
          style={{ padding: "0.5rem 1rem", backgroundColor: "#f44336", color: "#fff" }}
        >
          Retirar Admin
        </button>
      </form>

      {mensagem && <p><strong>{mensagem}</strong></p>}

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => router.push("/")}
          style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
        >
          Voltar à tela inicial
        </button>

        <button
          onClick={() => router.push("/admin")}
          style={{ padding: "0.5rem 1rem" }}
        >
          Ir para painel admin
        </button>
      </div>
    </div>
  );
}
