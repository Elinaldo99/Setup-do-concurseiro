import React from 'react';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: string;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${active ? 'border-sky-600 text-sky-600 bg-sky-50/50' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
    >
        <i className={`fas ${icon}`}></i>
        {label}
    </button>
);

export default TabButton;
