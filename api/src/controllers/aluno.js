const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar aluno
const create = async (req, res) => {
  try {
    let { nome, email, telefone, datanasc, arteMarcial, RA } = req.body;

    // Validação básica
    if (!nome || !email || !telefone || !datanasc || !arteMarcial) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Validação de data
    const dataValida = new Date(datanasc);
    if (isNaN(dataValida)) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    // Gera RA caso não venha
    if (!RA) {
      RA = Math.floor(100000 + Math.random() * 900000);
    }

    // Verifica se existe email já cadastrado
    let existingAluno = null;
    try {
      existingAluno = await prisma.aluno.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
    } catch (_) {
      // se o campo email não for unique, ignora
    }

    if (existingAluno) {
      return res.status(400).json({ error: "Já existe um aluno cadastrado com este e-mail." });
    }

    // Criação do aluno
    const aluno = await prisma.aluno.create({
      data: {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        datanasc: dataValida,
        arteMarcial: arteMarcial.trim(),
        RA: Number(RA)
      },
    });

    res.status(201).json(aluno);
  } catch (error) {
    console.error("Erro em create aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Listar todos os alunos
const read = async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany();
    res.status(200).json(alunos);
  } catch (error) {
    console.error("Erro em read alunos:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Buscar aluno pelo ID
const readOne = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const aluno = await prisma.aluno.findUnique({ where: { id } });

    if (!aluno) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    res.status(200).json(aluno);
  } catch (error) {
    console.error("Erro em readOne aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar aluno
const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    let { nome, email, telefone, datanasc, arteMarcial, RA } = req.body;

    let dataValida = undefined;
    if (datanasc) {
      dataValida = new Date(datanasc);
      if (isNaN(dataValida)) {
        return res.status(400).json({ error: "Data de nascimento inválida." });
      }
    }

    const aluno = await prisma.aluno.update({
      where: { id },
      data: {
        nome: nome?.trim(),
        email: email?.trim()?.toLowerCase(),
        telefone: telefone?.trim(),
        datanasc: dataValida,
        arteMarcial: arteMarcial?.trim(),
        RA: RA ? Number(RA) : undefined
      },
    });

    res.status(200).json(aluno);
  } catch (error) {
    console.error("Erro em update aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Atualizar notas
const updateNotas = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const { notaTecnica, notaDisciplina, frequencia } = req.body;

  if (
    notaTecnica == null || notaDisciplina == null || frequencia == null ||
    notaTecnica < 0 || notaTecnica > 10 ||
    notaDisciplina < 0 || notaDisciplina > 10 ||
    frequencia < 0 || frequencia > 100
  ) {
    return res.status(400).json({ error: "Notas inválidas! As notas devem estar entre 0 e 10 e a frequência entre 0 e 100." });
  }

  try {
    const alunoExistente = await prisma.aluno.findUnique({ where: { id } });
    if (!alunoExistente) return res.status(404).json({ error: "Aluno não encontrado" });

    const alunoAtualizado = await prisma.aluno.update({
      where: { id },
      data: { notaTecnica, notaDisciplina, frequencia }
    });

    res.status(200).json(alunoAtualizado);
  } catch (error) {
    console.error("Erro em updateNotas aluno:", error);
    res.status(500).json({ error: "Erro ao atualizar notas." });
  }
};

// Remover aluno
const remove = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // Verifica primeiro se existe
    const existe = await prisma.aluno.findUnique({ where: { id } });

    if (!existe) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    await prisma.aluno.delete({ where: { id } });

    res.status(200).json({ message: "Aluno removido com sucesso" });
  } catch (error) {
    console.error("Erro em remove aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Login
const login = async (req, res) => {
  let { nome, email } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
  }

  nome = nome.trim();
  email = email.trim().toLowerCase();

  try {
    const aluno = await prisma.aluno.findFirst({
      where: { nome, email }
    });

    if (!aluno) {
      return res.status(401).json({ error: "Nome ou e-mail incorretos" });
    }

    res.status(200).json({ message: "Login realizado com sucesso!", aluno });
  } catch (error) {
    console.error("Erro em login aluno:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = { create, read, readOne, update, remove, login, updateNotas };
