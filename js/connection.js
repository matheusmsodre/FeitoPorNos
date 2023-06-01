const url = 'https://8af6-2804-14c-5980-4053-9c86-e0a-963c-97d4.ngrok-free.app';

function loadChatBot() {
    new BlipChat()
        .withAppKey('ZmVpdG9wb3Jub3M6ZGNmMzY2OTAtZWM0YS00MGYyLWJlZTctOTJjZmRiODI3OWIz')
        .withButton({ "color": "#f3a02c", "icon": "" })
        .withCustomCommonUrl('https://matheus-sodre-yaanj.chat.blip.ai/')
        .build();
}

async function verifyConnection() {

    let userLogged = JSON.parse(localStorage.getItem('userLogged'));

    if (userLogged) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho'));

        if (carrinho.length)
            updateCartValue(carrinho.length);

        if (getEndPoint() != 'login.html') {
            if (userLogged.profile == 'seller' && document.querySelector('#btnLogin')) {
                setProfileIcon(userLogged.profile, userLogged);
            }

            if (userLogged.profile == 'user' && document.querySelector('#btnLogin')) {
                setProfileIcon(userLogged.profile, userLogged);
            }
        } else {
            window.location.href = '../../index.html';
        }
    }
}

function setProfileIcon(profile, userLogged) {
    let href = '/menuUser/userComum.html';
    let url = window.location.href;

    url = url.split('/');
    url = url[url.length - 1];
    console.log(url)
    if (url == 'index.html')
        document.querySelector('#btnLogin').href = 'pages' + href;
    else
        document.querySelector('#btnLogin').href = '..' + href;

    let icons = document.querySelectorAll('.navbar__item');

    if (profile == 'user') {
        icons.forEach((element, index) => {
            if (index == 0 || index == 4)
                element.style.display = 'inline';
        });
    } else {
        icons.forEach((element, index) => {
            if (index != 3)
                element.style.display = 'inline';
        });
    }

    let firstName = (userLogged.nome.split(' '))[0];
    document.querySelector('#logintransform').innerText = firstName;
}

async function connectionOn() {

    const data = {
        email: document.querySelector('#email-login').value,
        senha: document.querySelector('#password-login').value
    };


    const response = await fetch(url + '/set/connection', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (response.status == 200) {
        let person = await response.json();

        localStorage.setItem('userLogged', JSON.stringify(person));
        localStorage.setItem('carrinho', '[]');

        if (localStorage.getItem('productToCar')) {
            let href = localStorage.getItem('productToCar');
            localStorage.removeItem('productToCar');
            window.location.href = href;
        } else
            window.location.href = '../../index.html'

    } else {
        alert('Usuário não encontrado');
    }

}

async function connectionOff() {
    //get item session storage
    let userLogged = JSON.parse(localStorage.getItem('userLogged'));

    await fetch(url + '/set/connection/loggout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userLogged),
    })

    localStorage.clear();
    window.location.href = '../../index.html';
}

async function loadProfile() {

    let userLogged = JSON.parse(localStorage.getItem('userLogged'));

    if (userLogged) {
        document.querySelector('#profileName').innerText = userLogged.nome;
        document.querySelector('#profileEmail').innerText = userLogged.email;
    } else {
        window.location.href = '../../index.html';
    }
}

