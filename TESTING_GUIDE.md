## Part 1: Install Required Software

### Step 1.1: Install Docker Desktop

Docker runs the database your app needs.

**For Windows:**
1. Visit https://www.docker.com/products/docker-desktop
2. Click "Download for Windows"
3. Run the installer (`DockerDesktop-Installer.exe`)
4. Follow the prompts (use default settings)
5. **Restart your computer when finished**

**For Mac:**
1. Visit https://www.docker.com/products/docker-desktop
2. Download the version for your chip:
   - **Apple Silicon (M1/M2/M3)** → Download `arm64` version
   - **Intel Mac** → Download `x86_64` version
3. Open the `.dmg` file and drag Docker to Applications
4. Open Applications → Docker.app
5. Docker will ask for your password (this is normal)

**Verify Installation:**
- Open Terminal or Command Prompt
- Type: `docker --version`
- You should see a version number (like `Docker version 25.0.0`)

---

### Step 1.2: Install Node.js

Node.js provides the tools to run the web application.

1. Visit https://nodejs.org/
2. Click the **LTS** button (the larger one on the left)
3. Run the installer
4. Click "Next" → "Next" → "Install" (use all default settings)
5. **Restart your computer when finished**

**Verify Installation:**
- Open Terminal or Command Prompt
- Type: `node --version`
- You should see a version number (like `v20.10.0`)

---

## Part 2: Get the Code Ready

### Step 2.1: Open Command Prompt/Terminal

**Windows:**
- Press `Win + R`
- Type `cmd`
- Press Enter

**Mac/Linux:**
- Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
- Type `terminal`
- Press Enter

### Step 2.2: Navigate to the Project Folder

Copy and paste this command:

```bash
cd C:\Users\daris\Desktop\School\PMA
```

(If this is on a Mac, the path will be different—ask the developer)

---

## Part 3: Start the Database

The app stores and searches patent data in a database.

### Step 3.1: Start the Database Container

Type this command:

```bash
docker-compose -f database/docker-compose.yml up -d
```

Wait 5-10 seconds. You should see output that looks like:
```
Creating patentiq-db ... done
```

**Verify it's running:**
Type: `docker ps`

You should see a container running with a name like `patentiq-db`

---

## Part 4: Start the Web Application

### Step 4.1: Install Dependencies (First Time Only)

Navigate to the app folder:

```bash
cd patentiq
```

Install all required packages:

```bash
npm install
```

This takes 2-5 minutes. Don't close the window until you see the prompt return.

### Step 4.2: Start the Development Server

Type:

```bash
npm run dev
```

You should see output similar to:
```
> next dev
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 3.2s
```

The app is now running!

---

## Part 5: Test the Application

### Step 5.1: Open the Application

Open your web browser and go to:

```
http://localhost:3000
```

You should see the **PatentIQ login page**.

### Step 5.2: Create an Account / Login

1. Look for "Sign Up" or "Login" button
2. Click it
3. Create a test account or use existing credentials
4. You should be logged in and see the main interface

### Step 5.3: Test Patent Search

1. Look for the search bar or "New Search" button
2. Enter a simple invention idea:
   - Examples: "smart water bottle", "AI chatbot", "solar panel"
3. Click "Search" or "Analyze"
4. Wait for results (this may take 10-30 seconds)

**Expected Results:**
- You should see a list of related patents
- Each patent should show:
  - Patent number
  - Title
  - Company/Assignee
  - Publication date
  - A brief description or abstract

### Step 5.4: Explore a Patent

1. Click on any patent from the search results
2. You should see more detailed information:
   - Full patent number and dates
   - Complete abstract
   - Claims
   - Inventor names
   - Assignee (company holding the patent)

---

## Part 6: Testing Checklist

Print this out or keep it handy while testing:

- ✅ Can you open http://localhost:3000?
- ✅ Can you log in with your credentials?
- ✅ Can you search for a patent?
- ✅ Do search results appear?
- ✅ Can you click on a patent to see details?
- ✅ Are the patent details correct and readable?
- ✅ Can you navigate back to search?

