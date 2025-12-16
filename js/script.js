// 글자스크롤페이드인
const content = document.getElementsByClassName("content");
const introduction = document.querySelector("#introduction");

window.addEventListener("scroll", () => {
    const winH = window.innerHeight;
    const sectionRect = introduction.getBoundingClientRect();
    
    // introduction 섹션이 화면에 보이는지 확인
    const sectionInView = sectionRect.top < winH && sectionRect.bottom > 0;
    
    if (sectionInView) {
        textEffect();
    } else {
        // 섹션을 벗어나면 효과 제거
        resetEffect();
    }
});

function textEffect() {
    const winH = window.innerHeight;
    for (let i = 0; i < content.length; i++) {
        const contentTop = content[i].getBoundingClientRect().top;
        if (contentTop - winH < 0) {
            content[i].classList.add("in");
        }
    }
}

function resetEffect() {
    for (let i = 0; i < content.length; i++) {
        content[i].classList.remove("in");
    }
}


// 풀페이지
let currentSectionIndex = 0; // 현재 보고있는 섹션 번호
const sections = document.querySelectorAll(".section");
const menuItems = document.querySelectorAll(".menu_item");
const totalSections = sections.length; // 8
let isScrolling = false; // 스크롤중인지 여부를 나타냄
let isFullPageScrollActive = false; // 현재 풀페이지 스크롤 활성화 여부
const breakPoint = 1024;

// 메뉴 active 업데이트
function updateMenu() {
    menuItems.forEach((item, index) => {
        if (index === currentSectionIndex) item.classList.add("active");
        else item.classList.remove("active");
    });
}

// // 메뉴 클릭 이벤트
// menuItems.forEach((item) => {
//     item.addEventListener("click", (e) => {
//         const index = parseInt(e.currentTarget.dataset.index, 10);
//         currentSectionIndex = index;
//         sections[currentSectionIndex].scrollIntoView({
//             behavior: "smooth",
//             block: "start"
//         });
//         updateMenu();
//     });
// });

// 휠(마우스) 이벤트 핸들러
function handleScroll(event) {
    if (window.innerWidth <= breakPoint) return;
    if (isScrolling) return;

    isScrolling = true;

    if (event.deltaY > 0) {
        currentSectionIndex = Math.min(currentSectionIndex + 1, totalSections - 1);
    } else {
        currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
    }

    sections[currentSectionIndex].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    updateMenu();

    // 애니메이션 시간(스크롤 애니메이션 소요) 이후에 다시 스크롤 허용
    setTimeout(() => { isScrolling = false; }, 800);
}

// 초기화: 현재 섹션 계산 및 풀페이지 토글
function initFullPageScroll() {
    // 현재 화면에 보이는 섹션을 찾아 초기 currentSectionIndex 설정
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight) {
            currentSectionIndex = index;
        }
    });
    updateMenu();
    isScrolling = false;

    // 데스크탑에서만 풀페이지 활성화
    if (window.innerWidth > breakPoint && !isFullPageScrollActive) {
        isFullPageScrollActive = true;
        document.body.style.overflow = "hidden";
        // wheel 이벤트 등록 (옵션은 기본)
        window.addEventListener("wheel", handleScroll);
    } else if (window.innerWidth <= breakPoint && isFullPageScrollActive) {
        isFullPageScrollActive = false;
        document.body.style.overflow = "auto";
        window.removeEventListener("wheel", handleScroll);
    }
}

// 페이지 로드 시 한 번 실행, 이후 리사이즈 시에도 실행
window.addEventListener("load", initFullPageScroll);
window.addEventListener("resize", initFullPageScroll);

// (선택) 키보드 화살표로도 이동하게 하려면 아래 주석 해제
window.addEventListener("keydown", (e) => {
    if (window.innerWidth <= breakPoint) return;
    if (e.key === "ArrowDown") {
        currentSectionIndex = Math.min(currentSectionIndex + 1, totalSections - 1);
        sections[currentSectionIndex].scrollIntoView({ behavior: "smooth", block: "start" });
        updateMenu();
    } else if (e.key === "ArrowUp") {
        currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        sections[currentSectionIndex].scrollIntoView({ behavior: "smooth", block: "start" });
        updateMenu();
    }
});


// 마우스 호버 시 
// 마우스 커서 따라 요소 이동
const section = document.querySelector('.common_sense');
const box1 = document.querySelector('.common_sense_box_1');
const box2 = document.querySelector('.common_sense_box_2');

section.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;

    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;

    // 움직임 강도 조절
    const moveX1 = x * 30;
    const moveY1 = y * 30;

    const moveX2 = x * 50;
    const moveY2 = y * 50;

    box1.style.setProperty('--mx', `${moveX1}px`);
    box1.style.setProperty('--my', `${moveY1}px`);

    box2.style.setProperty('--mx', `${moveX2}px`);
    box2.style.setProperty('--my', `${moveY2}px`);
});

section.addEventListener('mouseleave', () => {
    box1.style.setProperty('--mx', `0px`);
    box1.style.setProperty('--my', `0px`);
    box2.style.setProperty('--mx', `0px`);
    box2.style.setProperty('--my', `0px`);
});