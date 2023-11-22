document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([61.33015794498324, 23.760237117887772], 13);
    var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    document.getElementById('my-location').addEventListener('click', function() {
        map.locate({setView: true, maxZoom: 16});
    });

    map.on('locationfound', function(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup("Twoja lokalizacja: " + e.latlng.toString()).openPopup();
    });

    document.getElementById('download-map').addEventListener('click', function() 
	{
		leafletImage(map, function (err, canvas) 
		{
			if (err) 
			{
				console.log(err);
				return;
			}
			createPuzzle(canvas);
		});
	});
});

function createPuzzle(canvas) 
{
    const numCols = 4;
    const numRows = 4;
    const mapContainer = document.getElementById('map-container');
    const mapWidth = mapContainer.offsetWidth;
    const mapHeight = mapContainer.offsetHeight;
    const pieceWidth = mapWidth / numCols;
    const pieceHeight = mapHeight / numRows;
    let pieces = [];
	let goodIndexes = [];

    for (let x = 0; x < numCols; ++x) 
	{
        for (let y = 0; y < numRows; ++y) 
		{
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const context = pieceCanvas.getContext('2d');
            context.drawImage(canvas, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

            pieces.push(pieceCanvas);
			goodIndexes.push(y * numCols + x);
        }
    }
	
    pieces.sort(() => Math.random() - 0.5);

    const table = document.getElementById('table');
    table.innerHTML = '';
    pieces.forEach(piece => table.appendChild(piece));
	
	pieces.forEach((piece, index) => 
	{
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.setAttribute('data-piece-index', index);

        piece.addEventListener('dragstart', function(e) 
		{
            e.dataTransfer.setData('text/plain', index);
        });

        table.appendChild(piece);
    });
	
	window.goodIndexes = goodIndexes;

    setupDropContainer();
}

function setupDropContainer() 
{
    const puzzleContainer = document.getElementById('puzzle-container');
    puzzleContainer.innerHTML = ''; 

    puzzleContainer.addEventListener('dragover', function(e) 
	{
        e.preventDefault(); 
    });

    puzzleContainer.addEventListener('drop', function(e) 
	{
        e.preventDefault();
        const pieceIndex = e.dataTransfer.getData('text/plain');
        const piece = document.querySelector(`[data-piece-index='${pieceIndex}']`);

        puzzleContainer.appendChild(piece);
        isCompleted();
    });
}

function isCompleted() 
{
    const puzzleContainer = document.getElementById('puzzle-container');
    const pieces = puzzleContainer.querySelectorAll('.puzzle-piece');

    if (pieces.length !== 16) 
	{
        return false;
    }

    for (let i = 0; i < pieces.length; i++) 
	{
        if (parseInt(pieces[i].getAttribute('data-piece-index')) !== window.goodIndexes[i]) 
		{
            return false;
        }
    }

    alert('Wszystkie puzzle zostały ułożone poprawnie!');
    return true;
}