const table = document.getElementById('product-table');

// Obter dados do banco de dados
fetch('/api/products')
  .then(response => response.json())
  .then(data => {
    // Preencher a tabela com os dados
    const tbody = table.querySelector('tbody');
    data.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.price}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(error => console.error(error));

  $.ajax({
    url: '/api/products',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      // manipular a resposta aqui
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // tratar erros aqui
    }
  });
  $(document).ready(function() {

    function loadProducts() {
      $.ajax({
        url: '/api/products',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          // manipular a resposta aqui
        },
        error: function(jqXHR, textStatus, errorThrown) {
          // tratar erros aqui
        }
      });
    }
  
    loadProducts();
  
    function addProduct() {
      // código para adicionar um novo produto
    }
  
    $('#add-product-button').click(function() {
      addProduct();
    });
  
  });
  