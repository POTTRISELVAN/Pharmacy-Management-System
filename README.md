# Pharmacy-Management-System
"A web application for pharmacy operations using HTML, CSS, JS, Tomcat, and MySQL" .
# 🏥 Pharmacy Management System (Java Enterprise Application)

A robust, secure, and comprehensive web application designed to streamline pharmacy operations, automate billing, manage inventory stock, and track daily sales reports. This system is built using Java Enterprise technologies and follows the MVC (Model-View-Controller) architecture.

---

## 🚀 Key Modules & Features

This project consists of **5 core modules** managing the complete workflow of a pharmacy:

1. **📊 Dashboard**
   * High-level real-time analytics displaying daily sales, total medicines in stock, low-stock alerts, and recent transaction logs.

2. **💊 Medicine List Management**
   * CRUD operations to add, update, and view medicines with batch numbers, manufacturing/expiry dates, and supplier information.

3. **📦 Stock & Inventory Control**
   * Track real-time inventory levels, manage supplier data, and trigger automated warnings when stock drops below the safety threshold.

4. **🧾 Automated Billing System**
   * Invoice generation engine that calculates totals, discounts, taxes, and automatically updates the central database inventory upon purchase.

5. **📈 Analytics & Reports**
   * Generates periodic (daily, weekly, monthly) sales and financial performance reports to track business growth.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** HTML5, CSS3, JavaScript (User Interface & Client-side validation)
* **Backend (Logical Controller):** Java (Servlets, Filters, Core Java Classes)
* **Build & Dependency Management:** Maven (`pom.xml` configured for dependencies)
* **Configuration:** XML (Deployment Descriptor `web.xml` & Maven configurations)
* **Server-Side Environment:** Apache Tomcat 9
* **Database Management:** MySQL (Relational Database with JDBC connections)

---

## 📂 Project Structure

The project follows a standard Maven web application structure:
* `src/main/java` - Contains core Java classes, controllers, models, and DAO classes for MySQL connectivity.
* `src/main/webapp` - Contains HTML, CSS, JavaScript files, and the `WEB-INF/web.xml` deployment configuration.
* `pom.xml` - Manages all external project JAR dependencies (MySQL Driver, Servlet API, etc.).

---

## 💻 How to Setup and Run the Project

Follow these steps to configure and run this Java Maven project locally:

### Prerequisites:
* Java Development Kit (JDK 8 or higher) installed.
* Apache Maven installed.
* Apache Tomcat 9 server.
* MySQL Server running.

### Configuration Steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/POTTRISELVAN/Pharmacy-Management-System.git](https://github.com/POTTRISELVAN/Pharmacy-Management-System.git)
