# DEA Enterprise Platform 🚀

> A simple freelance job platform where clients post jobs and freelancers apply.

## What Does It Do? 

✅ Clients can post jobs  
✅ Freelancers can apply for jobs  
✅ Upload and submit work files  
✅ Track everything with dashboards

## Built With

**Backend:** Spring Boot + Java + MySQL  
**Frontend:** React + Tailwind CSS

## What You Need First

Make sure you have these installed:

1. **Java** (version 17 or newer) - [Download here](https://www.oracle.com/java/technologies/downloads/)
2. **Node.js** (version 18 or newer) - [Download here](https://nodejs.org/)
3. **Git** - [Download here](https://git-scm.com/)

## 🚀 How to Run (Step by Step)

### Step 1: Download the Project

```bash
git clone https://github.com/Maduranga14/DEA-project.git
cd DEA-project
```

### Step 2: Setup Database

Make sure MySQL is running and check if the database has been created:

```sql
CREATE DATABASE Freelance_db;
```

**That's it!** Tables will be created automatically when you run the app.

### Step 3: Start Backend

**Option A: Using IntelliJ IDEA** (Recommended)

1. Open IntelliJ IDEA
2. Click **File** → **Open**
3. Navigate to and select the `Backend` folder
4. Wait for IntelliJ to load the project
5. Find `BackendApplication.java` in the project explorer
6. Right-click on it and select **Run 'BackendApplication'**
7. Wait until you see: `Started BackendApplication` ✅

**Option B: Using Terminal/Command Line**

Open a terminal in the `Backend` folder:

```bash
./mvnw spring-boot:run
```

**Windows users:** Use `mvnw.cmd spring-boot:run` instead.

Wait until you see: `Started BackendApplication` ✅

### Step 4: Start Frontend

Open **another terminal** in the `Frontend` folder:

```bash
npm install
npm run dev
```

Wait until you see: `Local: http://localhost:3000` ✅

## 🎉 Open Your Browser

Go to: **http://localhost:3000**

You should see the login page! 🎊

## 📱 Using the Platform

### Create Your Account

1. Click **"Register"**
2. Choose your role:
   - **Client** - if you want to post jobs
   - **Freelancer** - if you want to apply for jobs
3. Fill in your details and sign up!

### For Clients

1. **Post a Job** - Click "Post Job" and fill in details
2. **View Applications** - See who applied
3. **Accept/Reject** - Choose the best freelancer
4. **Review Work** - Check submitted files

### For Freelancers

1. **Browse Jobs** - See all available jobs
2. **Apply** - Click "Apply" on jobs you like
3. **Track Status** - See if you're accepted
4. **Submit Work** - Upload your completed work

## 🔗 Important Links

- **Website:** http://localhost:5173
- **API Documentation:** http://localhost:8080/api/swagger-ui.html
- **Backend API:** http://localhost:8080/api

## 📁 Folder Structure

```
DEA-project/
├── Backend/          # Java Spring Boot code
│   └── src/
│       └── main/
│           ├── java/             # Java code here
│           └── resources/
│               └── application.properties  # ⚙️ Database config
│
└── Frontend/         # React code
    ├── src/
    │   ├── components/  # UI components
    │   └── services/    # API calls
    └── package.json     # Dependencies
```

## ❓ Common Problems

### "Can't connect to database"
- ✅ Make sure MySQL is running
- ✅ Check your password in `application.properties`
- ✅ Make sure database `Freelance_db` exists

### "Port already in use"
- ✅ Another app is using port 8080 or 5173
- ✅ Close other apps or change ports in config files

### "Frontend can't connect to backend"
- ✅ Make sure backend is running (check terminal)
- ✅ Backend should show "Started BackendApplication"

### "npm install fails"
- ✅ Delete `node_modules` folder
- ✅ Run `npm install` again

## 🆘 Still Need Help?

Check the terminal output - it usually tells you what's wrong!

## 🎓 For Developers

### API Documentation
Once running, visit: http://localhost:8080/api/swagger-ui.html  
You can test all API endpoints here!

### Production Build

**Backend:**
```bash
cd Backend
./mvnw clean package
```

**Frontend:**
```bash
cd Frontend
npm run build
```

## 📄 License

MIT License

### 🖥️ Little Preview For Frontend
# DEA Enterprise Platform 🚀

> A simple freelance job platform where clients post jobs and freelancers apply.

## What Does It Do? 

✅ Clients can post jobs  
✅ Freelancers can apply for jobs  
✅ Upload and submit work files  
✅ Track everything with dashboards

## Built With

**Backend:** Spring Boot + Java + MySQL  
**Frontend:** React + Tailwind CSS

## What You Need First

Make sure you have these installed:

1. **Java** (version 17 or newer) - [Download here](https://www.oracle.com/java/technologies/downloads/)
2. **Node.js** (version 18 or newer) - [Download here](https://nodejs.org/)
3. **Git** - [Download here](https://git-scm.com/)

## 🚀 How to Run (Step by Step)

### Step 1: Download the Project

```bash
git clone https://github.com/Maduranga14/DEA-project.git
cd DEA-project
```

### Step 2: Setup Database

Make sure MySQL is running and check if the database has been created:

```sql
CREATE DATABASE Freelance_db;
```

**That's it!** Tables will be created automatically when you run the app.

### Step 3: Start Backend

**Option A: Using IntelliJ IDEA** (Recommended)

1. Open IntelliJ IDEA
2. Click **File** → **Open**
3. Navigate to and select the `Backend` folder
4. Wait for IntelliJ to load the project
5. Find `BackendApplication.java` in the project explorer
6. Right-click on it and select **Run 'BackendApplication'**
7. Wait until you see: `Started BackendApplication` ✅

**Option B: Using Terminal/Command Line**

Open a terminal in the `Backend` folder:

```bash
./mvnw spring-boot:run
```

**Windows users:** Use `mvnw.cmd spring-boot:run` instead.

Wait until you see: `Started BackendApplication` ✅

### Step 4: Start Frontend

Open **another terminal** in the `Frontend` folder:

```bash
npm install
npm run dev
```

Wait until you see: `Local: http://localhost:3000` ✅

## 🎉 Open Your Browser

Go to: **http://localhost:3000**

You should see the login page! 🎊

## 📱 Using the Platform

### Create Your Account

1. Click **"Register"**
2. Choose your role:
   - **Client** - if you want to post jobs
   - **Freelancer** - if you want to apply for jobs
3. Fill in your details and sign up!

### For Clients

1. **Post a Job** - Click "Post Job" and fill in details
2. **View Applications** - See who applied
3. **Accept/Reject** - Choose the best freelancer
4. **Review Work** - Check submitted files

### For Freelancers

1. **Browse Jobs** - See all available jobs
2. **Apply** - Click "Apply" on jobs you like
3. **Track Status** - See if you're accepted
4. **Submit Work** - Upload your completed work

## 🔗 Important Links

- **Website:** http://localhost:5173
- **API Documentation:** http://localhost:8080/api/swagger-ui.html
- **Backend API:** http://localhost:8080/api

## 📁 Folder Structure

```
DEA-project/
├── Backend/          # Java Spring Boot code
│   └── src/
│       └── main/
│           ├── java/             # Java code here
│           └── resources/
│               └── application.properties  # ⚙️ Database config
│
└── Frontend/         # React code
    ├── src/
    │   ├── components/  # UI components
    │   └── services/    # API calls
    └── package.json     # Dependencies
```

## ❓ Common Problems

### "Can't connect to database"
- ✅ Make sure MySQL is running
- ✅ Check your password in `application.properties`
- ✅ Make sure database `Freelance_db` exists

### "Port already in use"
- ✅ Another app is using port 8080 or 5173
- ✅ Close other apps or change ports in config files

### "Frontend can't connect to backend"
- ✅ Make sure backend is running (check terminal)
- ✅ Backend should show "Started BackendApplication"

### "npm install fails"
- ✅ Delete `node_modules` folder
- ✅ Run `npm install` again

## 🆘 Still Need Help?

Check the terminal output - it usually tells you what's wrong!

## 🎓 For Developers

### API Documentation
Once running, visit: http://localhost:8080/api/swagger-ui.html  
You can test all API endpoints here!

### Production Build

**Backend:**
```bash
cd Backend
./mvnw clean package
```

**Frontend:**
```bash
cd Frontend
npm run build
```

## 📄 License

MIT License

### 🖥️ Little Preview For Frontend

https://raw.githubusercontent.com/Maduranga14/DEA-project/c55769f68046ea060c1d8127265d3cb9730ecb65/SS/Web-Preview.png
