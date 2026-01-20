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
    const [ufFilter, setUfFilter] = useState('Todos');
    const [yearFilter, setYearFilter] = useState('Todos');

    // Navigation State
    const [selectedGroup, setSelectedGroup] = useState<{ institution: string; uf: string } | null>(null);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

    // Admin State
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isExamDetailModalOpen, setIsExamDetailModalOpen] = useState(false);
    const [isEditExamModalOpen, setIsEditExamModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [selectedExamForDoc, setSelectedExamForDoc] = useState<string | null>(null);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [isEditBlockModalOpen, setIsEditBlockModalOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<{ institution: string; uf: string; originalInstitution: string; originalUf: string } | null>(null);

    // Viewer State
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerUrl, setViewerUrl] = useState('');
    const [viewerTitle, setViewerTitle] = useState('');

    // State for creating a new Block (Institution/UF)
    const [newBlock, setNewBlock] = useState({
        institution: '',
        uf: ''
    });

    const [newExamDetail, setNewExamDetail] = useState<Partial<Exam>>({
        role: '',
        banca: '',
        year: new Date().getFullYear(),
        level: 'Médio',
        status: 'Aberto'
    });

    const [newDoc, setNewDoc] = useState({
        name: '',
        type: 'PDF',
        link: ''
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
        const { data } = await supabase.from('exam_documents').select('*').eq('exam_id', selectedExam.id);
        if (data) setDocuments(data);
    };

    const handleCreateBlock = async () => {
        if (!newBlock.institution || !newBlock.uf) {
            alert('Preencha Instituição e UF');
            return;
        }

        // Create a record with placeholder role/year to make the block exist
        const { error } = await supabase.from('exams').insert([{
            institution: newBlock.institution,
            uf: newBlock.uf,
            role: 'Cadastrar Cargo',
            year: new Date().getFullYear(),
            level: 'Médio',
            status: 'Previsto'
        }]);

        if (error) {
            alert('Erro ao criar concurso');
        } else {
            setIsBlockModalOpen(false);
            setNewBlock({ institution: '', uf: '' });
            fetchExams();
        }
    };

    const handleAddExamDetail = async () => {
        if (!selectedGroup || !newExamDetail.role) {
            alert('Preencha o cargo');
            return;
        }

        const { error } = await supabase.from('exams').insert([{
            ...newExamDetail,
            institution: selectedGroup.institution,
            uf: selectedGroup.uf
        }]);

        if (error) {
            alert('Erro ao adicionar cargo');
        } else {
            setIsExamDetailModalOpen(false);
            setNewExamDetail({
                role: '',
                banca: '',
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

    const openEditExamModal = (exam: Exam, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingExam(exam);
        setIsEditExamModalOpen(true);
    };

    const handleUpdateExam = async () => {
        if (!editingExam) return;
        const { error } = await supabase
            .from('exams')
            .update({
                institution: editingExam.institution,
                role: editingExam.role,
                year: editingExam.year,
                level: editingExam.level,
                status: editingExam.status,
                uf: editingExam.uf,
                banca: editingExam.banca
            })
            .eq('id', editingExam.id);

        if (error) {
            alert('Erro ao atualizar concurso');
        } else {
            setIsEditExamModalOpen(false);
            setEditingExam(null);
            fetchExams();
        }
    };

    const openDocModal = (examId: string) => {
        setSelectedExamForDoc(examId);
        setIsDocModalOpen(true);
    };

    const handleDeleteBlock = async (institution: string, uf: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Tem certeza? Isso apagará a instituição "${institution} - ${uf}" e todas as provas vinculadas a ela.`)) return;

        const targetIds = exams
            .filter(e => e.institution === institution && (e.uf || 'Nacional') === uf)
            .map(e => e.id);

        const { error } = await supabase
            .from('exams')
            .delete()
            .in('id', targetIds);

        if (error) {
            alert('Erro ao excluir instituição');
        } else {
            fetchExams();
        }
    };

    const openEditBlockModal = (group: { institution: string; uf: string }, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingBlock({
            institution: group.institution,
            uf: group.uf,
            originalInstitution: group.institution,
            originalUf: group.uf
        });
        setIsEditBlockModalOpen(true);
    };

    const handleUpdateBlock = async () => {
        if (!editingBlock) return;

        const targetIds = exams
            .filter(e => e.institution === editingBlock.originalInstitution && (e.uf || 'Nacional') === editingBlock.originalUf)
            .map(e => e.id);

        const { error } = await supabase
            .from('exams')
            .update({
                institution: editingBlock.institution,
                uf: editingBlock.uf
            })
            .in('id', targetIds);

        if (error) {
            alert('Erro ao atualizar instituição');
        } else {
            setIsEditBlockModalOpen(false);
            setEditingBlock(null);
            fetchExams();
        }
    };

    const handleAddDocument = async () => {
        if (!newDoc.name || !newDoc.link || !selectedExamForDoc) {
            alert('Preencha todos os campos');
            return;
        }
        setUploading(true);
        try {
            const { error } = await supabase.from('exam_documents').insert({
                exam_id: selectedExamForDoc,
                name: newDoc.name,
                type: newDoc.type,
                url: newDoc.link
            });
            if (error) throw error;
            setIsDocModalOpen(false);
            setNewDoc({ name: '', type: 'PDF', link: '' });
            setSelectedExamForDoc(null);
            fetchDocuments();
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar documento');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDocument = async (docId: string) => {
        if (!confirm('Excluir documento?')) return;
        await supabase.from('exam_documents').delete().eq('id', docId);
        fetchDocuments();
    };

    const openViewer = (doc: ExamDocument) => {
        setViewerUrl(doc.url);
        setViewerTitle(doc.name);
        setIsViewerOpen(true);
    };

    const filteredExams = exams.filter(e => {
        const matchesSearch = e.institution.toLowerCase().includes(filter.toLowerCase()) ||
            e.role.toLowerCase().includes(filter.toLowerCase());
        const matchesLevel = levelFilter === 'Todos' || e.level === levelFilter;
        const matchesRole = roleFilter === 'Todos' || e.role === roleFilter;
        const matchesUf = ufFilter === 'Todos' || (e.uf || 'Nacional') === ufFilter;
        const matchesYear = yearFilter === 'Todos' || e.year.toString() === yearFilter;
        return matchesSearch && matchesLevel && matchesRole && matchesUf && matchesYear;
    });

    // Grouping for the Card View
    const uniqueGroups = Array.from(new Set(filteredExams.map(e => JSON.stringify({ institution: e.institution, uf: e.uf || 'Nacional' }))))
        .map(s => JSON.parse(s) as { institution: string; uf: string });

    const examsInGroup = selectedGroup ? filteredExams.filter(e => e.institution === selectedGroup.institution && (e.uf || 'Nacional') === selectedGroup.uf) : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Global Block Modal (Institution + UF) */}
            <Modal isOpen={isBlockModalOpen} onClose={() => setIsBlockModalOpen(false)} title="Novo Concurso">
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Instituição (ex: INSS)"
                        className="w-full p-2 border rounded-xl"
                        value={newBlock.institution}
                        onChange={e => setNewBlock({ ...newBlock, institution: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="UF (ex: SP, RJ ou Nacional)"
                        className="w-full p-2 border rounded-xl"
                        value={newBlock.uf}
                        onChange={e => setNewBlock({ ...newBlock, uf: e.target.value.toUpperCase() })}
                    />
                    <button onClick={handleCreateBlock} className="w-full bg-sky-600 text-white p-3 rounded-xl font-bold">Salvar</button>
                </div>
            </Modal>

            {/* Internal Exam Detail Modal (Role + Year + Level) */}
            <Modal isOpen={isExamDetailModalOpen} onClose={() => setIsExamDetailModalOpen(false)} title={`Adicionar Prova - ${selectedGroup?.institution}`}>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Cargo (ex: Agente, Perito)"
                        className="w-full p-2 border rounded-xl"
                        value={newExamDetail.role}
                        onChange={e => setNewExamDetail({ ...newExamDetail, role: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Banca (ex: Vunesp, FGV)"
                        className="w-full p-2 border rounded-xl"
                        value={newExamDetail.banca}
                        onChange={e => setNewExamDetail({ ...newExamDetail, banca: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Ano"
                            className="w-full p-2 border rounded-xl"
                            value={newExamDetail.year}
                            onChange={e => setNewExamDetail({ ...newExamDetail, year: parseInt(e.target.value) })}
                        />
                        <select
                            className="p-2 border rounded-xl"
                            value={newExamDetail.level}
                            onChange={e => setNewExamDetail({ ...newExamDetail, level: e.target.value as any })}
                        >
                            <option value="Fundamental">Fundamental</option>
                            <option value="Médio">Médio</option>
                            <option value="Superior">Superior</option>
                        </select>
                    </div>
                    <select
                        className="w-full p-2 border rounded-xl"
                        value={newExamDetail.status}
                        onChange={e => setNewExamDetail({ ...newExamDetail, status: e.target.value as any })}
                    >
                        <option value="Aberto">Aberto</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Previsto">Previsto</option>
                    </select>
                    <button onClick={handleAddExamDetail} className="w-full bg-sky-600 text-white p-3 rounded-xl font-bold">Salvar</button>
                </div>
            </Modal>

            {/* Edit Exam Modal */}
            <Modal isOpen={isEditExamModalOpen} onClose={() => { setIsEditExamModalOpen(false); setEditingExam(null); }} title="Editar Cargo">
                {editingExam && (
                    <div className="space-y-4">
                        <input type="text" className="w-full p-3 border rounded-xl" value={editingExam.institution} onChange={e => setEditingExam({ ...editingExam, institution: e.target.value })} />
                        <input type="text" placeholder="UF" className="w-full p-3 border rounded-xl" value={editingExam.uf || ''} onChange={e => setEditingExam({ ...editingExam, uf: e.target.value.toUpperCase() })} />
                        <input type="text" className="w-full p-3 border rounded-xl" value={editingExam.role} onChange={e => setEditingExam({ ...editingExam, role: e.target.value })} />
                        <input type="text" placeholder="Banca" className="w-full p-3 border rounded-xl" value={editingExam.banca || ''} onChange={e => setEditingExam({ ...editingExam, banca: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" className="w-full p-3 border rounded-xl" value={editingExam.year} onChange={e => setEditingExam({ ...editingExam, year: parseInt(e.target.value) })} />
                            <select className="w-full p-3 border rounded-xl" value={editingExam.level} onChange={e => setEditingExam({ ...editingExam, level: e.target.value as any })}>
                                <option value="Fundamental">Fundamental</option>
                                <option value="Médio">Médio</option>
                                <option value="Superior">Superior</option>
                            </select>
                        </div>
                        <select className="w-full p-3 border rounded-xl" value={editingExam.status} onChange={e => setEditingExam({ ...editingExam, status: e.target.value as any })}>
                            <option value="Aberto">Aberto</option>
                            <option value="Finalizado">Finalizado</option>
                            <option value="Previsto">Previsto</option>
                        </select>
                        <button onClick={handleUpdateExam} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold">Salvar Alterações</button>
                    </div>
                )}
            </Modal>

            {/* Edit Block Modal */}
            <Modal isOpen={isEditBlockModalOpen} onClose={() => { setIsEditBlockModalOpen(false); setEditingBlock(null); }} title="Editar Instituição">
                {editingBlock && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            className="w-full p-3 border rounded-xl"
                            placeholder="Instituição"
                            value={editingBlock.institution}
                            onChange={e => setEditingBlock({ ...editingBlock, institution: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="UF"
                            className="w-full p-3 border rounded-xl"
                            value={editingBlock.uf}
                            onChange={e => setEditingBlock({ ...editingBlock, uf: e.target.value.toUpperCase() })}
                        />
                        <button onClick={handleUpdateBlock} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold">Salvar Alterações</button>
                    </div>
                )}
            </Modal>

            {/* Document Modal */}
            <Modal isOpen={isDocModalOpen} onClose={() => { setIsDocModalOpen(false); setSelectedExamForDoc(null); }} title="Adicionar Documento">
                <div className="space-y-4">
                    <input type="text" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Nome do Documento (Ex: Prova Objetiva)" />
                    <select value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })} className="w-full p-3 border rounded-xl">
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                    </select>
                    <input type="url" value={newDoc.link} onChange={e => setNewDoc({ ...newDoc, link: e.target.value })} className="w-full p-3 border rounded-xl" placeholder="Link do arquivo" />
                    <button onClick={handleAddDocument} disabled={uploading} className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold disabled:opacity-50">
                        {uploading ? 'Carregando...' : 'Adicionar Documento'}
                    </button>
                </div>
            </Modal>

            {/* Main Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <i className="fas fa-file-signature text-sky-600"></i> Provas Anteriores
                    </h2>
                    <p className="text-slate-500 mt-1">Explore e baixe provas por instituição e estado.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setIsBlockModalOpen(true)} className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 shadow-lg flex items-center gap-2">
                        <i className="fas fa-layer-group"></i> Novo Concurso
                    </button>
                )}
            </div>

            {!selectedGroup && (
                <>
                    {/* Filter Bar */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="relative lg:col-span-1">
                                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                <input type="text" placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sky-500 bg-slate-50" />
                            </div>
                            <select value={ufFilter} onChange={e => setUfFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sky-500 bg-slate-50">
                                <option value="Todos">Todos os Estados</option>
                                {Array.from(new Set(exams.map(e => e.uf || 'Nacional'))).sort().map(uf => <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sky-500 bg-slate-50">
                                <option value="Todos">Todos os Anos</option>
                                {Array.from(new Set(exams.map(e => e.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a)).map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sky-500 bg-slate-50">
                                <option value="Todos">Escolaridade</option>
                                <option value="Fundamental">Fundamental</option>
                                <option value="Médio">Médio</option>
                                <option value="Superior">Superior</option>
                            </select>
                            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sky-500 bg-slate-50">
                                <option value="Todos">Todos os Cargos</option>
                                {Array.from(new Set(exams.map(e => e.role))).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Institution Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {uniqueGroups.map((group, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedGroup(group)}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-sky-400 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden h-48 flex flex-col justify-between"
                            >
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => openEditBlockModal(group, e)} className="p-2 text-sky-400 hover:text-sky-600"><i className="fas fa-edit"></i></button>
                                        <button onClick={(e) => handleDeleteBlock(group.institution, group.uf, e)} className="p-2 text-red-300 hover:text-red-500"><i className="fas fa-trash"></i></button>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fas fa-university text-7xl text-sky-900"></i>
                                </div>
                                <div className="relative">
                                    <span className="inline-block px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-black mb-3">
                                        {group.uf}
                                    </span>
                                    <h3 className="text-xl font-black text-slate-800 line-clamp-2 leading-tight">
                                        {group.institution}
                                    </h3>
                                </div>
                                <div className="flex justify-between items-center relative">
                                    <span className="text-xs font-bold text-slate-400">
                                        {filteredExams.filter(e => e.institution === group.institution && (e.uf || 'Nacional') === group.uf).length} provas disponíveis
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-sky-600 group-hover:text-white transition-all">
                                        <i className="fas fa-chevron-right text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {selectedGroup && !selectedExam && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setSelectedGroup(null)} className="text-sky-600 font-bold flex items-center gap-2 hover:underline">
                            <i className="fas fa-arrow-left"></i> Voltar para lista
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setIsExamDetailModalOpen(true)}
                                className="bg-sky-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-sky-700 shadow flex items-center gap-2"
                            >
                                <i className="fas fa-plus"></i> Novo Cargo/Ano
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-sky-600 to-sky-700 p-8 text-white">
                            <span className="text-sky-100 font-bold uppercase tracking-widest text-sm mb-2 block">{selectedGroup.uf}</span>
                            <h2 className="text-4xl font-black">{selectedGroup.institution}</h2>
                        </div>

                        <div className="p-8">
                            <h3 className="text-lg font-bold text-slate-700 mb-6">Selecione o cargo e ano da prova:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {examsInGroup.map(exam => (
                                    <div
                                        key={exam.id}
                                        onClick={() => setSelectedExam(exam)}
                                        className="p-5 border-2 border-slate-50 rounded-2xl hover:border-sky-500 hover:bg-sky-50 transition-all cursor-pointer group relative"
                                    >
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => openEditExamModal(exam, e)} className="p-2 text-sky-400 hover:text-sky-600"><i className="fas fa-edit"></i></button>
                                                <button onClick={(e) => handleDeleteExam(exam.id, e)} className="p-2 text-red-300 hover:text-red-500"><i className="fas fa-trash"></i></button>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-slate-800">{exam.role}</span>
                                                {exam.banca && <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{exam.banca}</span>}
                                            </div>
                                            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-100">{exam.year}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                            <span className={`px-2 py-0.5 rounded ${exam.status === 'Aberto' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{exam.status}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400">{exam.level}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedExam && (
                <div className="animate-fade-in">
                    <button onClick={() => setSelectedExam(null)} className="text-sky-600 font-bold flex items-center gap-2 hover:underline mb-6">
                        <i className="fas fa-arrow-left"></i> Voltar para {selectedExam.institution} ({selectedExam.role})
                    </button>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="bg-slate-800 p-8 text-white flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-black mb-1">{selectedExam.institution}</h2>
                                <p className="text-slate-400 font-bold">{selectedExam.role} - {selectedExam.year} ({selectedExam.level})</p>
                            </div>
                            {isAdmin && (
                                <button onClick={() => openDocModal(selectedExam.id)} className="bg-sky-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-sky-700 shadow-lg">
                                    Adicionar Documento
                                </button>
                            )}
                        </div>

                        <div className="p-8">
                            {documents.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fas fa-folder-open text-5xl mb-4 opacity-20"></i>
                                    <p className="font-bold">Nenhum documento disponível para esta prova.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-sky-500 transition-all relative">
                                            {isAdmin && (
                                                <button onClick={() => handleDeleteDocument(doc.id)} className="absolute top-4 right-4 text-red-200 hover:text-red-500">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                            <div className="mb-4">
                                                <i className={`fas ${doc.type === 'PDF' ? 'fa-file-pdf text-red-500' : 'fa-file-word text-blue-500'} text-4xl`}></i>
                                            </div>
                                            <h4 className="font-black text-slate-800 mb-4">{doc.name}</h4>
                                            <button
                                                onClick={() => openViewer(doc)}
                                                className="w-full py-3 bg-white border-2 border-slate-200 text-sky-600 rounded-xl font-black text-center block group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all"
                                            >
                                                <i className="fas fa-eye mr-2"></i> Visualizar {doc.type}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Document Viewer Modal */}
            <Modal
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                title={viewerTitle}
                maxWidth="max-w-6xl"
            >
                <div className="w-full h-[70vh]">
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full rounded-xl border-0"
                        title={viewerTitle}
                    ></iframe>
                </div>
            </Modal>
        </div>
    );
};

export default Concursos;

