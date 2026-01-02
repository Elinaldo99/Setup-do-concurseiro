import React, { useState, useEffect } from 'react';
import TabButton from '../components/TabButton';
import { Subject } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import Modal from '../components/Modal';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface SubjectTopic {
    id: string;
    subject_id: string;
    parent_id?: string;
    title: string;
    content: string;
    external_link: string;
    created_at: string;
}

interface SubjectMaterial {
    id: string;
    subject_id: string;
    topic_id?: string;
    name: string;
    url: string;
    type: string;
    category: string;
}


const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'align',
    'link',
    'image'
];

const Materias: React.FC = () => {
    const { isAdmin } = useAdmin();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [activeTab, setActiveTab] = useState<'apostilas' | 'questoes' | 'mapas'>('apostilas');
    const [topics, setTopics] = useState<SubjectTopic[]>([]);
    const [materials, setMaterials] = useState<SubjectMaterial[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<SubjectTopic | null>(null);

    // Admin Modal State
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

    const [newSubject, setNewSubject] = useState<Partial<Subject>>({
        name: '', description: '', icon: 'fa-book', topics: []
    });

    const [newTopic, setNewTopic] = useState<Partial<SubjectTopic>>({
        title: '', content: '', external_link: '', parent_id: undefined
    });

    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [editingTopic, setEditingTopic] = useState<SubjectTopic | null>(null);
    const [editingMaterial, setEditingMaterial] = useState<SubjectMaterial | null>(null);

    const [newMaterial, setNewMaterial] = useState<{ name: string, url: string, category: string, topic_id?: string, type: string }>({
        name: '', url: '', category: '', topic_id: '', type: 'PDF'
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (selectedSubject) {
            fetchTopics(selectedSubject.id);
            fetchMaterials(selectedSubject.id);
        }
    }, [selectedSubject]);

    const fetchSubjects = async () => {
        const { data, error } = await supabase.from('subjects').select('*').order('name');
        if (data) setSubjects(data);
    };

    const fetchTopics = async (subjectId: string) => {
        const { data } = await supabase.from('subject_topics').select('*').eq('subject_id', subjectId).order('created_at');
        if (data) setTopics(data);
    };

    const fetchMaterials = async (subjectId: string) => {
        const { data } = await supabase.from('subject_materials').select('*').eq('subject_id', subjectId);
        if (data) setMaterials(data);
    };

    const handleAddSubject = async () => {
        if (!newSubject.name) return;

        if (editingSubject) {
            const { error } = await supabase.from('subjects').update(newSubject).eq('id', editingSubject.id);
            if (!error) {
                setIsSubjectModalOpen(false);
                setEditingSubject(null);
                setNewSubject({ name: '', description: '', icon: 'fa-book', topics: [] });
                fetchSubjects();
            }
        } else {
            const { error } = await supabase.from('subjects').insert([newSubject]);
            if (!error) {
                setIsSubjectModalOpen(false);
                setNewSubject({ name: '', description: '', icon: 'fa-book', topics: [] });
                fetchSubjects();
            }
        }
    };

    const handleAddTopic = async () => {
        if (!newTopic.title || !selectedSubject) return;

        if (editingTopic) {
            const { error } = await supabase.from('subject_topics').update(newTopic).eq('id', editingTopic.id);
            if (!error) {
                setIsTopicModalOpen(false);
                setEditingTopic(null);
                setNewTopic({ title: '', content: '', external_link: '', parent_id: undefined });
                fetchTopics(selectedSubject.id);
            }
        } else {
            const { error } = await supabase.from('subject_topics').insert([{
                ...newTopic,
                subject_id: selectedSubject.id
            }]);
            if (!error) {
                setIsTopicModalOpen(false);
                setNewTopic({ title: '', content: '', external_link: '', parent_id: undefined });
                fetchTopics(selectedSubject.id);
            }
        }
    };

    const handleAddMaterialLink = async () => {
        if (!newMaterial.name || !newMaterial.url || !selectedSubject) return;

        const materialData = {
            subject_id: selectedSubject.id,
            topic_id: newMaterial.topic_id || null,
            name: newMaterial.name,
            url: newMaterial.url,
            type: newMaterial.type,
            category: newMaterial.category
        };

        if (editingMaterial) {
            const { error } = await supabase.from('subject_materials').update(materialData).eq('id', editingMaterial.id);
            if (!error) {
                setIsMaterialModalOpen(false);
                setEditingMaterial(null);
                setNewMaterial({ name: '', url: '', category: '', topic_id: '', type: 'PDF' });
                fetchMaterials(selectedSubject.id);
            } else {
                alert('Erro ao atualizar link');
            }
        } else {
            const { error } = await supabase.from('subject_materials').insert(materialData);
            if (!error) {
                setIsMaterialModalOpen(false);
                setNewMaterial({ name: '', url: '', category: '', topic_id: '', type: 'PDF' });
                fetchMaterials(selectedSubject.id);
            } else {
                alert('Erro ao adicionar link');
            }
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (!confirm('Excluir arquivo?')) return;
        await supabase.from('subject_materials').delete().eq('id', id);
        if (selectedSubject) fetchMaterials(selectedSubject.id);
    };

    const handleDeleteSubject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Tem certeza?')) return;
        await supabase.from('subjects').delete().eq('id', id);
        fetchSubjects();
    };

    const openMaterialModal = (category: string, material?: SubjectMaterial) => {
        if (material) {
            setEditingMaterial(material);
            setNewMaterial({
                name: material.name,
                url: material.url,
                category: material.category,
                topic_id: material.topic_id,
                type: material.type
            });
        } else {
            setEditingMaterial(null);
            setNewMaterial({ name: '', url: '', category, topic_id: selectedTopic?.id, type: 'PDF' });
        }
        setIsMaterialModalOpen(true);
    };

    const openTopicModal = (parentId?: string, topic?: SubjectTopic) => {
        if (topic) {
            setEditingTopic(topic);
            setNewTopic({
                title: topic.title,
                content: topic.content,
                external_link: topic.external_link,
                parent_id: topic.parent_id
            });
        } else {
            setEditingTopic(null);
            setNewTopic({ title: '', content: '', external_link: '', parent_id: parentId });
        }
        setIsTopicModalOpen(true);
    };

    const openSubjectModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject);
            setNewSubject({
                name: subject.name,
                description: subject.description,
                icon: subject.icon
            });
        } else {
            setEditingSubject(null);
            setNewSubject({ name: '', description: '', icon: 'fa-book', topics: [] });
        }
        setIsSubjectModalOpen(true);
    };

    const handleDeleteTopic = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Excluir este assunto? Isso apagará também os sub-assuntos.')) return;
        const { error } = await supabase.from('subject_topics').delete().eq('id', id);
        if (!error && selectedSubject) {
            fetchTopics(selectedSubject.id);
            if (selectedTopic?.id === id) setSelectedTopic(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Subject Modal */}
            <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title={editingSubject ? "Editar Matéria" : "Nova Matéria"}>
                <div className="space-y-4">
                    <input type="text" placeholder="Nome" className="w-full p-2 border rounded" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} />
                    <textarea placeholder="Descrição" className="w-full p-2 border rounded" value={newSubject.description} onChange={e => setNewSubject({ ...newSubject, description: e.target.value })} />
                    <input type="text" placeholder="Ícone (fa-book)" className="w-full p-2 border rounded" value={newSubject.icon} onChange={e => setNewSubject({ ...newSubject, icon: e.target.value })} />
                    <button onClick={handleAddSubject} className="w-full bg-sky-600 text-white p-3 rounded font-bold">Salvar</button>
                </div>
            </Modal>

            {/* Topic Modal */}
            <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title={editingTopic ? "Editar Assunto" : "Novo Assunto"} maxWidth="max-w-4xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Título do Assunto</label>
                        <input type="text" placeholder="Ex: Introdução à Administração" className="w-full p-2 border rounded" value={newTopic.title} onChange={e => setNewTopic({ ...newTopic, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Vincular a um Assunto Principal / Grupo (Opcional)</label>
                        <select
                            className="w-full p-2 border rounded bg-white"
                            value={newTopic.parent_id || ''}
                            onChange={e => setNewTopic({ ...newTopic, parent_id: e.target.value || undefined })}
                        >
                            <option value="">Nenhum (Será um Assunto Principal)</option>
                            {topics.filter(t => !t.parent_id).map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1">Selecione um "Capítulo" para que este assunto seja um "Sub-capítulo".</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">Conteúdo (Texto para leitura)</label>
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <ReactQuill
                                theme="snow"
                                value={newTopic.content || ''}
                                onChange={(content) => setNewTopic({ ...newTopic, content })}
                                modules={modules}
                                formats={formats}
                                placeholder="Escreva ou cole o conteúdo aqui..."
                                className="quill-editor"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Link Externo (URL)</label>
                        <input type="text" placeholder="https://..." className="w-full p-2 border rounded" value={newTopic.external_link} onChange={e => setNewTopic({ ...newTopic, external_link: e.target.value })} />
                    </div>
                    <button onClick={handleAddTopic} className="w-full bg-sky-600 text-white p-3 rounded font-bold">Salvar Assunto</button>
                </div>
            </Modal>

            {/* Material Link Modal */}
            <Modal isOpen={isMaterialModalOpen} onClose={() => setIsMaterialModalOpen(false)} title={editingMaterial ? "Editar Material" : `Adicionar Novo em ${newMaterial.category === 'questao' ? 'Exercícios' : newMaterial.category === 'mapa' ? 'Mapas Mentais' : 'Apostilas'}`}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Título / Nome</label>
                        <input type="text" placeholder="Ex: Aula 01, Exercícios de Fixação" className="w-full p-2 border rounded" value={newMaterial.name} onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Formato</label>
                        <select
                            className="w-full p-2 border rounded bg-white"
                            value={newMaterial.type}
                            onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                        >
                            <option value="PDF">PDF</option>
                            <option value="VIDEO">VÍDEO</option>
                            <option value="XLS">XLS (Excel)</option>
                            <option value="DOCX">DOCX</option>
                            <option value="LINK">LINK / SITE</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">URL do Link</label>
                        <input type="text" placeholder="https://..." className="w-full p-2 border rounded" value={newMaterial.url} onChange={e => setNewMaterial({ ...newMaterial, url: e.target.value })} />
                    </div>
                    <button onClick={handleAddMaterialLink} className="w-full bg-sky-600 text-white p-3 rounded font-bold hover:bg-sky-700 transition-colors">Salvar Material</button>
                </div>
            </Modal>

            {!selectedSubject ? (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <i className="fas fa-book-reader text-sky-600"></i> Matérias de Estudo
                        </h2>
                        {isAdmin && (
                            <button onClick={() => openSubjectModal()} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 shadow-lg flex items-center gap-2">
                                <i className="fas fa-plus"></i> Nova Matéria
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subjects.map((s) => (
                            <div key={s.id} onClick={() => setSelectedSubject(s)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 cursor-pointer transition-all group relative">
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button onClick={(e) => { e.stopPropagation(); openSubjectModal(s); }} className="text-slate-300 hover:text-sky-500">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button onClick={(e) => handleDeleteSubject(e, s.id)} className="text-slate-300 hover:text-red-500">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-sky-50 p-3 rounded-xl group-hover:bg-sky-600 transition-colors">
                                        <i className={`fas ${s.icon} text-sky-600 group-hover:text-white text-2xl`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{s.name}</h3>
                                </div>
                                <p className="text-slate-500 mb-4 text-sm">{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <button onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }} className="text-sky-600 font-medium flex items-center gap-2 hover:underline">
                        <i className="fas fa-arrow-left"></i> Voltar
                    </button>

                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="p-4 sm:p-6 bg-slate-50 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-sky-600 p-2 sm:p-3 rounded-xl">
                                    <i className={`fas ${selectedSubject.icon} text-white text-xl sm:text-2xl`}></i>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{selectedSubject.name}</h3>
                            </div>
                            {isAdmin && (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={() => openTopicModal()} className="w-full sm:w-auto bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 flex items-center justify-center gap-2">
                                        <i className="fas fa-plus"></i> Novo Assunto
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex border-b overflow-x-auto whitespace-nowrap">
                            <TabButton active={activeTab === 'apostilas'} onClick={() => setActiveTab('apostilas')} icon="fa-book" label="Apostilas" />
                            <TabButton active={activeTab === 'questoes'} onClick={() => setActiveTab('questoes')} icon="fa-tasks" label="Exercícios" />
                            <TabButton active={activeTab === 'mapas'} onClick={() => setActiveTab('mapas')} icon="fa-project-diagram" label="Mapas Mentais" />
                        </div>

                        <div className="p-4 sm:p-6 min-h-[400px]">
                            {activeTab === 'apostilas' && (
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-slate-400 text-xs uppercase">Assuntos</h4>
                                        <div className="space-y-4">
                                            {topics.filter(t => !t.parent_id).map(topic => (
                                                <div key={topic.id} className="space-y-2">
                                                    <div
                                                        onClick={() => setSelectedTopic(topic)}
                                                        className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center group/topic ${selectedTopic?.id === topic.id ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-sky-300'}`}
                                                    >
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-slate-800">{topic.title}</h4>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {isAdmin && (
                                                                <div className="flex gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); openTopicModal(topic.id); }}
                                                                        className="p-1.5 text-sky-600 hover:bg-sky-100 rounded"
                                                                        title="Adicionar Sub-assunto"
                                                                    >
                                                                        <i className="fas fa-plus-circle text-xs"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); openTopicModal(undefined, topic); }}
                                                                        className="p-1.5 text-sky-600 hover:bg-sky-100 rounded"
                                                                        title="Editar Assunto"
                                                                    >
                                                                        <i className="fas fa-edit text-xs"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleDeleteTopic(e, topic.id)}
                                                                        className="p-1.5 text-red-400 hover:bg-red-50 rounded"
                                                                        title="Excluir Assunto"
                                                                    >
                                                                        <i className="fas fa-trash text-xs"></i>
                                                                    </button>
                                                                </div>
                                                            )}
                                                            <i className={`fas fa-chevron-right text-slate-400 text-xs transition-transform ${selectedTopic?.id === topic.id ? 'rotate-90' : ''}`}></i>
                                                        </div>
                                                    </div>

                                                    {/* Sub-topics (Collapsible) */}
                                                    {(selectedTopic?.id === topic.id || selectedTopic?.parent_id === topic.id) && (
                                                        <div className="space-y-2 animate-fade-in">
                                                            {topics.filter(st => st.parent_id === topic.id).map(subTopic => (
                                                                <div
                                                                    key={subTopic.id}
                                                                    onClick={() => setSelectedTopic(subTopic)}
                                                                    className={`ml-6 p-3 border-l-2 rounded-r-lg cursor-pointer transition-all flex justify-between items-center group/subtopic ${selectedTopic?.id === subTopic.id
                                                                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                                        : 'border-slate-100 hover:border-sky-200 hover:bg-slate-50'
                                                                        }`}
                                                                >
                                                                    <span className="text-sm font-medium">{subTopic.title}</span>
                                                                    {isAdmin && (
                                                                        <div className="flex gap-1 opacity-0 group-hover/subtopic:opacity-100 transition-opacity">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); openTopicModal(undefined, subTopic); }}
                                                                                className="p-1 text-sky-400 hover:text-sky-600"
                                                                            >
                                                                                <i className="fas fa-edit text-[10px]"></i>
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => handleDeleteTopic(e, subTopic.id)}
                                                                                className="p-1 text-red-300 hover:text-red-500"
                                                                            >
                                                                                <i className="fas fa-trash text-[10px]"></i>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {topics.length === 0 && <p className="text-slate-400 text-sm">Nenhum assunto cadastrado ainda.</p>}
                                    </div>

                                    <div className="lg:col-span-3 space-y-6">
                                        {selectedTopic ? (
                                            <div className="animate-fade-in space-y-6">
                                                <div className="border-b pb-4">
                                                    {selectedTopic.parent_id && (
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                            <span>{topics.find(t => t.id === selectedTopic.parent_id)?.title}</span>
                                                            <i className="fas fa-chevron-right text-[8px]"></i>
                                                        </div>
                                                    )}
                                                    <h3 className="text-2xl font-bold text-sky-800 mb-2">{selectedTopic.title}</h3>
                                                    {selectedTopic.content && (
                                                        <div className="ql-snow">
                                                            <div
                                                                className="ql-editor text-slate-600 text-sm mb-4 !p-0"
                                                                dangerouslySetInnerHTML={{ __html: selectedTopic.content }}
                                                            />
                                                        </div>
                                                    )}
                                                    {!selectedTopic.parent_id && topics.some(t => t.parent_id === selectedTopic.id) && (
                                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                                            <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Sub-assuntos neste capítulo:</h5>
                                                            <div className="grid grid-cols-1 gap-2">
                                                                {topics.filter(t => t.parent_id === selectedTopic.id).map(st => (
                                                                    <button key={st.id} onClick={() => setSelectedTopic(st)} className="text-left py-1 text-sky-600 hover:underline text-sm flex items-center gap-2">
                                                                        <i className="fas fa-book-open text-[10px]"></i> {st.title}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedTopic.external_link && (
                                                        <a href={selectedTopic.external_link} target="_blank" rel="noreferrer" className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-sky-200 inline-block transition-colors">
                                                            <i className="fas fa-external-link-alt mr-1"></i> Baixar Texto
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Files for this Topic */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-bold text-slate-700 text-sm">Arquivos do Assunto</h4>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => openMaterialModal('apostila')}
                                                                className="text-xs font-bold text-sky-600 hover:underline"
                                                            >
                                                                + Adicionar Link
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {materials.filter(m => m.topic_id === selectedTopic.id).map(m => (
                                                            <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group/item">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${m.type === 'VIDEO' ? 'bg-amber-500' :
                                                                        m.type === 'XLS' ? 'bg-emerald-500' :
                                                                            'bg-red-500'
                                                                        }`}>
                                                                        <i className={`fas ${m.type === 'VIDEO' ? 'fa-video' :
                                                                            m.type === 'XLS' ? 'fa-file-excel' :
                                                                                'fa-file-pdf'
                                                                            } text-xs`}></i>
                                                                    </div>
                                                                    <div className="flex flex-col overflow-hidden">
                                                                        <span className="text-sm font-bold text-slate-700 truncate">{m.name}</span>
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{m.type}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <a href={m.url} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 text-xs font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-sky-100 shadow-sm transition-all hover:shadow">
                                                                        <i className="fas fa-external-link-alt text-[10px]"></i> Acessar
                                                                    </a>
                                                                    {isAdmin && (
                                                                        <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity items-center">
                                                                            <button
                                                                                onClick={() => openMaterialModal('apostila', m)}
                                                                                className="text-slate-300 hover:text-sky-500 transition-colors p-1.5"
                                                                            >
                                                                                <i className="fas fa-edit"></i>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteMaterial(m.id)}
                                                                                className="text-slate-300 hover:text-red-500 transition-colors p-1.5"
                                                                            >
                                                                                <i className="fas fa-trash"></i>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {materials.filter(m => m.topic_id === selectedTopic.id).length === 0 && <p className="text-xs text-slate-400">Nenhum arquivo.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl p-8">
                                                <i className="fas fa-arrow-left text-2xl mb-2"></i>
                                                <p>Selecione um assunto para ver o conteúdo</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'questoes' && (
                                <div>
                                    {isAdmin && (
                                        <div className="mb-4">
                                            <button onClick={() => openMaterialModal('questao')} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 flex items-center gap-2">
                                                <i className="fas fa-plus"></i> Novo Exercício (Link)
                                            </button>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {materials.filter(m => m.category === 'questao').map(m => (
                                            <div key={m.id} className="p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-sky-500 transition-all relative flex flex-col justify-between group">
                                                {isAdmin && (
                                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                                        <button onClick={() => openMaterialModal('questao', m)} className="text-slate-300 hover:text-sky-500">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button onClick={() => handleDeleteMaterial(m.id)} className="text-slate-300 hover:text-red-500">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="mb-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white ${m.type === 'VIDEO' ? 'bg-amber-500' :
                                                        m.type === 'XLS' ? 'bg-emerald-500' :
                                                            'bg-sky-600'
                                                        }`}>
                                                        <i className={`fas ${m.type === 'VIDEO' ? 'fa-video' :
                                                            m.type === 'XLS' ? 'fa-file-excel' :
                                                                'fa-tasks'
                                                            } text-xl`}></i>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 leading-tight">{m.name}</h4>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-wider">{m.type}</p>
                                                </div>

                                                <a href={m.url} target="_blank" rel="noreferrer" className="w-full bg-slate-50 text-sky-600 py-2 rounded-lg text-xs font-bold text-center hover:bg-sky-600 hover:text-white transition-all border border-slate-100">
                                                    <i className="fas fa-external-link-alt mr-1"></i> Acessar
                                                </a>
                                            </div>
                                        ))}
                                        {materials.filter(m => m.category === 'questao').length === 0 && <p className="text-slate-400 text-sm">Nenhum exercício cadastrado ainda.</p>}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'mapas' && (
                                <div>
                                    {isAdmin && (
                                        <div className="mb-4">
                                            <button onClick={() => openMaterialModal('mapa')} className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 flex items-center gap-2">
                                                <i className="fas fa-plus"></i> Novo Mapa Mental (Link)
                                            </button>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {materials.filter(m => m.category === 'mapa').map(m => (
                                            <div key={m.id} className="p-6 bg-white border-2 border-slate-100 rounded-2xl hover:border-sky-500 transition-all relative flex flex-col justify-between group">
                                                {isAdmin && (
                                                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                                                        <button onClick={() => openMaterialModal('mapa', m)} className="text-slate-300 hover:text-sky-500">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button onClick={() => handleDeleteMaterial(m.id)} className="text-slate-300 hover:text-red-500">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                )}

                                                <div className="mb-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white ${m.type === 'VIDEO' ? 'bg-amber-500' :
                                                        m.type === 'XLS' ? 'bg-emerald-500' :
                                                            'bg-sky-600'
                                                        }`}>
                                                        <i className={`fas ${m.type === 'VIDEO' ? 'fa-video' :
                                                            m.type === 'XLS' ? 'fa-file-excel' :
                                                                'fa-project-diagram'
                                                            } text-xl`}></i>
                                                    </div>
                                                    <h4 className="font-bold text-slate-800 leading-tight">{m.name}</h4>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase mt-1 tracking-wider">{m.type}</p>
                                                </div>

                                                <a href={m.url} target="_blank" rel="noreferrer" className="w-full bg-slate-50 text-sky-600 py-2 rounded-lg text-xs font-bold text-center hover:bg-sky-600 hover:text-white transition-all border border-slate-100">
                                                    <i className="fas fa-external-link-alt mr-1"></i> Acessar
                                                </a>
                                            </div>
                                        ))}
                                        {materials.filter(m => m.category === 'mapa').length === 0 && <p className="text-slate-400 text-sm">Nenhum mapa mental cadastrado ainda.</p>}
                                    </div>
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

