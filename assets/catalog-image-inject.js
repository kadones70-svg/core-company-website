(function(){
  const k=document.body.dataset.catalog||'office';
  const heroMap={office:'catalog-office-v1.webp',hospitality:'catalog-hospitality-v1.webp',home:'catalog-home-v1.webp',farm:'catalog-farm-v1.webp',manufacturing:'catalog-manufacturing-v1.webp'};
  const setMap={
    office:'catalog-office-cards-v1.webp',
    hospitality:'catalog-hospitality-cards-v1.webp',
    home:'catalog-home-cards-v1.webp',
    farm:'catalog-farm-cards-v1.webp',
    manufacturing:'catalog-manufacturing-cards-v1.webp'
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
})();
