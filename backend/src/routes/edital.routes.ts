import { Router } from "express";
import {
  listarEditais,
  buscarEditalPorId,
  criarEdital,
  atualizarEdital,
  removerEdital,
} from "../controllers/edital.controller";

const router = Router();

router.get("/editais", listarEditais);
router.get("/editais/:id", buscarEditalPorId);
router.post("/editais", criarEdital);
router.put("/editais/:id", atualizarEdital);
router.delete("/editais/:id", removerEdital);

export default router;
