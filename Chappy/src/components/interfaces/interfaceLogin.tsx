export interface LoginResponse {
    jwt: string;
    name: string; 
}
export interface Chat {
    sender: string;
    receiver: string;
    message: string;
}
export interface LoginData {
    name: string;
    password: string;
}


