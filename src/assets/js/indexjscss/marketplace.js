
function showContent(section) { 
    let cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        card.style.display = '';
    });
    document.querySelectorAll('.tileContent > div').forEach(function(div) {
        div.classList.add('hidden');  
    });
    document.getElementById(section).classList.remove('hidden');
    document.querySelectorAll('.tileContent > br').forEach(function(div) {
        div.classList.remove('hidden');  
    });

    let buttons = document.querySelectorAll('.category-button');
    buttons.forEach(function(button) {
        let buttonContent = button.textContent.trim();				
        if(buttonContent == section){
            button.classList.add('active')
        }else{
            button.classList.remove('active')
        }
    });
    searchCards();
}
function showAllCategories() { 
    let cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        card.style.display = '';
    });
    document.querySelectorAll('.tileContent > div').forEach(function(div) {
        div.classList.remove('hidden');  
    });
    document.querySelectorAll('.tileContent > br').forEach(function(div) {
        div.classList.add('hidden');  
    });

    let buttons = document.querySelectorAll('.category-button');
    buttons.forEach(function(button) {
        let buttonContent = button.textContent.trim();
        if(buttonContent.includes('All Categories')){
            button.classList.add('active')
        }else{
            button.classList.remove('active')
        }
    });
    searchCards();
}

function searchCards() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let allContainersHidden = true;
    let categorySections = document.querySelectorAll('.category-section');

    categorySections.forEach(function(container) {
        let rows = container.querySelectorAll('.row');
        let containerHidden =true
        
        let columns = document.querySelectorAll('.columnClass');
    columns.forEach(function(col) {
        col.style.display = '';
    });

        rows.forEach(function(row) {
            let cards = row.querySelectorAll('.card');
        cards.forEach(function(card) {
            card.style.display = '';
        });

        columns.forEach(function(col) {
        let title = col.querySelector('.card-title').textContent.toLowerCase();
        let description = col.querySelector('.company-text').textContent.toLowerCase();
        
        if (title.includes(input) ||description.includes(input) ) {
            col.style.display = '';
        } else {
            col.style.display = 'none';
        }
    });
            cards.forEach(function(card) {
                let title = card.querySelector('.card-title').textContent.toLowerCase();
                let description = card.querySelector('.company-text').textContent.toLowerCase();
                if (title.includes(input) ||description.includes(input)) {
                    card.style.display = '';
                    containerHidden = false
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Hide the container and its category if all rows are hidden
        if (containerHidden) {
            container.style.display = 'none';
        } else {
            container.style.display = '';
            allContainersHidden = false;
        }
    });

    // Show "No Data Found" if all containers are hidden
    if (allContainersHidden) {
        let noDataGlobal = document.querySelector('.no-data-global');
        if (!noDataGlobal) {
            noDataGlobal = document.createElement('div');
            noDataGlobal.classList.add('no-data-global');
            noDataGlobal.classList.add('no-data');
            noDataGlobal.textContent = 'No Data Found';
            document.querySelector('.tileContent').appendChild(noDataGlobal);
        }
        noDataGlobal.style.display = 'block';
    } else {
        let noDataGlobal = document.querySelector('.no-data-global');
        if (noDataGlobal) {
            noDataGlobal.style.display = 'none';
        }
    }
}