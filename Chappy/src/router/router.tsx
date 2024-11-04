import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { PrivateChannels } from "../components/PrivatePage";
import { PublicChannels } from "../components/channels"; 
import ProtectedRoute from "./ProtectedRouter";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, 
        children: [
            {
                path: "/private", 
                element: 
                <ProtectedRoute>
                <PrivateChannels />
                </ProtectedRoute>
            },
            {
                path: "/public",  
                element: <PublicChannels />
            },
            
        ]
    }
]);

export { router };
