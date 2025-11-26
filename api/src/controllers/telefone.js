const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar telefone
const create = async (req, res) => {
  try {
    const { numero, tipo, alunoId } = req.body;

    // Verifica se os dados obrigatórios estão presentes
    if (!numero || !tipo || !alunoId) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Valida o formato do número de telefone (Exemplo: no formato (XX) XXXXX-XXXX)
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(numero)) {
      return res.status(400).json({ error: "Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX." });
    }

    // Criação do telefone no banco de dados
    const telefone = await prisma.telefone.create({
      data: {
        numero: numero.trim(),
        tipo: tipo.trim(),
        alunoId: alunoId,
      },
    });

    res.status(201).json(telefone);  // Retorna o telefone criado
  } catch (error) {
    console.error("Erro ao criar telefone:", error);
    res.status(500).json({ error: `Erro interno ao criar telefone: ${error.message}` });
  }
};

// Listar todos os telefones
const read = async (req, res) => {
  try {
    const telefones = await prisma.telefone.findMany();
    res.status(200).json(telefones);
  } catch (error) {
    console.error("Erro ao buscar telefones:", error);
    res.status(500).json({ error: `Erro interno ao buscar telefones: ${error.message}` });
  }
};

// Buscar telefone por ID
const readOne = async (req, res) => {
  const { id } = req.params;
  try {
    const telefone = await prisma.telefone.findUnique({
      where: { id: Number(id) },
    });

    if (!telefone) {
      return res.status(404).json({ error: 'Telefone não encontrado' });
    }

    res.status(200).json(telefone);
  } catch (error) {
    console.error("Erro ao buscar telefone:", error);
    res.status(500).json({ error: `Erro interno ao buscar telefone: ${error.message}` });
  }
};

// Atualizar telefone
const update = async (req, res) => {
  const { id } = req.params;
  try {
    const { numero, tipo, alunoId } = req.body;

    // Verifica se os dados obrigatórios estão presentes
    if (!numero || !tipo || !alunoId) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Valida o formato do número de telefone
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(numero)) {
      return res.status(400).json({ error: "Número de telefone inválido. O formato correto é (XX) XXXXX-XXXX." });
    }

    const telefone = await prisma.telefone.update({
      where: { id: Number(id) },
      data: {
        numero: numero.trim(),
        tipo: tipo.trim(),
        alunoId: alunoId,
      },
    });

    res.status(200).json(telefone);
  } catch (error) {
    console.error("Erro ao atualizar telefone:", error);
    res.status(500).json({ error: `Erro interno ao atualizar telefone: ${error.message}` });
  }
};

// Remover telefone
const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const telefone = await prisma.telefone.findUnique({ where: { id: Number(id) } });

    if (!telefone) {
      return res.status(404).json({ error: "Telefone não encontrado" });
    }

    await prisma.telefone.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Telefone removido com sucesso' });
  } catch (error) {
    console.error("Erro ao remover telefone:", error);
    res.status(500).json({ error: `Erro interno ao remover telefone: ${error.message}` });
  }
};

module.exports = { create, read, readOne, update, remove };
