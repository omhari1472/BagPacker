/* The above code is a HTML file that creates a webpage for a luggage storage service called
"BagPackers". It includes a navigation bar, a carousel slider, and a contact form for potential
partners to join the service. It also includes Bootstrap CSS and JavaScript libraries for styling
and functionality. */
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Host</title>
</head>
<body>
    <div id="home">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <img class="logo" src="./images/backpacker.png" alt="">
            <div class="navbar-brand-group">
              <a class="navbar-brand" href="#">BagPackers</a>
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
                  
                <button class="btn my-2 my-sm-0" type="submit">Become a partner</button>
              </ul>
            </div>
        </nav>
          <!--main host body-->
        <div id="carouselExampleCaptions" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#carouselExampleCaptions" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
            <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
            <div class="carousel-item active">
            <img src="./images/carousel-2.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
                <h5>Become a host</h5>
                <p>Some representative placeholder content for the first slide.</p>
            </div>
            </div>
            <div class="carousel-item">
            <img src="./images/carousel-3.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
                <h5>Meet new people</h5>
                <p>Some representative placeholder content for the second slide.</p>
            </div>
            </div>
            <div class="carousel-item">
            <img src="./images/carousel.jpg" class="d-block w-100" alt="...">
            <div class="carousel-caption d-none d-md-block">
                <h5>Travel without luggage</h5>
                <p>Some representative placeholder content for the third slide.</p>
            </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-target="#carouselExampleCaptions" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-target="#carouselExampleCaptions" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </button>
        </div>

        <div class="bottom-container row">
            <div class="col-6">
                <div class="content">
                    Got extra space to spare for luggage storage? Join our Bagpackers partner program and start earning some extra moolah! Imagine, 
                    you can turn that empty corner into a money-making hotspot. But hey, being a partner comes with its perks. You get the authority 
                    to casually ask tourists to do the 'luggage reveal' during drop-off. 
                </div>
                <div class="content">
                    It's like being a detective, but with suitcases! And guess 
                    what? Our super-duper online money transfer system will automatically sprinkle those earnings into your bank account on a monthly 
                    or weekly basis. Cha-ching! So, why wait? Join us and let's turn your extra space into a fun and profitable adventure!
                </div>
            </div>
            <div class="form-inputs col-6">
                <h2>Contact Form</h2>
            <form id="myForm" method="post" action="https://script.google.com/macros/s/AKfycbw20Dv9zs3DVOqfgLp7FB_p06ViMrj256szt3PkrOdF7B30iLj7Lwp61JIxkekv20MP/exec    ">
                <div class="row">
                    <div class="form-group col-6">
                        <label for="fullName">FULL NAME</label>
                        <input type="text" class="form-control" id="full_name" name="full_name" required>
                    </div>
                    <div class="form-group col-6">
                        <label for="region">REGION</label>
                        <input type="text" class="form-control" id="region" name="region" required>
                    </div>
                </div>
                    <div class="form-group">
                    <label for="mobileNumber">MOBILE NUMBER</label>
                    <input type="text" class="form-control" id="mobile_number" name="mobile_number" required>
                </div>
                <div class="form-group">
                    <label for="address">ADDRESS</label>
                    <input type="text" class="form-control" id="address" name="address" required>
                    
                    <!-- <textarea class="form-control" id="address" name="address" required></textarea> -->
                </div>
                <button type="submit" id="submit" class="cta-btn">Send your request</button>
            </form>
        </div>
    </div>
        

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js" integrity="sha384-+sLIOodYLS7CIrQpBjl+C7nPvqq+FbNUBDunl/OZv93DB7Ln/533i8e/mZXLi/P+" crossorigin="anonymous"></script>

</body>
</html>