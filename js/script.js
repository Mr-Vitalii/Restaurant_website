
class Basket {
    allProducts;
    constructor(
        pathToProducts,
        mobileBasketContainer,
        basketCardContainer,
        basketEmptyContainer,
        basketFullContainer,
        basketTotalContainer,
        orderButton,
        sidebarRight,
    ) {

        this.sidebarRight = document.querySelector(sidebarRight);
        this.mobileBasketContainer = document.querySelector(mobileBasketContainer);
        this.viewportCheck();

        this.basketCardContainer = document.querySelector(basketCardContainer);
        this.emptyBasket = document.querySelector(basketEmptyContainer);
        this.basketFullContainer = document.querySelector(basketFullContainer);
        this.basketTotalContainer = document.querySelector(basketTotalContainer);
        this.orderButton = document.querySelector(orderButton);

        this.getData(pathToProducts);
        this.addQuantityProduct();

        this.basketTotalDate;
        this.mainPage = null;
        this.categoryContainer = null;
        this.selectedCardContainer = null;

        this.orderButton.addEventListener('click', () => {
            console.log('this.orderButton.addEventListener');
            ordering.showOrderingSection(this.mainPage, this.categoryContainer, this.selectedCardContainer, this.mobileBasketContainer)
            ordering.addTotalOrderingBlock(this.basketTotalDate)
            reviews.hideReviews();
        })

    }


    viewportCheck() {

        if (window.matchMedia("(max-width: 767px)").matches) {
            this.sidebarRight.remove();
        }
        if (window.matchMedia("(min-width: 768px)").matches) {
            this.mobileBasketContainer.remove();
        }

    }

    getData(path) {
        fetch(path)
            .then(res => res.json())
            .then(data => {
                this.allProducts = data
            })
    }

    addProduct(currentCard, quantityProduct) {
        console.log('added');
        const cardCategory = currentCard.dataset.cardCategory
        const cardId = currentCard.id
        // this.mobileBasketContainer.innerHTML = ' ';
        Object.keys(this.allProducts).forEach(key => {
            if (key == cardCategory) {
                let currentCategoryProducts = this.allProducts[key];
                currentCategoryProducts.forEach(product => {
                    if (product.id == cardId) {
                        this.createBaskedCards(quantityProduct, product)
                    }
                })
            }
        })

        this.calculateTotal()
    }

    createBaskedCards(quantityProduct, product) {
        this.basketCardContainer.innerHTML +=
            `
                            <div data-quantity="${quantityProduct}" id="${product.id}" class="basket-card">
                                <img class="basket-card__image" src="${product.pic || product.offers}" alt="product image">
                                <div class="basket-card__body">
                                    <h2 class="basket-card__title">${product.name}</h2>
                                    <div class="basket-card__bottom">
                                        <div class="basket-card__quantity-container">
                                        <span class="basket-card__quantity">${quantityProduct || 1}</span>
                                            <button class="basket-card__quantity-button plus">
                                                <svg class="basket-card__icon" width="30px" height="30px">
                                                    <use href="./images/main-page/sprite.svg#icon-plus"></use>
                                                </svg>
                                            </button>
                                            <button class="basket-card__quantity-button minus">
                                                <svg class="basket-card__icon" width="30px" height="30px">
                                                    <use href="./images/main-page/sprite.svg#icon-minus"></use>
                                                </svg>
                                            </button>
                                        </div>
                                        <span class="basket-card__price">${product.price}</span>
                                    </div>
                                </div>
                            </div>
                                `;

    }

    addQuantityProduct() {
        this.basketCardContainer.addEventListener('click', (e) => {
            const currentCard = e.target.closest('.basket-card');
            const quantityProduct = currentCard.querySelector('.basket-card__quantity');
            if (e.target.closest('.basket-card__quantity-button.plus')) {
                quantityProduct.textContent = parseInt(quantityProduct.textContent) + 1;
                // this.basketTotalDate.totalQuantity + 1;
                this.calculateTotal()
            }
            if (e.target.closest('.basket-card__quantity-button.minus')) {
                if (parseInt(quantityProduct.textContent) >= 2) {
                    quantityProduct.textContent = parseInt(quantityProduct.textContent) - 1;
                    // this.basketTotalDate.totalQuantity - 1;
                    this.calculateTotal()
                } else {
                    currentCard.remove();
                    this.calculateTotal()
                    this.showBasket()
                }
            }
        })
    }

    calculateTotal() {
        console.log('calculateTotal');
        console.log(this.basketTotalDate);
        this.basketTotalContainer.style.display = 'block';
        this.orderButton.style.display = 'block';
        let totalCardQuantity = 0;
        let totalCardPrice = 0;

        this.basketTotalDate = {
            totalPrice: 0,
            totalQuantity: 0,
            discount: 0,
            delivery: "300 COM"
        }


        const allCards = this.basketCardContainer.children;
        Array.from(allCards).forEach(card => {
            const cardQuantity = card.querySelector('.basket-card__quantity');
            const cardPrice = card.querySelector('.basket-card__price');
            totalCardPrice += parseInt(cardQuantity.textContent) * parseInt(cardPrice.textContent);
            totalCardQuantity += parseInt(cardQuantity.textContent);

        });
        this.basketTotalDate.totalPrice += totalCardPrice;
        this.basketTotalDate.totalQuantity += totalCardQuantity;

        if (this.basketTotalDate.totalPrice > 3000) {
            this.basketTotalDate.discount = Math.round(this.basketTotalDate.totalPrice / 100 * 10);
        }

        if (this.basketTotalDate.totalPrice > 800) {
            this.basketTotalDate.delivery = 'Бесплатно';
        }

        this.basketTotalContainer.innerHTML = this.createBaskedTotalCard(this.basketTotalDate)
    }


