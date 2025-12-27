import React, { useState } from 'react';
import { Exam } from '../types';
import { EXAMS } from '../constants';

const Concursos: React.FC = () => {
    const [filter, setFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('Todos');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

    const uniqueRoles = Array.from(new Set(EXAMS.map(e => e.role)));

    const filteredExams = EXAMS.filter(e => {
        const matchesSearch = e.institution.toLowerCase().includes(filter.toLowerCase()) ||
            e.role.toLowerCase().includes(filter.toLowerCase());
        const matchesLevel = levelFilter === 'Todos' || e.level === levelFilter;
        const matchesRole = roleFilter === 'Todos' || e.role === roleFilter;
        return matchesSearch && matchesLevel && matchesRole;
    });

    // For detail view: Group by year
    const institutionExams = selectedExam ? EXAMS.filter(e => e.institution === selectedExam.institution) : [];
    const yearsAvailable = Array.from(new Set(institutionExams.map(e => e.year))).sort((a, b) => b - a);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {selectedExam ? (
                <div className="space-y-8 animate-fade-in">
                    <button
                        onClick={() => setSelectedExam(null)}
                        className="text-sky-600 font-bold flex items-center gap-2 hover:underline mb-4"
                    >
                        <i className="fas fa-arrow-left"></i> Voltar para lista de concursos
                    </button>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden pb-12">
                        <div className="bg-gradient-to-r from-sky-600 to-sky-700 p-8 text-white mb-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-extrabold mb-2 leading-none">{selectedExam.institution}</h2>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
                                    <span className="font-bold uppercase tracking-widest text-sm">Portfólio de Provas</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 space-y-12">
                            <div className="flex items-center gap-3 text-slate-800 border-b pb-4">
                                <i className="fas fa-cloud-download-alt text-sky-600 text-2xl"></i>
                                <h3 className="text-2xl font-bold">Provas Anteriores e Documentos</h3>
                            </div>

                            {yearsAvailable.map(year => {
                                const yearExams = institutionExams.filter(e => e.year === year);
                                return (
                                    <div key={year} className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-xl font-extrabold text-slate-700 min-w-fit">Ano {year}</h4>
                                            <div className="h-px bg-slate-100 flex-1"></div>
                                        </div>

                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {yearExams.map((ex) => (
                                                <React.Fragment key={ex.id}>
                                                    {[
                                                        { name: `Prova ${ex.institution} - ${ex.year}`, type: 'PDF', icon: 'fa-file-pdf', color: 'text-red-500' },
                                                        { name: `Gabarito Oficial`, type: 'PDF', icon: 'fa-check-square', color: 'text-green-500' },
                                                        { name: `Edital Completo`, type: 'PDF', icon: 'fa-scroll', color: 'text-sky-500' },
                                                    ].map((doc, idx) => (
                                                        <div key={`${ex.id}-${idx}`} className="p-6 border-2 border-slate-50 rounded-2xl hover:border-sky-200 transition-all group flex flex-col justify-between bg-slate-50/50">
                                                            <div>
                                                                <i className={`fas ${doc.icon} ${doc.color} text-3xl mb-4`}></i>
                                                                <h4 className="font-bold text-slate-800 mb-1 leading-tight">{doc.name}</h4>
                                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Formato: {doc.type}</p>
                                                            </div>
                                                            <button className="mt-6 w-full py-3 bg-white border border-slate-200 text-sky-600 rounded-xl font-bold group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all flex items-center justify-center gap-2">
                                                                <i className="fas fa-download"></i> Baixar Arquivo
                                                            </button>
                                                        </div>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <i className="fas fa-file-signature text-sky-600"></i> Provas Anteriores
                        </h2>
                        <p className="text-slate-500 mt-1">Explore e baixe provas de diversos concursos para praticar sua técnica.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Busca Direta</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Instituição ou cargo..."
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-sky-50 focus:border-sky-500 outline-none transition-all text-slate-700 bg-slate-50 shadow-sm"
                                    />
                                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Escolaridade</label>
                                    <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-sky-50 focus:border-sky-500 outline-none text-slate-700 cursor-pointer shadow-sm bg-slate-50">
                                        <option value="Todos">Todos</option>
                                        <option value="Fundamental">Fundamental</option>
                                        <option value="Médio">Médio</option>
                                        <option value="Superior">Superior</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wide">Cargos</label>
                                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-sky-50 focus:border-sky-500 outline-none text-slate-700 cursor-pointer shadow-sm bg-slate-50">
                                        <option value="Todos">Todos</option>
                                        {uniqueRoles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b">
                                        <th className="px-6 py-4 font-bold text-slate-700">Instituição</th>
                                        <th className="px-6 py-4 font-bold text-slate-700">Cargo</th>
                                        <th className="px-6 py-4 font-bold text-slate-700 text-center">Ano / Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-700 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExams.map((exam) => (
                                        <tr key={exam.id} className="border-b hover:bg-sky-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedExam(exam)}
                                                    className="font-bold text-slate-800 hover:text-sky-600 transition-colors text-lg text-left"
                                                >
                                                    {exam.institution}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{exam.role}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-slate-500 text-sm font-bold">{exam.year}</span>
                                                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${exam.status === 'Aberto' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>{exam.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedExam(exam)}
                                                    className="bg-sky-50 text-sky-600 px-4 py-2 rounded-xl font-bold hover:bg-sky-600 hover:text-white transition-all text-sm flex items-center gap-2 ml-auto"
                                                >
                                                    Ver Provas <i className="fas fa-chevron-right text-[10px]"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredExams.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <p className="text-lg">Nenhum concurso encontrado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Concursos;
