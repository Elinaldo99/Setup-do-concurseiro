import React, { useState, useEffect } from 'react';
import { Exam } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import Modal from '../components/Modal';

interface ExamDocument {
    id: string;
    exam_id: string;
    name: string;
    type: string;
    url: string;
}

const Concursos: React.FC = () => {
    const { isAdmin } = useAdmin();
    const [exams, setExams] = useState<Exam[]>([]);
    const [documents, setDocuments] = useState<ExamDocument[]>([]);

    const [filter, setFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('Todos');
    const [roleFilter, setRoleFilter] = useState('Todos');
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

    // Admin State
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [newExam, setNewExam] = useState<Partial<Exam>>({
        institution: '',
        role: '',
        year: new Date().getFullYear(),
        level: 'Médio',
        status: 'Aberto'
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            fetchDocuments();
        }
    }, [selectedExam, exams]);

    const fetchExams = async () => {
        const { data, error } = await supabase.from('exams').select('*').order('created_at', { ascending: false });
        if (data) setExams(data);
    };

    const fetchDocuments = async () => {
        if (!selectedExam) return;

        const relevantExamIds = exams.filter(e => e.institution === selectedExam.institution).map(e => e.id);

        if (relevantExamIds.length > 0) {
            const { data } = await supabase.from('exam_documents').select('*').in('exam_id', relevantExamIds);
            if (data) setDocuments(data);
        } else {
            setDocuments([]);
        }
    };

    const handleAddExam = async () => {
        if (!newExam.institution || !newExam.role) return;

        const { error } = await supabase.from('exams').insert([newExam]);
        if (error) {
            alert('Erro ao criar concurso');
        } else {
            setIsExamModalOpen(false);
            setNewExam({
                institution: '',
                role: '',
                year: new Date().getFullYear(),
                level: 'Médio',
                status: 'Aberto'
            });
            fetchExams();
        }
    };

    const handleDeleteExam = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Tem certeza? Isso apagará também os documentos associados.')) return;

        const { error } = await supabase.from('exams').delete().eq('id', id);
        if (!error) {
            fetchExams();
            if (selectedExam?.id === id) setSelectedExam(null);
        }
    };

    const handleFileUpload = async (examId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${examId}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('exams').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('exams').getPublicUrl(filePath);

            const { error: dbError } = await supabase.from('exam_documents').insert({
                exam_id: examId,
                name: file.name,
                type: fileExt?.toUpperCase() || 'FILE',
                url: publicUrl
            });

            if (dbError) throw dbError;

            fetchDocuments();
        } catch (error) {
            console.error(error);
            alert('Erro ao enviar arquivo');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async (docId: string, path: string | undefined) => {
        if (!confirm('Excluir arquivo?')) return;
        await supabase.from('exam_documents').delete().eq('id', docId);
        fetchDocuments();
    };

    const uniqueRoles = Array.from(new Set(exams.map(e => e.role)));

    const filteredExams = exams.filter(e => {
        const matchesSearch = e.institution.toLowerCase().includes(filter.toLowerCase()) ||
            e.role.toLowerCase().includes(filter.toLowerCase());
        const matchesLevel = levelFilter === 'Todos' || e.level === levelFilter;
        const matchesRole = roleFilter === 'Todos' || e.role === roleFilter;
        return matchesSearch && matchesLevel && matchesRole;
    });

    const institutionExams = selectedExam ? exams.filter(e => e.institution === selectedExam.institution) : [];
    const yearsAvailable = Array.from(new Set(institutionExams.map(e => e.year))).sort((a, b) => b - a);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Modal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} title="Novo Concurso">
                <div className="space-y-4">
                    <input type="text" placeholder="Instituição (ex: INSS)" className="w-full p-2 border rounded" value={newExam.institution} onChange={e => setNewExam({ ...newExam, institution: e.target.value })} />
                    <input type="text" placeholder="Cargo" className="w-full p-2 border rounded" value={newExam.role} onChange={e => setNewExam({ ...newExam, role: e.target.value })} />
                    <div className="flex gap-2">
                        <input type="number" placeholder="Ano" className="w-full p-2 border rounded" value={newExam.year} onChange={e => setNewExam({ ...newExam, year: parseInt(e.target.value) })} />
                        <select className="p-2 border rounded" value={newExam.level} onChange={e => setNewExam({ ...newExam, level: e.target.value as any })}>
                            <option value="Fundamental">Fundamental</option>
                            <option value="Médio">Médio</option>
                            <option value="Superior">Superior</option>
                        </select>
                    </div>
                    <select className="w-full p-2 border rounded" value={newExam.status} onChange={e => setNewExam({ ...newExam, status: e.target.value as any })}>
                        <option value="Aberto">Aberto</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Previsto">Previsto</option>
                    </select>
                    <button onClick={handleAddExam} className="w-full bg-sky-600 text-white p-3 rounded font-bold">Salvar</button>
                </div>
            </Modal>

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
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-2 leading-none">{selectedExam.institution}</h2>
                        </div>

                        <div className="px-8 space-y-12">
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
                                                <div key={ex.id} className="contents">
                                                    {/* Documents List */}
                                                    {documents.filter(d => d.exam_id === ex.id).map(doc => (
                                                        <div key={doc.id} className="p-6 border-2 border-slate-50 rounded-2xl hover:border-sky-200 transition-all group flex flex-col justify-between bg-slate-50/50 relative">
                                                            {isAdmin && (
                                                                <button onClick={() => handleDeleteDocument(doc.id, doc.url)} className="absolute top-2 right-2 text-red-300 hover:text-red-500 z-10">
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            )}
                                                            <div>
                                                                <i className={`fas fa-file-pdf text-red-500 text-3xl mb-4`}></i>
                                                                <h4 className="font-bold text-slate-800 mb-1 leading-tight">{doc.name}</h4>
                                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Formato: {doc.type}</p>
                                                            </div>
                                                            <a href={doc.url} target="_blank" rel="noreferrer" className="mt-6 w-full py-3 bg-white border border-slate-200 text-sky-600 rounded-xl font-bold group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all flex items-center justify-center gap-2">
                                                                <i className="fas fa-download"></i> Baixar Arquivo
                                                            </a>
                                                        </div>
                                                    ))}

                                                    {/* Upload Area for Admin */}
                                                    {isAdmin && (
                                                        <div className="p-6 border-2 border-dashed border-sky-200 rounded-2xl flex flex-col items-center justify-center text-sky-500 hover:bg-sky-50 transition cursor-pointer relative min-h-[200px]">
                                                            <input
                                                                type="file"
                                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                                onChange={(e) => handleFileUpload(ex.id, e)}
                                                                disabled={uploading}
                                                            />
                                                            {uploading ? (
                                                                <i className="fas fa-circle-notch animate-spin text-3xl"></i>
                                                            ) : (
                                                                <>
                                                                    <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                                                                    <span className="font-bold text-sm text-center">Adicionar Arquivo para<br />{ex.role}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
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
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                                <i className="fas fa-file-signature text-sky-600"></i> Provas Anteriores
                            </h2>
                            <p className="text-slate-500 mt-1">Explore e baixe provas de diversos concursos.</p>
                        </div>
                        {isAdmin && (
                            <button onClick={() => setIsExamModalOpen(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 shadow-lg flex items-center gap-2">
                                <i className="fas fa-plus"></i> Novo Concurso
                            </button>
                        )}
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
                                            <td className="px-6 py-4 relative flex items-center gap-3">
                                                {isAdmin && (
                                                    <button onClick={(e) => handleDeleteExam(exam.id, e)} className="text-slate-300 hover:text-red-500 transition-colors w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
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