    createBaskedTotalCard({ totalQuantity, totalPrice, discount, delivery }) {
        return (
            `
                            <h2 class="basket__title-accent">Разом</h2>
                        <div class="basket__container">
                            <div class="basket__quantity-container">
                                <span class="basket__quantity basket__text">${totalQuantity}</span>
                                <span class="basket__text">шт.</span>
                            </div>
                            <div>
                                <span class="basket__price">${totalPrice}</span>
                                <span>COM</span>
                            </div>
                        </div>
                        <div class="basket__container">
                            <span class="basket__text">Знижка</span>
                            <span class="basket__discount">${discount}</span>
                        </div>
                        <div class="basket__container">
                            <span class="basket__text">Доставка</span>
                            <span class="basket__delivery">${delivery}</span>
                        </div>
                                `);
    }

    showBasket(mainPage, categoryContainer, selectedCardContainer) {
        this.mainPage = mainPage;
        this.categoryContainer = categoryContainer;
        this.selectedCardContainer = selectedCardContainer;

        if (window.matchMedia("(max-width: 767px)").matches) {
            this.mobileBasketContainer.style.display = 'block';
        }

        if (window.matchMedia("(min-width: 768px)").matches) {
            this.basketFullContainer.style.display = 'block';
        }
        else {
            this.mobileBasketContainer.style.display = 'block';
        }

        if (this.basketCardContainer.children.length > 0) {
            this.emptyBasket.style.display = 'none';
            this.basketFullContainer.style.display = "block";
        } else {
            console.log('this.emptyBasket.style.display = block');
            this.emptyBasket.style.display = 'block';
            this.basketFullContainer.style.display = 'none';
        };
    }

    emptyTrash() {
        console.log(this.basketTotalDate);
        const allCards = this.basketCardContainer.children;
        Array.from(allCards).forEach(card => {
            console.log(card);
            card.remove();
        });
        console.log('emptyTrash');
        console.log(this.basketCardContainer.children.length);
        Array.from(this.basketTotalContainer.children).forEach(element => {
            element.remove();
        });
        this.basketFullContainer.style.display = "none";
        this.emptyBasket.style.display = 'block';
    }

    hideBasket() {
        console.log('hideBasket');
        this.mobileBasketContainer.style.display = 'none'
    }
}



const basket = new Basket(
    './data/data.json',
    '.mobile-basket-container',
    '.basket__card-container',
    '.basket__empty-container',
    '.basket__full-container',
    '.basket__total-container',
    '.basket__button',
    '.sidebar-right'
);





class Router {
    data /* масив даних наших товарів, присвоєння в методі takeData 38й рядок */
    isShownNewProduct;
    isShownPopularProduct;

    constructor(
        mainPage,
        pathToProducts,
        logoLink,
        selectorContainer,
        mainPageMenu,
        linksMenu,
        newAndPopularMenu,
        categoryContainer,
        newProductContainer,
        popularProductContainer,
        selectedCardSection,
        selectedCardContainer,
        recommendedCardContainer,
        aboutSection,
        footerMobileMenuLink,
        footerMobileBasketLink,
        footerMobileReviewsLink,
        headerReviewLink,
        orderingSection
    ) {
        this.mainPage = document.querySelector(mainPage)
        this.logoLink = document.querySelector(logoLink)
        this.container = document.querySelector(selectorContainer)
        this.categoryContainer = document.querySelector(categoryContainer)
        this.mainPageMenu = document.querySelectorAll(mainPageMenu)
        this.sidebarMenu = document.querySelectorAll(linksMenu)
        this.newAndPopularMenu = document.querySelectorAll(newAndPopularMenu)
        this.newProductContainer = document.querySelectorAll(newProductContainer)
        this.popularProductContainer = document.querySelectorAll(popularProductContainer)
        this.selectedCardSection = document.querySelector(selectedCardSection)
        this.selectedCardContainer = document.querySelector(selectedCardContainer)
        this.recommendedCardContainer = document.querySelectorAll(recommendedCardContainer)
        this.aboutSection = document.querySelector(aboutSection)
        this.footerMobileBasketLink = document.querySelector(footerMobileBasketLink);
        this.footerMobileReviewsLink = document.querySelector(footerMobileReviewsLink);
        this.footerMobileMenuLink = document.querySelector(footerMobileMenuLink);
        this.headerReviewLink = document.querySelector(headerReviewLink);
        this.orderingSection = document.querySelector(orderingSection);
        this.productQuantity = 1;

        this.getData(pathToProducts)
        this.createNavigation()
        this.showCategory()
    }

