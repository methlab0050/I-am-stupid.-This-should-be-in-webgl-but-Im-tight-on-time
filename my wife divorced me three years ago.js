const canvas = document.getElementById('canvas') 
    || (()=>{
        let canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
        return canvas
    })();
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rect = canvas.getBoundingClientRect();
canvas.width = rect.width * devicePixelRatio;
canvas.height = rect.height * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);
canvas.style.width = rect.width + 'px';
canvas.style.height = rect.height + 'px';


function hexcode() {
    let colorHex = () => Math.floor(Math.random() * (256)).toString(16);
    let hexcoderice = colorHex() + colorHex() + colorHex();
    return '#' + hexcoderice.padEnd(6, '0');
};

function vector(x = null, y = null) {
    return {
        x: x?.x ?? x?.at(0) ?? x ?? 0, 
        y: x?.y ?? x?.at(1) ?? y ?? 0,
    }
}

const platform_list = []
const frame = []

class sprite_base {
    constructor(pos, vel, acc, size) {
        this.pos = vector(pos)
        this.vel = vector(vel)
        this.acc = vector(acc)
        this.size = vector(size)
    }

    update() {
        let is_colliding = this.collider()
        this.pos.x = (!is_colliding * (this.pos.x + this.vel.x))
        this.pos.y = (!is_colliding * (this.pos.y + this.vel.y))
        this.vel.x = (!is_colliding * (this.vel.x + this.acc.x))
        this.vel.y = (!is_colliding * (this.vel.y + this.acc.y))
        this.draw()
        return 1
    }

    collider() {
        return false
    }

    draw() {}
}

class image_sprite extends sprite_base {
    constructor(src, size, pos, vel, acc) {
        super(pos, vel, acc, size)
        this.img = new Image(
            this.size.x || undefined, 
            this.size.y || undefined
        )
        this.src = src 
        this.img.src = this.src
    }
    
    draw() {
        ctx.drawImage(
            this.img,
            this.pos.x - (this.img.width / 2), 
            this.pos.y - (this.img.height / 2),
            this.img.width, 
            this.img.height,
            /**
             * we're drawing the image
             * at the position minus half the size
             * (effectively drawing it relative to the centerpoint)
             */
        )
    }

    collider() {
        return false
    }
}

class rect_sprite extends sprite_base {
    constructor(color, size, pos, vel, acc) {
        super(pos, vel, acc, size) 
        this.color = color || hexcode()
        platform_list.push
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(
            this.pos.x - (this.img.width / 2), 
            this.pos.y - (this.img.height / 2),
            this.size.x, 
            this.size.y,
            /**
             * we're drawing the image
             * at the position minus half the size
             * (effectively drawing it relative to the centerpoint)
             * with the given size
             */
        )
    }
}

function sprite(src_or_color,size, pos, vel, acc) {
    let sprite_obj;

    if(src_or_color.search(/((https\:\/\/)|(.{0,}\.(png|jpeg)))/g) != -1) {
        sprite_obj = new image_sprite(src_or_color,size, pos, vel, acc)
    } else {
        sprite_obj = new rect_sprite(src_or_color,size, pos, vel, acc)
    }
    return sprite_obj
}

let onkey = {};
let onekey = {};
onkeydown = (event) => {
    try {
        ( onkey[event.key] ?? (()=>{}) )(event)
    } catch (err) {
        throw(
            console.error(
                `Function expected\
                \n%cExamples:\
                \n  on_key.${event.key} = %cfunction () {[code]}\
                \n  on_key.${String.fromCharCode(event.key.charCodeAt() + 1)} = () => {[code]}`, 
                'color:black;'
            )
        )
    }
}
onkeyup = (event) => {
    try {
        ( onekey[event.key] ?? (()=>{}) )(event)
    } catch (err) {
        throw(
            console.error(
                `Function expected\
                \n%cExamples:\
                \n  on_key.${event.key} = %cfunction () {[code]}\
                \n  on_key.${String.fromCharCode(event.key.charCodeAt() + 1)} = () => {[code]}`, 
                'color:black;'
            )
        )
    }
}

setInterval(

    () => {
        ctx.clearRect(0, 0, window.screen.width, window.screen.height)
        for (let i = 0; i < frame.length; i++) {
            frame[i]?.update() ?? frame.splice(i, 1)
        }
    },

    30//framerate in miliseconds
);


//export {vector, sprite, frame, platform_list, onkey, onekey}