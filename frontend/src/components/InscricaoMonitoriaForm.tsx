import { useEffect, useState } from "react";
import { Edital } from "../types/Edital";
import { Candidatura } from "../types/Candidatura";

interface InscricaoMonitoriaFormProps {
  editaisAbertos: Edital[];
  proximoId: number;
  onInscrever: (candidatura: Candidatura) => void;
}

export default function InscricaoMonitoriaForm({
  editaisAbertos,
  proximoId,
  onInscrever,
}: InscricaoMonitoriaFormProps): React.ReactElement {
  const [editalId, setEditalId] = useState<number | "">("");
  const [nomeAluno, setNomeAluno] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [motivacao, setMotivacao] = useState("");
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (editaisAbertos.length > 0 && editalId === "") {
      setEditalId(editaisAbertos[0].id);
    }
  }, [editaisAbertos, editalId]);

  useEffect(() => {
    document.title = nomeAluno
      ? `Inscrição – ${nomeAluno}`
      : "Sistema de Monitorias";

    return () => {
      document.title = "Sistema de Monitorias";
    };
  }, [nomeAluno]);
  
  useEffect(() => {
    if (!enviado) return;

    const timer = setTimeout(() => setEnviado(false), 4000);
    return () => clearTimeout(timer);
  }, [enviado]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editalId === "") return;

    const novaCandidatura: Candidatura = {
      id: proximoId,
      editalId,
      nomeAluno,
      matricula,
      email,
      motivacao,
      dataEnvio: new Date().toISOString(),
    };

    onInscrever(novaCandidatura);
    setEnviado(true);
    setNomeAluno("");
    setMatricula("");
    setEmail("");
    setMotivacao("");
    setEditalId(editaisAbertos[0]?.id ?? "");
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h6 className="mb-0 fw-semibold">
          <i className="bi bi-person-plus-fill me-2"></i>
          Inscrição em Monitoria
        </h6>
      </div>

      <div className="card-body">
        {enviado && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Inscrição enviada com sucesso!
          </div>
        )}

        {editaisAbertos.length === 0 ? (
          <p className="text-muted mb-0">
            Não há editais abertos para inscrição no momento.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label"><strong>Edital</strong></label>
                <select
                  className="form-control"
                  value={editalId}
                  onChange={(e) => setEditalId(Number(e.target.value))}
                  required
                >
                  {editaisAbertos.map((edital) => (
                    <option key={edital.id} value={edital.id}>
                      {edital.disciplina} – {edital.professor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><strong>Nome completo</strong></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Maria Souza"
                  value={nomeAluno}
                  onChange={(e) => setNomeAluno(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label"><strong>Matrícula</strong></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: 2026202194"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label"><strong>E-mail</strong></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Ex: maria.souza@aluno.ifsudestemg.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label"><strong>Motivação</strong></label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Conte rapidamente por que quer ser monitor(a) nesta disciplina"
                  value={motivacao}
                  onChange={(e) => setMotivacao(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              <i className="bi bi-send-fill me-1"></i>
              Enviar Inscrição
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
