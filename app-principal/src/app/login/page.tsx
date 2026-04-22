"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { useFormik } from "formik";
import { loginSchema, cadastroSchema } from "@/schemas/authSchema";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [tipoUsuario, setTipoUsuario] = useState<"produtor" | "mercado">("produtor");

    const formik = useFormik({
        initialValues: {
            tipoUsuario: "produtor",
            nome: "",
            documento: "",
            telefone: "",
            email: "",
            senha: "",
        },
        validationSchema: isLogin ? loginSchema : cadastroSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            if (isLogin) {
                // ==========================
                // LÓGICA DE LOGIN REAL
                // ==========================
                try {
                    const resposta = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: values.email, senha: values.senha }),
                    });

                    const dados = await resposta.json();

                    if (!resposta.ok) {
                        setFieldError("senha", dados.error || "Erro ao fazer login");
                        return;
                    }

                    // Salva os dados no navegador para o Header usar
                    localStorage.setItem("userEmail", values.email);
                    const nomeProvisorio = values.email.split('@')[0];
                    localStorage.setItem("userName", nomeProvisorio);

                    localStorage.setItem("userRole", dados.tipoUser);

                    // Redirecionamento baseado no Perfil
                    if (dados.tipoUser === "produtor") {
                        router.push("/produtor");
                    } else if (dados.tipoUser === "mercado") {
                        router.push("/checkout");
                    } else if (dados.tipoUser === "admin") {
                        router.push("/admin");
                    } else {
                        router.push("/");
                    }

                } catch (erro) {
                    console.error("Erro no login:", erro);
                    alert("Erro de conexão com o servidor.");
                } finally {
                    setSubmitting(false);
                }
            } else {
                // ==========================
                // LÓGICA DE CADASTRO
                // ==========================
                try {
                    const resposta = await fetch('/api/auth/cadastro', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(values),
                    });

                    const dados = await resposta.json();

                    if (!resposta.ok) {
                        setFieldError("email", dados.error || "Erro no cadastro");
                        return;
                    }

                    // Salva os dados no navegador logo no cadastro
                    localStorage.setItem("userEmail", values.email);
                    
                    localStorage.setItem("userRole", dados.tipoUser);

                    // Se ele preencheu o nome no formulário, a gente usa o nome real!
                    // Se não, fazemos a quebra pelo email de novo.
                    const nomeParaSalvar = values.nome ? values.nome.split(' ')[0] : values.email.split('@')[0];
                    localStorage.setItem("userName", nomeParaSalvar);

                    alert("Cadastro realizado com sucesso! Você já pode fazer login.");
                    setIsLogin(true);
                    formik.resetForm();

                } catch (erro) {
                    console.error("Erro no fetch:", erro);
                    alert("Erro de conexão com o servidor.");
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const alternarAba = (modoLogin: boolean) => {
        setIsLogin(modoLogin);
        formik.resetForm();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-green-50/50">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 text-green-700 font-bold text-3xl">
                        <Leaf className="h-8 w-8" />
                        Raiz Conecta
                    </Link>
                </div>

                <Card>
                    <div className="flex border-b mb-6">
                        <button
                            onClick={() => alternarAba(true)}
                            type="button"
                            className={`flex-1 py-3 text-center font-medium transition-colors ${isLogin ? "border-b-2 border-green-600 text-green-700" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => alternarAba(false)}
                            type="button"
                            className={`flex-1 py-3 text-center font-medium transition-colors ${!isLogin ? "border-b-2 border-green-600 text-green-700" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Criar Conta
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        {isLogin ? "Bem-vindo de volta!" : "Junte-se a nós"}
                    </h2>

                    <form className="space-y-4" onSubmit={formik.handleSubmit}>

                        {!isLogin && (
                            <>
                                <div className="flex flex-col gap-1 w-full mb-2">
                                    <label className="text-sm font-semibold text-gray-700">Tipo de Perfil</label>
                                    <select
                                        name="tipoUsuario"
                                        value={formik.values.tipoUsuario}
                                        onChange={(e) => {
                                            setTipoUsuario(e.target.value as "produtor" | "mercado");
                                            formik.handleChange(e);
                                        }}
                                        className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-green-500/50"
                                    >
                                        <option value="produtor">Sou Produtor Rural</option>
                                        <option value="mercado">Sou um Mercado / Comprador</option>
                                    </select>
                                </div>

                                <Input
                                    label={tipoUsuario === "produtor" ? "Nome Completo" : "Razão Social"}
                                    name="nome"
                                    type="text"
                                    placeholder={tipoUsuario === "produtor" ? "João da Silva" : "Mercado Central Ltda"}
                                    value={formik.values.nome}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.nome ? formik.errors.nome : undefined}
                                />

                                <Input
                                    label={tipoUsuario === "produtor" ? "CPF" : "CNPJ"}
                                    name="documento"
                                    type="text"
                                    placeholder={tipoUsuario === "produtor" ? "000.000.000-00" : "00.000.000/0001-00"}
                                    value={formik.values.documento}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.documento ? formik.errors.documento : undefined}
                                />

                                <Input
                                    label="Telefone"
                                    name="telefone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={formik.values.telefone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.telefone ? formik.errors.telefone : undefined}
                                />
                            </>
                        )}

                        <Input
                            label="E-mail"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email ? formik.errors.email : undefined}
                        />

                        <Input
                            label="Senha"
                            name="senha"
                            type="password"
                            placeholder="••••••••"
                            value={formik.values.senha}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.senha ? formik.errors.senha : undefined}
                        />

                        <Button fullWidth className="mt-6" type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? "Aguarde..." : (isLogin ? "Entrar na Plataforma" : "Finalizar Cadastro")}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}