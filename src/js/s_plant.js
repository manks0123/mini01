
document.getElementById("add-plant-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const plantData = {
    
      plant_name: document.getElementById("Plant_Name").value,
      plant_season: document.getElementById("Plant_season").value,
      growth_stage: document.getElementById("Growth_stage").value,
      area_id: document.getElementById("Area_ID").value
    };

    fetch("http://localhost:3001/api/plants/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(plantData)
    })
    .then(response => response.json())
    .then(data => {
      alert("Plant added successfully!");
      document.getElementById("add-plant-form").reset();
      fetchPlants(currentPage); // รีโหลดตาราง
    })
    .catch(error => {
      console.error("Error adding plant:", error);
      alert("There was an error adding the plant.");
    });
  });

  // ฟังก์ชันสำหรับการอัปเดตพืช
document.getElementById("updatePlantForm").addEventListener("submit", function (e) {
e.preventDefault();

const plantId = document.getElementById("updatePlantId").value;
const plantName = document.getElementById("updatePlantName").value;
const plantSeason = document.getElementById("updatePlantSeason").value;
const growthStage = document.getElementById("updateGrowthStage").value;
const areaId = document.getElementById("updateAreaId").value;

console.log(plantId, plantName, plantSeason, growthStage, areaId);

axios.put(`http://localhost:3001/api/plants/${plantId}`, {
  plant_name: plantName,
  plant_season: plantSeason,
  growth_stage: growthStage,
  area_id: areaId
})
  .then(response => {
    alert("✅ Plant information updated successfully!");
    document.getElementById("updatePlantForm").reset();
    fetchPlants(currentPage); // รีโหลดข้อมูลในตาราง
  })
  .catch(error => {
    console.error("❌ There was an error updating plants!", error);
    alert("❌ Unable to update plants! Please check the information again.");
  });
});

  // ฟังก์ชันสำหรับการลบพืช
  // document.getElementById("deletePlantForm").addEventListener("submit", function (e) {
  //   e.preventDefault();
  //   const plantId = document.getElementById("deletePlantId").value;

  //   deletePlant(plantId);
  // });

  // ฟังก์ชันที่ใช้สำหรับลบพืช (ทั้งจากฟอร์มและปุ่มในตาราง)
  function deletePlant(plantId) {
    if (confirm(`You want to delete the code plant. ${plantId} Or not?`)) {
      axios.delete(`http://localhost:3001/api/plants/${plantId}`)
        .then(response => {
          alert("✅ Successfully removed the plant!");
          fetchPlants(currentPage); // รีโหลดข้อมูลในตาราง
          document.getElementById("deletePlantForm").reset();
        })
        // .catch(error => {
        //   console.error("❌ มีข้อผิดพลาดในการลบพืช!", error);
        //   alert("❌ ไม่สามารถลบพืชได้!");
        // });
    }
  }

let currentPage = 1;
let currentButtonSet = 1;
const itemsPerPage = 10;
const buttonsPerSet = 10;