    getData(path) {
        fetch(path)
            .then(res => res.json())
            .then(data => {
                this.data = data;

                this.showMainCatalog(data)
                this.showNewProduct(data)
                this.showSelectedCard(data)
            })
    }

    createNavigation() {

        this.logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            location.hash = this.logoLink.hash;

            this.mainPage.style.display = 'block';
            this.aboutSection.style.display = 'block';
            this.categoryContainer.style.display = 'none';
            this.selectedCardSection.style.display = 'none';
            this.orderingSection.style.display = 'none';
            basket.hideBasket();
            reviews.hideReviews();
        })

        this.sidebarMenu.forEach((link) => {
            let currentLink;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentLink = link
                location.hash = link.dataset.category;
                this.showMainCatalog(this.data)
                this.showCategory(currentLink)
                sortProduct.createSortList();
                reviews.hideReviews();
            })
        })
        this.mainPageMenu.forEach((link) => {
            let currentLink;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.sidebarMenu.forEach((menuLink) => {
                    if (link.dataset.category == menuLink.dataset.category) {
                        currentLink = menuLink
                    }
                })
                location.hash = link.dataset.category;

                this.showMainCatalog(this.data)
                this.showCategory(currentLink)
                sortProduct.createSortList();
            })
        })

        this.newAndPopularMenu.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.isShownNewProduct && link.id == 'new') {
                    link.classList.toggle("current-link");
                    link.nextElementSibling.classList.toggle("current-link");
                    this.showNewProduct(this.data)
                }
                else if (!this.isShownPopularProduct && link.id == 'popular') {
                    link.classList.toggle("current-link");
                    link.previousElementSibling.classList.toggle("current-link");
                    this.showPopularProduct(this.data)
                }
            })
        })

        this.footerMobileMenuLink.addEventListener('click', (e) => {
            this.mainPage.style.display = 'block';
            this.categoryContainer.style.display = 'none';
            this.selectedCardSection.style.display = 'none';
            this.orderingSection.style.display = 'none';
            basket.hideBasket();
            reviews.hideReviews();
        })

        this.footerMobileBasketLink.addEventListener('click', (e) => {
            console.log('show');
            e.preventDefault();
            this.mainPage.style.display = 'none';
            this.categoryContainer.style.display = 'none';
            this.selectedCardSection.style.display = 'none';
            this.aboutSection.style.display = 'none';
            this.orderingSection.style.display = 'none';
            reviews.hideReviews();
            basket.showBasket(this.mainPage, this.categoryContainer, this.selectedCardSection);
        })


        const openReviewSection = () => {

            this.mainPage.style.display = 'none';
            this.categoryContainer.style.display = 'none';
            this.selectedCardSection.style.display = 'none';
            this.selectedCardSection.style.display = 'none';
            this.aboutSection.style.display = 'none';
            this.orderingSection.style.display = 'none';
            basket.hideBasket();
            ordering.hideOrderingSection();
            reviews.showReviews()
        }

        this.footerMobileReviewsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openReviewSection();
        })
        this.headerReviewLink.addEventListener('click', (e) => {
            e.preventDefault();
            openReviewSection();
        })

    }

    showCategory(currentLink) {

        if (location.hash.substring(1)) {
            this.categoryContainer.style.display = 'block';
            if (currentLink) {
                this.categoryContainer.querySelector('.catalog__title')
                    .innerHTML = currentLink.innerHTML;
                this.categoryContainer.querySelector('.catalog__title')
                    .dataset.category = currentLink.dataset.category;
            }
            this.mainPage.style.display = 'none';
            this.orderingSection.style.display = 'none';
        } else {
            this.categoryContainer.style.display = 'none';
            this.mainPage.style.display = 'block';
        }
    }

    showMainCatalog(products) {
        this.container.innerHTML = '';
        for (let key in products) {
            if (`#${encodeURIComponent(key)}` === location.hash) {
                this.sidebarMenu.forEach((link) => { //*монтування заголовка секції
                    if (key === link.dataset.category) {
                        let currentLink = link;
                        this.showCategory(currentLink);
                        sortProduct.createSortList();
                    }
                })
                let currentCategoryProducts = products[key];
                currentCategoryProducts.forEach(product => {

                    this.createCards(this.container, product, key)
                })
            }
        }
    }

    showNewProduct(products) {
        this.popularProductContainer.forEach(popularProduct => {
            popularProduct.style.display = 'none';
            this.isShownPopularProduct = false;
        })
        this.newProductContainer.forEach(newProduct => {
            newProduct.innerHTML = '';
            newProduct.style.display = 'block';
            this.isShownNewProduct = true;
        })

        for (let key in products) {
            if (key == 'new') {
                let currentCategoryProducts = products[key];
                this.newProductContainer.forEach(newProduct => {
                    currentCategoryProducts.forEach(product => {

                        if (newProduct.id == product.id) {

                            this.createCards(newProduct, product, key)
                        }

                    })
                })
            }
        }
        this.newProductContainer.forEach(newProduct => {
            newProduct.children[0].classList.add("new-popular__card");
        })
    }

    showPopularProduct(products) {

        this.newProductContainer.forEach(newProduct => {
            newProduct.style.display = 'none';
            this.isShownNewProduct = false;
        })
        this.popularProductContainer.forEach(popularProduct => {
            popularProduct.innerHTML = '';
            popularProduct.style.display = 'block';
            this.isShownPopularProduct = true;
        })

        for (let key in products) {
            if (key == 'popular') {
                let currentCategoryProducts = products[key];
                this.popularProductContainer.forEach(popularProduct => {
                    currentCategoryProducts.forEach(product => {

                        if (popularProduct.id == product.id) {
                            this.createCards(popularProduct, product, key)
                        }
                    })
                })
            }
        }
        this.newProductContainer.forEach(newProduct => {
            newProduct.children[0].classList.add("new-popular__card");
        })
    }

    showSelectedCard(products) {

        const selectedCardContainer = this.selectedCardContainer.closest('.selected-card');
        document.body.addEventListener('click', (e) => {
            if (!e.target.classList.contains('product-card__button')) {
                if (e.target.closest('.product-card')) {
                    const cardContainer = this.selectedCardContainer;
                    const cardId = e.target.closest('.product-card').id;
                    const cardCategory = e.target.closest('.product-card').dataset.cardCategory;

                    e.preventDefault();
                    this.mainPage.style.display = 'none';
                    this.categoryContainer.style.display = 'none';
                    ordering.hideOrderingSection();
                    selectedCardContainer.style.display = 'block';

                    Object.keys(products).forEach(key => {
                        if (key == cardCategory) {
                            let currentCategoryProducts = products[key];
                            currentCategoryProducts.forEach(product => {
                                if (product.id == cardId) {
                                    cardContainer.innerHTML = " ";

                                    this.createCards(cardContainer, product, key, () => {
                                        const currentCard = cardContainer.children[0];
                                        currentCard.classList.add("selected__card");
                                        currentCard.firstElementChild.lastElementChild.insertAdjacentHTML("beforeend", `
                                        <div class="product-card__quantity-container">
                                            <div>
                                                <span class="product-card__quantity-text">Количество:</span>
                                                <span class="product-card__quantity">1</span>
                                            </div>
                                            <button class="product-card__quantity-button">
                                            <svg class="product-card__icon" width="30px" height="30px">
                                    <use href="./images/main-page/sprite.svg#icon-plus"></use>
                                            </svg>
                                            </button>
                                        </div>
                                    `);
                                    });
                                }
                            })
                        }
                    })
                } else {
                    if (e.target.dataset.category) {
                        this.productQuantity = 1;
                        basket.hideBasket()
                        selectedCardContainer.style.display = 'none';
                    }
                }
            }
            else {
                e.preventDefault();
                const currentCard = e.target.closest('.product-card');
                basket.addProduct(currentCard, this.productQuantity)
                if (window.matchMedia("(min-width: 768px)").matches) {
                    console.log("showBasket");
                    basket.showBasket(this.mainPage, this.categoryContainer, this.selectedCardSection);
                }
            }
        })
        for (let key in products) {
            if (key == 'popular') {
                let currentCategoryProducts = products[key];
                this.recommendedCardContainer.forEach(recommendProduct => {
                    currentCategoryProducts.forEach(product => {

                        if (recommendProduct.id == product.id) {
                            this.createCards(recommendProduct, product, key)
                        }
                    })
                })
            }
        }
        this.recommendedCardContainer.forEach(newProduct => {
            newProduct.children[0].classList.add("new-popular__card");
        })
    }

    createCards(cardsContainer, product, category, addSelectedClass) {

        cardsContainer.innerHTML += `
                <div data-card-category="${category}" id="${product.id}" class="product-card">
                <a href="#" class="product-card__link">
                    <img class="product-card__image" src="${product.pic || product.offers}" alt="product image">
                    <div class="product-card__body">
                        <h2 class="product-card__title">${product.name}</h2>
                        <p class="product-card__text">${product.info}</p>
                        <div class="product-card__bottom">
                            <span class="product-card__price">${product.price}</span>
                            <button class="product-card__button">Хочу!</button>
                        </div>
                    </div>
                     </a>
                </div>
                         `;
        if (typeof addSelectedClass === 'function') {
            addSelectedClass();
            this.addProductQuantity(cardsContainer)
        }
    }

    addProductQuantity(currentCardContainer) {
        const currentCard = currentCardContainer.firstElementChild;
        const quantityProduct = currentCard.querySelector('.product-card__quantity');
        const addButton = currentCard.querySelector('.product-card__quantity-button');

        quantityProduct.textContent = this.productQuantity

        addButton.addEventListener('click', () => {
            this.productQuantity += 1;
        })

    }

    showMainPage() {
        this.mainPage.style.display = 'block';
        this.aboutSection.style.display = 'block';
    }
}

