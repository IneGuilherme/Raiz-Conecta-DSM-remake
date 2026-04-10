import * as Yup from 'yup';

// Regras para a tela de Login
export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Digite um e-mail válido')
        .required('O e-mail é obrigatório'),
    senha: Yup.string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .required('A senha é obrigatória'),
});

// Regras para a tela de Cadastro
export const cadastroSchema = Yup.object().shape({
    tipoUsuario: Yup.string().oneOf(['produtor', 'mercado']).required(),
    nome: Yup.string()
        .min(3, 'O nome deve ter no mínimo 3 letras')
        .required('O nome/razão social é obrigatório'),
    documento: Yup.string()
        .required('O documento é obrigatório')
        .test('valida-doc', 'Documento inválido', function (value) {
            if (!value) return false;
            const { tipoUsuario } = this.parent;
            // Remove pontuação para contar os números
            const numeros = value.replace(/\D/g, '');
            if (tipoUsuario === 'produtor') return numeros.length === 11; // CPF básico
            if (tipoUsuario === 'mercado') return numeros.length === 14;  // CNPJ básico
            return false;
        }),
    telefone: Yup.string()
        .required('O telefone é obrigatório'),
    email: Yup.string()
        .email('Digite um e-mail válido')
        .required('O e-mail é obrigatório'),
    senha: Yup.string()
        .min(6, 'A senha deve ter no mínimo 6 caracteres')
        .required('A senha é obrigatória'),
});