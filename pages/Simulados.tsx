import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAdmin } from '../hooks/useAdmin';
import Modal from '../components/Modal';
import { Simulado } from '../types';

const Simulados: React.FC = () => {
    const { isAdmin } = useAdmin();
    const [simulados, setSimulados] = useState<Simulado[]>([]);
    const [selectedSimulado, setSelectedSimulado] = useState<Simulado | null>(null);

    // Admin State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSimulado, setEditingSimulado] = useState<Simulado | null>(null);
    const [newSimulado, setNewSimulado] = useState<Partial<Simulado>>({
        title: '',
        description: '',
        url: ''
    });

    useEffect(() => {
        fetchSimulados();
    }, []);

    const fetchSimulados = async () => {
        const { data, error } = await supabase
            .from('simulados')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching simulados:', error);
        } else if (data) {
            setSimulados(data);
        }
    };

    const handleSaveSimulado = async () => {
        if (!newSimulado.title || !newSimulado.url) {
            alert('Preencha título e URL');
            return;
        }

        try {
            if (editingSimulado) {
                const { error } = await supabase
                    .from('simulados')
                    .update(newSimulado)
                    .eq('id', editingSimulado.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('simulados')
                    .insert([newSimulado]);

                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingSimulado(null);
            setNewSimulado({ title: '', description: '', url: '' });
            fetchSimulados();
        } catch (error: any) {
            console.error('Error saving simulado:', error);
            alert('Erro ao salvar simulado: ' + (error.message || error.error_description || 'Erro desconhecido'));
        }
    };

    const handleDeleteSimulado = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Tem certeza que deseja excluir este simulado?')) return;

        try {
            const { error } = await supabase
                .from('simulados')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchSimulados();
            if (selectedSimulado?.id === id) setSelectedSimulado(null);
        } catch (error: any) {
            console.error('Error deleting simulado:', error);
            alert('Erro ao excluir simulado: ' + (error.message || error.error_description || 'Erro desconhecido'));
        }
    };

    const openModal = (simulado?: Simulado, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (simulado) {
            setEditingSimulado(simulado);
            setNewSimulado({
                title: simulado.title,
                description: simulado.description,
                url: simulado.url
            });
        } else {
            setEditingSimulado(null);
            setNewSimulado({ title: '', description: '', url: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSimulado ? "Editar Simulado" : "Novo Simulado"}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Título</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={newSimulado.title}
                            onChange={e => setNewSimulado({ ...newSimulado, title: e.target.value })}
                            placeholder="Ex: Simulado INSS 2024"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Descrição</label>
                        <textarea
                            className="w-full p-2 border rounded"
                            value={newSimulado.description}
                            onChange={e => setNewSimulado({ ...newSimulado, description: e.target.value })}
                            placeholder="Breve descrição do simulado"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">URL</label>
                        <input
                            type="url"
                            className="w-full p-2 border rounded"
                            value={newSimulado.url}
                            onChange={e => setNewSimulado({ ...newSimulado, url: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <button
                        onClick={handleSaveSimulado}
                        className="w-full bg-sky-600 text-white p-3 rounded font-bold hover:bg-sky-700"
                    >
                        Salvar
                    </button>
                </div>
            </Modal>

            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <i className="fas fa-laptop-code text-sky-600"></i> Simulados
                        </h2>
                        <p className="text-slate-500 mt-1">
                            No momento, nossa plataforma ainda não disponibiliza simulados nativos, mas selecionamos e indicamos abaixo as melhores plataformas com bancos de questões para você praticar.
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => openModal()}
                            className="bg-sky-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-sky-700 shadow-lg flex items-center gap-2"
                        >
                            <i className="fas fa-plus"></i> Novo Simulado
                        </button>
                    )}
                </div>

                {simulados.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <i className="fas fa-clipboard-list text-4xl text-slate-300 mb-4"></i>
                        <p className="text-slate-500">Nenhum simulado disponível no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {simulados.map((simulado) => (
                            <div
                                key={simulado.id}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-sky-300 hover:shadow-md transition-all group relative flex flex-col justify-between"
                            >
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                                        <button
                                            onClick={(e) => openModal(simulado, e)}
                                            className="text-slate-300 hover:text-sky-500 p-1"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteSimulado(simulado.id, e)}
                                            className="text-slate-300 hover:text-red-500 p-1"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-sky-50 p-3 rounded-xl group-hover:bg-sky-600 transition-colors">
                                            <i className="fas fa-file-alt text-sky-600 group-hover:text-white text-2xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{simulado.title}</h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Simulado Online</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-sm line-clamp-3 mb-4 min-h-[3rem]">
                                        {simulado.description || 'Sem descrição.'}
                                    </p>
                                </div>

                                <a
                                    href={simulado.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-slate-50 text-sky-600 py-2 rounded-lg text-sm font-bold text-center group-hover:bg-sky-600 group-hover:text-white transition-all border border-slate-100 block"
                                >
                                    <i className="fas fa-external-link-alt mr-2"></i> Iniciar Simulado
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simulados;
