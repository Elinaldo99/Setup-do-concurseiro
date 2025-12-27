import React, { useState, useEffect } from 'react';
import { Goal, Achievement } from '../types';

const Perfil: React.FC = () => {
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
        const savedGoals = localStorage.getItem('study_goals');
        if (savedGoals) setGoals(JSON.parse(savedGoals));

        const savedSchedule = localStorage.getItem('study_schedule');
        if (savedSchedule) {
            const parsed = JSON.parse(savedSchedule);
            setScheduleCount(parsed.length);
            if (parsed.length > 0) {
                unlockAchievement('1');
            }
        }
    }, []);

    const saveGoals = (updatedGoals: Goal[]) => {
        setGoals(updatedGoals);
        localStorage.setItem('study_goals', JSON.stringify(updatedGoals));

        const completedCount = updatedGoals.filter(g => g.completed).length;
        if (completedCount >= 5) {
            unlockAchievement('2');
        }
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* User Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden text-center p-8">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-5xl font-bold border-4 border-white shadow-lg mx-auto overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Concurseiro" alt="Avatar" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Concurseiro imparável</h3>
                        <p className="text-slate-500 text-sm mb-6">Em busca da vaga dos sonhos</p>

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
                </div>

                {/* Goals & Progress */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className="text-2xl font-bold text-slate-800">Minhas Metas Semanais</h4>
                                <p className="text-slate-500 text-sm">Transforme seus sonhos em passos concretos.</p>
                            </div>
                            <div className="bg-sky-50 px-4 py-2 rounded-2xl border border-sky-100">
                                <span className="text-sky-700 font-bold text-sm">{goals.filter(g => g.completed).length}/{goals.length} Feitas</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-8">
                            <input
                                type="text"
                                placeholder="Ex: Resolver 50 questões de Direito..."
                                value={newGoalText}
                                onChange={(e) => setNewGoalText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                                className="flex-1 bg-slate-50 border-2 border-transparent focus:border-sky-300 px-6 py-4 rounded-2xl outline-none transition-all"
                            />
                            <button onClick={addGoal} className="bg-sky-600 text-white px-8 rounded-2xl font-bold hover:bg-sky-700 transition-all">
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

                    <div className="grid md:grid-cols-2 gap-8">
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
