jQuery.noConflict();
jQuery(function($) {
    alert('js worked!!');
    /*
     * 外部链接添加属性：target="_blank"
     */
    $('a[href^="http://"]').attr('target', '_blank');

    /**
     * 提取<time>标签中datetime属性
     * datetime为 yyyy-mm-dd 格式
     */
    var datetime = $('time').attr('datetime').split('-');
    $('time').find('.year').text(datetime[0]).end()
        .find('.month').text(datetime[1]).end()
        .find('.day').text(datetime[2]).end()
        .find('.year-month-day').text(datetime.join('.')).end()
        .find('.year-month').text(datetime[0] + '.' + datetime[1]).end()
        .find('.month-day').text(datetime[1] + '.' + datetime[2]);

    /*
     * 一级菜单鼠标悬停时显示二级菜单
     */
    $('ul.parent').children('li').hover(function() {
        $(this).find('ul.sub').stop().slideDown();
    }, function() {
        $(this).find('ul.sub').stop().slideUp();
    });

    /*
     * 滚动时导航栏固定在最顶部
     */
    // 变量
    var primaryNav = $('#primary-nav');
    var main = $('main');
    var primaryNavHeight = primaryNav.height();
    var primaryNavOffsetTop = primaryNav.offset().top;
    // 监听滚动事件
    $(document).scroll(function(event) {
        if (primaryNavOffsetTop < $(document).scrollTop()) {
            // 固定在顶部
            primaryNav.addClass('nav-fix-top');
            main.css('margin-top', primaryNavHeight);
        } else {
            // 随文档滚动
            primaryNav.removeClass('nav-fix-top');
            main.css('margin-top', 0);
        }
    });

    /*
     * 首页滑动图片
     */
    // 变量
    var slider = $('#slider');
    var sliderImages = slider.find('img');
    var sliderTitle = slider.find('.slider-title');
    // 初始化文字标题.
    sliderTitle.html('<span class="animated fadeInLeft">' + sliderImages[0].getAttribute('alt') + '</span>');
    // 插件：unslider
    slider.unslider({
        speed: 500, //  The speed to animate each slide (in milliseconds)
        delay: 3000, //  The delay between slide animations (in milliseconds)
        complete: function() {
            // 更新文字标题
            var dots = slider.find('ol');
            var currentImgIndex = dots.find('li').index(dots.find('.active'));
            var imgAltText = sliderImages[currentImgIndex].getAttribute('alt');
            sliderTitle.html('<span class="animated fadeInLeft">' + imgAltText + '</span>');
        }, //  A function that gets called after every slide animation
        keys: true, //  Enable keyboard (left, right) arrow shortcuts
        dots: true, //  Display dot navigation
        arrows: true, //  Display next & prev
        fluid: true //  Support responsive design. May break non-responsive designs
    });
    // 隐藏dots的数字
    slider.find('ol').find('li').text('');
    // 追加arrows到滑动图片区域
    var sliderArrows = slider.append($('p.arrows')).find('.arrows');
    // arrows显示图标
    sliderArrows.hide()
        .find('.next').html('<i class="fa fa-angle-right"></i>').end()
        .find('.prev').html('<i class="fa fa-angle-left"></i>');
    // 鼠标悬停时显示arrows
    slider.hover(function() {
        sliderArrows.stop().fadeIn('normal');
    }, function() {
        sliderArrows.stop().fadeOut('normal');
    });
    //图片添加响应式
    sliderImages.addClass('img-responsive');

    /**
     * 首页新闻类、预告类首次出现在屏幕上时的淡入动画
     */
    $('.main-box').addClass('wow fadeInUp').attr('data-wow-offset', '0');
    wow = new WOW({
        boxClass: 'wow', // default
        animateClass: 'animated', // default
        offset: 0, // default
        mobile: true, // default
        live: true // default
    });
    wow.init();

    /*
     * 阅读更多动画
     */
    $('.more').hover(function() {
        $(this).addClass('animated jello');
    }, function() {
        $(this).removeClass('animated jello');
    });

    /*
     * 鼠标悬停在二维码上时显示大图
     */
    $('.qrcode').hover(function() {
        $(this).find('img').show().removeClass('bounceOut').addClass('bounceIn');
    }, function() {
        // 解决IE9 及以下版本，不支持CSS3，导致二维码大图不消失的bug
        if (whichIE()>0 && whichIE()<10){
            $(this).find('img').hide().removeClass('bounceIn').addClass('bounceOut');
        }else{
            $(this).find('img').removeClass('bounceIn').addClass('bounceOut');
        }
    });

    /**
     * 返回顶部
     */
    // 返回顶部  
    function getScrollTop() {
        return document.documentElement.scrollTop + document.body.scrollTop;
    }
    function setScrollTop(value) 
    { 
        if (document.documentElement.scrollTop) 
        { 
            document.documentElement.scrollTop = value; 
        } 
        else 
        { 
            document.body.scrollTop = value; 
        } 
    }
    // 弹性返回顶部，展现滚动的动画
    var goToTop = $('#go-to-top');
    goToTop.click(function(event) {
        var goTop = setInterval(scrollMove, 12); 
        function scrollMove() 
        { 
            setScrollTop(getScrollTop() / 1.1); 
            if (getScrollTop() < 1) clearInterval(goTop); 
        } 
    });
    // 自动隐藏放回顶部按钮
    $(window).scroll(function(event) {
        var i = getScrollTop()>0 ? goToTop.fadeIn('fast') : goToTop.fadeOut('fast');
    });
});

/**
 * 判断浏览器类型
 * 返回表示浏览器类型的字符串
 */
function whoIsMe(){
    var explorer = navigator.userAgent;
    if(explorer.indexOf("Opera") != -1) { 
        return 'Opera'; 
    } 
    else if(explorer.indexOf("MSIE") != -1) { 
        return 'IE'; 
    } 
    else if(explorer.indexOf("Firefox") != -1) { 
        return 'Firefox'; 
    } 
    else if(explorer.indexOf("Netscape") != -1) { 
        return 'Netscape'; 
    } 
    else if(explorer.indexOf("Chrome") != -1) { 
        return 'Chrome'; 
    } 
    else if(explorer.indexOf("Safari") != -1) { 
        return 'Safari'; 
    } 
    else{ 
        return '无法识别的浏览器。'; 
    } 
}

/*
 * 判断IE的版本。
 * 返回表示IE版本号的int型数字
 * 返回-1表示不是IE浏览器
 */
function whichIE(){
    var appName = navigator.appName;
    var appVersion = navigator.appVersion;

    if(appName != "Microsoft Internet Explorer" ){
        return -1;
    }
    if(appVersion.match(/6./i)=="6."){ 
        return 6; 
    } 
    else if(appVersion.match(/7./i)=="7."){ 
        return 7; 
    } 
    else if(appVersion.match(/8./i)=="8."){ 
        return 8; 
    } 
    else if(appVersion.match(/9./i)=="9."){ 
        return 9; 
    } 
}