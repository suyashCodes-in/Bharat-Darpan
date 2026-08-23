// Mock Database of Attractions
const data = {
    delhi: [
        { name: "Red Fort", img: "https://images.indianexpress.com/2018/06/red-fort-759-getty-images.jpg" },
        { name: "India Gate", img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80" },
        { name: "Qutub Minar", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxznnhKkmoCFg4h_naOFQ-DUgI9Im0_UZkR2IptK8tZgxAsUndltxJvvNP&s=10" },
        { name: "Connaught Place", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJJNXWr3H-YVegzxsDnoPXJOmU05wfbw9OLJF7c4rMjw&s" },
        { name: "Humayun Tomb", img: "https://images.squarespace-cdn.com/content/v1/6298cb774cf3830bc9b342bf/1686821873057-GC66MGFKTZ9BC0FP0P23/humayans-tomb-1.jpg?format=750w" },
        { name: "Lotus Temple", img: "https://upload.wikimedia.org/wikipedia/commons/f/fc/LotusDelhi.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original" },

    ],
    agra: [
        { name: "Taj Mahal", img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80" },
        { name: "Agra Fort", img: "https://cdn.britannica.com/37/178637-050-22E50FA5/Jahangirs-Palace-Agra-Fort-India-Uttar-Pradesh.jpg" },
        { name: "Tomb of Akbar", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8t1n0MtnaSuEbUxOs27KMqEZw_whW2b3oMwtd4KPJTZ7lwW7uSDIZDPMb&s=10" },
        { name: "Jama Masjid", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9UbUiGVkxEObpj3vTWQ0P5RTkAWH4rx8RFIfjA9pKciZvPfnofjW_ovU&s=10" },
        { name: "Jahangir Palace", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa1t_dSODRSQFGS-qPcUpmtx0SCSPRrJaZA98y_INudFoEIFx0XQjDZg4&s=10" },
        { name: "Itmad-ud-Daula", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf7a_mcapsWUIn47V23F2H8ZXeeFYgWhAM6bmFGi6_PWiEnaYCFDTFIUc&s=10" },
    ],
    jaipur: [
        { name: "Hawa Mahal", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80" },
        { name: "Jaigarh Fort", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2VGA_35BVjSIJ6hRrTl64Fukz78EQEQFiADDTVrF3ZNzZaoWzK2llj4w&s=10" },
        { name: "Amer Fort", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNAz3xos8La_KotaYDliJfK91k94I_vzLGg-VUIMx6A&s=10" },
        { name: "Nahargarh Fort", img: "https://hblimg.mmtcdn.com/content/hubble/img/jaipur/mmt/activities/m_activities_nahargarh_fort_l_370_556.jpg" },
        { name: "Jantar Mantar", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHtOWHYWkuwJwe-LKIYa07f8CR7V6tWu_hBmmCSWIqzw&s" },
        { name: "Amber Palace", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHyt5zsSA6siua3LoHkEhlxF2cYM9RLgF8HzidEf-QbUa3Hb5u_k_SXVx3&s=10" }
    ],kashmir: [
        { name: "Dal Lake", img: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Dal_LakeVR.jpg?utm_source=simple.wikipedia.org&utm_campaign=index&utm_content=original" },
        { name: "Gulmarg", img: "https://7seasfly.com/wp-content/uploads/2024/07/Gulmarg-Baramulla-Jammu-and-Kashmir.jpg" }
    ],ladakh: [
        { name: "Pangong Lake", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbptdHYagqgX9Y8dAZMNrO2DX-_1ncsYOTwFd5_HnIQAEu3j1Q-s_yjb1e&s=10" },
        { name: "Nubra Valley", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxJSH6N7_gqZB5Ws7by_0yFRf169sjTYhm32UA5V3zXg&s=10" }
    ],
    shimla: [
        { name: "Kufri", img: "https://www.tourmyindia.com/socialimg/best-time-visit-kufri.jpg" },
        { name: "Green Valley", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB87YW7CLeinPRpS-goSE0sYl1zXkh2quOzFdsonTNiX9H7CS46c9BiKs&s=10" }
    ],
    dehradun: [
        { name: "Robber's Cave", img: "https://indiaeasytrip.com/blog/wp-content/uploads/2023/06/cav1.jpg" },
        { name: "Rajaji National Park", img: "https://www.teriin.org/sites/default/files/2021-05/rajaji-national-park-og.jpg" }
    ],
    manali: [
        { name: "Rohtang Pass", img: "https://chalotravellers.com/wp-content/uploads/2026/05/Rohtang.jpg" },
        { name: "Jogini Waterfalls", img: "https://www.trailhikers.in/wp-content/uploads/2022/11/Jogini-Waterfall-trek-003.jpg" }
    ],
    varanasi: [
        { name: "Kashi Vishwanath Mandir", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRncy2pSgaJWpqus0GzIXu8mfBWrITRpB2uQ2dJRPlzXXQug7AXsmmpn2k&s=10" },
        { name: "Assi Ghat", img: "https://kashiyatra.in/wp-content/uploads/2024/03/Assi-ghat-scaled.jpg" }
    ],
    chennai: [
        { name: "Marina Beach", img: "https://s7ap1.scene7.com/is/image/incredibleindia/marina-beach-chennai-tamil-nadu-attr-about?qlt=82&ts=1742170361098" },
        { name: "Kapaleeshwarar Temple", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTHq2_9qWBcFAZ8zY_m9ULoVcMXGbiQAmiK3KQ78Cd1w&s=10" }
    ],
    banglore: [
        { name: "Banglore Palace", img: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Bangalore_Mysore_Maharaja_Palace.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original" },
        { name: "Bannerghatta National Park", img: "https://bangaloretourism.in/images/v2/headers/bannerghatta-national-park-tourism-header.jpg" }
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