// https://fakestoreapi.com/products
const router = new Router(
    '.current-page',
    './data/data.json',
    '.logo',
    '.catalog__cards-container',
    '.site-menu a',
    '.main-nav__link',
    '.new-popular__link',
    '.catalog',
    '.new-popular__container-card--new',
    '.new-popular__container-card--popular',
    '.selected-card',
    '.selected-card__container',
    '.selected-card__recommended-container',
    '.about',
    '.footer__menu-link',
    '#basket-link',
    '#reviews-link',
    '.header__review-link',
    '.ordering-section',
);






//* Сортування

class SortProduct {
    allProducts;
    constructor(
        pathToProducts,
        sortMenu,
        sortList,
        sortButton,
        catalogCategory,
        containerProduct,
    ) {

        this.sortMenu = document.querySelector(sortMenu);
        this.sortList = document.querySelector(sortList);
        this.sortButton = document.querySelector(sortButton);
        this.catalogCategory = document.querySelector(catalogCategory);
        this.containerProduct = document.querySelector(containerProduct);


        this.selectedCategory = this.sortMenu.options[this.sortMenu.selectedIndex].value;


        this.getData(pathToProducts);
        this.openSortMenu();

    }

    getData(path) {
        fetch(path)
            .then(res => res.json())
            .then(data => {
                this.allProducts = data
            })
    }

