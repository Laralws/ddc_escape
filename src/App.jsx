"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────
   CONFIGURAÇÃO GLOBAL DO TIMER (18 minutos)
─────────────────────────────────────────── */
const TEMPO_TOTAL_SEGUNDOS = 18 * 60; 

const fontLink = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
  
  html, body {
    margin: 0;
    padding: 0;
    background-color: #121212;
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
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "SOS",
    corRecompensaHex: "#FF0000",
    corRecompensaNome: "VERMELHO",
  },
  {
    id: 2,
    titulo: "ETAPA 2: A PISTA NO AR",
    enigma:
      "Nas frequências criptografadas do DDC, um analista captou uma transmissão codificada. A mensagem dizia: 'Procure o elemento que aparece quando a luz encontra a chuva — não o arco-íris inteiro, apenas a cor que está sempre no centro, entre o quente e o frio.' Qual é essa cor?",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "verde",
    corRecompensaHex: "#00FF88",
    corRecompensaNome: "VERDE CIANO",
  },
  {
    id: 3,
    titulo: "ETAPA 3: O ARQUIVO PROIBIDO",
    enigma:
      "No servidor offline do DDC, um arquivo protegido foi encontrado. A senha era um conceito: 'a cor do perigo, do alerta máximo, do sangue que corre quando a truth é revelada.' Apenas uma palavra abre esse arquivo. Qual cor é essa?",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "vermelho",
    corRecompensaHex: "#FF2020",
    corRecompensaNome: "VERMELHO",
  },
  {
    id: 4,
    titulo: "ETAPA 4: A IDENTIDADE OCULTA",
    enigma:
      "A fonte anônima deixou um bilhete: 'Sou a cor do céu antes da tempestade, da frieza das telas e dos sistemas que nunca dormem. Encontre-me no monitor aceso às 3h da manhã.' Qual é a minha cor?",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "azul",
    corRecompensaHex: "#1E90FF",
    corRecompensaNome: "AZUL",
  },
  {
    id: 5,
    titulo: "ETAPA 5: O PROTOCOLO FINAL",
    enigma:
      "O Diário de Caça chegou ao fim — ou ao início? O código final estava escondido na edição impressa, na tinta que preenche cada página, no tom que une todas as pistas anteriores numa única sombra. A cor que tudo absorve e nada reflete. Qual cor é essa?",
    instrucao: "Insira aqui sua resposta",
    respostaCorreta: "preto",
    corRecompensaHex: "#8B5CF6",
    corRecompensaNome: "VIOLETA",
  },
];

function formatarTempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─────────────────────────────────────────
   CRONÔMETRO — CENTRALIZADO E GRANDE
─────────────────────────────────────────── */
function Cronometro({ tempoRestante }) {
  const critico = tempoRestante <= 60;
  const cor = critico ? "#FF3B3B" : "#D1FFC2"; 

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      width: "100%",
      margin: "0.5rem 0 1.5rem 0"
    }}>
      <div style={{
        background: "#0F0F0F",
        border: "2px solid #222",
        padding: "0.6rem 2.5rem",
        display: "inline-block",
        position: "relative",
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.8)"
      }}>
        <span style={{ position: "absolute", top: 4, left: 4, width: 3, height: 3, background: "#333" }} />
        <span style={{ position: "absolute", top: 4, right: 4, width: 3, height: 3, background: "#333" }} />
        <span style={{ position: "absolute", bottom: 4, left: 4, width: 3, height: 3, background: "#333" }} />
        <span style={{ position: "absolute", bottom: 4, right: 4, width: 3, height: 3, background: "#333" }} />

        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "2.4rem",
          fontWeight: "700",
          color: cor,
          margin: 0,
          letterSpacing: "0.05em",
          lineHeight: 1,
          textShadow: critico ? "0 0 10px rgba(255,59,59,0.5)" : "0 0 12px rgba(41,255,20,0.4)"
        }}>
          {formatarTempo(tempoRestante)}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TELA: TEMPO ESGOTADO
