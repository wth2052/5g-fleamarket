

// 상품 상세 불러오기 
function getProduct (productId) {
    window.location.replace(`http://localhost:3000/products/${productId}`)
}

// 상품삭제하기
function deleteProduct(productId){

    if(confirm('정말 삭제하시겠습니까?')){ 

    axios
    .delete(`/products/${productId}`)
    .then((res) => {
        // 응답처리
        alert(JSON.stringify(res.data.message))
        window.location.replace("http://localhost:3000/products")
    })
    .catch((error) => {
        // 예외처리
        alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
    });
}    
   
}

