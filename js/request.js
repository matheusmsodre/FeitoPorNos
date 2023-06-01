const url = ' https://8af6-2804-14c-5980-4053-9c86-e0a-963c-97d4.ngrok-free.app'

async function cadastrarProdutos() {

    let userLogged = JSON.parse(localStorage.getItem('userLogged'));

    const body = {
        //link: (document.querySelector('#produto-imagem-preview').src,
        nomeProduto: document.querySelector("#produto-nome").value.trim()
            ? document.querySelector("#produto-nome").value
            : null,
        categoria: document.querySelector("#produto-categoria").value.trim()
            ? document.querySelector("#produto-categoria").value
            : null,
        precoProduto: document.querySelector("#produto-preco").value.trim()
            ? document.querySelector("#produto-preco").value
            : null,
        descricao: document.querySelector("#produto-desc").value.trim()
            ? document.querySelector("#produto-desc").value
            : null,
        qtd: document.querySelector("#produto-quantidade").value.trim()
            ? document.querySelector("#produto-quantidade").value
            : null
    };

    if (verifyEmptyField(body)) {
        alert('Preencha todos os campos');
    } else {
        document.querySelector("#signButton").disabled = true;
        await fetch(url + '/set/seller/product', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    seller: userLogged,
                    product: body
                }
            ),
        });

        setTimeout(() => {
            window.location.reload(true);
        }, 600);
    }
}

async function cadastrarVendedor() {

    const infoVendedor = {
        nome: document.querySelector("#nome-completo").value.trim()
            ? document.querySelector("#nome-completo").value
            : null,
        email: document.querySelector("#email").value.trim()
            ? document.querySelector("#email").value
            : null,
        nickname: document.querySelector("#produto-artesanato").value.trim()
            ? document.querySelector("#produto-artesanato").value
            : null,
        telefone: document.querySelector("#telefone").value.trim()
            ? document.querySelector("#telefone").value
            : null,
        senha: document.querySelector("#password").value.trim()
            ? document.querySelector("#password").value
            : null
    };

    if (verifyEmptyField(infoVendedor)) {
        alert('Preencha todos os campos')
    } else {
        document.querySelector("#signSeller").disabled = true;
        let email = document.getElementsByClassName('email')[0].value;
        let confirmEmail = document.getElementsByClassName('email')[1].value;
        let senha = document.getElementsByClassName('senha')[0].value;
        let confirmSenha = document.getElementsByClassName('senha')[1].value;

        if (email != confirmEmail) {
            alert("Os email's devem ser iguais!")
        } else if (senha != confirmSenha) {
            alert("As senhas devem ser iguais!")
        } else {
            const response = await fetch(url + '/set/seller', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(infoVendedor),
            });


            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 600);
        }
    }
}

async function cadastrarUser() {

    const infoUser = {
        nome: document.querySelector("#nome-completo").value.trim()
            ? document.querySelector("#nome-completo").value
            : null,
        email: document.querySelector("#email").value.trim()
            ? document.querySelector("#email").value
            : null,
        telefone: document.querySelector("#telefone").value.trim()
            ? document.querySelector("#telefone").value
            : null,
        senha: document.querySelector("#password").value.trim()
            ? document.querySelector("#password").value
            : null
    };

    if (verifyEmptyField(infoUser)) {
        alert('Preencha todos os campos')
    } else {
        document.querySelector("#signUser").disabled = true;
        let email = document.getElementsByClassName('email')[0].value;
        let confirmEmail = document.getElementsByClassName('email')[1].value;
        let senha = document.getElementsByClassName('senha')[0].value;
        let confirmSenha = document.getElementsByClassName('senha')[1].value;

        if (email != confirmEmail) {
            alert("Os email's devem ser iguais!")
        } else if (senha != confirmSenha) {
            alert("As senhas devem ser iguais!")
        } else {
            const response = await fetch(url + '/set/user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(infoUser),
            });

            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 600);
        }
    }
}

async function getProduct() {
    const response = await fetch(url + '/set/seller/product/1');

    const text = await response.json();
    console.log(text)
}

function verifyEmptyField(obj) {
    for (let info in obj) {
        if (!(obj[info])) {
            return true;
        }
    }

    return false;
}
