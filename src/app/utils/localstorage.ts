export class LocalStorageUtils{

    public salvarUsuario(user: string){
        localStorage.setItem('user', JSON.stringify(user));
    }

    public obterUsuario(){
        return JSON.parse(localStorage.getItem('user'));
    }

    public salvarTokenUsuario(token: string){
        localStorage.setItem('userToken', token);
    }

    public obterTokenUsuario(): string{
        return JSON.parse(localStorage.getItem('userToken'));
    }

    public salvarDadosLocaisUsuario(response: any){
        this.salvarTokenUsuario(response.token);
        //this.salvarUsuario(response.user);
        this.decodeToken();
    }

    public limparDadosUsuario(){
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    }

    private decodeToken() {
        var jwt = require('jsonwebtoken');
        var token = this.obterTokenUsuario();
        var user = jwt.decode(token);
        this.salvarUsuario(user);
    }

}