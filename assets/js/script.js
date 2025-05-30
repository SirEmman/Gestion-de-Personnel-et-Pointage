let employes = [];

function renderTable() {
  const table = document.getElementById("employeTable");
  table.innerHTML = "";
  employes.forEach((emp, index) => {
    table.innerHTML += `
      <tr>
        <td class="border p-2">${emp.nom}</td>
        <td class="border p-2">${emp.poste}</td>
        <td class="border p-2">${emp.email}</td>
        <td class="border p-2 space-x-2">
          <button onclick="editEmploye(${index})" class="text-blue-600 hover:underline">Modifier</button>
          <button onclick="deleteEmploye(${index})" class="text-red-600 hover:underline">Supprimer</button>
        </td>
      </tr>
    `;
  });
}

function openForm() {
  document.getElementById("formModal").classList.remove("hidden");
  document.getElementById("employeForm").reset();
  document.getElementById("index").value = "";
  document.getElementById("formTitle").innerText = "Ajouter un employé";
}

function closeForm() {
  document.getElementById("formModal").classList.add("hidden");
}

function editEmploye(index) {
  const emp = employes[index];
  document.getElementById("index").value = index;
  document.getElementById("nom").value = emp.nom;
  document.getElementById("poste").value = emp.poste;
  document.getElementById("email").value = emp.email;
  document.getElementById("formTitle").innerText = "Modifier l'employé";
  openForm();
}

function deleteEmploye(index) {
  if (confirm("Supprimer cet employé ?")) {
    employes.splice(index, 1);
    renderTable();
  }
}

document.getElementById("employeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = document.getElementById("index").value;
  const nom = document.getElementById("nom").value;
  const poste = document.getElementById("poste").value;
  const email = document.getElementById("email").value;

  if (index === "") {
    employes.push({ nom, poste, email });
  } else {
    employes[index] = { nom, poste, email };
  }

  renderTable();
  closeForm();


  
});
function openForm() {
  document.getElementById("formModal").classList.remove("hidden");
  document.getElementById("employeForm").reset();
  document.getElementById("index").value = "";
  document.getElementById("formTitle").innerText = "Ajouter un employé";
}
