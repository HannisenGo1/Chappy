import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { PrivateChannels } from "../components/PrivatePage";
import { PublicChannels } from "../components/channels"; 
import ProtectedRoute from "./ProtectedRouter";
import {CreateUser} from "../components/credelUser";


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
            {
                path: "/create-user",
                 element: <CreateUser />
            },
            
        ]
    }
]);

export { router };
