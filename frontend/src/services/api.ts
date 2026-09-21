import { Edital } from "../types/Edital";

// URL base da API (backend). Pode ser trocada pela variável VITE_API_URL no .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// Formato que a API devolve:
// - datas em ISO ("2026-06-01T00:00:00.000Z")
// - status em maiúsculas
interface EditalApi {
  id: number;
  disciplina: string;
  descricao: string;
  imageUrl: string;
  professor: string;
  curso: string;
  vagas: number;
  dataAbertura: string;
  dataEncerramento: string;
  status: "ABERTO" | "ENCERRADO";
  destaque: boolean;
}

// Converte o formato da API para o formato usado pelos componentes:
// - datas "2026-06-01T00:00:00.000Z" -> "2026-06-01"
function paraEdital(e: EditalApi): Edital {
  return {
    id: e.id,
    disciplina: e.disciplina,
    descricao: e.descricao,
    imageUrl: e.imageUrl,
    professor: e.professor,
    curso: e.curso,
    vagas: e.vagas,
    dataAbertura: e.dataAbertura.slice(0, 10),
    dataEncerramento: e.dataEncerramento.slice(0, 10),
    status: e.status,
    destaque: e.destaque,
  };
}

// GET /api/editais
export async function fetchEditais(): Promise<Edital[]> {
  const resp = await fetch(`${BASE_URL}/api/editais`);
  if (!resp.ok) {
    throw new Error(`Erro HTTP ${resp.status}`);
  }
  const data: EditalApi[] = await resp.json();
  return data.map(paraEdital);
}
