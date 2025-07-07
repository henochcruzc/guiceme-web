export class Login {
    constructor(public username: string, public password: string, public rememberMe: boolean,
        public grant_type: string, public idSistema: number) { }
}
