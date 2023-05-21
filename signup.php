<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>
<body>
    <div class="parent-container">
        <form action="#" method="POST" class="left-side">
            <div class="title">
                Create an account
            </div>
            <div class="row">
                <label for="firstName">First Name</label>
                <input type="text" name="firstName" class="col-12" placeholder="Type here">
            </div>
            <div class="row">
                <label for="lastName">Last Name</label>
                <input type="text" name="lastName" class="col-12" placeholder="Type here">
            </div>
            <div class="row">
                <label for="Email">Email address</label>
                <input type="email" name="email" class="col-12" placeholder="example@gmail.com">
            </div>
            <div class="row">
                <label for="password">Password</label>
                <input type="password" name="password" class="col-12" placeholder="Type here">
            </div>
            <div class="row">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" name="confirmPassword" class="col-12" placeholder="Type here">
            </div>
            <div class="row">
                <button class="cta-btn" name="register">Register</button>
            </div>
        </form>
        <div class="right-side">
            <img src="./images/backtrans.png" alt="image">
        </div>
    </div>
</body>
</html>

<?php
include("connection.php");

if(isset($_POST['register'])) {
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // Perform validation

    $errors = [];

    if(empty($firstName)) {
        $errors['firstName'] = 'First name is required.';
    }

    if(empty($lastName)) {
        $errors['lastName'] = 'Last name is required.';
    }

    if(empty($email)) {
        $errors['email'] = 'Email is required.';
    } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format.';
    }

    if(empty($password)) {
        $errors['password'] = 'Password is required.';
    } elseif(strlen($password) < 6) {
        $errors['password'] = 'Password should be at least 6 characters long.';
    }

    if($password !== $confirmPassword) {
        $errors['confirmPassword'] = 'Passwords do not match.';
    }

    // Insert data into the database if there are no errors

    if(empty($errors)) {
        $query = "INSERT INTO FORM (firstName, lastName, email, password, confirmPassword) VALUES ('$firstName', '$lastName', '$email', '$password', '$confirmPassword')";
        $result = mysqli_query($conn, $query);

        if($result) {
            // echo "Welcome to The Cure And Care.";
            session_start();
            header('location: dashboard.php');
            exit;
        } else {
            echo "An error occurred while registering.";
        }
    }
}
?>
