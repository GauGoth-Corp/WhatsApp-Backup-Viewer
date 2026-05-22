<?php

  $path ="";
  $private = false;
  //Récupère dans une array le nom de chaque dossier dans le dossier "/W-Backup-Viewer/conversations"
  if (isset($_GET["private"])) {
    if ($_GET["private"] == true) {
      $path = "conversations\\private\\";
      $private = true;

    }
    else $path = "conversations\\";
  }
  else $path = "conversations\\";

  //Checks if the path exists, if not creates it
  if (!file_exists($path)) {
    mkdir($path, 0777, true);
  }

  $conversations = array_diff(scandir($path), array('..', '.'));
?>


<!-- Copyright © 2021-2026 GauGoth Corp. All rights reserved -->

<!DOCTYPE html>
<html lang="fr">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title>Whatsapp Backup Viewer | GauGoth Corp.</title> <!-- Titre de la page-->

<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💬</text></svg>">

<meta name="viewport" content="width=device-width, initial-scale=1">

<!--<meta name="robots" content="noindex">-->

<link rel="stylesheet" type="text/css" href="style.css" />


</head>

<body>
  <!-- Header -->
  <div id="header"></div>

  <!-- End header -->

<div class="container"> 
  <div class="content">

    <h1 id="title">Welcome to Whatsapp Backup Viewer!</h1>
    <p class="subtitle">Easily view and read your WhatsApp chat backups. <i> - By GauGoth Corp.</i></p>
    <hr/>
    
    <div class="conversations-List">
      <h2>Your Conversations</h2>

      <?php 
      $i = 1;
      foreach($conversations as $conv): 
            if (is_dir($path . $conv) && $conv != "private"): ?>
            <a id="chat-item-<?php echo $i; $i++;?>" class="chat-item" href="chat-view.html?chat=<?php echo $conv; if ($private): ?>&private=true<?php endif; ?>">
              <img class="chat-avatar" src="datas/user-icon.png" alt="Avatar">
              <div class="chat-info">
                <span class="chat-name"><?php echo $conv?></span>
                <span class="chat-date">15/01/2026</span>
              </div>
            </a>
      <?php endif; 
    endforeach; 
    
    if ($i == 1): ?>
      <a id="chat-item-0" class="chat-item" href="#">
        <img class="chat-avatar" src="datas/warning-icon.svg" alt="Warning">
        <div class="chat-info">
          <span class="chat-name">No conversations found. Please add your WhatsApp backup folders to the "conversations" directory.</span>
        </div>
      </a>    
      
    <?php endif;

    ?>      
     
      <!-- autres .chat-item -->
    </div><!-- end .conversations-List -->


    <!-- About Box -->
    <div class="box" id="about"><span id="reduce-about" class="box-reduce">–</span>
      <div id="about-title"><h2>About Whatsapp Backup Viewer</h2></div>
      <p><span id="about-intro">
        Whatsapp Backup Viewer is a free-of-use conv developped by GauGoth Corp. Through an easy handling interface, read your WhatsApp chat and media backups, private conversations or groups, witho</span><span id="about-content-to-hide1">ut needing to restore them on your mobile device.</span><span id="about-points" class="box-points">Read more...</span>
      </p>
      <div id="about-content-to-hide2"><p>This project is placed under 'All Rights Reserved' license from GauGoth Corp. That means that all contents, scripts, pages, etc. are the exclusive property of GauGoth Corp., are copyrighted and subject to our <a href="http://gaugoth.corp.free.fr/privacy-policy/" target="_blank">Privacy Policy</a>: thus you cannot redistribute or modify <i>Whatsapp Backup Viewer</i> without permission.</p>
        <p>However, remember that your chats and all their contents stay your own property! We do not store any data from your backups, and all processing is done locally on your device. For more details, please read our <a href="http://gaugoth.corp.free.fr/terms-of-service/" target="_blank">Terms of Service</a>.
        <a href="http://gaugoth.corp.free.fr/credits/" target="_blank">Learn more</a></p>
      <p>For more information, visit our <a href="http://gaugoth.corp.free.fr/W-Backup-Viewer/" target="_blank">official website</a>. If you have any questions or feedback, feel free to <a href="http://gaugoth.corp.free.fr/credits/contact/" target="_blank">contact us</a>. We are always happy to answer!</p></div>
    </div>
    <script>
      function collapse() {
        var aboutBox = document.getElementById('about');
        var content1 = document.getElementById('about-content-to-hide1');
        var content2 = document.getElementById('about-content-to-hide2');
        var points = document.getElementById('about-points');
        var button = document.getElementById('reduce-about');
        var toShadow = document.getElementById('about-intro');
        if (aboutBox.classList.contains('collapsed')) {
          aboutBox.classList.remove('collapsed');
          toShadow.classList.remove('shadow');
          content1.style.display = 'contents';
          content2.style.display = 'contents';
          points.style.display = 'none';
          button.textContent = '–';
        } else {
          aboutBox.classList.add('collapsed');
          toShadow.classList.add('shadow');
          content1.style.display = 'none';
          content2.style.display = 'none';
          points.style.display = 'inline';
          button.textContent = '+';
        }
      }

      document.getElementById('reduce-about').addEventListener('click', function() {
        collapse();
      });
      document.getElementById('about-points').addEventListener('click', function() {
        collapse();
      });
    </script>
    <!-- End About Box -->

  </div><!-- end .content -->
  <!-- end .container --></div>
   
  <!-- Footer -->
  <div id="footer">
    <p>&copy; 2021-2026 GauGoth Corp. All rights reserved. | <a href="http://gaugoth.corp.free.fr/" target="_blank">GauGoth Corp. Official Website</a></p>
  <!-- End footer --></div>

  </div>
  


</body>
</html>