If you can check all these boxes, **the app is working correctly!**

---

## Stopping the Application

### Stop the Web App
1. Go to the Terminal/Command Prompt window where `npm run dev` is running
2. Press `Ctrl + C`
3. Type `Y` and press Enter (if asked)

### Stop the Database
In a different Terminal/Command Prompt window, type:

```bash
docker-compose -f database/docker-compose.yml down
```

The database stops and any containers are shut down.

---

## Troubleshooting

### Problem: "Command not found: docker"
**Solution:** Docker is not installed or didn't install correctly.
- Reinstall Docker Desktop from https://www.docker.com/products/docker-desktop
- Restart your computer
- Verify with `docker --version`

### Problem: "Command not found: node"
**Solution:** Node.js is not installed.
- Install Node.js from https://nodejs.org/
- Restart your computer
- Verify with `node --version`

### Problem: Port 3000 is already in use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
- Another app is using port 3000
- Close any other instances of PatentIQ
- Or type: `npm run dev -- -p 3001` to use a different port, then go to `http://localhost:3001`

### Problem: Database connection failed
**Error:** Contains "database" or "connection refused"

**Solution:**
- Make sure Docker is running: `docker ps`
- Restart the database:
  ```bash
  docker-compose -f database/docker-compose.yml down
  docker-compose -f database/docker-compose.yml up -d
  ```

### Problem: Search returns no results
**Possible causes:**
- The database doesn't have patent data loaded yet
- OpenAI API is not responding (check internet connection)
- Auth0 credentials are invalid

**Next steps:** Contact the development team

### Problem: "npm: command not found"
**Solution:** After installing Node.js, you must restart your computer. Then try again.

### Problem: The page shows "Not Found" or 404
**Solution:**
- Make sure you're using the correct URL: `http://localhost:3000` (not `https://`)
- Check that `npm run dev` is still running in your terminal
- If the terminal closed, restart it by typing `npm run dev` again from the `patentiq` folder

---

## Common Questions

**Q: Why do I need Docker?**
A: The app stores patent data in a PostgreSQL database. Docker runs this database automatically on your computer.

**Q: What if I don't have 20GB of disk space?**
A: Docker and dependencies take ~10GB. You need at least 10GB free to start; more is better.

**Q: Can I use this on my phone?**
A: Not directly on the phone itself. But if it's running on your computer, you can access it from another device on the same network by using your computer's IP address instead of `localhost`.

**Q: How long does patent search take?**
A: Usually 10-30 seconds depending on your internet speed and server load.

**Q: Can multiple people use it at once?**
A: If they're on the same network, yes. But each needs to be logged in with their own account.

---

## Getting Help

If something doesn't work:

1. **Write down:**
   - What you were trying to do
   - What happened (or didn't happen)
   - Any error messages (copy them exactly)

2. **Share this information with the development team**

3. **Useful commands for troubleshooting:**
   - Check Docker status: `docker ps`
   - View logs: `docker logs patentiq-db`
   - Check if ports are in use:
     - Windows: `netstat -ano | findstr :3000`
     - Mac/Linux: `lsof -i :3000`

---

## Next Steps (After Testing)

Once the app is running and you've verified it works:

- **Report bugs:** If you found anything that doesn't work as expected
- **Test with different data:** Try searching for different types of inventions
- **Check accessibility:** Can you use the app on different browsers? (Chrome, Safari, Firefox, Edge)
- **Test authentication:** Log out and log back in

---

## System Information (For Reference)

When contacting support, include:

- **Operating System:** Windows / Mac / Linux (and version)
- **Docker version:** Run `docker --version`
- **Node version:** Run `node --version`
- **Browser:** Chrome / Safari / Firefox / Edge

---

**Last Updated:** March 2026
**PatentIQ AI Version:** 0.1.0
