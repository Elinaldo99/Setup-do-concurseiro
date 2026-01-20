import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Goal, Achievement } from '../types';
import Modal from '../components/Modal';

interface Profile {
    id: string;
    full_name: string;
    bio: string;
    avatar_url: string | null;
}

const Perfil: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Form states
    const [editForm, setEditForm] = useState({ full_name: '', bio: '' });
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Goals and achievements (existing functionality)
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoalText, setNewGoalText] = useState('');
    const [scheduleCount, setScheduleCount] = useState(0);
    const [achievements, setAchievements] = useState<Achievement[]>([
        { id: '1', title: 'Primeiro Passo', description: 'Criou seu primeiro cronograma', icon: 'fa-walking', unlocked: false },
        { id: '2', title: 'Focado', description: 'Completou 5 metas pessoais', icon: 'fa-bullseye', unlocked: false },
        { id: '3', title: 'Guru da Revisão', description: 'Acessou 3 resumos de IA', icon: 'fa-brain', unlocked: true },
        { id: '4', title: 'Maratonista', description: 'Estudou por 7 dias seguidos', icon: 'fa-running', unlocked: false },
    ]);

    useEffect(() => {
        fetchUserProfile();
        loadGoalsAndSchedule();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            if (authError || !authUser) {
                navigate('/auth');
                return;
            }
            setUser(authUser);

            // Fetch or create profile
            const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            let finalProfile = existingProfile;

            if (fetchError && fetchError.code === 'PGRST116') {
                console.log('Perfil não encontrado, criando padrão...');
                const newProfile = {
                    id: authUser.id,
                    full_name: authUser.user_metadata?.full_name || 'Concurseiro',
                    bio: 'Em busca da vaga dos sonhos',
                    avatar_url: null
                };
                const { data: createdProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert([newProfile])
                    .select()
                    .single();

                if (insertError) {
                    console.error('Erro ao criar perfil:', insertError);
                } else {
                    finalProfile = createdProfile;
                }
            } else if (fetchError) {
                console.error('Erro ao buscar perfil:', fetchError);
            }

            if (finalProfile) {
                setProfile(finalProfile);
                setEditForm({
                    full_name: finalProfile.full_name || '',
                    bio: finalProfile.bio || ''
                });
            }
        } catch (error) {
            console.error('Erro inesperado no perfil:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadGoalsAndSchedule = () => {
        const savedGoals = localStorage.getItem('study_goals');
        if (savedGoals) setGoals(JSON.parse(savedGoals));

        const savedSchedule = localStorage.getItem('study_schedule');
        if (savedSchedule) {
            const parsed = JSON.parse(savedSchedule);
            setScheduleCount(parsed.length);
            if (parsed.length > 0) unlockAchievement('1');
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user) return;

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        setUploading(true);
        try {
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
            setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao fazer upload' });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);

        try {
            console.log('Salvando perfil para:', user.id, editForm);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editForm.full_name,
                    bio: editForm.bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            setProfile(prev => prev ? { ...prev, ...editForm } : null);
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        } catch (error: any) {
            console.error('Erro ao salvar perfil:', error);
            setMessage({ type: 'error', text: `Erro ao salvar: ${error.message || 'Erro desconhecido'}` });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.new !== passwordForm.confirm) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' });
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.new
            });

            if (error) throw error;

            setShowPasswordModal(false);
            setPasswordForm({ current: '', new: '', confirm: '' });
            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao alterar senha' });
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    // Goals functions (existing)
    const saveGoals = (updatedGoals: Goal[]) => {
        setGoals(updatedGoals);
        localStorage.setItem('study_goals', JSON.stringify(updatedGoals));
        const completedCount = updatedGoals.filter(g => g.completed).length;
        if (completedCount >= 5) unlockAchievement('2');
    };

    const unlockAchievement = (id: string) => {
        setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));
    };

    const addGoal = () => {
        if (!newGoalText.trim()) return;
        const newGoal: Goal = {
            id: Date.now().toString(),
            text: newGoalText,
            completed: false,
            category: 'Estudo'
        };
        saveGoals([...goals, newGoal]);
        setNewGoalText('');
    };

    const toggleGoal = (id: string) => {
        saveGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const removeGoal = (id: string) => {
        saveGoals(goals.filter(g => g.id !== id));
    };

    const completionRate = goals.length > 0 ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100) : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <i className="fas fa-circle-notch animate-spin text-4xl text-sky-600"></i>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Password Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Alterar Senha">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nova Senha</label>
                        <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="Digite a nova senha"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirmar Senha</label>
                        <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500"
                            placeholder="Confirme a nova senha"
                        />
                    </div>
                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-sky-600 text-white py-3 rounded-xl font-bold hover:bg-sky-700"
                    >
                        Alterar Senha
                    </button>
                </div>
            </Modal>

            {message && (
                <div className={`mb-4 p-4 rounded-xl font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden text-center p-8">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-5xl font-bold border-4 border-white shadow-lg mx-auto overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name}`} alt="Avatar" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-sky-600 text-white w-10 h-10 rounded-full border-4 border-white cursor-pointer flex items-center justify-center hover:bg-sky-700 transition-colors">
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
                                <i className={`fas ${uploading ? 'fa-circle-notch animate-spin' : 'fa-camera'} text-sm`}></i>
                            </label>
                        </div>

                        {isEditing ? (
                            <div className="space-y-3 mb-4">
                                <input
                                    type="text"
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-center font-bold"
                                    placeholder="Nome"
                                />
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-center text-sm"
                                    placeholder="Biografia"
                                    rows={2}
                                />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveProfile} className="flex-1 bg-sky-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-sky-700">
                                        Salvar
                                    </button>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-300">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-slate-800">{profile?.full_name}</h3>
                                <p className="text-slate-500 text-sm mb-4">{profile?.bio}</p>
                                <button onClick={() => setIsEditing(true)} className="text-sky-600 text-sm font-bold hover:underline mb-4">
                                    <i className="fas fa-edit mr-1"></i> Editar Perfil
                                </button>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-4 border-t pt-6">
                            <div>
                                <p className="text-2xl font-extrabold text-sky-600">{scheduleCount}</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Blocos de Estudo</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-sky-600">{completionRate}%</p>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Metas batidas</p>
                            </div>
                        </div>

                        <div className="border-t mt-6 pt-6 space-y-2">
                            <button onClick={() => setShowPasswordModal(true)} className="w-full text-slate-600 py-2 rounded-lg hover:bg-slate-50 font-bold text-sm flex items-center justify-center gap-2">
                                <i className="fas fa-key"></i> Alterar Senha
                            </button>
                            <button onClick={handleLogout} className="w-full text-red-600 py-2 rounded-lg hover:bg-red-50 font-bold text-sm flex items-center justify-center gap-2">
                                <i className="fas fa-sign-out-alt"></i> Sair
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-trophy text-yellow-500"></i> Suas Conquistas
                        </h4>
                        <div className="grid grid-cols-4 gap-4">
                            {achievements.map(a => (
                                <div key={a.id} title={`${a.title}: ${a.description}`} className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all cursor-help ${a.unlocked ? 'bg-sky-600 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-300 opacity-50 grayscale'}`}>
                                    <i className={`fas ${a.icon}`}></i>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-headset text-sky-600"></i> Suporte Exclusivo
                        </h4>
                        <div className="space-y-3">
                            <a
                                href="https://t.me/setupdoconcurseirobot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-between p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                                        <i className="fab fa-telegram-plane"></i>
                                    </div>
                                    <span className="font-bold text-sky-900 text-sm">Bot Suporte</span>
                                </div>
                                <i className="fas fa-external-link-alt text-sky-300 group-hover:text-sky-600 text-xs"></i>
                            </a>

                            <div className="grid grid-cols-3 gap-2">
                                <a
                                    href="https://t.me/setupdoconcurseiro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-sky-600 hover:text-white transition-all"
                                    title="Canal Telegram"
                                >
                                    <i className="fab fa-telegram-plane"></i>
                                </a>
                                <a
                                    href="https://www.facebook.com/profile.php?id=61585865818712"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-sky-600 hover:text-white transition-all"
                                    title="Facebook"
                                >
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a
                                    href="mailto:setupdoconcurseiro@gmail.com"
                                    className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-sky-600 hover:text-white transition-all"
                                    title="E-mail"
                                >
                                    <i className="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Goals & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h4 className="text-xl sm:text-2xl font-bold text-slate-800">Minhas Metas Semanais</h4>
                                <p className="text-slate-500 text-sm">Transforme seus sonhos em passos concretos.</p>
                            </div>
                            <div className="bg-sky-50 px-4 py-2 rounded-2xl border border-sky-100 w-full sm:w-auto text-center">
                                <span className="text-sky-700 font-bold text-sm">{goals.filter(g => g.completed).length}/{goals.length} Feitas</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mb-8">
                            <input
                                type="text"
                                placeholder="Ex: Resolver 50 questões de Direito..."
                                value={newGoalText}
                                onChange={(e) => setNewGoalText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                                className="flex-1 bg-slate-50 border-2 border-transparent focus:border-sky-300 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl outline-none transition-all"
                            />
                            <button onClick={addGoal} className="bg-sky-600 text-white px-8 py-3 sm:py-0 rounded-2xl font-bold hover:bg-sky-700 transition-all">
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {goals.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <i className="fas fa-clipboard-list text-5xl mb-4 opacity-10"></i>
                                    <p>Nenhuma meta definida ainda. Comece agora!</p>
                                </div>
                            ) : (
                                goals.map(goal => (
                                    <div key={goal.id} className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${goal.completed ? 'bg-green-50 border-green-100' : 'bg-white border-slate-50 hover:border-sky-100'}`}>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => toggleGoal(goal.id)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${goal.completed ? 'bg-green-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                                <i className="fas fa-check text-xs"></i>
                                            </button>
                                            <span className={`font-semibold ${goal.completed ? 'text-green-700 line-through opacity-70' : 'text-slate-700'}`}>{goal.text}</span>
                                        </div>
                                        <button onClick={() => removeGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fas fa-chart-line text-sky-600"></i> Produtividade
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 tracking-wide">
                                        <span>FOCO DIÁRIO</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-sky-500 w-[85%] rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 tracking-wide">
                                        <span>REVISÃO SEMANAL</span>
                                        <span>40%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400 w-[40%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-2 tracking-wide">Streak de Estudo</h4>
                                <p className="text-4xl font-extrabold mb-4 flex items-baseline gap-2">7 <span className="text-lg font-medium opacity-80 uppercase">dias</span></p>
                                <p className="text-sm opacity-90 leading-snug">Você está entre os 5% melhores estudantes da plataforma hoje! Continue firme.</p>
                            </div>
                            <i className="fas fa-fire absolute right-[-10px] bottom-[-10px] text-[120px] text-white/10 rotate-12 pointer-events-none"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
