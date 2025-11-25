$(document).ready(function () {

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    flatpickr("#FromDate", { dateFormat: "d/m/Y", defaultDate: firstDay });
    flatpickr("#ToDate", { dateFormat: "d/m/Y", defaultDate: today });

    $(document).on("click", "#viewBtn", viewBtn);
    $(document).on("click", "#sendBtn", sendBtn);
    $("#totalpolicy").hide();
});
function viewBtn() {

    const data = [
        $("#FromDate").val(),
        $("#ToDate").val()        
    ];

    $.ajax({
        type: "POST",
        url: "/show_policy_count",
        data: { data: data },
        traditional: true,

        beforeSend: function () {
            $("#cover").show();
        },
        success: function (res) {               
            $("#cover").hide();
            if (res.success) {
                $("#totalCount").text(res.count);
                $("#div_send").show();
                $("#totalpolicy").show();
            } else {
                alert(res.message);
                $("#totalpolicy").hide();
                $("#div_send").hide();
            }
        },
        error: function (xhr, status, error) {
            $("#cover").hide();
            $("#div_send").hide();
            alert("Request failed: " + error);
        }
    });
}
function sendBtn() {

    const data = [
        $("#FromDate").val(),
        $("#ToDate").val()        
    ];

    $.ajax({
        type: "POST",
        url: "/mass_sms_ids",
        data: { data: data },
        traditional: true,

        beforeSend: function () {
            $("#cover").show();
        },
        success: function (response) {          
             $("#cover").hide();        
            
            if (response.success==true) {
                alert(response.message); // show success alert                
            } else {
                alert(response.message || "Failed to send SMS"); // show failure alert
            }
        },
        error: function (xhr, status, error) {
            $("#cover").hide();
            $("#div_send").hide();
            alert("Request failed: " + error);
        }
    });
}