// const app = angular.module('crudApp', []);

// app.controller('CrudController', function ($scope) {
//   $scope.tables = []; // List of tables from the database
//   $scope.selectedTable = null; // Selected table
//   $scope.tableData = []; // Data of the selected table
//   $scope.formData = {}; // Data for form inputs
//   $scope.isEditing = false; // Flag to toggle between edit and add modes
//   $scope.newTableName = ''; // New table name

//   // Fetch available tables
//   $scope.getTables = function () {
//     axios.get('http://localhost:3000/api/tables') // Adjust backend API URL
//       .then(response => {
//         $scope.tables = response.data;
//         $scope.$apply();
//       })
//       .catch(err => console.error(err));
//   };

//   // Fetch table data
//   $scope.fetchTableData = function () {
//     if ($scope.selectedTable) {
//       axios.get(`http://localhost:3000/api/tables/${$scope.selectedTable}`)
//         .then(response => {
//           $scope.tableData = response.data;
//           $scope.formData = {}; // Clear form
//           $scope.isEditing = false;
//           $scope.$apply();
//         })
//         .catch(err => console.error(err));
//     }
//   };

//   // Create a new table
//   $scope.createTable = function () {
//     axios.post('http://localhost:3000/api/tables', { tableName: $scope.newTableName })
//       .then(() => {
//         $scope.newTableName = ''; // Clear input
//         $scope.getTables(); // Refresh table list
//       })
//       .catch(err => console.error(err));
//   };

//   // Add a new row
//   $scope.addRow = function () {
//     axios.post(`http://localhost:3000/api/tables/${$scope.selectedTable}/rows`, $scope.formData)
//       .then(() => $scope.fetchTableData())
//       .catch(err => console.error(err));
//   };

//   // Edit a row
//   $scope.editRow = function (row) {
//     $scope.formData = angular.copy(row);
//     $scope.isEditing = true;
//   };

//   // Update a row
//   $scope.updateRow = function () {
//     axios.put(`http://localhost:3000/api/tables/${$scope.selectedTable}/rows/${$scope.formData.id}`, $scope.formData)
//       .then(() => $scope.fetchTableData())
//       .catch(err => console.error(err));
//   };

//   // Delete a row
//   $scope.deleteRow = function (id) {
//     axios.delete(`http://localhost:3000/api/tables/${$scope.selectedTable}/rows/${id}`)
//       .then(() => $scope.fetchTableData())
//       .catch(err => console.error(err));
//   };

//   // Initialize by fetching tables
//   $scope.getTables();
// });

const app = angular.module('crudApp', []);

app.controller('CrudController', function ($scope) {
  $scope.tables = []; // List of tables from the database
  $scope.selectedTable = null; // Selected table
  $scope.tableData = []; // Data of the selected table
  $scope.formData = {}; // Data for form inputs
  $scope.isEditing = false; // Flag to toggle between edit and add modes
  $scope.newTableName = ''; // New table name

  // Fetch available tables
  $scope.getTables = function () {
    axios.get('http://localhost:3000/api/tables') // Adjust backend API URL
      .then(response => {
        $scope.tables = response.data;
        $scope.$apply();
      })
      .catch(err => console.error(err));
  };

  // Fetch table data
  // $scope.fetchTableData = function () {
  //   if ($scope.selectedTable) {
  //     axios.get(`http://localhost:3000/api/tables/${$scope.selectedTable}`)
  //       .then(response => {
  //         $scope.tableData = response.data;
  //         $scope.formData = {}; // Clear form
  //         $scope.isEditing = false;
  //         $scope.$apply();
  //       })
  //       .catch(err => console.error(err));
  //   }
  // };

  $scope.fetchTableData = function () {
    if ($scope.selectedTable) {
      axios.get(`http://localhost:3000/api/tables/${$scope.selectedTable}`)
        .then(response => {
          $scope.tableData = response.data;

          // Dynamically populate formData with keys from the first row of tableData
          if ($scope.tableData.length > 0) {
            $scope.formData = {};
            Object.keys($scope.tableData[0]).forEach(key => {
              if (key !== 'id') { // Exclude 'id' if it's a primary key
                $scope.formData[key] = '';
              }
            });
          } else {
            $scope.formData = {}; // Clear formData if table is empty
          }

          $scope.isEditing = false;
          $scope.$apply();
        })
        .catch(err => console.error(err));
    }
  };

  // Create a new table
  $scope.createTable = function () {
    if (!$scope.newTableName.trim()) return; // Prevent empty table names
    axios.post('http://localhost:3000/api/tables', { tableName: $scope.newTableName })
      .then(() => {
        $scope.newTableName = ''; // Clear input
        $scope.getTables(); // Refresh table list
      })
      .catch(err => console.error(err));
  };

  // Add a new row
  $scope.addRow = function () {
    if (!$scope.selectedTable || Object.keys($scope.formData).length === 0) return; // Prevent empty rows
    axios.post(`http://localhost:3000/api/tables/${$scope.selectedTable}/rows`, $scope.formData)
      .then(() => {
        $scope.formData = {}; // Clear form after adding
        $scope.fetchTableData();
      })
      .catch(err => console.error(err));
  };

  // Edit a row
  $scope.editRow = function (row) {
    $scope.formData = angular.copy(row);
    $scope.isEditing = true;
  };

  // Update a row
  $scope.updateRow = function () {
    if (!$scope.selectedTable || !$scope.formData.id) return;
    axios.put(`http://localhost:3000/api/tables/${$scope.selectedTable}/rows/${$scope.formData.id}`, $scope.formData)
      .then(() => {
        $scope.formData = {}; // Clear form after updating
        $scope.isEditing = false;
        $scope.fetchTableData();
      })
      .catch(err => console.error(err));
  };

  // Delete a row
  $scope.deleteRow = function (id) {
    if (!id) return;
    axios.delete(`http://localhost:3000/api/tables/${$scope.selectedTable}/rows/${id}`)
      .then(() => $scope.fetchTableData())
      .catch(err => console.error(err));
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.formData = {};
    $scope.isEditing = false;
  };

  // Initialize by fetching tables
  $scope.getTables();
});
