import settings from './settings.js';
import appearOnScroll from './appearOnScroll.js';
const app = {
  init: function () {
    const thisApp = this;
    thisApp.getElements();
    thisApp.initPages();
    thisApp.initActions();
  },

  initPages: function () {
    const thisApp = this;

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (const page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this.children[0];
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change url hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    /* add class 'active* to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      page.classList.toggle(settings.classNames.activePage, page.id == pageId);
    }

    /* add class 'active* to matching links, remove from non-matching */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        settings.classNames.activePage,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initActions: function () {
    const thisApp = this;
    new appearOnScroll(thisApp.cards);
  },
  getElements: function () {
    const thisApp = this;
    thisApp.pages = document.querySelector(settings.select.pages).children;
    thisApp.navLinks = document.querySelectorAll(settings.select.links);
    thisApp.cards = document.querySelectorAll(settings.select.cards);
  },
};

app.init();
