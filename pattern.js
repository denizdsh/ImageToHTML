var pixelPattern = (data) => `<div style = "background-color: rgb(${data[0]}, ${data[1]}, ${data[2]});"></div>`

var headPattern = (container) =>
    `<meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>div picture</title>
    <style>
        body {
            width: ${container.clientWidth}px;
            height: ${container.clientHeight}px;
            display: grid;
            grid-template-columns: repeat(auto-fit, 1px);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }

        div {
            min-width: 1px;
            max-width: 1px;
            min-height: 1px;
            max-height: 1px;
        }
    </style>`

var outputPattern = (container) =>
    `<!DOCTYPE html>
        <html lang="en">

        <head>
            ${headPattern(container)}
        </head>

        <body>
            ${container.innerHTML}
        </body>
    </html>`