/* This is a PHP code that connects to a database using the `connection.php` file, retrieves the last
region and bags values from the `BILL` table, calculates the total cost based on the last bags
value, and displays a payment form with the last region value pre-filled. The form uses the Razorpay
payment gateway to process payments. The PHP code also handles form submission, but the actions to
be performed after form submission are not specified in the code. */
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
    <title>Payment Form</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">

</head>
<body>
    <div class="parent-container">
        <form action="signup.php" method="POST" class="left-side">
            <div class="title">
                Please complete your payment
            </div>
            <div class="row">
                <label for="firstName">Full Name</label>

                <input type="text" name="firstName" class="col-12" placeholder="Type here">
            </div>
            <div class="row">
                <label for="Email">Email address</label>
                <input type="text" name="email" class="col-12" placeholder=" email ">

            </div>
            <div class="row">
                <label for="password">Mobile number</label>
                <input type="password" name="password" class="col-12" placeholder="+91 9950.....">
            </div>
            <div class="row">
                <label for="confirmPassword">Address</label>
                <input type="text"  class="col-12" name="region" value="<?php echo $lastRegion; ?>" readonly>
                <!-- <input type="password" name="confirmPassword" class="col-12" placeholder="Type here"> -->
            </div>
            <div class="row">
                <button class="cta-btn" id="rzp-button1" name="register">Make Payment</button>
            </div>
        </form>
        <div class="right-side">
            <img src="./images/payment.png" alt="image">
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