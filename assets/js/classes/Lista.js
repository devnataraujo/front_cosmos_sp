class Lista {

    // atributos
    constructor() {
        this.titulo = '';
        this.descricao = '';
        this.tipo = '';
        this.cor_lista = '';
        this.usuario = '';
    };


    lerDadosCadastro() {
        let lista = {};

        lista.titulo = document.getElementById('inp_titulo').value;
        lista.descricao = document.getElementById('inp_descricao').value;
        lista.tipo = document.getElementById('inp_tipo').value;


        lista.usuario = JSON.parse(sessionStorage.getItem('logado')).id_usuario;

        if (lista.tipo == 'Outros') {
            lista.tipo = document.getElementById('inp_outros').value;
        }

        // buscando o valor do input radio
        let cor = null;
        const rd_cor1 = document.getElementById('rd_cor1').value;
        const rd_cor2 = document.getElementById('rd_cor2').value;
        const rd_cor3 = document.getElementById('rd_cor3').value;
        const rd_cor4 = document.getElementById('rd_cor4').value;

        // verificando qual radio foi selecionado
        if (document.getElementById('rd_cor1').checked) {
            cor = rd_cor1;
        }

        if (document.getElementById('rd_cor2').checked) {
            cor = rd_cor2;
        }
        if (document.getElementById('rd_cor3').checked) {
            cor = rd_cor3;
        }
        if (document.getElementById('rd_cor4').checked) {
            cor = rd_cor4;
        }


        lista.cor_lista = cor;
        console.log(lista);
        return lista;
    };

    exibirCorrecoes(elemento, texto) {
        elemento.innerHTML = texto;
    };


    validarCamposCadastro(lista) {
        const elementos = document.querySelectorAll('.valid-text');

        elementos.forEach(elemento => {
            elemento.innerHTML = '';
        });

        if (lista.titulo == '') {
            this.exibirCorrecoes(document.getElementById('erro_titulo'), 'O campo título é obrigatório!');
            return false;
        }

        if (lista.tipo == '') {
            this.exibirCorrecoes(document.getElementById('erro_tipo'), 'O campo tipo é obrigatório!');
            return false;
        }

        if (lista.cor_lista == '') {
            this.exibirCorrecoes(document.getElementById('erro_cor'), 'O campo cor é obrigatório!');
            return false;
        }

        return true;
    };

    cadastrar() {
        let novaLista = this.lerDadosCadastro()
        if (this.validarCamposCadastro(novaLista)) {
            console.log(novaLista);
            fetch('http://localhost:3000/lista/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(novaLista),
            })
                .then(response => response.json())
                .then(data => {
                    window.location.href = "listas.html";
                })

        } else {
            alert('Erro ao cadastrar lista!');
        }
    };

    modelo_card(lista, cor) {
        let card = document.createElement('div');
        card.classList.add('col');
        //adicionar classe de cor
        card.innerHTML = `
            <div class="card-list">
                <div class="card-info" onclick="lista.abrir_infos(${lista.id_lista}, '${lista.titulo}', '${lista.descricao}')">
                    <h5 class="title titulo-${cor}">
                        ${lista.titulo}
                    </h5>
                    <p class="desc">
                        ${lista.descricao}
                    </p>
                    <div class="flag-type ">
                        <p class="flag-text flag-${cor}">
                            ${lista.tipo}
                        </p>
                    </div>
                </div>  
            </div>
            `;
        return card;
    }


    exibirListas(lista) {
        let listas = document.getElementById('listas_exibir');
        listas.innerHTML = '';
        let cor = null;
        lista.forEach(element => {
            if (element.cor_lista == '#5435C5') {
                cor = 'roxo';
            }
            if (element.cor_lista == '#A191D9') {
                cor = 'lilas';
            }
            if (element.cor_lista == '#01CCA7') {
                cor = 'verde';
            }
            if (element.cor_lista == '#DAAA02') {
                cor = 'amarelo';
            }
            listas.appendChild(this.modelo_card(element, cor));

        });
    }

    buscar_lista(id_usuario){
        const url = `http://localhost:3000/lista/user/${id_usuario}`;
        const fetchLista = async () => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            this.exibirListas(json);
        }

        fetchLista();
    }

    abrir_infos(id_lista, nome, desc) {
        sessionStorage.setItem('id_lista', id_lista);
        sessionStorage.setItem('nome_lista', nome);
        sessionStorage.setItem('desc_lista', desc);
        window.location.href = "lista.html";
    }

    // const {titulo, descricao, data_inicio, data_conclusao, flag_conclusao, lista, etapa} = infos; //desestruturando o objeto infos


    ler_dados_tarefa(){
        let tarefa = {};
        tarefa.titulo = document.getElementById('inp_titulo').value;
        tarefa.descricao = document.getElementById('inp_descricao').value;
        tarefa.data_inicio = document.getElementById('inp_dt_inicio').value;
        tarefa.data_conclusao = document.getElementById('inp_dt_fim').value;
        tarefa.etapa = 1;
        tarefa.lista = sessionStorage.getItem('id_lista');

        if(tarefa.data_fim != ''){
            tarefa.flag_conclusao = 1;
        }
        else
        {
            tarefa.flag_conclusao = 0;
        }

        return tarefa;
    }

    cadastrar_tarefa() {
        let novaTarefa = this.ler_dados_tarefa();
        console.log(novaTarefa);
        fetch('http://localhost:3000/tarefa/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaTarefa),
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = "lista.html";
            })
    }

    modelo_tarefa(tarefa){
        // separar por cor de acordo com a cor da lista
        let cor = null;
        if (tarefa.cor_lista == '#5435C5') {
            cor = 'roxo';
        }
        if (tarefa.cor_lista == '#A191D9') {
            cor = 'lilas';
        }
        if (tarefa.cor_lista == '#01CCA7') {
            cor = 'verde';
        }
        if (tarefa.cor_lista == '#DAAA02') {
            cor = 'amarelo';
        }
        

        let card = document.createElement('div');
        card.classList.add('card-task');
        card.classList.add(`card-${cor}`);
        card.onclick = function() {abrir_infos_tarefa(tarefa.id_tarefa, tarefa.titulo, tarefa.descricao, tarefa.data_inicio, tarefa.data_conclusao, tarefa.flag_conclusao, tarefa.lista, tarefa.etapa)};
        card.id = `task_card`;
        card.setAttribute('data-bs-toggle', 'modal');
        card.setAttribute('data-bs-target', '#modal_teste');
        card.innerHTML = `
            <p class="title">
                ${tarefa.titulo}
            </p>
            <p class="desc">
                ${tarefa.descricao}
            </p>
        `;
        
        return card;
    }

    abrir_infos_tarfea(id_tarefa) {
        let modal = document.getElementById('modal_teste')
        let title = document.getElementById('titulo_teste')

        title.innerHTML = 'Informações da tarefa'
    }

    exibirTarefas(tarefas){
        // separar exibições por etapa
        let tarefas_etapa1 = document.getElementById('etapa1');
        let tarefas_etapa2 = document.getElementById('etapa2');
        let tarefas_etapa3 = document.getElementById('etapa3');
        let tarefas_etapa4 = document.getElementById('etapa4');

        tarefas_etapa1.innerHTML = '';
        tarefas_etapa2.innerHTML = '';
        tarefas_etapa3.innerHTML = '';
        tarefas_etapa4.innerHTML = '';

        tarefas.forEach(element => {
            if(element.etapa == 1){
                tarefas_etapa1.appendChild(this.modelo_tarefa(element));
            }
            if(element.etapa == 2){
                tarefas_etapa2.appendChild(this.modelo_tarefa(element));
            }
            if(element.etapa == 3){
                tarefas_etapa3.appendChild(this.modelo_tarefa(element));
            }
            if(element.etapa == 4){
                tarefas_etapa4.appendChild(this.modelo_tarefa(element));
            }
        });


    }
    
    buscar_tarefas(id_lista, id_usuario){
        const url = `http://localhost:3000/tarefa/lista/${id_usuario}/${id_lista}`;
        const fetchTarefas = async () => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // verificar se o status é 200
            const json = await response.json();
            if(json.length > 0){
                // verificar cor da lista
                if(json[0].cor_lista == '#5435C5'){
                    document.getElementById('lista_infos').classList.add('infos-roxo');
                }
                if(json[0].cor_lista == '#A191D9'){
                    document.getElementById('lista_infos').classList.add('infos-lilas');
                }
                if(json[0].cor_lista == '#01CCA7'){
                    document.getElementById('lista_infos').classList.add('infos-verde');
                }
                if(json[0].cor_lista == '#DAAA02'){
                    document.getElementById('lista_infos').classList.add('infos-amarelo');
                }
                this.exibirTarefas(json);
            }
            else{
                console.log('Lista vazia');
            }

        }

        fetchTarefas();
    }

    buscar_tarefa(id_tarefa){
        const url = `http://localhost:3000/tarefa/${id_tarefa}`;
        const fetchTarefa = async () => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // verificar se o status é 200
            const json = await response.json();
            if(json.length > 0){
                console.log(json);
                document.getElementById('inp_titulo').value = json[0].titulo;
                document.getElementById('inp_descricao').value = json[0].descricao;
                document.getElementById('inp_dt_inicio').value = json[0].data_inicio;
                document.getElementById('inp_dt_fim').value = json[0].data_conclusao;
                document.getElementById('inp_etapa').value = json[0].etapa;
                document.getElementById('inp_flag').value = json[0].flag_conclusao;
                document.getElementById('inp_lista').value = json[0].lista;
            }
            else{
                console.log('Tarefa não encontrada');
            }

        }

        fetchTarefa();
    }
};




let lista = new Lista();
