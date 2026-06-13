"use client";

import { useState, useCallback } from "react";

const fontLink = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
  
  html, body {
    margin: 0;
    padding: 0;
    background-color: #0A1128;
    color: #FFF;
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  *, *:before, *::after {
    box-sizing: inherit;
  }
`;

/* ─────────────────────────────────────────
   FASES — texto e respostas do DDC
─────────────────────────────────────────── */
const fases = [
  {
    id: 1,
    titulo: "ETAPA 1: MEDO",
    enigma: "Tentei me esconder do Lobo-Guará em um quarto com guarda-roupas",
    infoExtra: "Deixei alguns vestígios nos lugares que tentei me esconder do Lobo-Guará.",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "SOS",
    corRecompensaHex: "#FF0000",
    corRecompensaNome: "VERMELHO",
  },
  {
    id: 2,
    titulo: "ETAPA 2: REGREDIR PARA DEPOIS AVANÇAR",
    enigma:
      "Tentei fugir, mas não consegui. Então tentei me esconder na piscina. ",
    infoExtra: "Dica: O espectro visível segue uma ordem específica de temperaturas de cor.",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "verde",
    corRecompensaHex: "#1E90FF",
    corRecompensaNome: "AZUL",
  },
  {
    id: 3,
    titulo: "ETAPA 3: NEM TUDO É O QUE PARECE",
    enigma:
      "Último lugar pelo qual passei tinham algumas cadeiras com mesa de centro e uma porta que levava para fora da casa.",
    infoExtra: "Escondi uma mensagem no meio da conversa de algumas pessoas que estavam por aqui.",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "CONTINUE",
    corRecompensaHex: "#ffe920ff",
    corRecompensaNome: "AMARELO",
  },
];


/* ─────────────────────────────────────────
   TELA FINAL (Vitória)
─────────────────────────────────────────── */
function TelaFinal() {
  return (
    <div style={{
      minHeight: "100vh", background: "#050914", width: "100vw",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box"
    }}>
      <div style={{ width: "100%", maxWidth: "26rem", border: "1px solid #FFB800", background: "#0A1128", padding: "2rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.2rem", color: "#FFB800", margin: "0 0 1.5rem 0" }}>⚠️ SEQUÊNCIA ENCONTRADA</h1>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.9rem", color: "#8892B0", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          A sequência de cores foi identificada, mas a cela do Lobo Autor continua trancada. Guarde essa combinação para colocar no sistema principal.
        </p>
        <div style={{ background: "#111A3A", border: "1px solid #1E2A5E", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.7rem", color: "#8892B0", display: "flex", justifyContent: "center" }}>
          <span style={{ color: "#FFB800" }}>COLOQUEM A SEQUÊNCIA DE CORES NO SISTEMA PRINCIPAL</span>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
          {fases.map((f) => (
            <div key={f.id} style={{ width: 24, height: 24, background: f.corRecompensaHex, border: "1px solid #1E2A5E" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CARD DE TRANSIÇÃO (Sucesso)
─────────────────────────────────────────── */
function CardConclusao({ fase, onAvancar, ultima }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(5, 9, 20, 0.9)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 50,
    }}>
      <div style={{
        width: "100%", maxWidth: "22rem", background: "#0A1128", border: "1px solid #FFB800", padding: "2rem 1.5rem", textAlign: "center",
      }}>
        <div style={{ fontSize: "0.7rem", color: "#FFB800", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>
          [✓] SETOR_RESTRITO_LIBERADO
        </div>
        <div style={{ width: 60, height: 60, background: fase.corRecompensaHex, margin: "0 auto 1rem", border: "1px solid #1E2A5E" }} />
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#FFF", margin: "0 0 2rem 0", letterSpacing: "0.1em" }}>
          {fase.corRecompensaNome}
        </p>
        <button onClick={onAvancar} style={{
          width: "100%", padding: "0.85rem", background: "#FFB800", color: "#000", border: "none",
          fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
        }}>
          {ultima ? "COMPLETAR DIÁRIO →" : "PRÓXIMO SETOR →"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TELA DE FASE (Dashboard Principal)
─────────────────────────────────────────── */
function TelaFase({ fase, faseIndex, total, onAvancar }) {
  const [resposta, setResposta]   = useState("");
  const [erro, setErro]           = useState(false);
  const [acerto, setAcerto]       = useState(false);

  const handleEnviar = () => {
    if (resposta.toLowerCase().trim() === fase.respostaCorreta.toLowerCase().trim()) {
      setErro(false);
      setAcerto(true);
    } else {
      setErro(true);
      setAcerto(false);
    }
  };

  const progresso = ((faseIndex - 1) / total) * 100;

  return (
    <>
      <style>{fontLink}</style>
      <style>{`
        @keyframes piscarErro { 
          0%, 100% { background-color: #6B0000; border-color: #9B0000; } 
          50% { background-color: #3B0000; border-color: #6B0000; } 
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#0A1128", color: "#FFF",
        fontFamily: "'JetBrains Mono', monospace", padding: "1.5rem 1rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100vw", boxSizing: "border-box"
      }}>
        <div style={{ width: "100%", maxWidth: "26rem" }}>

          {/* Header Superior Metadados */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.65rem", color: "#8892B0" }}>
            <span>DIÁRIO DE CAÇA // OBSIDIAN PROTOCOL</span>
            <span style={{ color: "#FFB800" }}>{faseIndex}/{total}</span>
          </div>

          {/* Barra de Progresso do Topo */}
          <div style={{ height: 2, background: "#1E2A5E", marginBottom: "1.5rem", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progresso}%`, background: "#FFB800", transition: "width 0.5s ease" }} />
          </div>

          {/* Título da Etapa */}
          <h2 style={{
            fontSize: "1.1rem", fontWeight: 700, color: "#FFF",
            margin: "0 0 0.25rem 0", letterSpacing: "0.02em"
          }}>
            {fase.titulo}
          </h2>
          <p style={{ fontSize: "0.6rem", color: "#8892B0", margin: "0 0 1.25rem 0", letterSpacing: "0.1em" }}>
            SECTOR_0{fase.id}_ESCAPE // ETAPA 0{fase.id}
          </p>

          {/* Bloco de Enigma */}
          <div style={{
            background: "#111A3A", border: "1px solid #1E2A5E",
            padding: "1.25rem", marginBottom: "1.25rem"
          }}>
            <p style={{ fontSize: "0.6rem", color: "#FFB800", margin: "0 0 0.75rem 0", letterSpacing: "0.05em" }}>
              › LOCALIZAÇÃO
            </p>
            <p style={{
              fontFamily: "'Courier Prime', monospace", fontSize: "0.9rem",
              color: "#BCBCBC", lineHeight: 1.6, margin: 0
            }}>
              {fase.enigma}
            </p>
          </div>

          {/* Bloco de Informação Extra */}
          {fase.infoExtra && (
            <div style={{
              background: "#111A3A", border: "1px solid #1E2A5E",
              padding: "1.25rem", marginBottom: "1.25rem"
            }}>
              <p style={{ fontSize: "0.6rem", color: "#FFB800", margin: "0 0 0.75rem 0", letterSpacing: "0.05em" }}>
                › DADOS ADICIONAIS
              </p>
              <p style={{
                fontFamily: "'Courier Prime', monospace", fontSize: "0.9rem",
                color: "#BCBCBC", lineHeight: 1.6, margin: 0
              }}>
                {fase.infoExtra}
              </p>
            </div>
          )}

          {/* Alerta de erro piscando */}
          {erro && (
            <div style={{
              animation: "piscarErro 1s infinite ease-in-out",
              border: "1px solid #9B0000",
              padding: "0.75rem 1rem", marginBottom: "1.25rem",
              display: "flex", alignItems: "center", gap: "0.5rem"
            }}>
              <span style={{ fontSize: "0.75rem", color: "#FFB3B3" }}>⚠️</span>
              <p style={{ fontSize: "0.7rem", color: "#FFB3B3", margin: 0, letterSpacing: "0.05em" }}>
                Sequência Incorreta. Tente Novamente.
              </p>
            </div>
          )}

          {/* Caixa de Entrada e Botão Completamente Retos */}
          <div style={{ background: "#111A3A", border: "1px solid #1E2A5E", padding: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.6rem", color: "#8892B0", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
              › {fase.instrucao.toUpperCase()}
            </label>
            <input
              type="text"
              value={resposta}
              onChange={(e) => { setResposta(e.target.value); if (erro) setErro(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleEnviar(); }}
              placeholder="Sua resposta..."
              autoComplete="off" autoCorrect="off" spellCheck={false}
              style={{
                width: "100%", boxSizing: "border-box", padding: "0.75rem",
                background: "#050914", border: "1px solid #1E2A5E",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#FFF",
                outline: "none", marginBottom: "0.75rem"
              }}
            />
            <button onClick={handleEnviar} style={{
              width: "100%", padding: "0.8rem", background: "#FFB800", color: "#000",
              border: "none", fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer"
            }}>
              ENVIAR PISTA
            </button>
          </div>

        </div>
      </div>

      {acerto && (
        <CardConclusao
          fase={fase}
          onAvancar={() => { setResposta(""); setErro(false); setAcerto(false); onAvancar(); }}
          ultima={faseIndex === total}
        />
      )}
    </>
  );
}


/* ─────────────────────────────────────────
   COMPONENTE RAIZ
─────────────────────────────────────────── */
export default function EscapeRoom() {
  const [estado, setEstado] = useState(0);

  const handleAvancar = useCallback(() => {
    setEstado((prev) => {
      if (typeof prev === "number" && prev < fases.length - 1) return prev + 1;
      return "fim";
    });
  }, []);
  if (estado === "fim") {
    return <TelaFinal />;
  }

  return (
    <TelaFase
      key={fases[estado].id}
      fase={fases[estado]}
      faseIndex={estado + 1}
      total={fases.length}
      onAvancar={handleAvancar}
    />
  );
}
