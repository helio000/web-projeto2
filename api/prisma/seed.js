const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Criar professor
  const professor = await prisma.professor.create({
    data: {
      nome: "Daniel Silva",
      cpf: "12345678901",
      email: "daniel@academia.com",
      telefone: "19999999999",
      arteMarcial: "Jiu-Jitsu",
      datanasc: new Date("1985-05-10")
    }
  });

  // Criar turma
  const turma = await prisma.turma.create({
    data: {
      nome: "Turma A",
      arteMarcial: "Jiu-Jitsu",
      professorId: professor.id
    }
  });

  // Criar aluno
  const aluno = await prisma.aluno.create({
    data: {
      nome: "João Oliveira",
      email: "joao@gmail.com",
      telefone: "19988887777",
      datanasc: new Date("2005-06-29"),
      arteMarcial: "Jiu-Jitsu",
      RA: 123456,
      notaTecnica: 9.5,
      notaDisciplina: 8.7,
      frequencia: 93.5
    }
  });

  // Criar matrícula
  await prisma.matricula.create({
    data: {
      alunoId: aluno.id,
      turmaId: turma.id
    }
  });

  // Criar planejamento
  await prisma.planejamento.create({
    data: {
      diaSemana: "Segunda-feira",
      atividade: "Treinamento de queda e defesa pessoal",
      professorId: professor.id
    }
  });

  console.log("🌱 Seed criado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
