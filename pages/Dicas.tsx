import React, { useState } from 'react';
import { TIPS } from '../constants';

const Dicas: React.FC = () => {
    const [downloading, setDownloading] = useState<string | null>(null);

    const simulateDownload = (name: string) => {
        setDownloading(name);
        setTimeout(() => {
            setDownloading(null);
            alert(`Baixando: ${name}.pdf`);
        }, 1200);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <i className="fas fa-magic text-sky-600"></i> Dicas Estratégicas
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Guias de Estudo Recomendados</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {TIPS.map(tip => (
                            <div key={tip.id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">{tip.category}</span>
                                    <h4 className="text-xl font-bold text-slate-800 mt-3 mb-2">{tip.title}</h4>
                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">{tip.summary}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-sky-50 text-sky-600 rounded-xl font-bold text-sm hover:bg-sky-100 transition-colors flex items-center justify-center gap-2">
                                        <i className="fas fa-book-open"></i> Ler
                                    </button>
                                    <button
                                        onClick={() => simulateDownload(tip.title)}
                                        className="flex-1 py-3 bg-sky-600 text-white rounded-xl font-bold text-sm hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {downloading === tip.title ? <i className="fas fa-spinner animate-spin"></i> : <><i className="fas fa-file-pdf"></i> PDF</>}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Apostilas de Dicas</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Manual do Concurseiro Iniciante', format: 'PDF', icon: 'fa-user-graduate' },
                                { name: 'Guia de Bancas 2024', format: 'EPUB', icon: 'fa-landmark' },
                                { name: 'Plano de Estudos em 90 dias', format: 'PDF', icon: 'fa-calendar-check' },
                                { name: 'Checklist de Editais', format: 'XLSX', icon: 'fa-list-ul' }
                            ].map((item, i) => (
                                <li
                                    key={i}
                                    onClick={() => simulateDownload(item.name)}
                                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm group-hover:bg-sky-600 group-hover:text-white transition-all">
                                            <i className={`fas ${item.icon}`}></i>
                                        </div>
                                        <div>
                                            <span className="text-slate-700 text-sm font-bold block">{item.name}</span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{item.format}</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-download text-slate-300 group-hover:text-sky-600 transition-colors"></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dicas;
