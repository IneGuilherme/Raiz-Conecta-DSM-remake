// microservico/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Permite que o nosso App Principal (porta 3000) converse com este microsserviço (porta 3001)
app.use(cors());
app.use(express.json());

// 1. Configuração do Mailtrap
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "c70fcdebb7f576",
        pass: "92799ce10d8a8c"
    }
});

// 2. Rota que o App Principal vai chamar quando alguém se cadastrar
app.post('/api/email/boas-vindas', async (req, res) => {
    const { email, nome, tipoUsuario } = req.body;

    console.log(`📩 Recebido pedido de e-mail para: ${email}`);

    // Personaliza a mensagem baseada no tipo de usuário
    let mensagemHTML = '';
    if (tipoUsuario === 'produtor') {
        mensagemHTML = `
      <h2 style="color: #166534;">Olá ${nome}, bem-vindo ao Raiz Conecta! 🌱</h2>
      <p>Estamos muito felizes em ter você como nosso Produtor Parceiro.</p>
      <p>Sua conta está em análise e logo você poderá começar a vender seus produtos frescos diretamente para os mercados da região!</p>
    `;
    } else {
        mensagemHTML = `
      <h2 style="color: #166534;">Olá ${nome}, bem-vindo ao Raiz Conecta! 🛒</h2>
      <p>A melhor plataforma para encontrar hortifruti fresco direto da raiz.</p>
      <p>Acesse o painel para começar a negociar com os produtores locais.</p>
    `;
    }

    try {
        // 3. Dispara o e-mail
        await transporter.sendMail({
            from: '"Equipe Raiz Conecta" <nao-responda@raizconecta.com>',
            to: email,
            subject: "Bem-vindo ao Raiz Conecta! 🌱",
            html: mensagemHTML
        });

        console.log("✅ E-mail enviado com sucesso pro Mailtrap!");
        res.status(200).json({ message: "E-mail enviado com sucesso!" });

    } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error);
        res.status(500).json({ error: "Erro interno ao disparar o e-mail." });
    }
});

// 4. Liga o Microsserviço na porta 3001 (Para não dar conflito com o Next.js que está na 3000)
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Microsserviço de E-mail rodando na porta ${PORT}`);
});