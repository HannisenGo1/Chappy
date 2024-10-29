import { createBrowserRouter }  from "react-router-dom";
import App from "../App";
import Chats from "../components/Chats";
import PrivateChannels from "../components/PrivateChannels";
import ProtectedRoute from "./ProtectedRouter";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, 
        children: [
            {
                path: "chats",
                element: <Chats />
            },
            {
                path: "private-channels", 
                element: 
                    <ProtectedRoute> <PrivateChannels /></ProtectedRoute>
                
            },
        ]
    }
]);

export { router };