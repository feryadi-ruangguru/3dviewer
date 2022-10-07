let canvas;
let helmet;
const controls = {
    view: {x: 0, y: 0, zoom: 1},
    viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

function preload() {
    // Load model with normalise parameter set to true
    helmet = loadModel('https://core-ruangguru.s3.ap-southeast-1.amazonaws.com/3dobject/model.obj', true);
}

function setup() {
    canvas = createCanvas(400, 400, WEBGL);


    canvas.mouseWheel(e => Controls.zoom(controls).worldZoom(e))

    translate(controls.view.x, controls.view.y)
    describe('Vertically rotating 3-d teapot with red, green and blue gradient.');
}

function draw() {
    background(200);
    normalMaterial(); // For effect
    orbitControl();
    model(helmet);
}

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)


class Controls {
    static move(controls) {
        function mousePressed(e) {
            controls.viewPos.isDragging = true;
            controls.viewPos.prevX = e.clientX;
            controls.viewPos.prevY = e.clientY;
        }

        function mouseDragged(e) {
            const {prevX, prevY, isDragging} = controls.viewPos;
            if(!isDragging) return;

            const pos = {x: e.clientX, y: e.clientY};
            const dx = pos.x - prevX;
            const dy = pos.y - prevY;

            if(prevX || prevY) {
                controls.view.x += dx;
                controls.view.y += dy;
                controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
            }
        }

        function mouseReleased(e) {
            controls.viewPos.isDragging = false;
            controls.viewPos.prevX = null;
            controls.viewPos.prevY = null;
        }

        return {
            mousePressed,
            mouseDragged,
            mouseReleased
        }
    }

    static zoom(controls) {
        // function calcPos(x, y, zoom) {
        //   const newX = width - (width * zoom - x);
        //   const newY = height - (height * zoom - y);
        //   return {x: newX, y: newY}
        // }

        function worldZoom(e) {
            const {x, y, deltaY} = e;
            const direction = deltaY > 0 ? -1 : 1;
            const factor = 0.05;
            const zoom = 1 * direction * factor;

            const wx = (x-controls.view.x)/(width*controls.view.zoom);
            const wy = (y-controls.view.y)/(height*controls.view.zoom);

            controls.view.x -= wx*width*zoom;
            controls.view.y -= wy*height*zoom;
            controls.view.zoom += zoom;
        }

        return {worldZoom}
    }
}