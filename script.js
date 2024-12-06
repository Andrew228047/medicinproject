let patients = JSON.parse(localStorage.getItem("patients")) || [];
let editingPatientId = null;

function savePatients() {
  localStorage.setItem("patients", JSON.stringify(patients));
}

function renderPatients() {
  const tableBody = document.querySelector("#patients-table tbody");
  tableBody.innerHTML = "";

  patients.forEach(patient => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="patient.html?id=${patient.id}">${patient.name}</a></td>
      <td>${patient.age}</td>
      <td>${patient.contact}</td>
      <td>${new Date(patient.lastVisit).toLocaleDateString("uk-UA")}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editPatient(${patient.id})">✏️ Редагувати</button>
        <button class="btn btn-danger btn-sm" onclick="deletePatient(${patient.id})">🗑️ Видалити</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function addOrUpdatePatient(event) {
  event.preventDefault();

  const patient = {
    id: editingPatientId || Date.now(),
    name: document.getElementById("patient-name").value,
    age: Number(document.getElementById("patient-age").value),
    contact: document.getElementById("patient-contact").value,
    lastVisit: document.getElementById("patient-visit").value,
    disease: document.getElementById("patient-disease").value || "Інформація відсутня"
  };

  if (editingPatientId) {
    patients = patients.map(p => (p.id === editingPatientId ? patient : p));
  } else {
    patients.push(patient);
  }

  savePatients();
  renderPatients();

  document.getElementById("patient-form").reset();
  editingPatientId = null;

  const modal = bootstrap.Modal.getInstance(document.getElementById("patient-modal"));
  modal.hide();
}

function editPatient(id) {
  const patient = patients.find(p => p.id === id);
  if (!patient) return;

  editingPatientId = id;

  document.getElementById("patient-name").value = patient.name;
  document.getElementById("patient-age").value = patient.age;
  document.getElementById("patient-contact").value = patient.contact;
  document.getElementById("patient-visit").value = patient.lastVisit;
  document.getElementById("patient-disease").value = patient.disease;

  const modal = new bootstrap.Modal(document.getElementById("patient-modal"));
  modal.show();
}

function deletePatient(id) {
  patients = patients.filter(p => p.id !== id);
  savePatients();
  renderPatients();
}

document.getElementById("add-patient-btn").addEventListener("click", () => {
  editingPatientId = null;
  document.getElementById("patient-form").reset();
  const modal = new bootstrap.Modal(document.getElementById("patient-modal"));
  modal.show();
});

document.getElementById("patient-form").addEventListener("submit", addOrUpdatePatient);

renderPatients();
