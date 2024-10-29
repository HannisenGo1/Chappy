import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorelog } from '../storage/storage';

interface Protected {
    children: any; 
}

const ProtectedRoute = ({ children }: Protected) => {
    const isLoggedIn = useStorelog(state => state.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn ? <>{children}</> : null; 
};

export default ProtectedRoute;
