// TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다.
// - [x] 메뉴를 추가할 때
// - [x] 메뉴를 수정할 때
// - [x] 메뉴를 삭제할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [] 에스프레소 메뉴판 관리
// - [] 프라푸치노 메뉴판 관리
// - [] 블렌디드 메뉴판 관리
// - [] 티바나 메뉴판 관리
// - [] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read&Rendering
// - [] 페이지에 최초로 접근할 때는 localStorage에서 에스프레소 메뉴를 읽어온다.
// - [] 에스프레소 메뉴를 페이지에 그려준다.
//
// - [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 추가한다
// - [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다
// - [] 품절 해당 메뉴의 상태값이 페이지에 그려진다.
//  -[] 클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

const $ = (selector) => document.querySelector(selector);

const store = {
	setLocalStorage(menu) {
		localStorage.setItem("menu", JSON.stringify(menu));
	},
	getLocalStorage() {
		return JSON.parse(localStorage.getItem("menu"));
	},
};

function App() {
	this.menu = {
		espresso: [],
		frappuccino: [],
		blended: [],
		teavana: [],
		desert: [],
	};
	this.currentCategory = "espresso";

	this.init = () => {
		if (store.getLocalStorage()) {
			this.menu = store.getLocalStorage();
		}
		render();
	};

	const render = () => {
		const template = this.menu[this.currentCategory]
			.map((menuItem, index) => {
				return `
			<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
				<span class="w-100 pl-2 menu-name">${menuItem.name}</span>
				<button
					type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
				>
					수정
				</button>
				<button
					type="button"
					class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
				>
					삭제
				</button>
			</li>`;
			})
			.join("");

		$("#espresso-menu-list").innerHTML = template;
		updateMenuCount();
	};

	const updateMenuCount = () => {
		const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
		$(".menu-count").innerText = `총 ${menuCount} 개`;
	};

	const addMenuName = () => {
		if ($("#espresso-menu-name").value === "") {
			alert("값을 입력해주세요.");
			return;
		}
		const espressoMenuName = $("#espresso-menu-name").value;
		this.menu[this.currentCategory].push({ name: espressoMenuName });
		store.setLocalStorage(this.menu);
		render();
		$("#espresso-menu-name").value = "";
	};

	const updateMenuName = (e) => {
		const menuId = e.target.closest("li").dataset.menuId;
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText); // 인자 사용 유의하기
		this.menu[this.currentCategory][menuId].name = updatedMenuName;
		store.setLocalStorage(this.menu);
		$menuName.innerText = updatedMenuName; //e를 변수로 활용
	};

	const removeMenuName = (e) => {
		if (confirm("정말 삭제하시겠습니까?")) {
			const menuId = e.target.closest("li").dataset.menuId;
			this.menu.splice(menuId, 1);
			store.setLocalStorage(this.menu);
			e.target.closest("li").remove();
			updateMenuCount(e);
		}
	};

	$("#espresso-menu-list").addEventListener("click", (e) => {
		//if 로 올바른(수정) 버튼인지 ( class 로 구분 )
		if (e.target.classList.contains("menu-edit-button")) {
			updateMenuName(e); //리팩터링
		}

		if (e.target.classList.contains("menu-remove-button")) {
			removeMenuName(e); //리팩터링
		}
	});

	//form태그가 자동으로 전송되는걸 막아준다.
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	$("#espresso-menu-submit-button").addEventListener("click", addMenuName);

	// 메뉴의 이름을 입력받는건
	$("#espresso-menu-name").addEventListener("keypress", (e) => {
		if (e.key !== "Enter") {
			// 처음에 엔터를 눌러도 alert 안뜨게
			return;
		}
		addMenuName();
	});

	$("nav").addEventListener("click", (e) => {
		const isCategoryButton = e.target.classList.contains("cafe-category-name");
		if (isCategoryButton) {
			const categoryName = e.target.dataset.categoryName;
			console.log(categoryName);
		}
	});
}
const app = new App();
app.init();
