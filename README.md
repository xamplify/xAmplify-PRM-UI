# xAmplify PRM UI

xAmplify PRM UI is an Angular application built for managing partners, content, and opportunities in the xAmplify ecosystem.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites

- **Node.js**: version `10.18.0`  
  ```bash
  node -v
  ```
- **Angular CLI**: version `1.4.2`  
  Install globally:
  ```bash
  npm install -g @angular/cli@1.4.2
  ```
  Verify installation:
  ```bash
  ng --version
  ```

### 2. Clone the Repository

```bash
git clone https://github.com/xamplify/xAmplify-PRM-UI.git
cd xAmplify-PRM-UI
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The app will start on [http://localhost:4200](http://localhost:4200).  
It automatically reloads on source file changes.

---

## 🏗️ Build

### Production Build

```bash
npm run prod
```

The build artifacts will be stored in the `xtremandApp/` directory.

---

## 📝 Usage

### Local Development Signup

If you’re running locally, you can create an account here:  
[http://localhost:4200/prm-signup](http://localhost:4200/prm-signup)

### Hosted Deployment

Update the `env.js` file with your deployment values:

```javascript
/********************* Production **********************/
window.__env.CLIENT_URL = '"https://app.myapp.com/';
window.__env.SERVER_URL = 'https://api.myapp.com/';
window.__env.imagesHost = window.__env.SERVER_URL + "vod/images/";
```

Once deployed, use this link to sign up and create your **Admin PRM Account**:  
[http://app.myapp.com/prm-signup](http://app.myapp.com/prm-signup)

---

## 👤 After Signup

Once the admin PRM account is created, you can:

- Add partners  
- Manage content  
- Track opportunities  
- And more…

---

## 📌 Notes

- Ensure you’re using the specified Node.js and Angular CLI versions for compatibility.  
- For custom hosting, always configure your `env.js` properly before deployment.
