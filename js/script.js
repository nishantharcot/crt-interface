const reset = () => {
    paper.project._activeLayer.removeChildren();
};
var previousActions = []
const undo = () => {
    previousActions.push(paper.project._activeLayer.lastChild)
    paper.project._activeLayer.lastChild.remove()
}
const redo = () => {
    if (previousActions.length != 0) {
        var a = previousActions.pop()
        paper.project._activeLayer.addChild(a)
    }
}
const submit = () => {
   let ifsubmit = confirm("Would you like to submit your CRT puzzle?")
    if(ifsubmit)
    html2canvas(document.getElementById("draw")).then((canvas) => {
        console.log("RENDERED", canvas);
        theCanvas = canvas;

        canvas.toBlob(function (blob) {
            saveAs(blob, "CRTdrawn.png");
            alert("Please download the file");
        });
    });
}

var paintColor = "black";
var strokeSize = 3;

const changeColor = (color) => {
    paintColor = color;
}

const increaseSize = () => {
    strokeSize++;
    updateStrokeSize();
}

const decreaseSize = () => {
    if (strokeSize < 2) {
        return;
    }
    strokeSize--;
    updateStrokeSize();
}

const updateStrokeSize = () => {
    $("#strokeSize").html(strokeSize);
}


// when the document is ready
$(document).ready(function () {
    updateStrokeSize();
    var mc = new Hammer(document.getElementById('draw'));
    paper.setup(document.getElementById('draw'));
    // handle touch input
    mc.on("hammer.input", function (ev) {
        // console.log(ev);
        if (ev.isFirst) {
            // start
            //  if (ev.srcEvent.shiftKey) {
            if (paintColor == "white") {
                // color matches background (essentially erase)
                startDraw(ev, "black", strokeSize * 4, "destination-out");
            } else {
                // draw
                startDraw(ev);
            }
        } else if (ev.isFinal) {
            // last
            endDraw(ev);
        } else {
            // middle
            middleDraw(ev);
        }
    });
    // handle startDraw
    const startDraw = (ev, strokeColor = paintColor, strokeWidth = strokeSize, blendMode = "normal") => {
        console.log("Start Draw!!", ev.center.x, ev.center.y);
        var path = new paper.Path({
            strokeColor: strokeColor,
            strokeWidth: strokeWidth,
            strokeCap: "round",
            blendMode: blendMode
        });
    }
    // handle middleDraw
    const middleDraw = (ev) => {
        console.log("Middle Draw!!", ev.center.x, ev.center.y);
        paper.project._activeLayer.lastChild.add({ x: ev.center.x, y: ev.center.y })
    }
    // handle endDraw
    const endDraw = (ev) => {
        console.log("End Draw!!", ev.center.x, ev.center.y);
        paper.project._activeLayer.lastChild.simplify(20)
    }
});

