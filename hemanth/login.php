<?php
// login.php – Handles login authentication
session_start();
require 'db.php';

$type = $_POST['type'] ?? '';
if ($type === 'student') {
    $idOrEmail = trim($_POST['student_id_or_email'] ?? '');
    $pass = $_POST['password'] ?? '';
    $stmt = $pdo->prepare('SELECT * FROM students WHERE student_id = ? OR email = ?');
    $stmt->execute([$idOrEmail, $idOrEmail]);
    $user = $stmt->fetch();
    if ($user && password_verify($pass, $user['password'])) {
        $_SESSION['student_id'] = $user['id'];
        header('Location: profile.php?type=student');
        exit;
    } else {
        exit('Invalid credentials.');
    }
} elseif ($type === 'college') {
    $idOrEmail = trim($_POST['college_id_or_email'] ?? '');
    $pass = $_POST['password'] ?? '';
    $stmt = $pdo->prepare('SELECT * FROM colleges WHERE college_id = ? OR email = ?');
    $stmt->execute([$idOrEmail, $idOrEmail]);
    $user = $stmt->fetch();
    if ($user && password_verify($pass, $user['password'])) {
        $_SESSION['college_id'] = $user['id'];
        header('Location: profile.php?type=college');
        exit;
    } else {
        exit('Invalid credentials.');
    }
} else {
    exit('Invalid login type.');
}
?>
