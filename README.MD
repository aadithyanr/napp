<div align="center">
  <div id="user-content-toc">
    <ul>
      <summary><h1 style="display: inline-block; margin-bottom:0px">Napp</h1></summary>
    </ul>
  </div>
  <h3>A sleep cycle optimization app</h3>
  <h4><i>Wake up refreshed by aligning your sleep with natural sleep cycles</i></h4>
  <br>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white"/>
  <br><br>
</div>

![napp-demo](screenshot.png)

## What are Sleep Cycles?
*Sleep cycles are approximately 90-minute periods during which your body goes through different stages of sleep, including light sleep, deep sleep, and REM sleep. Waking up during the lighter stages of sleep (at the end of a sleep cycle) helps you feel more refreshed and energized, while waking up during deep sleep can leave you feeling groggy and fatigued. By timing your sleep to complete full cycles, you can optimize your sleep quality and minimize morning headaches and grogginess.*

## Features
- **Two calculation modes**:
  - **Bedtime Now**: Calculate optimal wake-up times based on going to bed now
  - **Wake At**: Plan when to go to bed based on your desired wake-up time
- **Sleep cycle optimization**: Options for 3, 4, 5, and 6 sleep cycles (4.5 to 9 hours)
- **Sleep quality indicators**: Minimum, Adequate, Optimal, and Extended sleep recommendations
- **Dark/Light mode**: Choose your preferred theme
- **Countdown timer**: See how long until your next optimal bedtime or wake-up time
- **Responsive design**: Works on mobile and desktop devices

## The Science Behind It
Napp accounts for the average 14 minutes it takes most people to fall asleep and calculates wake-up or bedtime recommendations based on complete 90-minute sleep cycles. This helps you:
1. Avoid waking up during deep sleep
2. Reduce morning headaches and grogginess
3. Feel more refreshed upon waking
4. Optimize your sleep even when getting less than 8 hours

## Getting Started
### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Napp.git
   ```
2. Navigate to the project directory:
   ```
   cd Napp
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the app
```
npm run dev
```
The app will be available at `http://localhost:3000` by default.

## Video Demo
<div align="center">
<video src="napp.mp4" width="640" height="360" controls></video>
</div>

## Why I Built This
I created Napp after struggling with persistent morning headaches. Research showed that waking up in the middle of deep sleep was likely the culprit. By aligning my wake-up times with the end of complete sleep cycles, I was able to wake up feeling more refreshed and eliminate the headaches. I built this app to help others discover the benefits of sleep cycle optimization.

## Technologies Used
- React.js
- Next.js
- Tailwind CSS
- Lucide Icons
- Custom sleep cycle algorithms

## Future Enhancements
- Alarm integration
- Custom sleep cycle duration settings
- Sleep history tracking
- Smart wake-up window recommendations
- Apple Watch and Android Wear compatibility