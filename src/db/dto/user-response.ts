export type ConsentResult = {
    id: string
    enabled: boolean
}

export type GetUserResponse = {
    id: string
    email: string
    consents: ConsentResult[]
}