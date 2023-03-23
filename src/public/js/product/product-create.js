axios
  .get('/api/products/category')
  .then((res) => {
    let data = res.data.categories;
    let temp = '';
    for (let i = 0; i < data.length; i++) {
      temp += `<option value="${data[i].id}">${data[i].name}</option>`;
    }
    document.getElementById('categorySelect').innerHTML = temp;
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status === 401) {
      alert('로그인해야 주문이 가능합니다.');
      window.location.href = '/login';
    }
  });

const imageInput = document.querySelector('#images');
const imagePreview = document.querySelector('#image-preview');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', form.title.value);
  formData.append('description', form.description.value);
  formData.append('price', form.price.value);
  formData.append('categoryId', form.categoryId.value);

  const files = document.querySelector('[type=file]').files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} is too large! Please select a smaller file.`);
      return;
    }

    formData.append('images', file);
  }

  axios
    .post('/api/products/up', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      alert('상품 등록에 성공하였습니다.');
      form.reset();
      window.location.href = '/';
    })
    .catch((error) => {
      alert('상품 등록에 실패하였습니다.');
    });
});

imageInput.addEventListener('change', () => {
  const files = imageInput.files;
  imagePreview.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const imageType = /image.*/;

    if (!file.type.match(imageType)) {
      continue;
    }

    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);
    image.classList.add('preview-image');

    if (file.size > 5 * 1024 * 1024) {
      image.style.border = '3px solid red';
      alert(`File size of ${file.name} exceeds the limit (5MB)`);
    }

    imagePreview.appendChild(image);
  }
});