    createSortList() {
        this.sortList.innerHTML = "";
        const createList = (menuOption) => {

            const li = document.createElement('li');
            li.classList.add("sort-menu__item");
            li.innerHTML = this.sortMenu.options[menuOption].innerHTML;


            li.addEventListener('click', () => {
                let selectedLink = li;
                this.sort(selectedLink)
                Array.from(this.sortList.children).forEach(item => {
                    item.classList.remove("selected");
                });
                li.classList.add("selected");
                this.sortMenu.selectedIndex = menuOption;
                this.sortList.classList.toggle('active');
                this.sortButton.classList.toggle('active');


                this.selectedCategory = this.sortMenu.value;
                this.sortButton.children[1].children[1].innerText = this.selectedCategory;
                setTimeout(() => {
                    this.sortButton.children[1].children[0].style.display = 'none';
                }, 500);
            })
            this.sortList.append(li);
        }


        if (this.catalogCategory.dataset.category == 'sets' ||
            this.catalogCategory.dataset.category == 'roll' ||
            this.catalogCategory.dataset.category == 'sushi') {
            for (let i = 0; i < this.sortMenu.options.length; i++) {
                createList(i);
            }
        } else {
            for (let i = 0; i < (this.sortMenu.options.length - 2); i++) {
                createList(i);
            }
        }

    }

    openSortMenu() {

        this.sortButton.addEventListener('click', () => {

            this.sortButton.classList.toggle('active');
            this.sortList.classList.toggle('active');
            if (this.sortButton.classList.contains('active')) {
                this.sortButton.children[1].children[0].style.display = 'block';
                this.sortButton.children[1].children[1].innerText = this.selectedCategory;
            } else {
                setTimeout(() => {
                    this.sortButton.children[1].children[0].style.display = 'none';
                }, 500);
            }
        });
    }

    sort(selectedLink) {
        this.containerProduct.innerHTML = ' ';
        let currentCategory;
        Object.keys(this.allProducts).forEach(key => {
            if (this.catalogCategory.dataset.category == key) {

                switch (selectedLink.textContent) {
                    case 'За замовчуванням':
                        currentCategory = this.allProducts[key];
                        currentCategory.sort((a, b) => a.id - b.id);
                        currentCategory.forEach(product => {
                            router.createCards(this.containerProduct, product)
                        });
                        break;
                    case 'Назва':
                        currentCategory = this.allProducts[key];
                        currentCategory.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                        currentCategory.forEach(product => {
                            router.createCards(this.containerProduct, product)
                        });
                        break;
                    case 'Спочатку дешевше':
                        currentCategory = this.allProducts[key];
                        currentCategory.sort((a, b) => parseInt(a.price) - parseInt(b.price));
                        currentCategory.forEach(product => {
                            router.createCards(this.containerProduct, product)
                        });
                        break;
                    case 'Спочатку дорожче':
                        currentCategory = this.allProducts[key];
                        currentCategory.sort((a, b) => parseInt(b.price) - parseInt(a.price));
                        currentCategory.forEach(product => {
                            router.createCards(this.containerProduct, product)
                        });
                        break;
                    case 'Кількість шматочків':
                        currentCategory = this.allProducts[key];
                        currentCategory.sort((a, b) => parseInt(a.info.split(' ')[2]) - parseInt(b.info.split(' ')[2]));
                        currentCategory.forEach(product => {
                            router.createCards(this.containerProduct, product)
                        });
                        break;
                    case 'Вага':
                        currentCategory = this.allProducts[key];
                        currentCategory.sort((a, b) => parseInt(a.info.split(' ')[0]) - parseInt(b.info.split(' ')[0]));
                        currentCategory.forEach(product => {
                            router.createCards(this.containerProduct, product)
                        });
                        break;
                }
            }
        });
    }
}

const sortProduct = new SortProduct(
    './data/data.json',
    '.sort-menu__option-container',
    '.sort-menu__list',
    '.sort-menu__button',
    '.catalog__title',
    '.catalog__cards-container',
);



