/* This is a PHP code that establishes a connection to a MySQL database using the mysqli_connect()
function. It sets the servername, username, password, and database name as variables and passes them
as parameters to the function. It also checks if the connection was successful and displays an error
message if it failed. The line `error_reporting(0);` is used to turn off error reporting in PHP. */
<?php
error_reporting(0);
    $servername="localhost";
    $username="root";
    $password="";
    $dbname="admin";
    
    $conn = mysqli_connect($servername,$username,$password,$dbname);
    
    if($conn)
    {
        // echo "Connection success";
    }
    else
    {
        
        echo "Connection failed".mysqli_connect_error();
    }
    
    ?>
