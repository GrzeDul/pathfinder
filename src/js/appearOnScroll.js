import settings from './settings.js';
class appearOnScroll {
  constructor(slideElements) {
    const thisAOS = this;
    thisAOS.slideElements = slideElements;
    thisAOS.observerPoint = document.querySelectorAll(
      settings.select.observerPoint
    );
    thisAOS.initObserver();
  }

  observerCallback(entries) {
    for (const entry of entries) {
      entry.target.previousElementSibling.classList.toggle(
        settings.classNames.slideVisible,
        entry.isIntersecting
      );
    }
  }

  initObserver() {
    const thisAOS = this;
    const options = {
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(
      thisAOS.observerCallback,
      options
    );
    // Add observer points to trigger observerCallback instead of viewport and add observer to them
    for (const slide of Array.from(thisAOS.slideElements)) {
      const checkSlideSide = slide.children[0].classList.contains('left');
      const style = {
        position: 'absolute',
        bottom: checkSlideSide ? '-30vh' : '-5vh',
        height: '30vh',
        width: '100%',
      };
      const point = document.createElement('div');
      point.classList.add(settings.classNames.observerPoint);
      Object.assign(point.style, style);
      slide.appendChild(point);
      observer.observe(point);
    }
  }
}

export default appearOnScroll;
