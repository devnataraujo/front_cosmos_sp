class User {

    // atributos
    constructor() { 
        //nome, email, senha, telefone
        this.nome = '';
        this.email = '';
        this.senha = '';
        this.telefone = '';
    };


    lerDadosCadastro() {
        let user = {};	

        // declarando os valores para o objeto
        user.email = document.getElementById('inp_email').value;
        user.senha = document.getElementById('inp_senha').value;
        user.nome = document.getElementById('inp_nome').value;
        user.telefone = document.getElementById('inp_tel').value;
        user.confSenhaUser = document.getElementById('inp_conf_senha').value;

        return user;    
    };

    exibirCorrecoes(elemento, texto) {
        elemento.innerHTML = texto;
    };


    validarCamposCadastro(user){
        const elementos = document.querySelectorAll('.valid-text');

        elementos.forEach(elemento => {
            elemento.innerHTML = '';
        });


        if(user.nome == ''){
            this.exibirCorrecoes(document.getElementById('erro_nome'), 'O campo nome é obrigatório!');
            return false;
        }

        if(user.telefone == ''){
            this.exibirCorrecoes(document.getElementById('erro_tel'), 'O campo telefone é obrigatório!');
            return false;
        }
        
        if(user.email == '' ){
            this.exibirCorrecoes(document.getElementById('erro_email'), 'O campo email é obrigatório!');
            return false;
        }

        //validando formato do email
        if(user.email.indexOf('@') == -1 || user.email.indexOf('.') == -1 ){
            this.exibirCorrecoes(document.getElementById('erro_email'), 'O campo de email está no formato inválido!');
            return false;
        }     

        if(user.senha.trim() == ''){
            this.exibirCorrecoes(document.getElementById('erro_senha'), 'O campo senha é obrigatório!');
            return false;
        }

        //validando tamanho da senha
        if(user.senha.length < 8){
            this.exibirCorrecoes(document.getElementById('erro_senha'), 'O campo senha deve ter no mínimo 8 caracteres!');
            return false;
        }

        if(user.confSenhaUser == ''){
            this.exibirCorrecoes(document.getElementById('erro_conf_senha'), 'O campo confirmar senha é obrigatório!');
            return false;
        }
        if(user.senha != user.confSenhaUser){
            this.exibirCorrecoes(document.getElementById('erro_conf_senha'), 'O campo confirmar senha deve ser igual ao campo senha!');
            return false;
        }

        return true;
    };

    cadastrar() {
        let novoUsuario = this.lerDadosCadastro();
        if(this.validarCamposCadastro(novoUsuario)){
            delete novoUsuario.confSenhaUser;
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novoUsuario),
            })
            .then(response => response.json())
            .then(data => {
                    window.location.href = 'login.html';
                })
                
        }else{
            alert('Erro ao cadastrar usuário!');
        }
    };

    logar() {
        let email = document.getElementById('inp_email_login').value;
        let senha = document.getElementById('inp_senha_login').value;
        let user = {
            email: email,
            senha: senha,
        };
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length > 0){
                sessionStorage.setItem('logado', JSON.stringify(data[0]));
                window.location.href = './interno/usuarios/home.html';
                
            }else{
                alert('Usuário ou senha inválidos!');
            }
        })
        .catch(error => console.log(error));
    };
};


let user = new User();
