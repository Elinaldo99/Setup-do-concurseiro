import React, { useState, useEffect } from 'react';
import { StudyBlock } from '../types';
import { SUBJECTS, DAYS_OF_WEEK } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import Modal from '../components/Modal';

interface ReadySchedule {
    id: string;
    institution: string;
    role: string;
    file_url: string;
    created_at: string;
}

const Cronograma: React.FC = () => {
    const { isAdmin } = useAdmin();
    const [blocks, setBlocks] = useState<StudyBlock[]>([]);
    const [readySchedules, setReadySchedules] = useState<ReadySchedule[]>([]);
    const [newSubject, setNewSubject] = useState(SUBJECTS[0].id);
    const [newDay, setNewDay] = useState(DAYS_OF_WEEK[0]);
    const [newStart, setNewStart] = useState('08:00');
    const [newEnd, setNewEnd] = useState('10:00');
    const [downloading, setDownloading] = useState<string | null>(null);

    // Modal states
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        institution: '',
        role: '',
        link: ''
    });
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('study_schedule');
        if (saved) setBlocks(JSON.parse(saved));
        fetchReadySchedules();
    }, []);

    const fetchReadySchedules = async () => {
        try {
            const { data, error } = await supabase
                .from('ready_schedules')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReadySchedules(data || []);
        } catch (error) {
            console.error('Error fetching ready schedules:', error);
        }
    };

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

    const handleAddSchedule = async () => {
        if (!newSchedule.institution || !newSchedule.role || !newSchedule.link) {
            setMessage({ type: 'error', text: 'Preencha todos os campos' });
            return;
        }

        // Validate URL
        try {
            new URL(newSchedule.link);
        } catch {
            setMessage({ type: 'error', text: 'Link inválido. Use um URL completo (ex: https://...)' });
            return;
        }

        setUploading(true);
        try {
            const { error } = await supabase
                .from('ready_schedules')
                .insert([{
                    institution: newSchedule.institution,
                    role: newSchedule.role,
                    file_url: newSchedule.link
                }]);

            if (error) throw error;

            setShowScheduleModal(false);
            setNewSchedule({ institution: '', role: '', link: '' });
            setMessage({ type: 'success', text: 'Cronograma adicionado com sucesso!' });
            fetchReadySchedules();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao adicionar cronograma' });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteSchedule = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este cronograma?')) return;

        try {
            const { error } = await supabase
                .from('ready_schedules')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Cronograma removido!' });
            fetchReadySchedules();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao remover cronograma' });
        }
    };

    const handleDownload = (url: string, name: string) => {
        setDownloading(name);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setDownloading(null), 1000);
    };

    const getSubjectName = (id: string) => SUBJECTS.find(s => s.id === id)?.name || id;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Add Schedule Modal */}
            <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Novo Cronograma Pronto">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Instituição *</label>
                        <input
                            type="text"
                            value={newSchedule.institution}
                            onChange={(e) => setNewSchedule({ ...newSchedule, institution: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="Ex: INSS, Banco do Brasil"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Cargo *</label>
                        <input
                            type="text"
                            value={newSchedule.role}
                            onChange={(e) => setNewSchedule({ ...newSchedule, role: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="Ex: Técnico do Seguro Social"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Link do Cronograma *</label>
                        <input
                            type="url"
                            value={newSchedule.link}
                            onChange={(e) => setNewSchedule({ ...newSchedule, link: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="https://drive.google.com/... ou outro link"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            <i className="fas fa-info-circle mr-1"></i>
                            Cole o link direto para download (Google Drive, Dropbox, etc.)
                        </p>
                    </div>
                    <button
                        onClick={handleAddSchedule}
                        disabled={uploading}
                        className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 disabled:opacity-50"
                    >
                        {uploading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Adicionar Cronograma'}
                    </button>
                </div>
            </Modal>

            {message && (
                <div className={`mb-4 p-4 rounded-xl font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-8 p-4 sm:p-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <i className="fas fa-calendar-alt text-sky-600"></i> Gestão de Cronogramas
                </h2>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">Crie sua rotina personalizada ou baixe planos de estudos estratégicos prontos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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

                    {/* Ready Schedules Section */}
                    <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <i className="fas fa-file-pdf text-red-500"></i> Cronogramas Prontos
                            </h3>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowScheduleModal(true)}
                                    className="text-sky-600 hover:text-sky-700"
                                >
                                    <i className="fas fa-plus-circle"></i>
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mb-4">Modelos otimizados para editais específicos.</p>
                        <div className="space-y-3">
                            {readySchedules.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <i className="fas fa-calendar text-3xl mb-2 opacity-10"></i>
                                    <p className="text-xs">Nenhum cronograma disponível.</p>
                                </div>
                            ) : (
                                readySchedules.map(schedule => (
                                    <div
                                        key={schedule.id}
                                        className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-transparent hover:border-sky-100 transition-all group relative"
                                    >
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                                className="absolute top-1 right-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <i className="fas fa-trash text-xs"></i>
                                            </button>
                                        )}
                                        <div
                                            onClick={() => handleDownload(schedule.file_url, `${schedule.institution} - ${schedule.role}`)}
                                            className="flex items-center gap-3 flex-1 cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm">
                                                <i className="fas fa-scroll text-sm"></i>
                                            </div>
                                            <div className="text-left overflow-hidden flex-1">
                                                <span className="text-[11px] font-bold text-slate-800 block leading-tight truncate">{schedule.institution}</span>
                                                <span className="text-[9px] text-slate-400 uppercase font-bold truncate">{schedule.role}</span>
                                            </div>
                                        </div>
                                        {downloading === `${schedule.institution} - ${schedule.role}` ? (
                                            <i className="fas fa-spinner animate-spin text-sky-600"></i>
                                        ) : (
                                            <i className="fas fa-download text-slate-300 group-hover:text-sky-600 transition-colors"></i>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 order-first lg:order-last">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