async function openProduct(categoria) {
    const body = {
        allProducts: true
    }

    const response = await fetch(url + '/get/products/all', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    const products = (await response.json())[categoria];
    console.log(products)

    if (products.length) {
        document.querySelector('#semproduto').style.display = 'none';
        document.querySelector('#categoriaCabe').style.display = 'contents';
        document.querySelector('#categoriaPage').innerHTML += getBody(products, categoria);
    } else {
        let userLogged = JSON.parse(localStorage.getItem('userLogged'));

        if (userLogged && userLogged.profile == 'seller') {
            document.querySelector('#semproduto').style.display = 'flex';
        } else {
            document.querySelector('#semproduto').style.display = 'flex';
            document.querySelector('#semproduto').querySelector('button').style.display = 'none';
        }
    }
}

function getBody(products, categoria) {
    let body = '';
    console.log("---> " + products)
    products.forEach(element => {
        body += `<tr>
        <td>
            <div class="product">
                    <img src="../../assets/img/cosmeticosDaIlha.png" alt="">
                <div class="info">
                    <div class="name">${element.nomeProduto}</div>
                    <div class="categoria">${element.categoria}</div>
                </div>
            </div>
        </td>
        <td id="price">R$ ${element.precoProduto},00</td>
        <td><button class="comprarProduto" onclick="openProductPage(${element.sellerId}, ${element.id},'${categoria}','${element.categoria}','${element.nomeProduto}', ${element.precoProduto})">Ver Detalhes</button></td>
    </tr>`
    });

    return `<tbody>${body}</tbody>`;
}

async function openProductPage(sellerId, id, categoria, fullCategoria, nome, price) {

    const choosedProduct = {
        sellerId,
        id,
        categoria,
        fullCategoria,
        nome,
        price
    }

    localStorage.setItem('product', JSON.stringify(choosedProduct));
    window.location.href = '../pagina_produtos/pagina_produto.html';
}

function plusCounter(id = 'empty') {

    if (id != 'empty') {
        let currentValue = parseInt(document.querySelectorAll(".productCounter")[id].innerText);
        currentValue++;

        let carrinho = JSON.parse(updateInsideCart(id, currentValue));

        document.querySelectorAll('.cartTotal')[id].innerText = carrinho[id].qtd * carrinho[id].product.price;
        document.querySelectorAll(".productCounter")[id].innerText = currentValue;
        updateTotalCart();
    } else {
        let currentValue = parseInt(document.querySelector("#productCounter").innerText);

        currentValue++;
        document.querySelector("#productCounter").innerText = currentValue;
    }
}

function minusCounter(id = 'empty') {

    if (id != 'empty') {
        let currentValue = parseInt(document.querySelectorAll(".productCounter")[id].innerText);

        if (currentValue > 1)
            currentValue--;

        let carrinho = JSON.parse(updateInsideCart(id, currentValue));

        document.querySelectorAll('.cartTotal')[id].innerText = carrinho[id].qtd * carrinho[id].product.price;
        document.querySelectorAll(".productCounter")[id].innerText = currentValue;
        updateTotalCart();
    } else {
        let currentValue = parseInt(document.querySelector("#productCounter").innerText);

        if (currentValue > 0)
            currentValue--;

        document.querySelector("#productCounter").innerText = currentValue;
    }
}

async function loadProduct() {

    let infoProduct = JSON.parse(localStorage.getItem('product'));

    const body = {
        allProducts: true
    }

    const response = await fetch(url + '/get/products/all', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    const products = await response.json();

    let choosedProduct = products[infoProduct.categoria].find(element =>
        element.sellerId == infoProduct.sellerId && element.id == infoProduct.id);

    document.querySelector('#productCategory').innerText = choosedProduct.categoria;
    document.querySelector('#productName').innerText = choosedProduct.nomeProduto;
    document.querySelector('#productDescription').innerText = choosedProduct.descricao;
    document.querySelector('#price').innerText = `R$${choosedProduct.precoProduto},00`;
    document.querySelector('#promoPrice').innerText = `R$${choosedProduct.precoProduto * 0.8},00`;
}

function getEndPoint() {
    let endPoint = window.location.href;
    endPoint = endPoint.split('/');
    endPoint = endPoint[endPoint.length - 1];

    return endPoint;
}


function sendProduct() {
    let userLogged = JSON.parse(localStorage.getItem('userLogged'));
    let infoProduct = JSON.parse(localStorage.getItem('product'));
    let qtd = document.querySelector('#productCounter').innerText;

    if (qtd == '0')
        return alert('Informe uma quantidade!');

    if (!userLogged) {
        localStorage.setItem('productToCar', `${window.location.href}`);
        window.location.href = '../login/login.html';
    } else {
        console.log(infoProduct, qtd)
        addToCart(infoProduct, qtd);
        console.log(JSON.parse(localStorage.getItem('carrinho')))
        document.querySelector("#productCounter").innerText = 0;
    }
}

function addToCart(infoProduct, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho'));
    let inCart = carrinho.some(element =>
        element.product.sellerId == infoProduct.sellerId &&
        element.product.id == infoProduct.id &&
        element.product.categoria == infoProduct.categoria
    )
    quantidade = parseInt(quantidade);

    if (inCart) {
        carrinho.forEach((element, index) => {
            if (element.product.sellerId == infoProduct.sellerId && element.product.id == infoProduct.id) {
                carrinho[index].qtd = carrinho[index].qtd + quantidade;
            }
        })
    } else
        carrinho.push({ product: infoProduct, qtd: quantidade });

    let carrinhoSize = carrinho.length;

    updateCartValue(carrinhoSize);
    carrinho = JSON.stringify(carrinho);
    localStorage.setItem('carrinho', carrinho);
}

function updateCartValue(carrinhoSize) {
    document.querySelector('#cartValue').innerText = carrinhoSize;
}

function updateInsideCart(id, quantidade, remove = false) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho'));

    if (remove) {
        carrinho[id] = null;
        carrinho = carrinho.filter(element => element !== null);
    } else
        carrinho[id].qtd = quantidade;

    carrinho = JSON.stringify(carrinho);
    localStorage.setItem('carrinho', carrinho);

    return carrinho;
}

function loadCart() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho'));

    if (carrinho.length) {
        document.querySelector('#semproduto').style.display = 'none';
        document.querySelector('#cartHead').style.display = 'contents';
        document.querySelector('#cartTable').innerHTML += getCartBody(carrinho);
        document.querySelector('#asideTotal').style.display = 'inline';
        updateTotalCart();
    } else {
        document.querySelector('#semproduto').style.display = 'flex';
        document.querySelector('#cartTable').style.display = 'none';
        document.querySelector('#asideTotal').style.display = 'none';
    }
}

