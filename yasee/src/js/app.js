$(document).ready(function(){
/*Smooth Scroll*/
// Select all links with hashes
$('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
        // On-page links
        if (
            location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname
        ) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function() {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });


    /*sticky nav*/

   $('.js--section-about').waypoint(function(direction){
       if(direction == 'down') {
           $('nav').addClass('sticky');
       } else {
           $('nav').removeClass('sticky');
       }
   }, {
       offset: '220px;'
   });

   // 地圖隱藏或顯示

   $('#mapButton').click(function() {
       if($('#mapButton').text() === '地圖') {
           $('#mapButton').text("搜尋")
       }else {
            $('#mapButton').text("地圖")
       }

      $('#map').fadeToggle()
   })

   // ajax search
   $('#searchButton').click(function() {
       search()
   })

  function search() {
     // 抓取輸入搜尋值
     const inputSearch = $('#searchInput').val().toString()
     let html = ''
     $.ajax({
         url: './yajson.json',
         dataTpye: 'json',
         type: 'GET'
     }).done(function(d) {

         $.each(d, function(i, v){
             let name = v.name.toString()
             console.log(name)
             if(name.search(inputSearch) > 0) {
                 console.log(v.name)
                // console.log(i)
                html += `<h1>${v.name}</h1><h3>第${v.line}排 第${v.number}攤</h3><p>描述</p>`
            }
         })
         $('#yasee__output').html(html)
     })
  }
});


  // Remodal

  window.REMODAL_GLOBALS = {
  NAMESPACE: 'modal',
  DEFAULTS: {
    hashTracking: false
  }
};







//
