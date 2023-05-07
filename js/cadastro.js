const input = document.getElementById('produto-imagem');
const preview = document.getElementById('produto-imagem-preview');
const removeButton = document.getElementById('remove-image-btn');
const maxSize = 350; // tamanho máximo da imagem em pixels

input.addEventListener('change', () => {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      // redimensiona a imagem se for maior que o tamanho máximo
      if (img.width > maxSize || img.height > maxSize) {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        preview.src = canvas.toDataURL();
      } else {
        preview.src = reader.result;
      }
      if (preview.src === '') {
        removeButton.style.display = 'none';
      } else {
        removeButton.style.display = 'block';
      }
    };
  };

  reader.readAsDataURL(file);
});

removeButton.addEventListener('click', () => {
  input.value = ''; // remove o arquivo selecionado
  preview.src = ''; // remove a imagem exibida
  removeButton.style.display = 'none'; // esconde o botão de remover imagem
});
