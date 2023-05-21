/* This is a PHP file that contains HTML and PHP code. It is a login page that allows users to enter
their email and password to log in. It also includes a Google login option using the Google API. The
PHP code at the bottom of the file checks if the login form is submitted, sanitizes the user input
to prevent SQL injection, and executes a prepared statement to check if the user's email and
password match a record in the database. If the login is successful, the user is redirected to the
dashboard page. If the login fails, nothing happens. */
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
        integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Document</title>
</head>

<body>
    <div class="parent-container-login">
        <div class="left-side">
            <img src="./images/login.png" alt="image">
        </div>
        <form action="#" method="POST" class="right-side">
            <div class="title">
                Login account
            </div>
            <div class="row">
                <label for="Email">Email address</label>
                <input type="email" name="username" class="col-12" placeholder="example@gmail.com">
            </div>
            <div class="row">
                <label for="password">Password</label>
                <input type="password" name="password" class="col-12" placeholder="Type here">
            </div>
            <div class="row">
                <?php
                include("connection.php");
                require_once 'vendor/autoload.php';

                // init configuration
                $clientID = '1072400597556-buvhb6ehmbqjucuept93ufignkp51rtt.apps.googleusercontent.com';
                $clientSecret = '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';
                $redirectUri = 'http://localhost/bag/dashboard.php';

                // create Client Request to access Google API
                $client = new Google_Client();
                $client->setClientId($clientID);
                $client->setClientSecret($clientSecret);
                $client->setRedirectUri($redirectUri);
                $client->addScope("email");
                $client->addScope("profile");

                // authenticate code from Google OAuth Flow
                if (isset($_GET['code'])) {
                    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
                    $client->setAccessToken($token['access_token']);

                    // get profile info
                    $google_oauth = new Google_Service_Oauth2($client);
                    $google_account_info = $google_oauth->userinfo->get();
                    $email = $google_account_info->email;
                    $name = $google_account_info->name;

                    // now you can use this profile info to create account in your website and make user logged in.
                }else {
                    echo "<a href='" . $client->createAuthUrl() . "'>
                        <div class='cta-btn' style='padding:0 8.2rem'  >
                            <img src='./images/google.png' width='34px' alt='Google Logo'>
                            Google Login
                        </div>
                    </a>";
                }
                
                ?>
            </div>
            <div class="row">
                <button class="cta-btn" name="login">Log in</button>
                Not a registered member? <a href="./signup.php">Click here to register</a>
            </div>
        </form>

    </div>
</body>

</html>


<?php
include("connection.php");

// Check if login form is submitted
if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Sanitize the user input to prevent SQL injection
    $username = mysqli_real_escape_string($conn, $username);
    $password = mysqli_real_escape_string($conn, $password);

    // Construct the SQL query using prepared statements
    $query = "SELECT * FROM `FORM` WHERE `email` = ? AND `password` = ?";
    $statement = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($statement, 'ss', $username, $password);

    // Execute the prepared statement
    mysqli_stmt_execute($statement);

    // Fetch the result
    $result = mysqli_stmt_get_result($statement);

    // Check the number of rows returned
    $total = mysqli_num_rows($result);

    if ($total == 1) {
        // echo "Login Success";
        header('Location: dashboard.php');
        exit;
    } else {
        // echo "Log in Failed";
    }

    // Close the prepared statement
    mysqli_stmt_close($statement);
}

// Close the database connection
mysqli_close($conn);
?>