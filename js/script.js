// // introduction 시작
// document.addEventListener("DOMContentLoaded", () => {
//     const p = document.querySelector("#intro-text");
//     // const lines = p.innerHTML.split("<br>");
//     // p.innerHTML = "";

//     // <span>으로 문장 분리
//     lines.forEach(line => {
//         const span = document.createElement("span");
//         span.innerHTML = line;
//         p.appendChild(span);
//     });

//     const spans = document.querySelectorAll("#intro-text span");

//     let lastScrollY = window.scrollY;
//     let scrollDirection = "down";

//     // 스크롤 방향 감지
//     window.addEventListener("scroll", () => {
//         scrollDirection = window.scrollY > lastScrollY ? "down" : "up";
//         lastScrollY = window.scrollY;
//     });

//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {

//             if (entry.isIntersecting) {
//                 // 등장 전 초기화
//                 spans.forEach(span => span.classList.remove("show"));

//                 if (scrollDirection === "down") {
//                     // 아래로 내려오며 등장 → 순서: 0,1,2,3...
//                     spans.forEach((span, index) => {
//                         setTimeout(() => {
//                             span.classList.add("show");
//                         }, index * 300);
//                     });
//                 } else {
//                     // 위로 올려오며 등장 → 순서: 마지막, 뒤에서 두 번째...
//                     [...spans].reverse().forEach((span, index) => {
//                         setTimeout(() => {
//                             span.classList.add("show");
//                         }, index * 300);
//                     });
//                 }
//             } else {
//                 // 화면에서 벗어나면 초기화
//                 spans.forEach(span => span.classList.remove("show"));
//             }
//         });
//     }, { threshold: 0.2 });

//     observer.observe(p);
// });
// // introduction 끝

// 글자스크롤페이드인
const content = document.getElementsByClassName("content");
window.addEventListener("scroll", ()=> {
    const winH = window.innerHeight;
    for(let i = 0; i < content.length; i++) {
        const contnenTop = content[i].getBoundingClientRect().top;
        if(contnenTop - winH < 0) {
            content[i].classList.add("in");
        } else {
            content[i].classList.remove("in");
        }
    };
});


// 풀페이지
let currentSectionIndex = 0; // 현재 보고있는 섹션 번호
const sections = document.querySelectorAll(".section");
const menuItems = document.querySelectorAll(".menu_item");
const totalSections = sections.length; // 8
let isScrolling = false; // 스크롤중인지 여부를 나타냄
let isFullPageScrollActive = false; // 현재 풀페이지 스크롤 활성화 여부
const breakPoint = 1024;

// 메뉴 active 업데이트
function updateMenu(){
    menuItems.forEach((item, index) => {
        if(index === currentSectionIndex) item.classList.add("active");
        else item.classList.remove("active");
    });
}

// 메뉴 클릭 이벤트
menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        currentSectionIndex = index;
        sections[currentSectionIndex].scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        updateMenu();
    });
});

// 휠(마우스) 이벤트 핸들러
function handleScroll(event){
    if(window.innerWidth <= breakPoint) return;
    if(isScrolling) return;

    isScrolling = true;

    if(event.deltaY > 0) {
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
function initFullPageScroll(){
    // 현재 화면에 보이는 섹션을 찾아 초기 currentSectionIndex 설정
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if(rect.top >= 0 && rect.top < window.innerHeight) {
            currentSectionIndex = index;
        }
    });
    updateMenu();
    isScrolling = false;

    // 데스크탑에서만 풀페이지 활성화
    if(window.innerWidth > breakPoint && !isFullPageScrollActive){
        isFullPageScrollActive = true;
        document.body.style.overflow = "hidden";
        // wheel 이벤트 등록 (옵션은 기본)
        window.addEventListener("wheel", handleScroll);
    } else if(window.innerWidth <= breakPoint && isFullPageScrollActive){
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
    if(window.innerWidth <= breakPoint) return;
    if(e.key === "ArrowDown"){
        currentSectionIndex = Math.min(currentSectionIndex + 1, totalSections - 1);
        sections[currentSectionIndex].scrollIntoView({behavior: "smooth", block: "start"});
        updateMenu();
    } else if(e.key === "ArrowUp"){
        currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        sections[currentSectionIndex].scrollIntoView({behavior: "smooth", block: "start"});
        updateMenu();
    }
});