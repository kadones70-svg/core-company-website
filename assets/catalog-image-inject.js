(function(){
  const k=document.body.dataset.catalog||'office';
  const heroMap={office:'catalog-office-v1.png',hospitality:'catalog-hospitality-v1.png',home:'catalog-home-v1.png',farm:'catalog-farm-v1.png',manufacturing:'catalog-manufacturing-v1.png'};
  const setMap={
    office:'catalog-office-cards-v1.png',
    hospitality:'catalog-hospitality-cards-v1.png',
    home:'catalog-home-cards-v1.png',
    farm:'catalog-farm-cards-v1.png',
    manufacturing:'catalog-manufacturing-cards-v1.png'
  };
  const hero='assets/images/'+heroMap[k];
  const set=setMap[k]?'assets/images/'+setMap[k]:hero;
  const positions=['left top','right top','left bottom','right bottom'];
  document.querySelectorAll('.card').forEach((card,index)=>{
    const visual=document.createElement('div');
    visual.className='catalog-card-visual';
    visual.setAttribute('role','img');
    visual.setAttribute('aria-label','공간 통합 구성 이미지');
    visual.style.backgroundImage=`url("${set}")`;
    visual.style.backgroundSize=setMap[k]?'200% 200%':'cover';
    visual.style.backgroundPosition=setMap[k]?positions[index%4]:'center';
    card.prepend(visual);
  });
  const heroWrap=document.querySelector('.hero .wrap');
  if(heroWrap&&!heroWrap.querySelector('.catalog-hero-visual')){
    const el=document.createElement('img');
    el.className='catalog-hero-visual';
    el.src=hero;
    el.alt='공간별 카탈로그 헤더 이미지';
    heroWrap.append(el);
  }
  if(!document.querySelector('link[href="assets/catalog-header.css"]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/catalog-header.css';
    document.head.append(link);
  }
  const header=document.querySelector('.header');
  if(header){
    header.innerHTML='<div class="catalog-head"><a href="index.html" class="catalog-brand"><img src="assets/logo/logo_color.svg" alt="Core Company"><span>CORE COMPANY<small>On-Premise AI, Rooted in Space.</small></span></a><nav class="catalog-nav"><a href="index.html#spaces">적용 공간</a><div class="catalog-dropdown"><button type="button">카탈로그 ▾</button><div><a href="index.html#catalog">로컬 AI 카탈로그</a><a href="catalog-office.html">오피스</a><a href="catalog-hospitality.html">숙박·펜션</a><a href="catalog-home.html">스마트홈</a><a href="catalog-farm.html">스마트팜</a><a href="catalog-manufacturing.html">제조</a></div></div><a href="index.html#method">진행 방식</a><a href="index.html#architecture">아키텍처</a><a href="index.html#faq">FAQ</a><a href="https://blog.naver.com/corecompany0607" target="_blank" rel="noopener noreferrer">블로그</a><a class="catalog-cta" href="index.html#contact">도입 진단 문의</a></nav></div>';
  }
})();
