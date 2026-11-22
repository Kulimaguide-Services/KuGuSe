<?php
include 'db.php';
$result = $conn->query("SELECT * FROM transporters ORDER BY id");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="GO Compony - Mr. Kamboyi Rapheal">
    <meta name="description" content="KulimaGuide connects farmers with buyers, suppliers and transporters.">
    <meta name="keywords" content="farming, agriculture, transporters, Zambia, KulimaGuide">
    <title>Find Transporter | KulimaGuide Services </title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body class="layout">
  <!-- HEADER: Logo and Navigation -->
     <header>
       <img class="logo" src ="images\logo.png" alt="Kulimaguide Services Logo" width="200" height="200">
       <!-- ========= NAV: Main Site Navigation ========= -->
       <!-- This part will stay the same for all pages-->
       <nav class="nav_links">
         <ul>
           <li><a href="index.html">Home</a></li>
           <li><a href="supplier.html">Find Supplier</a></li>
           <li><a href="buyer.html">Find Buyer</a></li>
           <li><a href="transporter.html">Find Transporter</a></li>
           <li><a href="tips.html">Farming Tips</a></li>
           <li><a href="contact.html">Contact</a></li>
         </ul>
       </nav>
     </header>

    
        <main class="transporter-main">

  <!-- SECTION 2 - TITLE + FILTERS -->
  <section class="transporter-header">
    <h1 class="transporter-title">FIND RELIABLE TRANSPORTERS FOR YOUR HARVEST</h1>
    <p class="filters-label">FILTERS</p>

    <form class="transporter-filter-bar">
      <div class="filter-field">
        <label class="filter-label">From Location</label>
        <input type="text" class="filter-input from-input" placeholder="e.g. Kasama">
      </div>

      <div class="filter-field">
        <label class="filter-label">To Location</label>
        <input type="text" class="filter-input to-input" placeholder="e.g. Ndola">
      </div>

      <div class="filter-field">
        <label class="filter-label">Vehicle Type</label>
        <select class="filter-select vehicle-select">
          <option value="all">All</option>
          <option value="truck">Truck</option>
          <option value="pickup">Pickup</option>
          <option value="oxcart">Oxcart</option>
          <option value="tractor-trailer">Tractor Trailer</option>
        </select>
      </div>

      <div class="filter-field">
        <label class="filter-label">Capacity [tons]</label>
        <input type="number" class="filter-input capacity-input" placeholder="e.g. 10">
      </div>

      <div class="filter-field">
        <label class="filter-label">Date Needed</label>
        <input type="date" class="filter-input date-input">
      </div>

      <div class="filter-field">
        <label class="filter-label">Price per km range</label>
        <input type="text" class="filter-input price-input" placeholder="e.g. 1-10 ZMW">
      </div>

      <button type="submit" class="search-btn">Search</button>
    </form>
  </section>

  <!-- LISTINGS + ASIDE -->
  <section class="transporter-layout">

    <!-- TRANSPORTER LISTINGS -->
    <div class="listings-wrap">
      <h2 class="listings-title">TRANSPORTER LISTINGS</h2>

      <div class="transporter-grid">

      <?php if ($result && $result->num_rows > 0) { ?>
  <?php while($row = $result->fetch_assoc()) { ?>
    <article class="transporter-card" data-from="<?php echo htmlspecialchars($row['route_from']); ?>" data-to="<?php echo htmlspecialchars($row['route_to']); ?>" data-vehicle="<?php echo strtolower(htmlspecialchars($row['vehicle_type'])); ?>" data-capacity="<?php echo $row['capacity']; ?>" data-price="<?php echo $row['price_per_km']; ?>" data-availability="<?php echo strtolower(htmlspecialchars($row['availability'])); ?>">
      <h3 class="transporter-name">Transporter Name: <?php echo htmlspecialchars($row['name']); ?></h3>
      <p class="transporter-detail"><span>Location:</span> <?php echo htmlspecialchars($row['location']); ?></p>
      <p class="transporter-detail"><span>Vehicle Type:</span> <?php echo htmlspecialchars($row['vehicle_type']); ?></p>
      <p class="transporter-detail"><span>Capacity:</span> <?php echo $row['capacity']; ?> Tons</p>
      <p class="transporter-detail"><span>Route:</span> <?php echo htmlspecialchars($row['route_from']); ?> → <?php echo htmlspecialchars($row['route_to']); ?></p>
      <p class="transporter-detail"><span>Price per km:</span> <?php echo $row['price_per_km']; ?> ZMW</p>
      <p class="transporter-detail"><span>Availability:</span> <?php echo htmlspecialchars($row['availability']); ?></p>
      <p class="transporter-detail"><span>Phone/WhatsApp:</span> <?php echo htmlspecialchars($row['phone']); ?></p>
      <?php if($row['verified']) { ?><span class="verified-badge">✓ Verified</span><?php } ?>
    </article>
  <?php } ?>
<?php } else { ?>
  <p>No transporters found.</p>
<?php } ?>
       
      
      </div>
    </div>

    <!-- ASIDE -->
    <aside class="transporter-sidebar">
      <div class="sidebar-box important-notes">
        <h3 class="sidebar-title">IMPORTANT NOTES</h3>
        <p class="sidebar-text">We only connect, we do not sell, buy or transport any goods!</p>
      </div>

      <div class="sidebar-box quick-tools">
        <h3 class="sidebar-title">QUICK TOOLS</h3>
        <ul class="tools-list">
          <li class="tool-item">Weather-Based Planting Guide</li>
          <li class="tool-item">Soil Type Matcher</li>
        </ul>
      </div>

      <div class="sidebar-box how-it-works">
        <h3 class="sidebar-title">HOW IT WORKS</h3>
        <ul class="how-list">
          <li class="how-item"><strong>Search</strong><br>Find transporters using filters</li>
          <li class="how-item"><strong>Contact</strong><br>Reach via Phone/WhatsApp</li>
          <li class="how-item"><strong>Negotiate</strong><br>Agree on price & schedule</li>
        </ul>
      </div>
    </aside>

  </section>

</main>
     
  <!-- FOOTER: Matches wireframe -->
      <footer class="foot">
        <article class="Contact">
          <a href="mailto:kabwegift084@gmail.com">Email: Kulimaguide01@gmail.com</a>
          <a href="https://www.facebook.com/Kulimaguideservices">Facebook: Kulimaguideservices</a>
          <a href="https://wa.me/260766254304">Whatsapp: +260 766 254 304</a>
        </article>

       <article class="location">
        <a href="https://www.google.com/maps/search/?api=1&query=Plot+12+Mungwi+Road+Town+Kasama+Northern+Province+Zambia">
        Kulimaguide Services<br>
        Plot 12 Mungwi Road, Town Center<br>
        Kasama, Northern Province, Zambia
       </a>
      </article>

      <article class="Partner">
         <a href="https://uagzambia.com">United Afrrica Grain Ltd(UAG)</a>
         <a href="https://Farmdepot.co.zm">Farm Depot</a>
         <a href="https://championagrow.co.zm">Champion Agro World</a>
         <a href="https://farmesoutgrower.com">Farmers' Out Grower Foundation(FOF)</a>
      </article>

    <hr><hr><hr>
     <p class="Disclaimer"><strong>Disclaimer:</strong> We do not process payments or hold goods. We only connect you.</p>
    <p class="rights">&copy; 2026 Kulimaguide Services. All Rights reserved.</p>
   </footer>

   </body>
</html>

