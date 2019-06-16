export interface ISocket {
    readonly id: string;
    playerID: string;
    roomID: string;
    broadcast: {
        emit: (action: string) => void;
    };
    join: (roomID: string) => void;
    emit: (action: string, payload?: any) => void;
    on: (method: string, cb: (param?: any) => void) => void;
}
