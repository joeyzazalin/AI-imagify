import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
                headers: { token }
            });
                
            if(data.success) {
                setCredit(data.creditBalance);
                setUser(data.user);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const generateImage = async (prompt) => {
        try {
            setIsLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            };

            const { data } = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                { prompt },
                config
            );

            if (data.success) {
                setGeneratedImage(data.resultImage);
                await loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                await loadCreditsData();
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error generating image';
            toast.error(errorMessage);
            console.error('Generate image error:', error.response || error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setGeneratedImage(null);
    }

    useEffect(() => {
        if(token) {
            loadCreditsData()
        }
    }, [token])

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage,
        generatedImage,
        isLoading
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;