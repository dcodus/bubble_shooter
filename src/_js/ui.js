import jQuery from 'jquery';
import BubbleShoot from './BubbleShoot.js';

const ui = (function ($) {
    const ui = {
        BUBBLE_DIMS: 44,
        ROW_HEIGHT: 38,
        init: function () {
        },
        endGame: function (hasWon, score) {
            $('#game').unbind('click');
            BubbleShoot.ui.drawBubblesRemaining(0);
            if (hasWon) {
                $('.level_complete').show();
                $('.level_failed').hide();
            } else {
                $('.level_complete').hide();
                $('.level_failed').show();
            }
            $('#final_score_value').text(score);
            $('#end_game').fadeIn(500);
        },
        drawScore: function (score) {
            $('#score p').text(score);
        },
        drawHighScore: function (highScore) {
            $('#highScore p').text(highScore);
        },
        drawLevel: function (level) {
            $('#level p').text(level + 1);
        },
        hideDialog: function () {
            $('.dialog').fadeOut(300);
        },
        getMouseCoords: function (e) {
            const coords = {x: e.pageX, y: e.pageY};
            return coords;
        },
        getBubbleCoords: function (bubble) {
            const bubbleCoords = bubble.position();
            bubbleCoords.left += ui.BUBBLE_DIMS / 2;
            bubbleCoords.top += ui.BUBBLE_DIMS / 2;
            return bubbleCoords;
        },
        getBubbleAngle: function (bubble, e) {
            const
                mouseCoords = ui.getMouseCoords(e),
                bubbleCoords = ui.getBubbleCoords(bubble),
                gameCoords = $('#game').position(),
                boardLeft = 120;

            let angle = Math.atan((mouseCoords.x - bubbleCoords.left - boardLeft) / (bubbleCoords.top + gameCoords.top - mouseCoords.y));

            if (mouseCoords.y > bubbleCoords.top + gameCoords.top) {
                angle += Math.PI;
            }
            return angle;
        },
        fireBubble: function (bubble, coords, duration) {

            bubble.setState(BubbleShoot.BubbleState.FIRING);

            const complete = function () {
                if (bubble.getRow() !== null) {
                    bubble.getSprite().css('transition', '');
                    bubble.getSprite().css({
                        left: bubble.getCoords().left - ui.BUBBLE_DIMS / 2,
                        top: bubble.getCoords().top - ui.BUBBLE_DIMS / 2
                    });
                    bubble.setState(BubbleShoot.BubbleState.ON_BOARD);
                } else {
                    bubble.setState(BubbleShoot.BubbleState.FIRED);
                }
            };


            if (bubble.getSprite().animate.name === 'canvasAnimate') {
                bubble.getSprite().animate({
                    left: coords.x - ui.BUBBLE_DIMS / 2,
                    top: coords.y - ui.BUBBLE_DIMS / 2
                }, {
                    duration: duration,
                    easing: 'linear',
                    complete: function () {
                        if (bubble.getRow()) {
                            bubble.getSprite().css({
                                left: bubble.getCoords().left - ui.BUBBLE_DIMS / 2,
                                top: bubble.getCoords().top - ui.BUBBLE_DIMS / 2
                            })
                        }
                    }
                })
            } else {
                bubble.getSprite().css(`transition`, `all ${duration / 1000}s linear`);
                bubble.getSprite().css({
                    left: coords.x - ui.BUBBLE_DIMS / 2,
                    top: coords.y - ui.BUBBLE_DIMS / 2
                });
                setTimeout(complete, duration);

            }


        },
        drawBoard: function (board) {
            const rows = board.getRows(),
                gameArea = $('#board');

            rows.forEach(function (row, i) {
                row.forEach(function (bubble, j) {
                    if (bubble) {
                        const sprite = bubble.getSprite();
                        gameArea.append(sprite);
                        const left = j * ui.BUBBLE_DIMS / 2,
                            top = i * ui.ROW_HEIGHT;
                        sprite.css({
                            left: left,
                            top: top
                        })
                    }
                })
            })
        },
        drawBubblesRemaining: function (numBubbles) {
            $('#bubbles_remaining').text(numBubbles < 10 ? `0${numBubbles}` : numBubbles);
        }
    };
    return ui;
})(jQuery);


export default ui;