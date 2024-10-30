export interface User {
    username: string;
  }
  
  export interface Message {
    user: User;
    content: string;
  }
  
  export interface Channel {
    name: string;
    description: string;
    topic: string;
    users: any[];
    isOpen: boolean;
    messages: Message[]; 
  }
  
  export interface SendMessage {
    topic: string;
    message: {
      user: {
        username: string;
      };
      content: string;
    };
  }