class Ordering {
    data = {};
    constructor(
        orderingSection,
        orderingForm,
        totalOrderingContainer,
        orderingSubmit,
        courierBtn,
        pickupBtn,
        cashBtn,
        cardBtn,
        iconCard,
        iconCash,

    ) {
        this.orderingSection = document.querySelector(orderingSection);
        this.orderingForm = document.querySelector(orderingForm);
        this.totalOrderingContainer = document.querySelector(totalOrderingContainer);
        this.orderingSubmit = document.querySelector(orderingSubmit);
        this.courierBtn = document.querySelector(courierBtn);
        this.pickupBtn = document.querySelector(pickupBtn);
        this.cashBtn = document.querySelector(cashBtn);
        this.cardBtn = document.querySelector(cardBtn);
        this.iconCard = document.querySelector(iconCard);
        this.iconCash = document.querySelector(iconCash);

        this.checkedOption();
        this.addSticksAndGravyBoat();

        this.prepareOrderData()
    }

    showOrderingSection(mainPage, categoryContainer, selectedCardContainer, mobileBasketContainer) {
        if (mainPage) {
            mainPage.style.display = 'none';
        }
        if (categoryContainer) {
            categoryContainer.style.display = 'none';
        }
        if (selectedCardContainer) {
            selectedCardContainer.style.display = 'none';
        }
        if (mobileBasketContainer) {
            mobileBasketContainer.style.display = 'none'
        }

        this.orderingSection.style.display = "block"
    }

    checkedOption() {
        this.courierBtn.addEventListener('click', () => {
            document.querySelector('#courier-input').checked = true;
            this.changeButtonStyle(this.courierBtn, this.pickupBtn);
        })
        this.pickupBtn.addEventListener('click', () => {
            document.querySelector('#pickup-input').checked = true;
            this.changeButtonStyle(this.pickupBtn, this.courierBtn);
        })

        this.cashBtn.addEventListener('click', () => {
            document.querySelector('#cash-input').checked = true;
            this.changeButtonStyle(this.cashBtn, this.cardBtn, this.iconCash, this.iconCard);
        })

        this.cardBtn.addEventListener('click', () => {
            document.querySelector('#card-input').checked = true;
            this.changeButtonStyle(this.cardBtn, this.cashBtn, this.iconCard, this.iconCash);
        })

    }

    changeButtonStyle(addClassBtn, removeClassBtn, addClassIcon, removeClassIcon) {
        addClassBtn.classList.add('checked');
        removeClassBtn.classList.remove('checked');
        if (addClassIcon) {
            addClassIcon.classList.add('checked');
            removeClassIcon.classList.remove('checked');
        }
    }


    addTotalOrderingBlock(basketTotalDate) {
        this.totalOrderingContainer.innerHTML = "";
        this.totalOrderingContainer.innerHTML = basket.createBaskedTotalCard(basketTotalDate);
        let { totalPrice, totalQuantity, discount, delivery } = basketTotalDate;
        this.data.totalPrice = totalPrice;
        this.data.totalQuantity = totalQuantity;
        this.data.discount = discount;
        this.data.deliveryPrice = delivery;
    }

    addSticksAndGravyBoat() {
        const quantitySticksAndGravyBoat = this.orderingForm.querySelector('.ordering-form__quantity');
        this.data.sticksAndGravyBoat = quantitySticksAndGravyBoat.textContent;
        this.orderingForm.addEventListener('click', (e) => {
            if (e.target.closest('.ordering-form__quantity-button.plus')) {
                quantitySticksAndGravyBoat.textContent = parseInt(quantitySticksAndGravyBoat.textContent) + 1;
            }
            if (e.target.closest('.ordering-form__quantity-button.minus')) {
                if (parseInt(quantitySticksAndGravyBoat.textContent) >= 2) {
                    quantitySticksAndGravyBoat.textContent = parseInt(quantitySticksAndGravyBoat.textContent) - 1;
                }
            }
            this.data.sticksAndGravyBoat = quantitySticksAndGravyBoat.textContent;
        })

    }

    prepareOrderData() {
        this.orderingSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('hhhh');
            let form = this.orderingForm;
            for (let i = 0; i <= form.elements.length; i += 1) {
                const element = form.elements[i];
                if (element) {
                    if (element.type == "radio" && !element.checked) continue
                    if (element.type == "button") continue;
                    if (element.name == "isChange" && element.checked) {
                        element.value = "потрібно"
                    } else if (element.name == "isChange" && !element.checked) {
                        element.value = "не потрібно"
                    }
                    this.data[element.name] = element.value;
                }
            }

            modal.getDataFromUser(this.data)
            this.data = {};
            form.reset();
            this.hideOrderingSection();
            basket.emptyTrash()
            router.showMainPage()
        })
    }


    hideOrderingSection() {
        console.log('hideOrderingSection');
        this.orderingSection.style.display = 'none'
    }
}

const ordering = new Ordering(
    '.ordering-section',
    '.ordering-form',
    '.ordering-form__total-container',
    '.ordering-form__submit-button',
    '#courier-btn',
    '#pickup-btn',
    '#cash-btn',
    '#card-btn',
    '#card-icon',
    '#cash-icon',
);






