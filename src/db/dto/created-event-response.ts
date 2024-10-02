import { ConsentResult } from "./user-response";

export type PostEventResponse ={
    user: {id: string}
    consents: ConsentResult[]
}
