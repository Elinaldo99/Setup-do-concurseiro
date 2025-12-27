import { useAuth } from '../contexts/AuthContext';

export const useAdmin = () => {
    const { user } = useAuth();
    return {
        isAdmin: user?.email === 'francoinvestimentoss@gmail.com',
        user
    };
};
