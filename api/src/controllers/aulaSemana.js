const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // Criar um novo planejamento
  async create(req, res) {
    try {
      const { diaSemana, atividade, professorId } = req.body;

      // Verifica se o professor existe
      const professorExistente = await prisma.professor.findUnique({
        where: { id: professorId },
      });

      if (!professorExistente) {
        return res.status(404).json({ error: "Professor não encontrado." });
      }

      // Criação do planejamento
      const planejamento = await prisma.planejamento.create({
        data: {
          diaSemana,
          atividade,
          professorId: Number(professorId), // Garante que professorId seja um número
        },
      });

      return res.status(201).json(planejamento);
    } catch (error) {
      console.error("Erro ao criar planejamento:", error);
      return res.status(500).json({ error: "Erro ao criar planejamento" });
    }
  },

  // Listar todos os planejamentos
  async read(req, res) {
    try {
      const planejamentos = await prisma.planejamento.findMany({
        include: {
          professor: true, // Inclui as informações do professor associado
        },
      });
      return res.json(planejamentos);
    } catch (error) {
      console.error("Erro ao listar planejamentos:", error);
      return res.status(500).json({ error: "Erro ao listar planejamentos" });
    }
  },

  // Mostrar um planejamento específico
  async readOne(req, res) {
    try {
      const { id } = req.params;
      const planejamento = await prisma.planejamento.findUnique({
        where: { id: Number(id) },
        include: {
          professor: true, // Inclui as informações do professor associado
        },
      });

      if (!planejamento) {
        return res.status(404).json({ error: "Planejamento não encontrado" });
      }

      return res.json(planejamento);
    } catch (error) {
      console.error("Erro ao buscar planejamento:", error);
      return res.status(500).json({ error: "Erro ao buscar planejamento" });
    }
  },

  // Atualizar um planejamento (ex: professor altera aula)
  async update(req, res) {
    try {
      const { id } = req.params;
      const { diaSemana, atividade } = req.body;

      // Atualização do planejamento
      const atualizado = await prisma.planejamento.update({
        where: { id: Number(id) },
        data: {
          diaSemana,
          atividade,
        },
      });

      return res.json(atualizado);
    } catch (error) {
      console.error("Erro ao atualizar planejamento:", error);
      return res.status(500).json({ error: "Erro ao atualizar planejamento" });
    }
  },

  // Remover um planejamento
  async remove(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o planejamento existe
      const planejamentoExistente = await prisma.planejamento.findUnique({
        where: { id: Number(id) },
      });

      if (!planejamentoExistente) {
        return res.status(404).json({ error: "Planejamento não encontrado" });
      }

      // Remoção do planejamento
      await prisma.planejamento.delete({ where: { id: Number(id) } });

      return res.status(204).send(); // 204 No Content
    } catch (error) {
      console.error("Erro ao remover planejamento:", error);
      return res.status(500).json({ error: "Erro ao remover planejamento" });
    }
  },
};
