#!/usr/bin/env node
// Substitui $PWD em .claude/settings.example.json pelo caminho absoluto do projeto
// e grava em .claude/settings.local.json (não comitado).
// Aula 10 do curso explica por que precisamos disso: hooks devem usar caminhos
// absolutos por segurança, mas isso quebra portabilidade — o template usa $PWD
// e este script resolve no setup.

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../..");
const templatePath = path.join(projectRoot, ".claude/settings.example.json");
const outPath = path.join(projectRoot, ".claude/settings.local.json");

if (!fs.existsSync(templatePath)) {
  console.error(`Template não encontrado: ${templatePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(templatePath, "utf8");
const resolved = raw.replaceAll("$PWD", projectRoot);

// Valida que ficou JSON válido
try {
  JSON.parse(resolved);
} catch (err) {
  console.error("Resultado inválido como JSON:", err.message);
  process.exit(1);
}

fs.writeFileSync(outPath, resolved);
console.log(`Gerado: ${outPath}`);
console.log(`Caminho do projeto: ${projectRoot}`);
console.log("Adicione .claude/settings.local.json ao .gitignore se ainda não estiver.");
