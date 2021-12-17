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

        document.querySelector('html').classList.add('is-transitioning');
        barba.wrapper.classList.add('is-animating');
        
        document.getElementById("nav-trigger").onclick = function() {
            document.getElementById("dark-trigger").checked = false;
        };
        document.getElementById("dark-trigger").onclick = function() {
            document.getElementById("nav-trigger").checked = false;
        };

    });

    // do something after the transition finishes
    barba.hooks.after(() => {

        document.querySelector('html').classList.remove('is-transitioning');
        barba.wrapper.classList.remove('is-animating');
        ga('set', 'page', window.location.pathname);
        ga('send', 'pageview');
        
        document.getElementById("nav-trigger").onclick = function() {
            document.getElementById("dark-trigger").checked = false;
        };
        document.getElementById("dark-trigger").onclick = function() {
            document.getElementById("nav-trigger").checked = false;
        };

    });

    // scroll to the top of the page
    barba.hooks.enter(() => {
        
        document.getElementById("nav-trigger").onclick = function() {
            document.getElementById("dark-trigger").checked = false;
        };
        document.getElementById("dark-trigger").onclick = function() {
            document.getElementById("nav-trigger").checked = false;
        };

        window.scrollTo(0, 0);
        ScrollReveal().reveal('.reveal', slideUp);
        for (var i = 0; i < all.length; i++) {
          all[i].style.left = mousePos;
        }

        initAfterBarba();
        
    });

    barba.init({
        transitions: [{
            async leave() {
                await loaderIn();
        
            },
            enter() {
                loaderAway();
            }
        }]
    })

    function getPosition( element ) {
        var rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top
        };
    }

    function initAfterBarba() {

        const iframe = document.querySelector('iframe');
        const player = new Vimeo.Player(iframe);

        document.getElementById("play-video").onclick = function() {
            player.play()
        };

        document.getElementById("stop-video").onclick = function() {
            player.pause()
        };

        document.getElementById("close-video").onclick = function() {
            player.pause()
        };

    };
    initAfterBarba();

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
/*
document.getElementById("nav-trigger").onclick = function() {
    document.getElementById("dark-trigger").checked = false;
};
document.getElementById("dark-trigger").onclick = function() {
    document.getElementById("nav-trigger").checked = false;
};
*/