axios
  .get('http://localhost:3000/orders/me/sell/product')
  .then((res) => {
    let data = res.data.data;
    console.log(res);
    if (data !== 0) {
      let temp = '';
      for (let i = 0; i < data.length; i++) {
        let productP = data[i].price;
        const productPrice = productP
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
        const timeAgo = getTimeAgo(data[i].pullUp);
        temp += `
                    <div class="col-md-6 col-lg-3" style="max-width: 25%; max-height: 25%">
                        <div class="card">
                            <img class="img-fluid" 
                              src="/img/${data[i].images[0].imagePath}"
                              style="min-height: 250px; max-height: 250px"
                               onclick="window.location='/order/dealAccept/${data[i].id}'" alt="">
                            <div class="card-body">
                                <h5 class="card-title">${data[i].title}</h5>
                                      <h6 class="card-title">${productPrice} 원</h6>
                                <p class="card-text">
                                    <img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" width="6%">
                                      <small class="text-muted">${data[i].likes}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/535/535193.png" width="6%">
                                      <small class="text-muted">${data[i].viewCount}　</small>
                                    <img src="https://cdn-icons-png.flaticon.com/512/4024/4024449.png" width="6%">
                                     <small class="text-muted">${timeAgo} 　<button type="button" id="dealUpdate" onclick="pullUp(${data[i].id})" class="btn mb-1 btn-rounded btn-primary">끌어올리기</button></small>
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
    console.log(error);
  });

function pullUp(productId) {
  event.stopPropagation();
  axios
    .post(`/orders/pullUp/${productId}`)
    .then((res) => {
      alert('게시글을 끌어올렸어요.');
      window.location.replace('http://localhost:3000/order');
    })
    .catch((error) => {
      alert(
        error.response?.data?.message ||
          error.response.data.errorMessage.details[0].message,
      );
    });
}


