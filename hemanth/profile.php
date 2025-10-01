<?php
// profile.php – Loads and displays profile details from DB
session_start();
require 'db.php';
$type = $_GET['type'] ?? '';
if ($type === 'student' && isset($_SESSION['student_id'])) {
    $stmt = $pdo->prepare('SELECT * FROM students WHERE id = ?');
    $stmt->execute([$_SESSION['student_id']]);
    $user = $stmt->fetch();
    if (!$user) exit('Student not found.');
    $name = htmlspecialchars($user['name']);
    $email = htmlspecialchars($user['email']);
    $id = htmlspecialchars($user['student_id']);
    echo "<h2>Welcome, $name</h2><p>Student ID: $id<br>Email: $email</p><a href='logout.php'>Logout</a>";
} elseif ($type === 'college' && isset($_SESSION['college_id'])) {
    $stmt = $pdo->prepare('SELECT * FROM colleges WHERE id = ?');
    $stmt->execute([$_SESSION['college_id']]);
    $user = $stmt->fetch();
    if (!$user) exit('College not found.');
    $name = htmlspecialchars($user['college_name']);
    $email = htmlspecialchars($user['email']);
    $id = htmlspecialchars($user['college_id']);
    echo "<h2>Welcome, $name</h2><p>College ID: $id<br>Email: $email</p><a href='logout.php'>Logout</a>";
} else {
    header('Location: login.html');
    exit;
}
?>
