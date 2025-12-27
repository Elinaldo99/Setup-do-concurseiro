import React, { useState } from 'react';
import TabButton from '../components/TabButton';
import { Subject } from '../types';
import { SUBJECTS } from '../constants';
import { getStudySummary } from '../services/geminiService';

const Materias: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [activeTab, setActiveTab] = useState<'apostilas' | 'questoes' | 'mapas'>('apostilas');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTopicClick = async (topic: string) => {
        if (!selectedSubject) return;
        setSelectedTopic(topic);
        setLoading(true);
        setSummary(null);
        const result = await getStudySummary(selectedSubject.name, topic);
        setSummary(result);
        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <i className="fas fa-book-reader text-sky-600"></i> Matérias de Estudo
            </h2>

            {!selectedSubject ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SUBJECTS.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => setSelectedSubject(s)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-sky-50 p-3 rounded-xl group-hover:bg-sky-600 transition-colors">
                                    <i className={`fas ${s.icon} text-sky-600 group-hover:text-white text-2xl`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
                            </div>
                            <p className="text-slate-500 mb-4 text-sm">{s.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {s.topics.slice(0, 3).map(t => (
                                    <span key={t} className="bg-slate-50 text-slate-500 px-2 py-1 rounded text-[10px] font-bold uppercase">{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <button
                        onClick={() => { setSelectedSubject(null); setActiveTab('apostilas'); setSelectedTopic(null); setSummary(null); }}
                        className="text-sky-600 font-medium flex items-center gap-2 hover:underline"
                    >
                        <i className="fas fa-arrow-left"></i> Voltar para lista de matérias
                    </button>

                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b flex items-center gap-4">
                            <div className="bg-sky-600 p-3 rounded-xl">
                                <i className={`fas ${selectedSubject.icon} text-white text-2xl`}></i>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">{selectedSubject.name}</h3>
                        </div>

                        <div className="flex border-b overflow-x-auto whitespace-nowrap">
                            <TabButton active={activeTab === 'apostilas'} onClick={() => setActiveTab('apostilas')} icon="fa-book" label="Apostilas" />
                            <TabButton active={activeTab === 'questoes'} onClick={() => setActiveTab('questoes')} icon="fa-tasks" label="Questões Anteriores" />
                            <TabButton active={activeTab === 'mapas'} onClick={() => setActiveTab('mapas')} icon="fa-project-diagram" label="Mapas Mentais" />
                        </div>

                        <div className="p-6 min-h-[400px]">
                            {activeTab === 'apostilas' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {selectedSubject.topics.map((t, idx) => (
                                        <div key={idx} onClick={() => handleTopicClick(t)} className="p-4 border border-slate-100 rounded-xl hover:bg-sky-50 transition-colors cursor-pointer flex justify-between items-center group">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{t}</h4>
                                                <p className="text-xs text-slate-500">Apostila Completa • Ver Resumo IA</p>
                                            </div>
                                            {loading && selectedTopic === t ? (
                                                <i className="fas fa-circle-notch animate-spin text-sky-600"></i>
                                            ) : (
                                                <i className="fas fa-magic text-sky-400 group-hover:text-sky-600"></i>
                                            )}
                                        </div>
                                    ))}
                                    {selectedTopic && summary && (
                                        <div className="col-span-full mt-8 p-8 bg-sky-50 rounded-3xl border border-sky-100 animate-fade-in shadow-inner">
                                            <h4 className="text-xl font-bold text-sky-800 mb-4">Resumo Estratégico: {selectedTopic}</h4>
                                            <div className="prose prose-sky text-slate-700 whitespace-pre-wrap leading-relaxed">{summary}</div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'questoes' && (
                                <div className="grid gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-sky-300 transition-all cursor-pointer">
                                            <div className="flex justify-between mb-3">
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase">Questão #{i * 124}</span>
                                                <span className="text-xs text-sky-600 font-bold">Banca CEBRASPE</span>
                                            </div>
                                            <p className="text-slate-700 font-medium mb-4 line-clamp-2">Considerando o tema de {selectedSubject.topics[i % selectedSubject.topics.length]}, julgue os itens a seguir de acordo com a jurisprudência dominante...</p>
                                            <div className="flex gap-4 text-xs font-bold">
                                                <span className="text-green-600">Resolver agora</span>
                                                <span className="text-slate-400">Ver comentários</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'mapas' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {selectedSubject.topics.slice(0, 4).map((t, idx) => (
                                        <div key={idx} className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-sm border-2 border-transparent hover:border-sky-500 transition-all">
                                            <img src={`https://picsum.photos/seed/${t}/400/400`} alt={t} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-4">
                                                <h4 className="text-white font-bold text-sm leading-tight">{t}</h4>
                                                <p className="text-sky-300 text-[10px] font-bold mt-1 uppercase tracking-wider">MAPA MENTAL</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Materias;
