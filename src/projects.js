// jsonUtils.js (Module)
async function createDivFromJsonFile() {
    const response = await fetch('./projects.json');
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();
    console.log(jsonData)

    const box = document.getElementById('project-box');
    const colors = ['red', 'blue', 'green', 'yellow', 'purple']

    for (let i = 0; i < 12; ++i) {
        // Create the new div element
        const newDiv = document.createElement('div');
        newDiv.style.width = 'calc(100%-4px)';
        newDiv.style.aspectRatio = '1 / 1';
        newDiv.style.border = '2px white solid'
        newDiv.style.position = 'relative'

        const jsonEntry = jsonData[i%jsonData.length]
        const newImage = document.createElement('img')
        newImage.className = 'projectImg'
        newImage.src = jsonEntry.img
        newImage.alt = ""
        newDiv.appendChild(newImage)

        const color = colors[i%colors.length]
        const colorBox = document.createElement('div')
        colorBox.className = `colorBox ${color}`
        colorBox.onclick = function(){window.open(jsonEntry.url)}

        const title = document.createElement('h2')
        title.textContent = jsonEntry.title
        colorBox.appendChild(title)

        newDiv.appendChild(colorBox)

        

        // Get the target div and append the new div
        box.appendChild(newDiv);
    }
}
  
createDivFromJsonFile();