─────────────────────────────────────────── */
function TelaTimeOut({ onReiniciar }) {
  return (
    <>
      <style>{fontLink}</style>
      <div style={{
        minHeight: "100vh", background: "#0A0A0A", width: "100vw",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box"
      }}>
        <div style={{ width: "100%", maxWidth: "26rem", border: "1px solid #6B0000", background: "#121212", padding: "2rem 1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.2rem", color: "#FF2020", margin: "0 0 1rem 0" }}>⚠️ PROTOCOLO FALHOU</h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.9rem", color: "#666", lineHeight: 1.6, marginBottom: "2rem" }}>
            O tempo limite expirou. O sistema limpou os logs do Diário de Caça e bloqueou este terminal.
          </p>
          <button onClick={onReiniciar} style={{
            width: "100%", padding: "0.85rem", background: "transparent", color: "#FF2020", border: "1px solid #6B0000",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
          }}> REINICIAR TERMINAL </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   TELA FINAL (Vitória)
─────────────────────────────────────────── */
function TelaFinal({ tempoRestante, total }) {
  const tempoUsado = total - tempoRestante;
  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0A", width: "100vw",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box"
    }}>
      <div style={{ width: "100%", maxWidth: "26rem", border: "1px solid #29FF14", background: "#121212", padding: "2rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.2rem", color: "#29FF14", margin: "0 0 1.5rem 0" }}>🔓 ACESSO CONCEDIDO</h1>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.9rem", color: "#888", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          A sequência criptográfica do Diário de Caça foi estabilizada. O isolamento do Setor 07 foi levantado com sucesso.
        </p>
        <div style={{ background: "#161616", border: "1px solid #2E2E2E", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.7rem", color: "#555", display: "flex", justifyContent: "space-between" }}>
          <span>TEMPO ATIVO: {formatarTempo(tempoUsado)}</span>
          <span style={{ color: "#29FF14" }}>SINCRONIZADO</span>
        </div>
        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
          {fases.map((f) => (
            <div key={f.id} style={{ width: 24, height: 24, background: f.corRecompensaHex, border: "1px solid #222" }} />
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
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", zIndex: 50,
    }}>
      <div style={{
        width: "100%", maxWidth: "22rem", background: "#121212", border: "1px solid #29FF14", padding: "2rem 1.5rem", textAlign: "center",
      }}>
        <div style={{ fontSize: "0.7rem", color: "#29FF14", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>
          [✓] SETOR_RESTRITO_LIBERADO
        </div>
        <div style={{ width: 60, height: 60, background: fase.corRecompensaHex, margin: "0 auto 1rem", border: "1px solid #222" }} />
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#FFF", margin: "0 0 2rem 0", letterSpacing: "0.1em" }}>
          {fase.corRecompensaNome}
        </p>
        <button onClick={onAvancar} style={{
          width: "100%", padding: "0.85rem", background: "#29FF14", color: "#000", border: "none",
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
function TelaFase({ fase, faseIndex, total, onAvancar, tempoRestante, totalTempo }) {
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
        minHeight: "100vh", background: "#121212", color: "#FFF",
        fontFamily: "'JetBrains Mono', monospace", padding: "1.5rem 1rem",
        display: "flex", flexDirection: "column", alignItems: "center",
        width: "100vw", boxSizing: "border-box"
      }}>
        <div style={{ width: "100%", maxWidth: "26rem" }}>

          {/* Header Superior Metadados */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", fontSize: "0.65rem", color: "#444" }}>
            <span>DIÁRIO DE CAÇA // OBSIDIAN PROTOCOL</span>
            <span style={{ color: "#29FF14" }}>{faseIndex}/{total}</span>
          </div>

          {/* Barra de Progresso do Topo */}
          <div style={{ height: 2, background: "#2A2A2A", marginBottom: "1.5rem", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progresso}%`, background: "#29FF14", transition: "width 0.5s ease" }} />
          </div>

          {/* Cronômetro Centralizado e Grande */}
          <Cronometro tempoRestante={tempoRestante} total={totalTempo} />

          {/* Título da Etapa */}
          <h2 style={{
            fontSize: "1.1rem", fontWeight: 700, color: "#FFF",
            margin: "0 0 0.25rem 0", letterSpacing: "0.02em"
          }}>
            {fase.titulo}
          </h2>
          <p style={{ fontSize: "0.6rem", color: "#444", margin: "0 0 1.25rem 0", letterSpacing: "0.1em" }}>
            SECTOR_0{fase.id}_ESCAPE // ETAPA 0{fase.id}
          </p>

          {/* Bloco de Enigma */}
          <div style={{
            background: "#161616", border: "1px solid #2E2E2E",
            padding: "1.25rem", marginBottom: "1.25rem"
          }}>
            <p style={{ fontSize: "0.6rem", color: "#29FF14", margin: "0 0 0.75rem 0", letterSpacing: "0.05em" }}>
              › TRANSMISSÃO INTERCEPTADA
            </p>
            <p style={{
              fontFamily: "'Courier Prime', monospace", fontSize: "0.9rem",
              color: "#BCBCBC", lineHeight: 1.6, margin: 0
            }}>
              {fase.enigma}
            </p>
          </div>

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
          <div style={{ background: "#161616", border: "1px solid #2E2E2E", padding: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.6rem", color: "#444", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
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
                background: "#0F0F0F", border: "1px solid #2E2E2E",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#FFF",
                outline: "none", marginBottom: "0.75rem"
              }}
            />
            <button onClick={handleEnviar} style={{
              width: "100%", padding: "0.8rem", background: "#29FF14", color: "#000",
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
   TELA DE INTRODUÇÃO (A Carta)
─────────────────────────────────────────── */
function TelaIntro({ onIniciar }) {
  return (
    <>
      <style>{fontLink}</style>
      <div style={{
        minHeight: "100vh", background: "#121212", color: "#FFF", width: "100vw",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "1.5rem", fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box"
      }}>
        <div style={{ width: "100%", maxWidth: "24rem", border: "1px solid #2E2E2E", background: "#161616", padding: "1.75rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#29FF14", marginBottom: "1rem" }}>
            // PROTOCOLO_OBSIDIAN.SYS
          </div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1rem 0", letterSpacing: "0.05em" }}>
            DIÁRIO DE CAÇA
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.88rem", color: "#888", lineHeight: 1.7, margin: "0 0 1.5rem 0" }}>
            Se você está lendo isso, o system foi comprometido. Não temos muito tempo. Eles já detectaram o vazamento de dados. 
            Decifre as 5 credenciais fragmentadas nas páginas do jornal antes que eles nos desliguem.
          </p>
          <div style={{ fontSize: "0.7rem", color: "#FFB800", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>
            ⏱️ JANELA DE TEMPO EXTREMA: {formatarTempo(TEMPO_TOTAL_SEGUNDOS)} MINUTOS
          </div>
          <button onClick={onIniciar} style={{
            width: "100%", padding: "0.85rem", background: "transparent", color: "#29FF14", border: "1px solid #29FF14",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer"
          }}>
            INICIAR DESAFIO →
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   COMPONENTE RAIZ
─────────────────────────────────────────── */
export default function EscapeRoom() {
  const [estado, setEstado]               = useState(null);
  const [tempoRestante, setTempoRestante] = useState(TEMPO_TOTAL_SEGUNDOS);
  const [tempoFinal, setTempoFinal]       = useState(null); 
  const timerRef                          = useRef(null);

  const pararTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof estado !== "number") return;

    timerRef.current = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          pararTimer();
          setEstado("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => pararTimer();
  }, [estado, pararTimer]);

  const handleIniciar = () => {
    setTempoRestante(TEMPO_TOTAL_SEGUNDOS);
    setTempoFinal(null);
    setEstado(0);
  };

  const handleReiniciar = () => {
    pararTimer();
    setTempoRestante(TEMPO_TOTAL_SEGUNDOS);
    setTempoFinal(null);
    setEstado(null);
  };

  const handleAvancar = useCallback(() => {
    setEstado((prev) => {
      if (typeof prev === "number" && prev < fases.length - 1) return prev + 1;
      pararTimer();
      return "fim";
    });
  }, [pararTimer]);

  useEffect(() => {
    if (estado === "fim" && tempoFinal === null) {
      setTempoFinal(tempoRestante);
    }
  }, [estado, tempoRestante, tempoFinal]);

  if (estado === null)      return <TelaIntro onIniciar={handleIniciar} />;
  if (estado === "timeout") return <TelaTimeOut onReiniciar={handleReiniciar} />;
  if (estado === "fim") {
    return <TelaFinal tempoRestante={tempoFinal ?? tempoRestante} total={TEMPO_TOTAL_SEGUNDOS} />;
  }

  return (
    <TelaFase
      key={fases[estado].id}
      fase={fases[estado]}
      faseIndex={estado + 1}
      total={fases.length}
      onAvancar={handleAvancar}
      tempoRestante={tempoRestante}
      totalTempo={TEMPO_TOTAL_SEGUNDOS}
    />
  );
}