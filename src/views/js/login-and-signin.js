const loginBtn = document.getElementById('login');

function login() {
	const email = document.getElementById('id').value;
	const password = document.getElementById('password').value;
	axios
		.post('/auth/login',
			{ email: email, password: password }
		)
		.then((res) => {
			// 응답처리
			alert("로그인에 성공하였습니다.")
			window.location.replace("http://localhost:3000/")
		})
		.catch((error) => {
			// 예외처리
			alert('아이디나 비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
		});
}
function signup(){
	window.location.replace("/")
}
function logout(){
	axios
		.post('http://localhost:3000/auth/logout',
		)
		.then((res) => {
			// 응답처리
			alert("정상적으로 로그아웃 처리 되었습니다.")
			window.location.href = "/view"

		})
		.catch((error) => {
			// 예외처리
			alert(error.response?.data?.message || error.response.data.errorMessage.details[0].message);
		});
}
