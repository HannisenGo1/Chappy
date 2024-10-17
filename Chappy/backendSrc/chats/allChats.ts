
export interface ChatMessage {
    sender: string;
    receiver: string;
    message: string;
    timestamp: Date;
}

export const chatMessages: ChatMessage[] = [
    {
        sender: "Robin",
        receiver: "Lars",
        message: "Hej Lars! Hur mår du?",
        timestamp: new Date('2024-10-15T10:00:00')
    },
    {
        sender: "Lars",
        receiver: "Robin",
        message: "Tja Robin! Jag mår bra, tack! Själv?",
        timestamp: new Date('2024-10-15T10:05:00')
    },
    {
        sender: "Fredrik",
        receiver: "Anna",
        message: "Hej Anna! Har du sett senaste avsnittet av serien?",
        timestamp: new Date('2024-10-15T11:00:00')
    },
    {
        sender: "Anna",
        receiver: "Fredrik",
        message: "Ja, det var så spännande! Vad tyckte du?",
        timestamp: new Date('2024-10-15T11:15:00')
    },
    {
        sender: "Erik",
        receiver: "Robin",
        message: "Robin, vi borde ses snart!",
        timestamp: new Date('2024-10-15T12:00:00')
    },
    {
        sender: "Robin",
        receiver: "Erik",
        message: "Absolut! Vad sägs om på fredag?",
        timestamp: new Date('2024-10-15T12:05:00')
    },
    {
        sender: "Lars",
        receiver: "Fredrik",
        message: "Ska vi gå och ta en öl senare?",
        timestamp: new Date('2024-10-15T12:30:00')
    },
    {
        sender: "Fredrik",
        receiver: "Lars",
        message: "Låter bra! Vi ses då.",
        timestamp: new Date('2024-10-15T12:35:00')
    }
];
