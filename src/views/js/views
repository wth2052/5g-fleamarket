function logout(){
	axios
		.post('/auth/logout',
		)
		.then((res) => {
			// 응답처리
			alert("정상적으로 로그아웃 처리 되었습니다.")
			window.location.href = "/login"

		})
		.catch((error) => {
			// 예외처리
			alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
		});
}