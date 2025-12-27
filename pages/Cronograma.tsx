import React, { useState, useEffect } from 'react';
import { StudyBlock } from '../types';
import { SUBJECTS, EXAMS, DAYS_OF_WEEK } from '../constants';

const Cronograma: React.FC = () => {
    const [blocks, setBlocks] = useState<StudyBlock[]>([]);
    const [newSubject, setNewSubject] = useState(SUBJECTS[0].id);
    const [newDay, setNewDay] = useState(DAYS_OF_WEEK[0]);
    const [newStart, setNewStart] = useState('08:00');
    const [newEnd, setNewEnd] = useState('10:00');
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('study_schedule');
        if (saved) setBlocks(JSON.parse(saved));
    }, []);

    const addBlock = () => {
        const block: StudyBlock = {
            id: Math.random().toString(36).substr(2, 9),
            subjectId: newSubject,
            dayOfWeek: newDay,
            startTime: newStart,
            endTime: newEnd
        };
        const updated = [...blocks, block];
        setBlocks(updated);
        localStorage.setItem('study_schedule', JSON.stringify(updated));
    };

    const removeBlock = (id: string) => {
        const updated = blocks.filter(b => b.id !== id);
        setBlocks(updated);
        localStorage.setItem('study_schedule', JSON.stringify(updated));
    };

    const simulateDownload = (examName: string) => {
        setDownloading(examName);
        setTimeout(() => {
            setDownloading(null);
            alert(`Download concluído: Cronograma Estratégico para ${examName}.pdf`);
        }, 1500);
    };

    const getSubjectName = (id: string) => SUBJECTS.find(s => s.id === id)?.name || id;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <i className="fas fa-calendar-alt text-sky-600"></i> Gestão de Cronogramas
                </h2>
                <p className="text-slate-500 mt-1">Crie sua rotina personalizada ou baixe planos de estudos estratégicos prontos.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    {/* Form to add personal blocks */}
                    <div className="bg-white p-6 rounded-3xl shadow-md border border-sky-100 space-y-4">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <i className="fas fa-plus-circle text-sky-600"></i> Novo Bloco
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1 tracking-wide">Matéria</label>
                                <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50">
                                    {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 block mb-1 tracking-wide">Dia</label>
                                <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50">
                                    {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1 tracking-wide">Início</label>
                                    <input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1 tracking-wide">Fim</label>
                                    <input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="w-full border p-2 rounded-lg bg-slate-50" />
                                </div>
                            </div>
                            <button onClick={addBlock} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-md">
                                Adicionar à Grade
                            </button>
                        </div>
                    </div>

                    {/* New Section: Downloadable ready-made schedules */}
                    <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 space-y-4">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            <i className="fas fa-file-pdf text-red-500"></i> Cronogramas Prontos
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Modelos otimizados para editais específicos.</p>
                        <div className="space-y-3">
                            {EXAMS.map(exam => (
                                <button
                                    key={exam.id}
                                    onClick={() => simulateDownload(exam.institution)}
                                    disabled={!!downloading}
                                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-transparent hover:border-sky-100 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm">
                                            <i className="fas fa-scroll text-sm"></i>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <span className="text-[11px] font-bold text-slate-800 block leading-tight truncate">{exam.institution}</span>
                                            <span className="text-[9px] text-slate-400 uppercase font-bold truncate">{exam.role}</span>
                                        </div>
                                    </div>
                                    {downloading === exam.institution ? (
                                        <i className="fas fa-spinner animate-spin text-sky-600"></i>
                                    ) : (
                                        <i className="fas fa-download text-slate-300 group-hover:text-sky-600 transition-colors"></i>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {DAYS_OF_WEEK.map(day => {
                            const dayBlocks = blocks.filter(b => b.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                            return (
                                <div key={day} className="bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[150px]">
                                    <div className="bg-slate-50 px-4 py-2 border-b rounded-t-3xl flex justify-between items-center">
                                        <h4 className="font-bold text-slate-700">{day}</h4>
                                        <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">{dayBlocks.length} Blocos</span>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {dayBlocks.length === 0 ? (
                                            <div className="py-8 text-center">
                                                <i className="fas fa-mug-hot text-slate-100 text-3xl mb-2"></i>
                                                <p className="text-[10px] text-slate-300 italic uppercase font-bold">Folga programada</p>
                                            </div>
                                        ) : (
                                            dayBlocks.map(block => (
                                                <div key={block.id} className="group relative bg-sky-50 border-l-4 border-sky-500 p-3 rounded-r-xl transition-all hover:bg-sky-100/50">
                                                    <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity">
                                                        <i className="fas fa-times-circle"></i>
                                                    </button>
                                                    <p className="text-[10px] font-extrabold text-sky-700 mb-0.5">{block.startTime} às {block.endTime}</p>
                                                    <p className="text-sm font-bold text-slate-800 leading-tight">{getSubjectName(block.subjectId)}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cronograma;
