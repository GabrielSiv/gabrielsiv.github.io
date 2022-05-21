//DEBOUNCE
function debounce(callback, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
      timer = null;
    }, delay);
  };
}

//SCROLL ANIMADO
class ScrollAnima {
  constructor(sections) {
    this.sections = document.querySelectorAll(sections);
    this.windowMetade = window.innerHeight * 0.6;

    this.checkDistance = debounce(this.checkDistance.bind(this), 50);
  }

  // Pega a distância de cada item em relação
  // ao topo do site
  getDistance() {
    this.distance = [...this.sections].map((section) => {
      const offset = section.offsetTop;
      return {
        element: section,
        offset: Math.floor(offset - this.windowMetade),
      };
    });
  }

  // Verifica a distância em cada objeto
  // em relação ao scroll do site
  checkDistance() {
    this.distance.forEach((item) => {
      if (window.pageYOffset > item.offset) {
        item.element.classList.add('ativo');
      } else if (item.element.classList.contains('ativo')) {
        item.element.classList.remove('ativo');
      }
    });
  }

  init() {
    if (this.sections.length) {
      this.getDistance();
      this.checkDistance();
      window.addEventListener('scroll', this.checkDistance);
    }
    return this;
  }

  // Remove o event de scroll
  stop() {
    window.removeEventListener('scroll', this.checkDistance);
  }
}

//SCROLL SUAVE
function initScrollSuave() {
  const linksInternos = document.querySelectorAll('.js-menu a[href^="#"]');
  const clickEvent = (function () {
    if ('ontouchstart' in document.documentElement === true)
      return 'touchstart';
    else return 'click';
  })();

  function scrollToSection(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const section = document.querySelector(href);
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  linksInternos.forEach((link) => {
    link.addEventListener(clickEvent, scrollToSection);
  });
}

function trocaImagem() {
  let largura;

  function checaMudancas() {
    largura = window.innerWidth;
    if (largura <= 1200) {
      document.getElementById('importancia-img-js').src =
        'img/importancia-psicologia-img-small.webp';
    } else {
      document.getElementById('importancia-img-js').src =
        'img/importancia-psicologia-img.webp';
    }

    if (largura <= 800) {
      document.getElementById('atendimentos-online-img').src =
        'img/atendimentos-online-img-mobile.jpg';
      document.getElementById('importancia-img-js').src =
        'img/importancia-psicologia-img-mobile.webp';
      document.getElementById('dropdown-container').style.display = 'block';
    } else {
      document.getElementById('atendimentos-online-img').src =
        'img/atendimentos-online-img.webp';
      document.getElementById('dropdown-container').style.display = 'none';
    }
  }

  window.addEventListener('resize', (event) => checaMudancas());
  window.addEventListener('load', (event) => checaMudancas());
}

//OUTSIDE CLICK
function outsideClick(element, events, callback) {
  const html = document.documentElement;
  const outside = 'data-outside';
  function handleOutsideClick(event) {
    if (!element.contains(event.target)) {
      element.removeAttribute(outside);
      events.forEach((userEvent) => {
        html.removeEventListener(userEvent, handleOutsideClick);
      });
      callback();
    }
  }

  if (!element.hasAttribute(outside)) {
    events.forEach((userEvent) => {
      setTimeout(() => html.addEventListener(userEvent, handleOutsideClick));
    });
    element.setAttribute(outside, '');
  }
}

//DROPDOWN MENU
class DropdownMenu {
  constructor(dropdownMenus, events) {
    this.dropdownMenus = document.querySelectorAll(dropdownMenus);

    // define touchstart e click como argumento padrão
    // de events caso o usuário não define
    if (events === undefined) this.events = ['touchstart', 'click'];
    else this.events = events;

    this.activeClass = 'active';
    this.activeDropdownMenu = this.activeDropdownMenu.bind(this);
  }

  // Ativa o dropdownmenu e adiciona
  // a função que observa o clique fora dele
  activeDropdownMenu(event) {
    event.preventDefault();
    const element = event.currentTarget;
    element.classList.add(this.activeClass);
    outsideClick(element, this.events, () => {
      element.classList.remove('active');
    });
  }

  // adiciona os eventos ao dropdownmenu
  addDropdownMenusEvent() {
    this.dropdownMenus.forEach((menu) => {
      this.events.forEach((userEvent) => {
        menu.addEventListener(userEvent, this.activeDropdownMenu);
      });
    });
  }

  init() {
    if (this.dropdownMenus.length) {
      this.addDropdownMenusEvent();
    }
    return this;
  }
}

initScrollSuave();
trocaImagem();
const scrollAnima = new ScrollAnima('[data-anime="scroll"]');
scrollAnima.init();
const dropdownMenu = new DropdownMenu('[data-dropdown]');
dropdownMenu.init();
