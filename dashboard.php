/* The above code is a combination of HTML, CSS, JavaScript, and PHP. It is a web page that displays a
navigation bar, a form to search for luggage storage services in a particular city, and a card
displaying an image of a city. The user can select a city from a dropdown menu, enter the region,
number of bags, drop-off and pickup dates, and click on the search button to find luggage storage
services in that city. The form data is submitted to the same page using the POST method. If the
search button is clicked, the PHP code at the end of the file */
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
    <div id="home">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <img class="logo" src="./images/backpacker.png" alt="">
            <div class="navbar-brand-group">
              <a class="navbar-brand" href="#">BagPackers</a>
              <!-- <div class="name">Hi! <input type="text" name="firstName" value="<?php echo isset($firstName) ? $firstName : ''; ?>" readonly></div> -->
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
          
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">
                    Top cities
                </a>
                <div class="dropdown-menu" id="topCitiesDropdown">
                    <a class="dropdown-item" href="#">Delhi</a>
                    <a class="dropdown-item" href="#">Mumbai</a>
                    <a class="dropdown-item" href="#">Kolkata</a>
                    <a class="dropdown-item" href="#">Chennai</a>
                    <a class="dropdown-item" href="#">Banglore</a>
                    <a class="dropdown-item" href="#">Hyderabad</a>
                    <a class="dropdown-item" href="#">Pune</a>
                    <a class="dropdown-item" href="#">Mysore</a>
                    <a class="dropdown-item" href="#">Jaipur</a>
                  </div>
                  
                </li>
                <li class="nav-item active">
                  <a class="nav-link" href="#">Services <span class="sr-only">(current)</span></a>
                </li> 
                <li class="nav-item">
                    <a class="nav-link" href="#">About us</a>
                  </li>
                  
                <a href="./joinus.php">
                  <button class="btn my-2 my-sm-0" type="submit">Become a partner</button>
                </a> 
              </ul>
            </div>
          </nav>
          <!--main home body-->
          <div class="middle-container">
            <div class="card-wrapper-container">
              <div class="title">
                City 
              </div>
              <div class="card mb-3">
                <img src="./images/taj-mahal.jpeg" class="card-img-top" alt="...">
                <div class="card-body">
                  <form action="#" method="POST">
                    <div class="row">
                        <div class="form-group col-6">
                            <label for="location">Region</label>
                            <input type="text" required class="form-control" name="region" id="location" placeholder="Enter Region">
                          </div>
                          <div class="form-group col-6">
                            <label for="bags">Number of Bags</label>
                            <input type="number" required class="form-control" id="bags" name="bags" placeholder="Enter number of bags">
                          </div>
                    </div>
                    <div class="row">
                        <div class="form-group col-6">
                            <label for="drop-off">Drop-off</label>
                            <input type="date" required class="form-control" id="drop-off" name="dropoff" placeholder="Enter drop-off option">
                          </div>
                          <div class="form-group col-6">
                            <label for="pickup">Pickup</label>
                            <input type="date" required class="form-control" id="pickup" name="pickup" placeholder="Enter pickup option">
                          </div>
                    </div>
                    <div class="row">
                    <!-- <button class="cta-btn" name="register">Register</button> -->
                        <button  class="col-6" name="bill" class="cta-btn">Search</button>
                      <a href="./payment.php" class="col-6">  
                        Book now
                      </a> 
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Get the dropdown menu element
          const dropdown = document.getElementById('topCitiesDropdown');
      
          // Add click event listener to the dropdown menu items
          dropdown.addEventListener('click', function(event) {
            // Check if the clicked element is a dropdown item
            if (event.target.classList.contains('dropdown-item')) {
              // Get the selected city
              const selectedCity = event.target.textContent;
      
              // Get the title element and change its text
              const titleElement = document.querySelector('.title');
              titleElement.textContent = `${selectedCity}`;
      
              // Get the image element and change its source
              const imageElement = document.querySelector('.card-img-top');
              imageElement.src = `./images/cities/${selectedCity.toLowerCase()}.jpeg`;
            }
          });
        });
      </script>

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js" integrity="sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+" crossorigin="anonymous"></script>

</body>
</html>

<?php
include("connection.php");

if(isset($_POST['bill'])) {
    $region = $_POST['region'];
    $bags = $_POST['bags'];
    $dropoff = $_POST['dropoff'];
    $pickup = $_POST['pickup'];

    // Insert data into the database if there are no errors

    if(empty($errors)) {
        $query = "INSERT INTO BILL (region, bags, dropoff, pickup) VALUES ('$region', '$bags', '$dropoff', '$pickup')";
        $result = mysqli_query($conn, $query);

        if ($result) {
          // echo "Welcome to The Cure And Care.";
          // session_start();
          // $_SESSION['region'] = $region; // Assuming $region contains the region from the form
          // header('location: map.php');
          echo '<script>window.location.href = "map.php";</script>';
          exit;
        } else {
            echo "An error occurred while registering.";
        }
    }
}
?>
