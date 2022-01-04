function init(){

    var slideUp = {
        distance: '100px',
        origin: 'bottom',
        opacity: 0,
        duration: 800,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        interval: 100,
        delay: 100,
        reset: false
    };

    ScrollReveal().reveal('.reveal', slideUp);    

    var all = document.getElementsByClassName('hover_thumbnail');
    var postsPos = document.getElementById('posts');
    var offX = 30;
    var mousePos;

    const onMouseMove = (e) =>{
      for (var i = 0; i < all.length; i++) {
        mousePos = (e.pageX + offX ) + 'px';
        all[i].style.left = mousePos;
      }
    }
    document.addEventListener('mousemove', onMouseMove);

    const loader = document.querySelector('.loader');

    // reset position of the loading screen
    gsap.set(loader, {
        scaleX: 1.25,
        scaleY: 2,
        rotation: 0,
        xPercent: -125,
        transformOrigin: 'left center', 
        autoAlpha: 1
    });

    function loaderIn() {
        // GSAP tween to strech the loading screen across the whole screen
        return gsap.fromTo(loader, 
            {
                xPercent: -125
            },
            { 
                duration: 0.6,
                xPercent: 0,
                ease: 'Power3.easeIn', 
                transformOrigin: 'left center'
            });
    }

    function loaderAway() {
        // GSAP tween to hide loading screen
        return gsap.to(loader, { 
            duration: 0.5,
            xPercent: 125, 
            transformOrigin: 'right center', 
            ease: 'Power3.easeOut'
        });
    }

    // do something before the transition starts
    barba.hooks.before(() => {

        //document.querySelector('html').classList.add('is-transitioning');
        //barba.wrapper.classList.add('is-animating');

    });

    // do something after the transition finishes
    barba.hooks.after(() => {

        //document.querySelector('html').classList.remove('is-transitioning');
        //barba.wrapper.classList.remove('is-animating');
        ga('set', 'page', window.location.pathname);
        ga('send', 'pageview');

        /*
        let bottomDOM = document.getElementsByTagName("body")[0]
        let newScript = document.createElement("script")
        //const oldScript = document.querySelector(".post-scripts")
        newScript.src = "/assets/js/post-scripts.js"
        newScript.className = "post-scripts"
        //oldScript.remove()
        bottomDOM.appendChild(newScript)
        */
    });

    // scroll to the top of the page
    barba.hooks.enter(() => {

        window.scrollTo(0, 0);
        ScrollReveal().reveal('.reveal', slideUp);
        
        for (var i = 0; i < all.length; i++) {
          all[i].style.left = mousePos;
        }
        
    });

    barba.init({
        transitions: [{
            async leave() {
                await loaderIn();
        
            },
            enter() {
                loaderAway();
            }
        }],
        views: [{
            namespace: 'home',
            beforeEnter(data) {

                const iframe = document.querySelector('iframe');
                const player = new Vimeo.Player(iframe);

                document.getElementById("play-video").onclick = function() {
                    player.play();
                    document.querySelector("meta[name='theme-color']").setAttribute("content", "#0000fa");
                };

                function pauseVideo() {
                    player.pause();
                    document.querySelector("meta[name='theme-color']").setAttribute("content", "#000000");
                };

                document.getElementById("stop-video").onclick = function() {
                    pauseVideo();
                };
            }
        }, {
            namespace: 'work',
            beforeEnter(data) {

                // Slider dragging
                let slider = document.getElementsByClassName('post-gallery');
                slider = slider[slider.length-1];
                let isDown = false;
                let startX;
                let scrollLeft;

                slider.addEventListener('mousedown', (e) => {
                    isDown = true;
                    slider.classList.add('active');
                    startX = e.pageX - slider.offsetLeft;
                    scrollLeft = slider.scrollLeft;
                    cancelMomentumTracking();
                });

                slider.addEventListener('mouseleave', () => {
                    isDown = false;
                    slider.classList.remove('active');
                });

                slider.addEventListener('mouseup', () => {
                    isDown = false;
                    slider.classList.remove('active');
                    beginMomentumTracking();
                });

                slider.addEventListener('mousemove', (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - slider.offsetLeft;
                    const walk = (x - startX); //scroll-fast
                    var prevScrollLeft = slider.scrollLeft;
                    slider.scrollLeft = scrollLeft - walk;
                    velX = slider.scrollLeft - prevScrollLeft;
                });

                // Momentum 
                var velX = 0;
                var momentumID;

                slider.addEventListener('wheel', (e) => {
                    cancelMomentumTracking();
                });

                function beginMomentumTracking() {
                    cancelMomentumTracking();
                    momentumID = requestAnimationFrame(momentumLoop);
                }

                function cancelMomentumTracking() {
                    cancelAnimationFrame(momentumID);
                }

                function momentumLoop() {
                    slider.scrollLeft += velX * 2;
                    velX *= 0.95;
                    if (Math.abs(velX) > 0.5) {
                        momentumID = requestAnimationFrame(momentumLoop);
                    }
                }


                // Hide drag indicator
                slider.addEventListener("scroll", function(){
                   var st = this.scrollLeft;
                   if (st > 100){
                        document.getElementById("gallery-container").classList.add("scrolled");
                   } else {
                        document.getElementById("gallery-container").classList.remove("scrolled");
                   }
                }, false);



                //Gallery
                let gallery = document.getElementsByClassName('slider');
                gallery = gallery[gallery.length-1];
                var flkty = new Flickity( gallery, {
                  wrapAround: true,
                  imagesLoaded: true,
                  arrowShape: 'M19.6915 51.9335L47.8165 80.0585L51.6835 76.1915L28.2264 52.7344H79V47.2656H28.2264L51.6835 23.8085L47.8165 19.9415L19.6915 48.0665L17.758 50L19.6915 51.9335Z'
                });

                const cards = document.getElementsByClassName('card');
                for (var i = 0; i < cards.length; i++) {
                    const slide = parseInt(String(i));
                    cards[i].onclick = function() {
                        flkty.selectCell( slide, true, false )
                    }
                }

                document.getElementById('open-modal').onclick = function() {
                    flkty.selectCell( 0, true, false )
                }


                //Pre-gallery
                var parallaxSlow = document.querySelector('.parallax-slow');
                var slow = new simpleParallax(parallaxSlow, {
                    overflow: true,
                    transition: 'linear'
                });

                var parallaxFast = document.querySelector('.parallax-fast');
                var fast = new simpleParallax(parallaxFast, {
                    overflow: true,
                    scale: 1.75,
                    transition: 'linear'
                });

            },
            beforeLeave(data) {

            }
        }]
    })

}

window.addEventListener('load', function(){
    init();
});

function menuCheck() {
    if (document.getElementById("nav-trigger").checked == true) {
        document.getElementById("dark-trigger").checked = false;
    }
}

function darkModeCheck() {
    if (document.getElementById("dark-trigger").checked == true) {
        document.getElementById("nav-trigger").checked = false;
    }
}


window.addEventListener("scroll", function(){
   var st = window.pageYOffset || document.documentElement.scrollTop;
   if (st > 300){
        document.getElementById("site-header").classList.add("scrolled");
   } else {
        document.getElementById("site-header").classList.remove("scrolled");
   }
}, false);

var st = window.pageYOffset || document.documentElement.scrollTop;
if (st > 300){
    document.getElementById("site-header").classList.add("scrolled");
} else {
    document.getElementById("site-header").classList.remove("scrolled");
}