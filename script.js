document.addEventListener('DOMContentLoaded', function () {
    const addRowBtn = document.getElementById('addRow');
    const submitBtn = document.getElementById('submitBtn');
    const traverseTable = document.getElementById('traverseTable').getElementsByTagName('tbody')[0];
    const resultsTable = document.getElementById('resultsTable');
    let rowCount = 1;

    addRowBtn.addEventListener('click', function () {
        rowCount++;
        const newRow = traverseTable.insertRow();
        newRow.innerHTML = `
            <td>${String.fromCharCode(65 + rowCount - 1)}${String.fromCharCode(65 + rowCount)}</td>
            <td><input type="number" step="0.01" class="length" required></td>
            <td><input type="number" step="0.01" class="azimuth" required></td>
            <td><input type="number" step="0.01" class="latitude" readonly></td>
            <td><input type="number" step="0.01" class="departure" readonly></td>
        `;
    });

    submitBtn.addEventListener('click', function () {
        const rows = traverseTable.getElementsByTagName('tr');
        let totalLatitude = 0;
        let totalDeparture = 0;
        let totalDistance = 0;
        let totalErrorLat = 0;
        let totalErrorDep = 0;
        const knownEasting = parseFloat(document.getElementById('knownEasting').value);
        const knownNorthing = parseFloat(document.getElementById('knownNorthing').value);

        resultsTable.innerHTML = ''; 

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const lengthInput = cells[1].getElementsByTagName('input')[0];
            const azimuthInput = cells[2].getElementsByTagName('input')[0];
            const latitudeInput = cells[3].getElementsByTagName('input')[0];
            const departureInput = cells[4].getElementsByTagName('input')[0];

            const length = parseFloat(lengthInput.value);
            const azimuth = parseFloat(azimuthInput.value) * Math.PI / 180;

            if (!isNaN(length) && !isNaN(azimuth)) {
                const latitude = length * Math.cos(azimuth);
                const departure = length * Math.sin(azimuth);

                latitudeInput.value = latitude.toFixed(2);
                departureInput.value = departure.toFixed(2);

                totalLatitude += latitude;
                totalDeparture += departure;
                totalDistance += length;
            }
        }
        totalErrorLat = totalLatitude - (rowCount * 0); 
        totalErrorDep = totalDeparture - (rowCount * 0); 

        document.getElementById('totalLatitude').textContent = totalLatitude.toFixed(2);
        document.getElementById('totalDeparture').textContent = totalDeparture.toFixed(2);
        document.getElementById('closingErrorLat').textContent = totalErrorLat.toFixed(2);
        document.getElementById('closingErrorDep').textContent = totalErrorDep.toFixed(2);

        
        let correctionLat = totalErrorLat / rowCount;
        let correctionDep = totalErrorDep / rowCount;

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const latitudeInput = cells[3].getElementsByTagName('input')[0];
            const departureInput = cells[4].getElementsByTagName('input')[0];

            const latitude = parseFloat(latitudeInput.value);
            const departure = parseFloat(departureInput.value);

            latitudeInput.value = (latitude - correctionLat).toFixed(2);
            departureInput.value = (departure - correctionDep).toFixed(2)
            const resultRow = resultsTable.insertRow();
            resultRow.innerHTML = `
                <td>${String.fromCharCode(65 + i)}${String.fromCharCode(65 + i + 1)}</td>
                <td>${(latitude - correctionLat).toFixed(2)}</td>
                <td>${(departure - correctionDep).toFixed(2)}</td>
            `;
        }

        const finalEasting = knownEasting + totalDeparture;
        const finalNorthing = knownNorthing + totalLatitude;

        document.getElementById('easting').textContent = finalEasting.toFixed(2);
        document.getElementById('northing').textContent = finalNorthing.toFixed(2);
    });
});

           



       


