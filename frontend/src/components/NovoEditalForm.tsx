import { useState } from "react";
import { Edital } from "../types/Edital";

interface NovoEditalFormProps {
  onAdicionar: (edital: Edital) => void;
  proximoId: number;
}

// Imagem usada quando o usuário não informa outra (arquivo em public/images/)
const IMAGEM_PADRAO = "/images/padrao.png";

export default function NovoEditalForm({ onAdicionar, proximoId }: NovoEditalFormProps): React.ReactElement {
  const [aberto, setAberto] = useState(false);
  const [disciplina, setDisciplina] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imageUrl, setImageUrl] = useState(IMAGEM_PADRAO);
  const [professor, setProfessor] = useState("");
  const [curso, setCurso] = useState("");
  const [vagas, setVagas] = useState(1);
  const [dataAbertura, setDataAbertura] = useState("");
  const [dataEncerramento, setDataEncerramento] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const novoEdital: Edital = {
      id: proximoId,
      disciplina,
      descricao,
      imageUrl,
      professor,
      curso,
      vagas,
      dataAbertura,
      dataEncerramento,
      status: "ABERTO",
    };

    onAdicionar(novoEdital);
    setAberto(false);
    setDisciplina("");
    setDescricao("");
    setImageUrl(IMAGEM_PADRAO);
    setProfessor("");
    setCurso("");
    setVagas(1);
    setDataAbertura("");
    setDataEncerramento("");
  }

  if (!aberto) {
    return (
      <button className="btn btn-success mb-4" onClick={() => setAberto(true)}>
        <i className="bi bi-plus-circle-fill me-1"></i>
        Novo Edital
      </button>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body bg-success-subtle">
        <div className="mb-3 card-header bg-success text-white d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-plus-circle me-2"></i>Cadastrar Novo Edital
          </h6>
          <button
            className="btn btn-sm btn-close btn-close-white"
            onClick={() => setAberto(false)}
            aria-label="Fechar formulário"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label"><strong>Disciplina</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Programação Web"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Descrição</strong></label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Ex: Edital de monitoria da disciplina de Programação Web."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>URL da Imagem</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: /images/programacao-web.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Professor</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Prof. João Silva"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Curso</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Ex: Sistemas de Informação"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Vagas</strong></label>
            <input
              type="number"
              className="form-control"
              min={1}
              max={10}
              value={vagas}
              onChange={(e) => setVagas(Number(e.target.value))}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Data de Abertura</strong></label>
            <input
              type="date"
              className="form-control"
              value={dataAbertura}
              onChange={(e) => setDataAbertura(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label"><strong>Data de Encerramento</strong></label>
            <input
              type="date"
              className="form-control"
              value={dataEncerramento}
              onChange={(e) => setDataEncerramento(e.target.value)}
              required
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-lg me-1"></i>
              Publicar Edital
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setAberto(false)}>
              <i className="bi bi-x-lg me-1"></i>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
