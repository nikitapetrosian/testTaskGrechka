import { getSlidesList } from "./apiHelper";

(async () => {
    let slidesList = [];
    let slidesNumber = 0;

    const fetchParams = {
        limit: 3,
        offset: 0
    };

    async function fetchData() {
        const { data, countAll } = await getSlidesList(fetchParams);

        if (data) {
            slidesList = data;
            slidesNumber = countAll;
        }
    }

      
    await fetchData();

    let init = false;

    function initCarsSlider() {
        if (slidesList.length > 0) {
            init = true;

            const sliderContainer = document.querySelector('.cars__slider .swiper-wrapper');

            sliderContainer.innerHTML = slidesList.map((slide) => {
                return `
                    <div class="cars__slide swiper-slide">
                        <div class="cars__img">
                            <img src=${slide.imgUrl} alt=${slide.title}>
                        </div>
                        <h2 class="cars__title">${slide.title}</h2>
                        <div class="cars__description-wrapper"><p class="cars__description">${slide.desc}</p></div>
                    </div>
                `;
            }).join('');
        
            const carsSlider = new Swiper('.cars__slider', {
                slidesPerView: 1,
                allowTouchMove: false,
                speed: 1000,
        
                navigation: {
                    nextEl: '.cars__next-button',
                    prevEl: '.cars__prev-button'
                },
        
                effect: "creative",
                creativeEffect: {
                    prev: {
                        shadow: true,
                        translate: ["-20%", 0, -1],
                    },
                    next: {
                        translate: ["100%", 0, 0],
                    },
                },

                on: {
                    slideChange: async function (s) {
                        if (s.realIndex === s.slides.length - 1) {
                            console.log(slidesNumber - fetchParams.offset > 3)
                            if (slidesNumber - fetchParams.offset > 3) {
                                fetchParams.offset += 3;
                                await fetchData();
                                const fetchedSlides = slidesList.map((slide) => {
                                    return `<div class="cars__slide swiper-slide"><div class="cars__img"><img src=${slide.imgUrl} alt=${slide.title}></div><h2 class="cars__title">${slide.title}</h2></div>`
                                });
                                s.appendSlide(fetchedSlides);
                            }
                        }
                    }
                }
            });
        } else {
            carsSlider.destroy();
            init = false;
        }
    }

    initCarsSlider();

    console.log(slidesList);
})()