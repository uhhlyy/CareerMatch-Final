# CareerMatch


CareerMatch is a simple job matching platform where **job seekers swipe jobs** and **employers manage applications** in one place.


---


## What is CareerMatch?


CareerMatch works like a swipe-style job app:
- Job seekers swipe jobs they like and apply
- Employers post jobs and review applicants
- Admins manage users and view system stats


---


## Main Features


### Job Seekers
- Swipe to apply or skip jobs
- Build and edit a resume
- Track application status
- Manage profile information


### Employers
- Post and manage job listings
- Review applicants
- Accept or reject applications
- View basic job statistics


### Admin
- Manage users
- View platform statistics

## Tech Used

**Frontend**
- React
- Tailwind CSS
- Vite


**Backend**
- PHP
- MySQL

## System Requirements
- Password: `12345`


⚠️ Change this before production


---


## Configuration


### Database Connection (`CMBackend/db.php`)
```php
$host = "localhost";
$dbname = "careermatch";
$username = "root";
$password = "";
```


### JWT Secret
Update in:
- `seeker_login.php`
- `employer_login.php`


```php
$secret = 'your-secret-key';
```


---


## How to Use


**Job Seeker**
- Register → Build Resume → Swipe Jobs → Track Applications


**Employer**
- Register → Post Jobs → Review Applicants


**Admin**
- Login → Manage Users → View Stats


---


## Common Problems


**Backend not connecting?**
- Make sure Apache & MySQL are running
- Check API URLs


**Database error?**
- Check database name
- Verify `db.php`


**Uploads not working?**
```bash
mkdir CMBackend/uploads
chmod 777 CMBackend/uploads
```


---


## Folder Structure
```
CareerMatch/
│── CMBackend/ # PHP backend
│── CMFrontend/ # React frontend
│── README.md
```


---


## License


MIT License


---


Created by the CareerMatch Team