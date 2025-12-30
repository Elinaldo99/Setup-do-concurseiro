import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import Modal from '../components/Modal';

interface Tip {
    id: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    created_at: string;
}

interface TipFile {
    id: string;
    name: string;
    format: string;
    icon: string;
    file_url: string;
    created_at: string;
}

const Dicas: React.FC = () => {
    const { isAdmin } = useAdmin();
    const [tips, setTips] = useState<Tip[]>([]);
    const [files, setFiles] = useState<TipFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Modals
    const [showTipModal, setShowTipModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [showReadModal, setShowReadModal] = useState(false);
    const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

    // Forms
    const [newTip, setNewTip] = useState({
        title: '',
        category: '',
        summary: '',
        content: ''
    });

    const [newFile, setNewFile] = useState({
        name: '',
        format: 'PDF',
        icon: 'fa-file-pdf',
        link: ''
    });

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchTips();
        fetchFiles();
    }, []);

    const fetchTips = async () => {
        try {
            const { data, error } = await supabase
                .from('tips')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTips(data || []);
        } catch (error) {
            console.error('Error fetching tips:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFiles = async () => {
        try {
            const { data, error } = await supabase
                .from('tip_files')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFiles(data || []);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleAddTip = async () => {
        if (!newTip.title || !newTip.category || !newTip.summary) {
            setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios' });
            return;
        }

        try {
            const { error } = await supabase
                .from('tips')
                .insert([newTip]);

            if (error) throw error;

            setShowTipModal(false);
            setNewTip({ title: '', category: '', summary: '', content: '' });
            setMessage({ type: 'success', text: 'Dica adicionada com sucesso!' });
            fetchTips();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao adicionar dica' });
        }
    };

    const handleDeleteTip = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta dica?')) return;

        try {
            const { error } = await supabase
                .from('tips')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Dica removida!' });
            fetchTips();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao remover dica' });
        }
    };

    const handleAddFile = async () => {
        if (!newFile.name || !newFile.link) {
            setMessage({ type: 'error', text: 'Preencha o nome e o link do arquivo' });
            return;
        }

        // Validate URL
        try {
            new URL(newFile.link);
        } catch {
            setMessage({ type: 'error', text: 'Link inválido. Use um URL completo (ex: https://...)' });
            return;
        }

        setUploading(true);
        try {
            const { error } = await supabase
                .from('tip_files')
                .insert([{
                    name: newFile.name,
                    format: newFile.format,
                    icon: newFile.icon,
                    file_url: newFile.link
                }]);

            if (error) throw error;

            setShowFileModal(false);
            setNewFile({ name: '', format: 'PDF', icon: 'fa-file-pdf', link: '' });
            setMessage({ type: 'success', text: 'Apostila adicionada com sucesso!' });
            fetchFiles();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao adicionar apostila' });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFile = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta apostila?')) return;

        try {
            const { error } = await supabase
                .from('tip_files')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Apostila removida!' });
            fetchFiles();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao remover apostila' });
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

    const getIconForFormat = (format: string) => {
        switch (format.toUpperCase()) {
            case 'PDF': return 'fa-file-pdf';
            case 'EPUB': return 'fa-book';
            case 'XLSX': case 'XLS': return 'fa-file-excel';
            case 'DOCX': case 'DOC': return 'fa-file-word';
            default: return 'fa-file';
        }
    };

    const handleReadTip = (tip: Tip) => {
        setSelectedTip(tip);
        setShowReadModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <i className="fas fa-circle-notch animate-spin text-4xl text-sky-600"></i>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Tip Modal */}
            <Modal isOpen={showTipModal} onClose={() => setShowTipModal(false)} title="Nova Dica/Guia">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Título *</label>
                        <input
                            type="text"
                            value={newTip.title}
                            onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="Ex: A Técnica Pomodoro"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Categoria *</label>
                        <select
                            value={newTip.category}
                            onChange={(e) => setNewTip({ ...newTip, category: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                        >
                            <option value="">Selecione...</option>
                            <option value="Produtividade">Produtividade</option>
                            <option value="Estratégia">Estratégia</option>
                            <option value="Memorização">Memorização</option>
                            <option value="Motivação">Motivação</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Resumo *</label>
                        <textarea
                            value={newTip.summary}
                            onChange={(e) => setNewTip({ ...newTip, summary: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            rows={2}
                            placeholder="Breve descrição da dica"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Conteúdo Completo (Opcional)</label>
                        <textarea
                            value={newTip.content}
                            onChange={(e) => setNewTip({ ...newTip, content: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            rows={4}
                            placeholder="Conteúdo detalhado da dica"
                        />
                    </div>
                    <button
                        onClick={handleAddTip}
                        className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700"
                    >
                        Adicionar Dica
                    </button>
                </div>
            </Modal>

            {/* File Link Modal */}
            <Modal isOpen={showFileModal} onClose={() => setShowFileModal(false)} title="Nova Apostila">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Arquivo *</label>
                        <input
                            type="text"
                            value={newFile.name}
                            onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="Ex: Manual do Concurseiro"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Formato</label>
                        <select
                            value={newFile.format}
                            onChange={(e) => {
                                const format = e.target.value;
                                setNewFile({ ...newFile, format, icon: getIconForFormat(format) });
                            }}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                        >
                            <option value="PDF">PDF</option>
                            <option value="EPUB">EPUB</option>
                            <option value="XLSX">XLSX</option>
                            <option value="DOCX">DOCX</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Link do Arquivo *</label>
                        <input
                            type="url"
                            value={newFile.link}
                            onChange={(e) => setNewFile({ ...newFile, link: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="https://drive.google.com/... ou outro link"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            <i className="fas fa-info-circle mr-1"></i>
                            Cole o link direto para download (Google Drive, Dropbox, etc.)
                        </p>
                    </div>
                    <button
                        onClick={handleAddFile}
                        disabled={uploading}
                        className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700 disabled:opacity-50"
                    >
                        {uploading ? <i className="fas fa-circle-notch animate-spin"></i> : 'Adicionar Apostila'}
                    </button>
                </div>
            </Modal>

            {/* Read Tip Modal */}
            <Modal isOpen={showReadModal} onClose={() => { setShowReadModal(false); setSelectedTip(null); }} title={selectedTip?.title || 'Dica'}>
                {selectedTip && (
                    <div className="space-y-4">
                        <div className="bg-sky-50 px-4 py-2 rounded-lg inline-block">
                            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-widest">{selectedTip.category}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-3">{selectedTip.summary}</h3>
                            {selectedTip.content ? (
                                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {selectedTip.content}
                                </div>
                            ) : (
                                <p className="text-slate-400 italic">Conteúdo completo não disponível.</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {message && (
                <div className={`mb-4 p-4 rounded-xl font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <i className="fas fa-magic text-sky-600"></i> Dicas Estratégicas
                </h2>
                {isAdmin && (
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setShowTipModal(true)}
                            className="flex-1 sm:flex-none bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <i className="fas fa-plus"></i> Nova
                        </button>
                        <button
                            onClick={() => setShowFileModal(true)}
                            className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            <i className="fas fa-upload"></i> Apostila
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Guias de Estudo Recomendados</h3>
                    {tips.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <i className="fas fa-lightbulb text-5xl mb-4 opacity-10"></i>
                            <p>Nenhuma dica cadastrada ainda.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {tips.map(tip => (
                                <div key={tip.id} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all flex flex-col justify-between relative group">
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteTip(tip.id)}
                                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    )}
                                    <div>
                                        <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">{tip.category}</span>
                                        <h4 className="text-xl font-bold text-slate-800 mt-3 mb-2">{tip.title}</h4>
                                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{tip.summary}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {tip.content && (
                                            <button
                                                onClick={() => handleReadTip(tip)}
                                                className="flex-1 py-3 bg-sky-50 text-sky-600 rounded-xl font-bold text-sm hover:bg-sky-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-book-open"></i> Ler
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Apostilas de Dicas</h3>
                        {files.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <i className="fas fa-file text-3xl mb-2 opacity-10"></i>
                                <p className="text-sm">Nenhuma apostila disponível.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {files.map(file => (
                                    <li
                                        key={file.id}
                                        className="flex items-center justify-between p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl transition-all cursor-pointer group relative"
                                    >
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteFile(file.id)}
                                                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <i className="fas fa-trash text-xs"></i>
                                            </button>
                                        )}
                                        <div className="flex items-center gap-4 flex-1" onClick={() => handleDownload(file.file_url, file.name)}>
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-sm group-hover:bg-sky-600 group-hover:text-white transition-all">
                                                <i className={`fas ${file.icon}`}></i>
                                            </div>
                                            <div>
                                                <span className="text-slate-700 text-sm font-bold block">{file.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase">{file.format}</span>
                                            </div>
                                        </div>
                                        <i className={`fas ${downloading === file.name ? 'fa-spinner animate-spin' : 'fa-download'} text-slate-300 group-hover:text-sky-600 transition-colors`}></i>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dicas;
