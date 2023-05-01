//* Налаштувння слайдеру

const splide = new Splide('.splide', {
    type: 'loop',
    drag: 'free',
    focus: 'left',
    perPage: 1,
    autoplay: true,
});

splide.mount();

const mediaDesktop = window.matchMedia('(min-width: 1171px)');


if (mediaDesktop.matches) {
    const newPopularSlider = new Splide('#new-popular-slider', {
        type: 'loop',
        drag: 'free',
        focus: 'left',
        perPage: 3,
        gap: '20px',
    });

    newPopularSlider.mount();

    const selectedSlider = new Splide('#selected-card-slider', {
        type: 'loop',
        drag: 'free',
        focus: 'left',
        perPage: 3,
        gap: '20px',
    });

    selectedSlider.mount();
} else {
    const newPopularSlider = new Splide('#new-popular-slider', {
        type: 'loop',
        drag: 'free',
        focus: 'left',
        perPage: 2,
        height: '300px',
        gap: '20px',

    });

    newPopularSlider.mount();

    const selectedSlider = new Splide('#selected-card-slider', {
        type: 'loop',
        drag: 'free',
        focus: 'left',
        perPage: 2,
        height: '300px',
        gap: '20px',

    });

    selectedSlider.mount();
}



