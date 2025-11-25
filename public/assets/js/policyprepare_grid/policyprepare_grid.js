$(document).ready(function () {
Gridload();
$(document).on('click', '#save_btn', Btn_save);
$(document).on('click', '#back_btn', btn_back);
});


var today = new Date();
var twoYearsAgo = new Date();
twoYearsAgo.setFullYear(today.getFullYear() - 2);
var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

flatpickr("#tlpayment_datee", {
      dateFormat: "d/m/Y",
      minDate: twoYearsAgo,
      maxDate: today,
      allowInput: false,
       disableMobile: true, 
      onReady: function(_, __, fp) {
          const yWrap = fp.calendarContainer.querySelector(".numInputWrapper");
          if (yWrap) yWrap.style.display = "none";
          const sel = document.createElement("select");
          sel.className = "fp-year";
          const curY = new Date().getFullYear();

          for (let y = curY - 2; y <= curY; y++) {
              const opt = document.createElement("option");
              opt.value = y;
              opt.textContent = y;
              sel.appendChild(opt);
          }
          sel.value = fp.currentYear;
          sel.onchange = () => fp.jumpToDate(new Date(sel.value, fp.currentMonth, 1));
          fp.calendarContainer.querySelector(".flatpickr-current-month").append(sel);
          fp.calendarContainer.addEventListener("click", () => {
              sel.value = fp.currentYear;
          });
      }
  });


flatpickr("#tlregdate", {
      dateFormat: "d/m/Y",
      minDate: twoYearsAgo,
      maxDate: today,
      allowInput: false,
       disableMobile: true, 
      onReady: function(_, __, fp) {
          const yWrap = fp.calendarContainer.querySelector(".numInputWrapper");
          if (yWrap) yWrap.style.display = "none";
          const sel = document.createElement("select");
          sel.className = "fp-year";
          const curY = new Date().getFullYear();

          for (let y = curY - 25; y <= curY; y++) {
              const opt = document.createElement("option");
              opt.value = y;
              opt.textContent = y;
              sel.appendChild(opt);
          }
          sel.value = fp.currentYear;
          sel.onchange = () => fp.jumpToDate(new Date(sel.value, fp.currentMonth, 1));
          fp.calendarContainer.querySelector(".flatpickr-current-month").append(sel);
          fp.calendarContainer.addEventListener("click", () => {
              sel.value = fp.currentYear;
          });
      }
  });



function Gridload() {
  $.ajax({
    type: "POST",
    url: "/policypreparegrid",
    traditional: true,
    beforeSend: function () {
      $("#cover").show();
    },
    success: function (response) {
      console.log("Response:", response);
      $("#cover").hide();
      $("#search_box").removeClass("hidden");

      if (response.success === true) {
        // ✅ Clear old content
        $("#dynamicTable").html("");
        $("#gridTable2").html("");

        // 🟦 Create first grid (fresh)
        const table1 = new Tabulator("#dynamicTable", {
          data: response.fresh,
          layout: "fitDataStretch",
          pagination: "local",
          paginationSize: 10,
          paginationSizeSelector: [10, 25, 50, 100],
          movableColumns: true,
          columns: [
            { title: "S.No.", formatter: "rownum", width: 70, hozAlign: "center" },
            { title: "payment_datee", field: "payment_datee" },
            { title: "customername", field: "customername" },
            { title: "mobile", field: "mobile" },
            { title: "vehicleno", field: "vehicleno" },
            { title: "make", field: "make" },
            { title: "model", field: "model" },
            { title: "idv", field: "idv" },
            { title: "transactionid", field: "transactionid" },
            {
              title: "Action",
              formatter: function (cell) {
                const userid = cell.getRow().getData().id;
                return `<u style="color:blue; cursor:pointer;" onclick="prepare_pending(${userid})"><i class="fa-solid fa-folder-open"></i></u>`;
            
              },
            },
          ],
        });

        // 🟩 Create second grid (waiting)
        const table2 = new Tabulator("#gridTable2", {
          data: response.waiting,
          layout: "fitDataStretch",
          pagination: "local",
          paginationSize: 10,
          paginationSizeSelector: [10, 25, 50, 100],
          movableColumns: true,
          columns: [
            { title: "S.No.", formatter: "rownum", width: 70, hozAlign: "center" },
            { title: "payment_datee", field: "payment_datee" },
            { title: "customername", field: "customername" },
            { title: "mobile", field: "mobile" },
            { title: "vehicleno", field: "vehicleno" },
            { title: "make", field: "make" },
            { title: "model", field: "model" },
            { title: "idv", field: "idv" },
            { title: "transactionid", field: "transactionid" },
            {
              title: "Action",
              formatter: function (cell) {
                const userid = cell.getRow().getData().id;
                return `<u style="color:blue; cursor:pointer;" onclick="update(${userid})"><i class="fa-solid fa-folder-open"></i></u>`;
               
              },
            },
          ],
        });

        // 🔍 One shared search box for both grids
        $("#search_box").off("keyup").on("keyup", function () {
          const keyword = $(this).val().toLowerCase();
          const filterFn = function (data) {
            return Object.values(data).some(val =>
              String(val).toLowerCase().includes(keyword)
            );
          };
          table1.setFilter(filterFn);
          table2.setFilter(filterFn);
        });

        // 📄 Shared page size selector
        $("#page-size").off("change").on("change", function () {
          const newSize = parseInt($(this).val(), 10);
          table1.setPageSize(newSize);
          table2.setPageSize(newSize);
        });

      } else {
        $("#dynamicTable").html('<p class="text-center text-red-600 py-4 bg-gray-200 w-full">No data found</p>');
      }
    },
    error: function (xhr, status, error) {
      $("#cover").hide();
      console.error("Error:", error);
      showmobilenumber('Error!',error); 
    },
  });
}

