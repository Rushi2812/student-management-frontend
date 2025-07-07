window.onload = function () {
  const API_BASE = "http://localhost:8080/students";
  const form = document.getElementById("studentForm");
  const tableBody = document.querySelector("#studentTable tbody");
  const submitBtn = form.querySelector("button");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("studentId").value;
    const student = {
      id: id || null,
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      course: document.getElementById("course").value,
    };

    const url = id ? `${API_BASE}/update` : `${API_BASE}/create`;
    const method = id ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    })
      .then(() => {
        alert(id ? "Student updated!" : "Student added!");
        form.reset();
        document.getElementById("studentId").value = "";
        submitBtn.textContent = "Add Student";
        loadStudents();
      });
  });

  function loadStudents() {
    document.getElementById("searchId").value = "";
    document.getElementById("searchName").value = "";

    fetch(`${API_BASE}/fetchAll`)
      .then((res) => res.json())
      .then((data) => {
        tableBody.innerHTML = "";
        data.forEach((student) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
              <button class="edit" onclick='editStudent(${JSON.stringify(student)})'>Edit</button>
              <button class="delete" onclick='deleteStudent(${student.id})'>Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      });
  }

  window.editStudent = function (student) {
    document.getElementById("studentId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("age").value = student.age;
    document.getElementById("course").value = student.course;
    submitBtn.textContent = "Update Student";
  };

  window.deleteStudent = function (id) {
    if (confirm("Are you sure you want to delete this student?")) {
      fetch(`${API_BASE}/delete?id=${id}`, {
        method: "DELETE",
      }).then(() => {
        alert("Student deleted!");
        loadStudents();
      });
    }
  };

  window.searchStudent = function () {
    const id = document.getElementById("searchId").value;
    if (!id) {
      alert("Enter a student ID");
      return;
    }

    fetch(`${API_BASE}/fetch?id=${id}`)
      .then((res) => res.json())
      .then((student) => {
        tableBody.innerHTML = `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
              <button class="edit" onclick='editStudent(${JSON.stringify(student)})'>Edit</button>
              <button class="delete" onclick='deleteStudent(${student.id})'>Delete</button>
            </td>
          </tr>
        `;
      })
      .catch(() => alert("Student not found"));
  };

  window.searchStudentByName = function () {
    const name = document.getElementById("searchName").value.trim();

    if (!name) {
      alert("Please enter a student name");
      return;
    }

    fetch(`${API_BASE}/fetchByName?name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((students) => {
        if (students.length === 0) {
          alert("❌ No students found.");
          return;
        }

        tableBody.innerHTML = "";
        students.forEach((student) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
              <button class="edit" onclick='editStudent(${JSON.stringify(student)})'>Edit</button>
              <button class="delete" onclick='deleteStudent(${student.id})'>Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(() => alert("❌ Error while searching by name!"));
  };

  window.loadStudents = loadStudents;

  // Initial load
  loadStudents();
};