function getCartBody(carrinho) {
    let body = '';

    carrinho.forEach((element, index) => {
        body += `<tr class="cartTableRow">
                        <td>
                            <div style="cursor: pointer;" class="product" onclick="openProductPage('${element.product.sellerId}', '${element.product.id}', '${element.product.categoria}', '${element.product.fullCategoria}', '${element.product.nome}', '${element.product.price}')">
                                <img src="../../assets/img/cosmeticosDaIlha.png" alt="">
                                <div class="info">
                                    <div class="name" id="cartName">${element.product.nome}</div>
                                    <div class="categoria" id="cartCategory">${element.product.fullCategoria}</div>
                                </div>
                            </div>
                            </td>
                            <td>R$ <span id="cartPrice">${element.product.price}</span>,00</td>
                        <td>
                            <div class="qty">
                                <button class="counterProduct" onclick="minusCounter(${index})"><i class="bx bx-minus" ></i></button>
                                <span class="productCounter">${element.qtd}</span>
                                <button class="counterProduct" onclick="plusCounter(${index})"><i class="bx bx-plus" ></i></button>
                            </div>
                        </td>
                        <td>R$ <span class="cartTotal">${element.product.price * element.qtd}</span>,00</td>
                        <td><button class="remover" onclick="removeProductCart(${index})"><i class="bx bx-x"></i></button></td>
                    </tr>`
    });

    return `<tbody>${body}</tbody>`
}

function getTotalCart() {
    let elements = document.querySelectorAll('.cartTotal');
    let totalPrice = 0;

    elements.forEach(element => {
        totalPrice += parseInt(element.innerText);
    });

    return totalPrice;
}

function updateTotalCart() {
    document.querySelector('#cartSubtotalPrice').innerText = getTotalCart();
    document.querySelector('#cartTotalPrice').innerText = getTotalCart();
}

function removeProductCart(id) {
    document.querySelectorAll('.cartTableRow')[id].remove();

    let size = JSON.parse(updateInsideCart(id, null, true)).length;
    updateCartValue(size);
    updateTotalCart();

    let elements = document.querySelectorAll('.remover');
    let buttons = document.querySelectorAll('.counterProduct');

    if (!elements.length) {
        loadCart();

        return;
    }

    buttons.forEach((button, index) => {
        if (index % 2 == 0)
            button.setAttribute('onclick', `minusCounter(${index / 2})`);
        else
            button.setAttribute('onclick', `plusCounter(${(index - 1) / 2})`);
    })

    elements.forEach((element, index) => {
        element.setAttribute("onclick", `removeProductCart(${index})`);
    });
}

async function getInventario(categoria) {
    let userLogged = JSON.parse(localStorage.getItem('userLogged'));

    let response = await fetch(url + `/set/seller/${userLogged.id}`, {
        method: 'POST'
    });

    let data = await response.json();
    let inventario = data.product[categoria];

    inventario = JSON.stringify(inventario);
    localStorage.setItem('inventario', inventario);

    window.location.href = 'perCategoria.html';
}

function loadInventario() {
    let inventario = JSON.parse(localStorage.getItem('inventario'));

    if (inventario.length) {
        document.querySelector('#page-title').innerText = inventario[0].categoria;
        document.querySelector('#inventCab').style.display = 'contents';
        document.querySelector('table').innerHTML += getInventarioBody(inventario);
    } else {
        document.querySelector('#page-title').style.color = 'red'
        document.querySelector('#page-title').innerHTML =
        `
        <div id="semproduto" style="font-size: 25px;">
            <h4>
                Sem produtos cadastrados <span>!</span>
            </h4>
            <button>
                <a href="../../pages/cadastro/cadastroProdutos.html">
                    Cadastrar agora
                </a>
            </button>
        </div>
        `;
    }
}


function getInventarioBody(inventario) {
    let body = '';

    inventario.forEach(produto => {
        body += `
        <tr>
            <td>
                <div class="product">
                    <img src="../../assets/img/cosmeticosDaIlha.png" alt="">
                    <div class="info">
                        <div class="name">${produto.nomeProduto}</div>
                        <div class="categoria" style="width: 50%;">${produto.descricao}</div>
                    </div>
                </div>
            </td>
            <td>R$ <span id="price">${produto.precoProduto}</span>,00</td>
            <td>${produto.precoProduto}</td>
        </tr>`
    })

    return `<tbody>${body}</tbody>`;
}