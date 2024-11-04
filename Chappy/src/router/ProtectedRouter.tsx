import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../storage/storage';

interface Protected {
    children: any; 
}

const ProtectedRoute = ({ children }: Protected) => {
    const isLoggedIn = useStore(state => state.isLoggedIn);
    const token = useStore(state => state.jwt); 
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isLoggedIn || !token) {
            navigate('/public'); 
        }
    }, [isLoggedIn, token, navigate]);
    
    return (isLoggedIn && token) ? <>{children}</> : null; 
};

export default ProtectedRoute;
