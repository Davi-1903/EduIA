import React from "react";
import ProtectedRoute from "../../../components/protectedRoute";
import RenderMessages from "../../../components/renderMessages";
import { Helmet } from "react-helmet-async";
import Cards from "./cards";

export default function Dashboard() {
    const cards = [
        {
            id: 1,
            title: "Gerar Questão",
            description: "Crie listas de exercícios personalizadas.",
        },
        {
            id: 2,
            title: "Gerar Formulários",
            description: "Gere formulários para avaliações.",
        },
        {
            id: 3,
            title: "Gerar Quiz",
            description: "Monte quizzes com tempo e pontuação.",
        },
        {
            id: 4,
            title: "Gerar Flashcards",
            description: "Crie cartões para memorização.",
        },
        {
            id: 5,
            title: "Gerar Resumo",
            description: "Resumos claros e objetivos.",
        },
        {
            id: 6,
            title: "Gerar Explicação",
            description: "Explicações adaptadas ao seu nível.",
        },
        {
            id: 7,
            title: "Gerar Exercícios Guiados",
            description: "Passo a passo completo.",
        },
        {
            id: 8,
            title: "Gerar Plano de Aula",
            description: "Planeje suas aulas facilmente.",
        },
        {
            id: 9,
            title: "Gerar Roteiro de Estudo",
            description: "Organize seus estudos.",
        },
        {
            id: 10,
            title: "Gerar Desafios",
            description: "Teste seus conhecimentos.",
        },
    ];

    const history = [
        {
            id: 1,
            title: "Resumo de Fotossíntese",
            description: "Biologia",
        },
        {
            id: 2,
            title: "Lista de Exercícios de Física",
            description: "Física",
        },
        {
            id: 3,
            title: "Quiz de Matemática",
            description: "Matemática",
        },
    ];

    return (
        <ProtectedRoute isPrivate={true}>
            <Helmet>
                <title>EduIA | Dashboard</title>
                <meta name="description" content="Dashboard do sistema EduIA" />
            </Helmet>

            <div className="wrapper">
                <RenderMessages />

                <main
                    className="min-h-screen mt-[var(--height-header)] bg-gradient-to-br from-color4-200 to-indigo-100"
                    
                >
                    <section className="max-w-7xl mx-auto px-6 py-16 space-y-24">

                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-color1-100 leading-tight">
                                Aprenda de forma inteligente <br /> e personalizada
                            </h1>
                            <p className="text-color3-200 mt-6 text-lg">
                                Use o EduIA para criar materiais, exercícios e conteúdos adaptados
                                ao seu ritmo de aprendizado.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-semibold text-color1-100 mb-8">
                                O que você quer criar hoje?
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card) => (
                                    <Cards
                                        key={card.id}
                                        title={card.title}
                                        description={card.description}
                                    />
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-color1-100 mb-8">
                                Continue de onde parou
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {history.map((item) => (
                                    <Cards
                                        key={item.id}
                                        title={item.title}
                                        description={item.description}
                                    />
                                ))}
                            </div>
                        </section>

                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
}
