const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;


//get mouse position
let mouse = {
    x: null,
    y: null,
    radius: 5 * 5
}
window.addEventListener('mousemove', 
    function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    }
);

//crete particle
class Particle {
    constructor(x, y, directionX, directionY, size, color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    //draw individual particle
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    //Update position, collisions and movement
    update(){
        //check if particle is still winthin canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }
        //check collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.directionX = -this.directionX;
            }
            if (mouse.x > this.x && this.x > this.size * 10){
                this.directionX = -this.directionX;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                this.directionY = -this.directionY;
            }
            if (mouse.y > this.y && this.y > this.size * 10){
                this.directionY = -this.directionY;
            }
        }
        //move particle
        this.x += this.directionX;
        this.y += this.directionY;
        //draw particle
        this.draw();
    }
}

//create particle array
function init(){
    particlesArray = [];
    let numberOfParticles = ((canvas.height * canvas.width) / 9000) * 2;
    if(numberOfParticles > 70) numberOfParticles = 70;
    for(let i = 0; i < numberOfParticles; i++){
        let size = 0;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#194128';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

//animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }

    connect();
}

//check if particles are close enough to draw line between them
function connect(){
    let opacityValue = 1;
    for(let i = 0; i < particlesArray.length; i++){
        for(let j = i; j < particlesArray.length; j++){
            let distance = ((particlesArray[i].x - particlesArray[j].x) * (particlesArray[i].x - particlesArray[j].x)) + ((particlesArray[i].y - particlesArray[j].y) * (particlesArray[i].y - particlesArray[j].y)); 
            if(distance < (canvas.width/5) * (canvas.height/5)){
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = "rgba(25, 65, 40, " + opacityValue +")";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}
//resize event
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = 5 * 5;
    init();
});

init();
animate();
