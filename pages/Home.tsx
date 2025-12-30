import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const news = [
        {
            id: 1,
            title: "Concurso INSS: Edital Publicado com 1.000 vagas",
            tag: "Edital Abertos",
            date: "Hoje",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            title: "Receita Federal: Inscrições começam na próxima segunda",
            tag: "Inscrições",
            date: "Ontem",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            title: "Polícia Federal solicita 2.500 novas vagas para Agente",
            tag: "Previstos",
            date: "2 dias atrás",
            image: "https://images.unsplash.com/photo-1579443140343-2280f339f4e2?auto=format&fit=crop&q=80&w=400"
        }
    ];

    const features = [
        { title: "Matérias", icon: "fa-book-reader", path: "/materias", desc: "Apostilas, resumos com IA e questões.", color: "bg-sky-600" },
        { title: "Concursos", icon: "fa-file-signature", path: "/concursos", desc: "Provas anteriores e editais completos.", color: "bg-indigo-600" },
        { title: "Dicas", icon: "fa-magic", path: "/dicas", desc: "Estratégias de estudo e guru motivacional.", color: "bg-purple-600" },
        { title: "Cronogramas", icon: "fa-calendar-alt", path: "/cronograma", desc: "Organize sua rotina de estudos.", color: "bg-teal-600" },
        { title: "Perfil", icon: "fa-user-circle", path: "/perfil", desc: "Acompanhe suas metas e conquistas.", color: "bg-orange-600" },
    ];

    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 pt-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-block bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                            🎉 100% focado na sua aprovação
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                            Sua Vaga no Serviço Público <span className="text-sky-600 underline decoration-sky-300">Começa Aqui.</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg">
                            A maior plataforma de apoio ao concurseiro. Estude com inteligência, organize-se e conquiste a estabilidade.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/materias" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-sky-200 text-center text-lg">Começar agora</Link>
                            <Link to="/cronograma" className="bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold transition-all text-center text-lg">Meu Cronograma</Link>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" alt="Concurseiros Estudando" className="rounded-[40px] shadow-2xl border-8 border-white" />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-sky-100 animate-bounce">
                            <p className="text-sky-600 font-bold text-2xl">+50k</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Aprovados</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Options Section */}
            <section className="bg-slate-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800">Explore Nossas Ferramentas</h2>
                        <p className="text-slate-500 mt-2">Tudo o que você precisa para uma preparação de alto nível.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                        {features.map((feature, i) => (
                            <Link
                                key={i}
                                to={feature.path}
                                className="bg-white p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all group text-center"
                            >
                                <div className={`${feature.color} w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <i className={`fas ${feature.icon}`}></i>
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm sm:text-lg mb-1">{feature.title}</h3>
                                <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed line-clamp-2">{feature.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* News Section */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <i className="fas fa-newspaper text-sky-600"></i> Últimas Notícias
                        </h2>
                        <p className="text-slate-500 mt-1">Fique por dentro das movimentações do mundo dos concursos.</p>
                    </div>
                    <button className="text-sky-600 font-bold hover:underline hidden sm:block">Ver todas as notícias</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {news.map(item => (
                        <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer">
                            <div className="relative h-48 overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                                    {item.tag}
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-400 text-xs font-bold mb-2 uppercase">{item.date}</p>
                                <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-sky-600 transition-colors">
                                    {item.title}
                                </h3>
                                <div className="mt-4 flex items-center text-sky-600 text-sm font-bold gap-2">
                                    Ler notícia completa <i className="fas fa-arrow-right text-[10px]"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Simple CTA */}
            <section className="max-w-7xl mx-auto px-4">
                <div className="bg-sky-600 rounded-[30px] sm:rounded-[40px] p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">Pronto para ser o próximo aprovado?</h2>
                        <p className="text-sky-100 mb-8 max-w-2xl mx-auto text-sm sm:text-base">Milhares de concurseiros já estão usando o Setup do Concurseiro para organizar seus estudos e bater metas.</p>
                        <Link to="/perfil" className="bg-white text-sky-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-sky-50 transition-colors shadow-xl inline-block">Criar meu Perfil Grátis</Link>
                    </div>
                    <i className="fas fa-graduation-cap absolute right-[-20px] bottom-[-20px] text-[200px] text-white/5 pointer-events-none -rotate-12"></i>
                </div>
            </section>
        </div>
    );
};

export default Home;