class Reviews {
    data
    constructor(
        pathToProducts,
        reviewsSection,
        reviewsGeneralContainer,
        reviewsCardsContainer,
        reviewUserContainer,
        reviewsForm,
        addReviewButton,
        addUserReviewButton
    ) {
        this.reviewsSection = document.querySelector(reviewsSection);
        this.reviewsGeneralContainer = document.querySelector(reviewsGeneralContainer);
        this.reviewsCardsContainer = document.querySelector(reviewsCardsContainer);
        this.reviewUserContainer = document.querySelector(reviewUserContainer);
        this.reviewsForm = document.querySelector(reviewsForm);
        this.addReviewButton = document.querySelector(addReviewButton);
        this.addUserReviewButton = document.querySelector(addUserReviewButton);


        this.getData(pathToProducts);

    }

    getData(path) {
        fetch(path)
            .then(res => res.json())
            .then(data => {
                this.data = data;

                this.addReview(data);
            })
    }

    showReviews() {

        this.reviewsCardsContainer.innerHTML = "";
        this.reviewsSection.style.display = "flex";
        this.reviewUserContainer.style.display = "none";

        if (window.matchMedia("(max-width: 767px)").matches) {
            this.reviewsGeneralContainer.style.display = "block";
        } else {
            this.reviewsGeneralContainer.style.display = "grid";
        }

        Object.keys(this.data).forEach(key => {
            if (key === "reviews") {
                let reviews = this.data[key];
                reviews.sort(function (a, b) {
                    return b.id - a.id;
                });
                reviews.forEach(review => {
                    this.reviewsCardsContainer.innerHTML += this.createReviewCard(review);
                });
            }
        })

    }

    addReview(data) {
        this.addReviewButton.addEventListener('click', () => {
            this.reviewsGeneralContainer.style.display = "none";
            this.reviewUserContainer.style.display = "block";
        })

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear()).substring(2);
        const formattedDate = `${month}.${day}.${year}`;

        let form = this.reviewsForm;
        this.addUserReviewButton.addEventListener('click', (event) => {
            event.preventDefault();
            const userReview = {};

            let isValid = true;

            for (let i = 0; i < form.elements.length; i += 1) {
                const element = form.elements[i];
                if (element.type == "button") continue;

                if (!element.value) {
                    isValid = false;
                    element.classList.add('reviews__error');
                    element.nextElementSibling.style.display = "inline-block";
                } else {
                    element.classList.remove('reviews__error');
                    element.nextElementSibling.style.display = "none";
                }
            };


            if (isValid) {
                let reviews = null;
                Object.keys(data).forEach(key => {
                    if (key === "reviews") {
                        reviews = data[key];
                        for (let i = 0; i < form.elements.length; i += 1) {
                            const element = form.elements[i];
                            if (element.type == "button") continue;
                            userReview.id = reviews.length + 1;
                            userReview.user_date = formattedDate;
                            userReview[element.name] = element.value;
                        }
                    }

                });
                reviews.push(userReview);
                form.reset();
                this.showReviews()
            }
        });
    }

    createReviewCard(review) {
        return (
            `
                             <div class="reviews__card">
                        <div class="reviews__header">
                            <h3 class="reviews__card-title">${review.user_name}</h3>
                            <span class="reviews__card-time">${review.user_date}</span>
                        </div>
                        <p class="reviews__card-text">${review.review}</p>
                    </div>
                                `);
    }


    hideReviews() {
        console.log('hideReviews');
        this.reviewsSection.style.display = "none";
    }
}


const reviews = new Reviews(
    './data/data.json',
    '.reviews',
    '.reviews__general-reviews-container',
    '.reviews__cards-container',
    '.reviews__user-review-container',
    '.reviews__form',
    '#reviews__button',
    '#own-review-button',
);




class Modal {

    constructor(
        modalContainer,
        modalLink,


    ) {
        this.modalContainer = document.querySelector(modalContainer);
        this.modalLinks = document.querySelectorAll(modalLink);
        this.timeout = 800;  //* тут час повинен долівнювати часу анімації в CSS (повинна співпадати з влативістю transition в CSS)
        this.unlock = true; //* щоб небуло подвійних кліків
        this.body = document.querySelector('body');
        this.logPadding = document.querySelectorAll('.lock-padding');

        this.orderModal;
        this.modal;

        this.orderData;
        this.modalHandler();
    }

    getDataFromUser(data) {
        this.orderData = data;
        this.createModalWithData(this.orderData);
        this.modalOpen(this.orderModal);
    }

    createModal() {
        console.log('createModal');
        this.modalContainer.innerHTML = "";
        this.modalContainer.innerHTML =
            `
                <div id="modal" class="modal">
                    <div class="modal__body">
                        <div class="modal__content modal__content--gratitude" onclick="modal.modalClose(this.closest('.modal'))">
                            <button class="modal__close-button close-modal">
                                <svg class="button-close-icon" width="22px" height="22px">
                                    <use href="./images/main-page/sprite.svg#icon-close-black"></use>
                                </svg>
                            </button>
                            <h2 class="modal__title">Необхідний заголовок</h2>
                            <p>Необхідний контент</p>
                        </div>
                    </div>
                </div>
                                `;
        this.modal = document.querySelector('#modal');
    }


