$(function(){  
	var $main = $('body');
    // 区分是预览还是线上逻辑
    if($main.hasClass('forPreview')){
        // 预览环境执行的代码
    }else{
        // 线上环境执行的代码
        if($main.height() > screen.height){
            $('#copyright', $main).css('position', 'absolute');
        }
    }
    // 防止preview组件每次插入此代码都添加监听事件
	$('.audio', $main).off('click');
    $('.audio', $main).on('click',function(event) {
    	var $curTarget = $(event.currentTarget);
        var $musicBtn = $(".mscBtn", $curTarget);
        var $musicPlay = $(".music-play", $curTarget);
        var $musicPause = $(".music-pause", $curTarget);
        var music = $(".bgMusic", $curTarget)[0];
        var musicPlay = function(){
            music.play();
            $musicBtn.css('animation-play-state', 'running');
            $musicBtn.css('-webkit-animation-play-state', 'running');
            $musicPause.css({
                opacity: 0
            });
            $musicPlay.css({
                opacity: 1
            });
        }
        var musicPause = function(){
            music.pause();
            $musicBtn.css('animation-play-state', 'paused');
            $musicBtn.css('-webkit-animation-play-state', 'paused');
            $musicPause.css({
                opacity: 1
            });
            $musicPlay.css({
                opacity: 0
            });
        }
        if (music.paused) {
            musicPlay();
        } else {
            musicPause();
        }
    });
});  