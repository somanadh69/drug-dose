<?php
// signup.php – Handles student/college registration
session_start();
require 'db.php';

$type = $_POST['type'] ?? '';
if ($type === 'student') {
    $id = trim($_POST['student_id'] ?? '');
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $pass = $_POST['password'] ?? '';
    if (!$id || !$name || !$email || !$pass) exit('All fields required.');
    $stmt = $pdo->prepare('SELECT id FROM students WHERE student_id = ? OR email = ?');
    $stmt->execute([$id, $email]);
    if ($stmt->fetch()) exit('Student ID or email already exists.');
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO students (student_id, name, email, password) VALUES (?, ?, ?, ?)');
    $stmt->execute([$id, $name, $email, $hash]);
    $_SESSION['student_id'] = $pdo->lastInsertId();
    header('Location: profile.php?type=student');
    exit;
} elseif ($type === 'college') {
    $id = trim($_POST['college_id'] ?? '');
    $name = trim($_POST['college_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $pass = $_POST['password'] ?? '';
    if (!$id || !$name || !$email || !$pass) exit('All fields required.');
    $stmt = $pdo->prepare('SELECT id FROM colleges WHERE college_id = ? OR email = ?');
    $stmt->execute([$id, $email]);
    if ($stmt->fetch()) exit('College ID or email already exists.');
    $hash = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO colleges (college_id, college_name, email, password) VALUES (?, ?, ?, ?)');
    $stmt->execute([$id, $name, $email, $hash]);
    $_SESSION['college_id'] = $pdo->lastInsertId();
    header('Location: profile.php?type=college');
    exit;
} else {
    exit('Invalid registration type.');
}
?>
