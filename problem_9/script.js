
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}


function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


async function fetchData(page = 1, query = '', filters = []) {
    
    const filterParams = filters.map(filter => `filter=${filter}`).join('&');
    const response = await fetch(`https://json-server.example.com/data?page=${page}&q=${query}&${filterParams}`);
    const data = await response.json();
    return data;
}


function renderData(items) {
    const content = document.getElementById('content');
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = item.name; 
        content.appendChild(div);
    });
}


function dynamicLoad() {
    const content = document.getElementById('content');
    if (content.scrollTop + content.clientHeight >= content.scrollHeight) {
        currentPage++;
        fetchData(currentPage, currentQuery, currentFilters).then(renderData);
    }
}


let currentPage = 1;
let currentQuery = '';
let currentFilters = [];


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', debounce(function() {
    currentQuery = searchInput.value;
    currentPage = 1;
    document.getElementById('content').innerHTML = '';
    fetchData(currentPage, currentQuery, currentFilters).then(renderData);
}, 500));


const filters = document.querySelectorAll('.filter');
filters.forEach(filter => {
    filter.addEventListener('change', function() {
        currentFilters = Array.from(filters)
            .filter(filter => filter.checked)
            .map(filter => filter.value);
        currentPage = 1;
        document.getElementById('content').innerHTML = '';
        fetchData(currentPage, currentQuery, currentFilters).then(renderData);
    });
});


const content = document.getElementById('content');
content.addEventListener('scroll', throttle(dynamicLoad, 300));


fetchData(currentPage, currentQuery, currentFilters).then(renderData);