    createModalWithData(orderData) {
        this.modalContainer.innerHTML = "";
        console.log('createModalWithData');
        console.log(orderData);
        this.modalContainer.innerHTML =
            `
                <div id="modal-gratitude" class="modal">
                    <div class="modal__body">
                        <div class="modal__content modal__content--gratitude">
                            <button class="modal__close-button close-modal" onclick="modal.modalClose(this.closest('.modal'))">
                                <svg class="button-close-icon" width="22px" height="22px">
                                    <use href="./images/main-page/sprite.svg#icon-close-black"></use>
                                </svg>
                            </button>
                            <h2 class="modal__title">Ваше замовлення прийнято!</h2>

                            <div class="modal__text-container">
                            <span class="modal__text">Прізвище:</span><span class="modal__text">${orderData.lastName}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Ім'я:</span><span class="modal__text">${orderData.firstName}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Вид доставки:</span><span class="modal__text">${orderData.delivery}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Спосіб оплати:</span><span class="modal__text">${orderData.orderingType}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Вулиця:</span><span class="modal__text">${orderData.street}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Будинок:</span><span class="modal__text">${orderData.house}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Квартира:</span><span class="modal__text">${orderData.apartment}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Під'їзд:</span><span class="modal__text">${orderData.entrance}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Поверх:</span><span class="modal__text">${orderData.floor}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Код:</span><span class="modal__text">${orderData.code}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Телефон:</span><span class="modal__text">${orderData.email}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Кількість товару:</span><span class="modal__text">${orderData.totalQuantity}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Загальна вартість:</span><span class="modal__text">${orderData.totalPrice}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Вартість доставки:</span><span class="modal__text">${orderData.deliveryPrice}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Знижка:</span><span class="modal__text">${orderData.discount}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Палички(шт.):</span><span class="modal__text">${orderData.sticksAndGravyBoat}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Коментар:</span><span class="modal__text">${orderData.comment}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Підготувати здачу:</span><span class="modal__text">${orderData.isChange}</span>
                            </div>
                            <div class="modal__text-container">
                            <span class="modal__text">Здача з:</span><span class="modal__text">${orderData.change}</span>
                            </div>
                        </div>
                    </div>
                </div>
                                `;
        this.orderModal = document.querySelector('#modal-gratitude');
    }


    modalHandler() {
        if (this.modalLinks.length > 0) {
            for (let i = 0; i < this.modalLinks.length; i++) {
                const modalLink = this.modalLinks[i];
                modalLink.addEventListener('click', (e) => { //* Коли просто потрідкрити вікно без даних
                    e.preventDefault();
                    this.createModal();
                    this.modalOpen(this.modal);
                })
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modalActive = document.querySelector('.modal.open');
                this.modalClose(modalActive);
            }
        })

    }

    modalOpen(currentModal) {
        console.log('modalOpen');
        console.log(currentModal);
        console.log(this.unlock);
        if (currentModal && this.unlock) {
            const modalActive = document.querySelector('.modal.open'); //* Якщо в нас є попап у попапі то він закриється. 
            if (modalActive) {
                this.modalClose(modalActive, false)
            } else {
                this.bodyLock();
            }

            currentModal.classList.add('open');
            currentModal.addEventListener('click', (e) => {
                if (!e.target.closest('.modal__content')) {
                    this.modalClose(e.target.closest('.modal'));
                }
            });
        }
    }

    modalClose(modalActive, doUnLock = true) {
        console.log('modalClose');
        console.log(modalActive);

        if (this.unlock) {
            modalActive.classList.remove('open');
            if (doUnLock) {
                this.bodyUnLock();
            }
        }
    }

    bodyLock() {
        console.log('bodyLock');
        const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

        if (this.logPadding.length > 0) {    //* Для фіксованих об'єктів (за наявності)
            for (let i = 0; i < this.logPadding.length; i++) {
                const element = this.logPadding[i];
                element.style.paddingRight = lockPaddingValue;
            }
        }

        this.body.style.paddingRight = lockPaddingValue;
        this.body.classList.add('lock')

        this.unlock = false; //* для уникнення повторних кліків
        setTimeout(() => {
            this.unlock = true;
        }, this.timeout);
    }

    bodyUnLock() {
        console.log('bodyUnLock');
        setTimeout(() => {
            if (this.logPadding.length > 0) {    //* Для фіксованих об'єктів (за наявності)
                for (let i = 0; i < this.logPadding.length; i++) {
                    const element = this.logPadding[i];
                    element.style.paddingRight = '0px';
                }
            }
            this.body.style.paddingRight = '0px';
            this.body.classList.remove('lock')
        }, this.timeout);
        this.unlock = false; //* для уникнення повторних кліків
        setTimeout(() => {
            this.unlock = true;
        }, this.timeout);
    }
}

const modal = new Modal(
    '#modal-container',
    '.modal-link',

);


document.querySelector('.about__btn').addEventListener('click', function () {
    const aboutBtn = document.querySelector('.about__btn');
    document.querySelector('.about').classList.toggle('active');
    if (aboutBtn.textContent == 'Детальніше ▽') {
        aboutBtn.innerHTML = `Детальніше △`;
    }
    else {
        aboutBtn.innerHTML = `Детальніше ▽ `;
    }

})




