function update(id) {
  const data = [id];
  $("#lbluserid").text(id);
  $.ajax({
    type: "POST",
    url: "/prepareupdate",
    traditional: true,
    data: { data: data },
    beforeSend: function () {
      $("#cover").show();
    },
    success: function (response) {
      console.log("Response:", response);
      $("#cover").hide();
      const user = response.data[0]; 
        console.log("User Data:", user);
        $("#mainPage").addClass("hidden");
        $("#secoundPage").removeClass("hidden");
        $("#customerName").val(user.customername || "");
        $("#vehicleNo").val(user.vehicleno || "");
        $("#tlpayment_datee").val(user.payment_datee || "");
        $("#tlamount").val(user.amount || "");
        $("#tlMobile").val(user.mobile || "");
        $("#tlmodel").val(user.model || "");
        $("#tlmake").val(user.make || "");
        $("#tlidv").val(user.idv || "");
        $("#tltransactionid").val(user.transactionid || "");
        $("#tlchasisno").val(user.chasisno || "");
        $("#tlengineno").val(user.engineno || "");
     
        $("#empId").focus();
    },
    error: function (xhr, status, error) {
      $("#cover").hide();
      console.error("Error:", error);
      showmobilenumber('Error!',error); 
    }
  });
}


function Btn_save() {
   if (chkdata(".tl_textall") && chk_mobileno(".mob") && chk_chasis("tlchasisno") && chk_engine("tlengineno") && chk_eng_chasis1(".chkno")) {
 
   const data = [];
   
   $(".tl_textall").each(function () {
  const tag = $(this).prop("tagName").toLowerCase();
  const value = $(this).val();

  if (tag == "select") {
    data.push(value && value !== "0" ? value : "0");
  } else {
    data.push(value ? value : "");
  }
   });

   var userid = $('#lbluserid').text();
   data.push(userid);
   var insert = $('#lblinsert').text();
   var update = $('#lblupdate').text();

   data.push(insert? insert : update);
  
   $.ajax({
    type: "POST",
    url: "/preparesave",
    traditional: true,
    data: { data: data },
    beforeSend: function () {
      $("#cover").show();
    },
    success: function (response) {
      if (response.success == true) {
        showmobilenumber('Success!',response.message);
     $("#savepage").addClass("hidden");
      $("#mainPage").removeClass("hidden");

      $('#lblinsertedId').text(response.insertedId);
      }
  
    },
    error: function (xhr, status, error) {
      $("#cover").hide();
      console.error("Error:", error);
      showmobilenumber('Error!',error); 
    }
  });
}
}


function btn_back() {
  $("#secoundPage").addClass("hidden");
  $("#mainPage").removeClass("hidden"); 
}

function prepare_pending(id) {
  const data = [id, $('#lblprepare_pending').text()];    

 
  $.ajax({
    type: "POST",
    url: "/prepare_pending",
    traditional: true,
    data: { data: data },
    beforeSend: function () {
      $("#cover").show();
    },
    success: function (response) {
      if (response.success == true) {    
        update(id);
      } else if (response.success == false) {
        showmobilenumber('Error!',response.message);  
      }
  
    },
    error: function (xhr, status, error) {
      $("#cover").hide();
      console.error("Error:", error);
      showmobilenumber('Error!',error); 
    }
  });
}

