axios
  .get('http://localhost:3000/likes')
  .then((res) => {
    console.log(res)
    let data = res.data;
    let products = data.product;
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < products.length; i++) {
        console.log(products[i].product.images)
        let productP = products[i].product.price;
        const productPrice = productP
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const timeAgo = getTimeAgo(products[i].product.pullUp);
        temp += `
                    <div class="col-md-6 col-lg-3">
                        <div class="card">
                            <img class="img-fluid" 
                              src="/img/${products[i].product.images[0].imagePath}"
                              style="min-height: 250px; max-height: 250px"
                               onclick="window.location='/products/asdf/${products[i].product.id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${products[i].product.title}</h5>
                                <h6 class="card-title">${productPrice} 원</h6>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                      <small class="text-muted">${products[i].product.likes} </small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                      <small class="text-muted">${products[i].product.viewCount} </small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="6%">
                                     <small class="text-muted">${timeAgo}</small>
                                </p>
                            </div>
                        </div>
                    </div>
`;
      }
      document.getElementById('product-list').innerHTML = temp;

    }
  })
  .catch((error) => {
    console.log(error)
    if (error.response.status === 401) {
        alert('로그인 후 사용이 가능합니다.');
        window.location.href = '/';
      } else if (error.response.status === 404) {
        let temp = '';
        temp = `<img src="/images/제목을 입력해주세요_-001 (5).png" width="100%">`;
        document.getElementById('product-list').innerHTML = temp;
      }
    
  });