import zim from "https://zimjs.com/cdn/015/zim_game";

// See Docs under Frame for FIT, FILL, FULL, and TAG
const frame = new Frame(FIT, 1024, 768, dark, light, game);
let gameOver = false;
function game() {
    const actualGame = new Container().addTo();
    const leftScorer = new Scorer({backgroundColor:green, color:black, isometric:RIGHT}).addTo(actualGame);
    leftScorer.loc(300, 100);
    const rightScorer = new Scorer({backgroundColor:red, color:black, isometric:RIGHT}).addTo(actualGame);
    rightScorer.loc(700, 100);
    // put code here
    const MAX_SCORE = 5;
    const s = 5;//speed
    let speedX = s;
    let speedY = s;
    let inGame = true;
    let rightWin = true;
    const ball = new Circle(20, purple).center().addTo(actualGame);// create ball
    const rightPaddle = new Rectangle(20,150,red).loc(980,300).addTo(actualGame)// create right paddle 
    const leftPaddle = new Rectangle(20,150,green).loc(20,300).addTo(actualGame)// create right paddle 

    Ticker.add(() =>{
        //until the game is over the ball keeps moving
        if(inGame){
        ball.x += speedX;
        ball.y += speedY;
        //used to check that the ball does not come out of the frame
        if(ball.y > frame.height - ball.radius || ball.y < ball.radius){
            speedY *= -1;
        }
        //used to throw the ball
        if(Math.abs(ball.x -( leftPaddle.x + leftPaddle.width + ball.radius)) < s && ball.y < leftPaddle.y + leftPaddle.height && ball.y > leftPaddle.y){
            speedX *= -1;
        }
        else if(Math.abs(rightPaddle.x - ball.radius - ball.x ) < s && ball.y < rightPaddle.y + rightPaddle.height && ball.y > rightPaddle.y){
            speedX *= -1;
        }
        // add score
        else if (ball.x < 0){
            ball.loc(leftPaddle.x + leftPaddle.width + ball.radius + 1, leftPaddle.y + leftPaddle.height/2);
            rightScorer.score += 1;
            inGame = false;
            rightWin = true;
        }
        else if (ball.x > frame.width){
            ball.loc(rightPaddle.x - ball.radius - 1, rightPaddle.y+ rightPaddle.height/2);
            leftScorer.score += 1;
            inGame = false;
            rightWin = false;
        }
    }
    else{
        //designates the winner
        if (leftScorer.score == MAX_SCORE){
            new Label({
            text:"left player won",
            size:100,
            font:"courier",
            color:green,
            bold:true,
            italic:true
            }).center().addTo(actualGame);
            gameOver = true;
        }
        if (rightScorer.score == MAX_SCORE){
            new Label({
            text:"right player won",
            size:100,
            font:"courier",
            color:red,
            bold:true,
            italic:true
            }).center().addTo(actualGame);
            Ticker.removeAll();
            gameOver = true;
        }
        //with each shot the ball restarts at the paddle location of the person who lost the point
        if (rightWin) {
            ball.loc(leftPaddle.x + leftPaddle.width + ball.radius + 1, leftPaddle.y + leftPaddle.height/2); 
        }
        else{
            ball.loc(rightPaddle.x - ball.radius - 1, rightPaddle.y+ rightPaddle.height/2);
        }
    }
        
        
    })
    //move the paddles
    frame.on("keydown", e=>{
        var step = 20;
        switch (e.key) {
            case "ArrowUp":
                if (rightPaddle.y > step){
                    rightPaddle.y-= step;
                }
                else{
                    rightPaddle.y = 0;
                }
                break;
            case "ArrowDown":
                    if (rightPaddle.y < frame.height - rightPaddle.height){
                        rightPaddle.y+= step;}
                        else{
                            rightPaddle.y = frame.height - rightPaddle.height;
                }
                break;
            case "w":
                if (leftPaddle.y > step){
                    leftPaddle.y-= step;
                }
                else{
                    leftPaddle.y = 0;
                }
                break;
            case "s":
                if (leftPaddle.y < frame.height - leftPaddle.height){
                    leftPaddle.y+= step;}
                else{
                        leftPaddle.y = frame.height - leftPaddle.height;
                }
                break;
            //restart a shot
            case "d":
                    if (!inGame && rightWin){
                        inGame = true; 
                        speedX = s;
                        speedY = s;
                    }
                    break;
            case "ArrowLeft":
                    if (!inGame && !rightWin){
                        inGame = true; 
                        speedX = -s;
                        speedY = -s;
                    }
                    break;  
            default:

            break;
        }
        
    })   
 
}// end game