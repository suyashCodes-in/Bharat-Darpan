// Mock Database of Attractions
const data = {
    delhi: [
        { name: "Red Fort", img: "https://images.indianexpress.com/2018/06/red-fort-759-getty-images.jpg" },
        { name: "India Gate", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80" },
        { name: "Qutub Minar", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxznnhKkmoCFg4h_naOFQ-DUgI9Im0_UZkR2IptK8tZgxAsUndltxJvvNP&s=10" }
    ],
    agra: [
        { name: "Taj Mahal", img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80" },
        { name: "Agra Fort", img: "https://cdn.britannica.com/37/178637-050-22E50FA5/Jahangirs-Palace-Agra-Fort-India-Uttar-Pradesh.jpg" }
    ],
    jaipur: [
        { name: "Hawa Mahal", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80" },
        { name: "Amber Palace", img: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWngOAvryj-s1TXkla_ImLMECylLltBl1uhQJBE6gzbFFUdYvGVtC22bcD7QKkmXNg3SbMUthk3G7sZSgVVlvb1U2rRk3BuxdcVnWtqPSv28MiorCOz__XNgziJIz8hN_T2ENoY7=s1360-w1360-h1020-rw" }
    ]
};

// Flow Navigation Functions
function hideAllSections() {
    document.querySelectorAll('.step-section').forEach(sec => sec.classList.remove('active'));
}

function resetApp() {
    hideAllSections();
    document.getElementById('step-1-city').classList.add('active');
    document.getElementById('city-select').value = "";
}

function goBack(sectionId) {
    hideAllSections();
    document.getElementById(sectionId).classList.add('active');
}

// Step 1 to Step 2: Select City
function selectCity() {
    const citySelect = document.getElementById('city-select');
    const cityKey = citySelect.value;
    
    if(!cityKey) {
        alert("Please select a city first!");
        return;
    }

    const cityName = citySelect.options[citySelect.selectedIndex].text;
    document.getElementById('city-title').innerText = `Attractions in ${cityName}`;
    
    // Populate grid
    const grid = document.getElementById('attractions-grid');
    grid.innerHTML = '';
    
    data[cityKey].forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'dest-card';
        card.onclick = () => selectAttraction(attraction.name);
        card.innerHTML = `
            <img src="${attraction.img}" alt="${attraction.name}">
            <div class="card-overlay">
                <h3>${attraction.name}</h3>
                <p>Click to explore services</p>
            </div>
        `;
        grid.appendChild(card);
    });

    hideAllSections();
    document.getElementById('step-2-attractions').classList.add('active');
}

// Step 2 to Step 3: Select Attraction
function selectAttraction(attractionName) {
    document.getElementById('attraction-title').innerText = `Explore ${attractionName}`;
    hideAllSections();
    document.getElementById('step-3-services').classList.add('active');
}

// Modals Handling
function openModal(modalId) {
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById(modalId).style.display = 'block';
}

function closeModals() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    
    // Reset the food coupon generator when closed
    document.getElementById('coupon-display').style.display = 'none';
    document.getElementById('coupon-display').innerText = '';
}

// Local Zayaka Coupon Generator
function generateCode() {
    // Generates a random 6 digit number
    const code = Math.floor(100000 + Math.random() * 900000); 
    const display = document.getElementById('coupon-display');
    display.innerText = code;
    display.style.display = 'inline-block';
}