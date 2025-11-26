const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  // Criar um novo planejamento
  async create(req, res) {
    try {
      const { diaSemana, atividade, professorId } = req.body;

      // Verifica se os dados necessários estão presentes
      if (!diaSemana || !atividade || !professorId) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
      }

      // Verifica se o professorId é válido
      const professorExistente = await prisma.professor.findUnique({
        where: { id: Number(professorId) },
      });

      if (!professorExistente) {
        return res.status(404).json({ error: "Professor não encontrado!" });
      }

      // Cria o planejamento
      const novo = await prisma.planejamento.create({
        data: {
          diaSemana,
          atividade,
          professorId: Number(professorId),
          data: new Date(), // Adiciona a data atual do planejamento
        },
        include: {
          professor: {
            select: { nome: true, arteMarcial: true }, // Inclui o nome e arte marcial do professor
          },
        },
      });

      return res.status(201).json(novo); // Retorna o planejamento criado com status 201
    } catch (error) {
      console.error("Erro ao criar planejamento:", error);
      return res.status(500).json({ error: "Erro ao criar planejamento" });
    }
  },

  // Listar todos os planejamentos
  async read(req, res) {
    try {
      const planejamentos = await prisma.planejamento.findMany({
        include: { professor: true }, // Inclui informações do professor
      });
      return res.status(200).json(planejamentos); // Retorna todos os planejamentos com status 200
    } catch (error) {
      console.error("Erro ao listar planejamentos:", error);
      return res.status(500).json({ error: "Erro ao listar planejamentos" });
    }
  },

  // Atualizar um planejamento
  async update(req, res) {
    try {
      const { id } = req.params;
      const { diaSemana, atividade } = req.body;

      // Verifica se os dados necessários estão presentes
      if (!diaSemana || !atividade) {
        return res.status(400).json({ error: "Dia da semana e atividade são obrigatórios!" });
      }

      // Verifica se o planejamento existe
      const planejamentoExistente = await prisma.planejamento.findUnique({
        where: { id: Number(id) },
      });

      if (!planejamentoExistente) {
        return res.status(404).json({ error: "Planejamento não encontrado!" });
      }

      // Atualiza o planejamento
      const atualizado = await prisma.planejamento.update({
        where: { id: Number(id) },
        data: { diaSemana, atividade },
        include: {
          professor: {
            select: { nome: true, arteMarcial: true }, // Inclui informações do professor
          },
        },
      });

      return res.status(200).json(atualizado); // Retorna o planejamento atualizado com status 200
    } catch (error) {
      console.error("Erro ao atualizar planejamento:", error);
      return res.status(500).json({ error: "Erro ao atualizar planejamento" });
    }
  },

  // Excluir um planejamento
  async remove(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o planejamento existe
      const planejamentoExistente = await prisma.planejamento.findUnique({
        where: { id: Number(id) },
      });

      if (!planejamentoExistente) {
        return res.status(404).json({ error: "Planejamento não encontrado!" });
      }

      // Exclui o planejamento
      await prisma.planejamento.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ message: "Planejamento excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir planejamento:", error);
      return res.status(500).json({ error: "Erro ao excluir planejamento" });
    }
  },
};