function fetchPlants(page = 1) {
  currentPage = page;

  fetch(`http://localhost:3001/api/plants?page=${page}&limit=${itemsPerPage}`)
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById("plantsTable");
          tableBody.innerHTML = "";

          data.plants.forEach(plant => {
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${plant.Plant_ID}</td>
                  <td>${plant.Plant_Name}</td>
                  <td>${plant.Plant_season}</td>
                  <td>${plant.Growth_stage}</td>
                  <td>${plant.Area_ID}</td>
                  <td>
                      <button class="delete-button" onclick="deletePlant(${plant.Plant_ID})">
                          <i class="fas fa-trash"></i> ลบ
                      </button>
                  </td>
              `;
              tableBody.appendChild(row);
          });

          const paginationInfo = document.getElementById("paginationInfo");
          paginationInfo.innerHTML = `Page ${data.pagination.currentPage} of ${data.pagination.totalPages}`;

          updatePaginationButtons(data.pagination.totalPages);
      })
      .catch(error => console.error("Error fetching plants:", error));
}

function updatePaginationButtons(totalPages) {
  const paginationControls = document.getElementById("paginationControls");
  paginationControls.innerHTML = "";

  const startPage = (currentButtonSet - 1) * buttonsPerSet + 1;
  const endPage = Math.min(startPage + buttonsPerSet - 1, totalPages);

  // ปุ่มไปหน้าแรก
  if (startPage > 1) {
      const firstPageButton = document.createElement("button");
      firstPageButton.textContent = "« หน้าแรก";
      firstPageButton.onclick = () => {
          currentButtonSet = 1;
          fetchPlants(1);
          updatePaginationButtons(totalPages);
      };
      paginationControls.appendChild(firstPageButton);
  }

  // ปุ่มย้อนกลับชุดก่อนหน้า
  if (startPage > 1) {
      const prevSetButton = document.createElement("button");
      prevSetButton.textContent = "‹ ก่อนหน้า";
      prevSetButton.onclick = () => {
          currentButtonSet--;
          updatePaginationButtons(totalPages);
      };
      paginationControls.appendChild(prevSetButton);
  }

  // ปุ่มหมายเลขหน้า
  for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      if (i === currentPage) button.style.fontWeight = "bold";
      button.onclick = () => fetchPlants(i);
      paginationControls.appendChild(button);
  }

  // ปุ่มไปชุดหน้าถัดไป
  if (endPage < totalPages) {
      const nextSetButton = document.createElement("button");
      nextSetButton.textContent = "ถัดไป ›";
      nextSetButton.onclick = () => {
          currentButtonSet++;
          updatePaginationButtons(totalPages);
      };
      paginationControls.appendChild(nextSetButton);
  }

  // ปุ่มไปหน้าสุดท้าย
  if (endPage < totalPages) {
      const lastPageButton = document.createElement("button");
      lastPageButton.textContent = "หน้าสุดท้าย »";
      lastPageButton.onclick = () => {
          currentButtonSet = Math.ceil(totalPages / buttonsPerSet);
          fetchPlants(totalPages);
          updatePaginationButtons(totalPages);
      };
      paginationControls.appendChild(lastPageButton);
  }
}


document.addEventListener("DOMContentLoaded", () => fetchPlants(currentPage));
// footer
fetch('footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer').innerHTML = data;
      });

      // ตัวแปรสำหรับจัดเก็บข้อมูลพืชทั้งหมด และข้อมูลที่กรองแล้ว
let allPlants = [];
let filteredPlants = [];
let isSearchActive = false;

// ปรับปรุงฟังก์ชัน fetchPlants
function fetchPlants(page = 1) {
  currentPage = page;

  fetch(`http://localhost:3001/api/plants?page=${page}&limit=${itemsPerPage}`)
      .then(response => response.json())
      .then(data => {
          // เก็บข้อมูลพืชทั้งหมดไว้ในตัวแปร global
          allPlants = data.plants;
          
          // ถ้าไม่ได้กำลังค้นหา ให้แสดงข้อมูลปกติ
          if (!isSearchActive) {
            displayPlants(data.plants, data.pagination);
          } else {
            // ถ้ากำลังค้นหา ให้แสดงเฉพาะข้อมูลที่กรองแล้ว
            displayPlants(filteredPlants, {
              currentPage: 1,
              totalPages: Math.ceil(filteredPlants.length / itemsPerPage) || 1
            });
          }
      })
      .catch(error => console.error("Error fetching plants:", error));
}

// ฟังก์ชันใหม่สำหรับแสดงข้อมูลพืช
function displayPlants(plants, pagination) {
  const tableBody = document.getElementById("plantsTable");
  tableBody.innerHTML = "";

  plants.forEach(plant => {
      const row = document.createElement("tr");
      
      // ถ้ากำลังค้นหา ให้เน้นข้อความที่ตรงกับคำค้นหา
      let plantName = plant.Plant_Name;
      if (isSearchActive) {
          const searchTerm = document.getElementById("search-term").value.trim();
          if (searchTerm && plantName.toLowerCase().includes(searchTerm.toLowerCase())) {
              const regex = new RegExp(searchTerm, 'gi');
              plantName = plantName.replace(regex, match => `<span class="search-result-highlight">${match}</span>`);
          }
      }
      
      row.innerHTML = `
          <td>${plant.Plant_ID}</td>
          <td>${plantName}</td>
          <td>${plant.Plant_season}</td>
          <td>${plant.Growth_stage}</td>
          <td>${plant.Area_ID}</td>
          <td>
              <button class="delete-button" onclick="deletePlant(${plant.Plant_ID})">
                  <i class="fas fa-trash"></i> ลบ
              </button>
          </td>
      `;
      tableBody.appendChild(row);
  });

  const paginationInfo = document.getElementById("paginationInfo");
  paginationInfo.innerHTML = `Page ${pagination.currentPage} of ${pagination.totalPages}`;

  updatePaginationButtons(pagination.totalPages);
}



// ฟังก์ชันค้นหาพืช
function searchPlants(searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    isSearchActive = false;
    fetchPlants(currentPage);
    return;
  }
  
  isSearchActive = true;
  searchTerm = searchTerm.toLowerCase();
  
  // กรองข้อมูลพืชตามคำค้นหา
  filteredPlants = allPlants.filter(plant => 
    plant.Plant_Name.toLowerCase().includes(searchTerm)
  );
  
  // แสดงผลลัพธ์การค้นหา
  displayPlants(filteredPlants, {
    currentPage: 1,
    totalPages: Math.ceil(filteredPlants.length / itemsPerPage) || 1
  });
  
  // แสดงข้อความผลการค้นหา
  const messagesDiv = document.getElementById("messages");
  if (filteredPlants.length > 0) {
    messagesDiv.innerHTML = `<div class="success">พบ ${filteredPlants.length} รายการที่ตรงกับ "${searchTerm}" | Found ${filteredPlants.length} results matching "${searchTerm}"</div>`;
  } else {
    messagesDiv.innerHTML = `<div class="error">ไม่พบรายการที่ตรงกับ "${searchTerm}" | No results found for "${searchTerm}"</div>`;
  }
}

// Event Listener สำหรับฟอร์มค้นหา
document.addEventListener("DOMContentLoaded", function() {
  // โหลดข้อมูลพืชเมื่อโหลดหน้า
  fetchPlants(currentPage);
  
  // ฟอร์มค้นหา
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const searchTerm = document.getElementById("search-term").value;
      searchPlants(searchTerm);
    });
  }
  
  // ปุ่มรีเซ็ตการค้นหา
  const resetButton = document.getElementById("reset-search");
  if (resetButton) {
    resetButton.addEventListener("click", function() {
      document.getElementById("search-term").value = "";
      isSearchActive = false;
      const messagesDiv = document.getElementById("messages");
      messagesDiv.innerHTML = "";
      fetchPlants(1);
    });
  }
});

