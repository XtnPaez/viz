<?php
session_start();
session_unset();
session_destroy();
header("Location: /viz/public/index.php");
exit;
