function kSlider(target, option) {
  const OPTION = validate(target, option);
  ready(target);
  function validate(target, option) {
    if (!document.querySelector(target)) {
      throw new Error('타겟이 존재하지 않습니다.');
    } else if (!option) {
      // throw new Error('반드시 옵션객체를 넣어주세요.');
      return Object.freeze({speed: 500});
    } else if (option.speed < 0) {
      throw new Error('음수는 입력할 수 없습니다.');
    }
    return Object.freeze(Object.assign({}, option));
  }
  function ready(target) {
    const images = document.querySelectorAll(`${target} img`);
    let loaded = 0;
    images.forEach(img => {
      img.addEventListener('load', () => {
        loaded += 1; 
        if (loaded === images.length) initializeDom(target);
      });
    });
  }
  function initializeDom(target){
    const slider = document.querySelector(target);
    const kItems = document.querySelectorAll(`${target} > *`);
    const kindWrap = document.createElement('div');
    const kindSlider = document.createElement('div');
    slider.classList.add('k_slider');
    kindWrap.classList.add('kind_wrap');
    kindSlider.classList.add('kind_slider');

    kindWrap.appendChild(kindSlider);
    slider.parentNode.insertBefore(kindWrap, slider);
    kindSlider.appendChild(slider);
    kItems.forEach(item => {item.classList.add('k_item')});

    kindWrap.insertAdjacentHTML('beforeend', `
      <div class="arrow">
        <a href="" class="prev">이전</a>
        <a href="" class="next">다음</a>
      </div>
    `);
    setupSlide(target);
  }
  function setupSlide(target) {
    const slider = document.querySelector(target);
    const kindWrap = slider.closest('.kind_wrap');
    const kItems = document.querySelectorAll(`${target} > *`);

    const prevBtn = kindWrap.querySelector('.prev');
    const nextBtn = kindWrap.querySelector('.next');
  
    const cloneA = kItems[0].cloneNode(true);
    const cloneC = kItems[kItems.length - 1].cloneNode(true);
    slider.insertAdjacentElement('beforeend', cloneA);
    slider.insertAdjacentElement('afterbegin', cloneC);

    const cloneKItems = slider.querySelectorAll('.k_item'); 
    const kItemWidth = cloneKItems[0].clientWidth;
    const sliderWidth = kItemWidth * cloneKItems.length;
    const state = {
      crrNum: 1,
      moveDist: -kItemWidth,
      kItemWidth 
    };
    // let moveDist = -kItemWidth;
    // let crrNum = 1;
    slider.style.width = sliderWidth + 'px';
    slider.style.left = `${state.moveDist}px`;

    //파라미터로 slider, crrNum, moveList, kItemWidth 등의 정보를 넘겨야 한다
    prevBtn.addEventListener('click', ((state) => {
      return function(e) {
        moveSlidePrev(e, state);
    }})(state));
    nextBtn.addEventListener('click', ((state) => { // 내가 넣어주는 state 받기
      return function(e) { // 리스터가 e를 넣어줘야 하기 때문에
        moveSlideNext(e, state);
    }})(state));
  }   
  function moveSlidePrev(e, state) {
    e.preventDefault();
    const slider = document.querySelector(target);
    const cloneKItems = slider.querySelectorAll('.k_item'); 
    slider.style.transition = `all ${OPTION.speed}ms ease`;
    move(1, state);
    if (state.crrNum === 0) {
      setTimeout(() => {
        slider.style.transition = 'none'; 
        state.crrNum = cloneKItems.length - 2; // 3로 초기화
        state.moveDist = -state.kItemWidth * (cloneKItems.length - 2); // -2400으로 초기화
        slider.style.left = `${state.moveDist}px`; // -2400으로 이동
      }, OPTION.speed);
    };
  }
  function moveSlideNext(e, state) {
    e.preventDefault();
    const slider = document.querySelector(target);
    const cloneKItems = slider.querySelectorAll('.k_item'); 
    slider.style.transition = `all ${OPTION.speed}ms ease`;
    move(-1, state);
    if (state.crrNum === cloneKItems.length - 1) {
      setTimeout(()=> {
        slider.style.transition = 'none';
        state.crrNum = 1;
        state.moveDist = -state.kItemWidth;
        slider.style.left = `${state.moveDist}px`;
      }, OPTION.speed)
    }
  }
  function move(direction, state) {
    const slider = document.querySelector(target);
    state.crrNum += -1 * direction;
    state.moveDist += state.kItemWidth * direction;
    slider.style.left = `${state.moveDist}px`;
  }  
}