export type ActivityType = 'login' | 'material_view' | 'goal_completion';

interface Activity {
    timestamp: string;
    type: ActivityType;
    metadata?: any;
}

const STORAGE_KEY = 'user_activity_log';

export const recordActivity = (type: ActivityType, metadata?: any) => {
    const logs: Activity[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    logs.push({
        timestamp: new Date().toISOString(),
        type,
        metadata
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export const getActivityStats = () => {
    const logs: Activity[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Calculate Streak
    const dates = [...new Set(logs
        .filter(l => l.type === 'login' || l.type === 'material_view')
        .map(l => l.timestamp.split('T')[0]))]
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dates.length > 0) {
        if (dates[0] === today || dates[0] === yesterday) {
            streak = 1;
            for (let i = 0; i < dates.length - 1; i++) {
                const current = new Date(dates[i]);
                const next = new Date(dates[i + 1]);
                const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }
    }

    // Calculate Productivity (Today's Goals)
    const savedGoals = JSON.parse(localStorage.getItem('study_goals') || '[]');
    const totalGoals = savedGoals.length;
    const completedGoals = savedGoals.filter((g: any) => g.completed).length;
    const dailyProd = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Calculate Weekly Material Views
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const weeklyMaterialViews = logs.filter(l => l.type === 'material_view' && l.timestamp >= oneWeekAgo).length;
    const weeklyProd = Math.min(100, Math.round((weeklyMaterialViews / 10) * 100)); // Target 10 materials viewed per week

    return {
        streak,
        dailyProd,
        weeklyProd,
        totalMaterialViews: logs.filter(l => l.type === 'material_view').length
    };
};
