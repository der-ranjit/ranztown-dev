export interface Action<N = string,T = any> {
    name: N;
    data: T;
}

export type Notification = Action<"notification", {message: string}>;
