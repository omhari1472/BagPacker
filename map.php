/* This is a PHP script that connects to a database using the `connection.php` file, retrieves the last
region and number of bags from the `BILL` table, calculates the total cost based on the number of
bags, and displays the information on a web page. It also includes a Razorpay payment gateway
integration for users to make payments. The script handles form submission and performs further
actions or database operations as needed. */
<?php

include("connection.php");


// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Query to retrieve the last region value
$query =  "SELECT `region`, `bags` FROM `BILL` ORDER BY id DESC LIMIT 1";

$result = mysqli_query($conn, $query);
$row = mysqli_fetch_array($result);
$lastRegion = $row['region'];
$lastBags = $row['bags'];
$totalCost = $lastBags * 30;


// Handle form submission
if(isset($_POST['submit'])) {
    // Process the form data
    $inputRegion = $_POST['region'];

    // Perform further actions or database operations
    // ...

    // Redirect or display a success message
    // ...
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Home</title>
</head>
<body>
    <div class="parent-container">
        <div class="payment-container">
            <div class="title">Your booking</div>
            <div class="row">
                <form action="payscript.php" method="post"></form>
                <div class="sub-title col-12">Name: </div>
                <div class="col-12">displayname</div>
            </div>
            <div class="row">
                <div class="sub-title col-12">Region: </div>
                <div class="col-12"><input type="text" name="region" value="<?php echo $lastRegion; ?>" readonly></div>
            </div>
            <div class="row">
                <div class="sub-title col-12">Number of bags: </div>
                <div class="col-12"><input type="text" name="bags" value="<?php echo isset($lastBags) ? $lastBags : ''; ?>" readonly>
</div>
            </div>
            <div class="row">
                <div class="sub-title col-12">Total cost: </div>
                <div class="col-12">
                <input type="text" name="cost" value="<?php echo isset($totalCost) ? $totalCost : ''; ?>" readonly>   
                </div>
            </div>
            <div class="row">
            <a href=""></a> <button class="cta-btn" id="rzp-button1" name="login">Pay now</button>
            <a href="./dashboard.php"> <button class="cta-btn col-12" >Go Back to Dashboard</button></a>
            </div>
        </div>
        <div class="map">
        <!-- <iframe src="https://locatestore.com/FoLfYm" style="border:none;width:100%;height:600px" allow="geolocation"></iframe> -->
        <iframe src="https://locatestore.com/FoLfYm" style="border:none;width:100%;height:100vh" allow="geolocation"></iframe>
        </div>
        </div>
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js" integrity="sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+" crossorigin="anonymous"></script>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
var options = {
    "key": "rzp_test_gT9pBk80szGKC5", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Bagpackers", //your business name
    "description": "Travell Luggage Free",
    "image": "https://example.com/",
    // "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    // "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
    "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
        "name": "Gaurav Kumar", //your customer's name
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();
    e.preventDefault();
}
</script>
</body>
</html>