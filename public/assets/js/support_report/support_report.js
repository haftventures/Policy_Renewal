$(document).ready(function () {

function formatDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

  $("#FromDate").val(formatDate(firstDayOfMonth));
  $("#ToDate").val(formatDate(today));

    $(document).on('click', '#viewBtn', viewBtn);
    $(document).on('click', '#Btn_save', Btn_save);
    flatpickr("#Payment_Date", {
    dateFormat: "d/m/Y",
    allowInput: true,
  });

  $(document).on('click','#Btn_back', Btn_back)
});



var today = new Date();
var twoYearsAgo = new Date();
twoYearsAgo.setFullYear(today.getFullYear() - 2);
var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

 flatpickr("#FromDate", {
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


flatpickr("#ToDate", {
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

 function viewBtn() {
  const data = [$('#FromDate').val(), $('#ToDate').val()];

  $.ajax({
    type: "POST",
    url: "/support_report",
    traditional: true,
    data: { data: data },
    beforeSend: function () {
      $("#cover").show();
    },
    success: function (response) {
      console.log("Response:", response);
      $("#cover").hide();     
      let success = response.success;

      if (success == true) {
       
if (window.currentTabulator) {
    window.currentTabulator.destroy();
}


createThemedGrid(
    "#dynamicTable",
    response.data,
    [
        { title: "S.No.", formatter: "rownum", width: 60, hozAlign: "center" },
        { title: "Date", field: "datee", width: 100 },
         { title: "Transactionid", field: "transactionid", width: 160 },      
        { title: "Vehicle No", field: "vehicleno", width: 120 },
         { title: "Make", field: "make", width: 100 },
        { title: "Mobile", field: "mobile", width: 120 },
        { title: "Model", field: "model", width: 100 },
        { title: "engineno", field: "engineno", width: 160 },
        { title: "Chasisno", field: "chasisno" , width: 120, minWidth: 120},
          { title: "Name", field: "name", width: 100 },  
         { title: "Description", field: "description", width: 220 },
    ],
   
);


      } else {
        $("#dynamicTable").html('<p class="text-center text-red-600 py-4">No data found</p>');
      }
    },
    error: function (xhr, status, error) {
      $("#cover").hide();
      console.error("Error:", error);
    showmobilenumber("Error!", error);
    }
  });
}

