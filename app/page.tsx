"use client"

import { useState, useEffect } from "react"
import { format, addMinutes, formatDistanceToNow, parse, isValid, set } from "date-fns"
import { Moon, Sun, Clock, AlarmClock, Settings, Info } from "lucide-react"
import { Bed } from "lucide-react" 

export default function SleepCycleCalculator() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCycle, setSelectedCycle] = useState(5) // Default to 5 cycles (optimal)
  const [mode, setMode] = useState("sleep") // "sleep" or "wake"
  const [showInfo, setShowInfo] = useState(false)
  const [theme, setTheme] = useState("dark") // "dark" or "light"
  const [wakeUpTimeInput, setWakeUpTimeInput] = useState("7:00 AM")
  const [wakeUpTime, setWakeUpTime] = useState(() => {
    // Default to 7:00 AM
    const today = new Date()
    return set(today, { hours: 7, minutes: 0, seconds: 0 })
  })
  
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle wake-up time input change
  const handleWakeUpTimeChange = (e) => {
    const input = e.target.value
    setWakeUpTimeInput(input)
    
    try {
      // Try to parse the input time
      const parsedTime = parse(input, "h:mm a", new Date())
      
      if (isValid(parsedTime)) {
        // Create a date object for today with the input time
        const today = new Date()
        const newWakeUpTime = set(today, {
          hours: parsedTime.getHours(),
          minutes: parsedTime.getMinutes(),
          seconds: 0
        })
        
        // If the time would be in the past, set it for tomorrow
        if (newWakeUpTime < currentTime) {
          newWakeUpTime.setDate(newWakeUpTime.getDate() + 1)
        }
        
        setWakeUpTime(newWakeUpTime)
      }
    } catch (error) {
      // Keep the previous valid time if parsing fails
      console.log("Time parsing error:", error)
    }
  }

  // Calculate wake-up times based on sleep cycles (90 minutes each)
  const calculateWakeUpTimes = () => {
    // Add 14 minutes to fall asleep
    const fallAsleepTime = addMinutes(currentTime, 14)

    // Calculate wake-up times for 3, 4, 5, and 6 sleep cycles
    return [3, 4, 5, 6].map((cycles) => {
      const wakeUpTime = addMinutes(fallAsleepTime, cycles * 90)
      return {
        cycles,
        time: wakeUpTime,
        formatted: format(wakeUpTime, "h:mm a"),
        hours: (cycles * 90) / 60,
        quality: getQualityLabel(cycles),
      }
    })
  }

  // Calculate bedtime based on desired wake time
  const calculateBedTimes = () => {
    // Calculate bedtimes for 3, 4, 5, and 6 sleep cycles
    return [3, 4, 5, 6].map((cycles) => {
      // Subtract sleep time + 14 minutes to fall asleep
      const bedTime = addMinutes(wakeUpTime, -((cycles * 90) + 14))
      return {
        cycles,
        time: bedTime,
        formatted: format(bedTime, "h:mm a"),
        hours: (cycles * 90) / 60,
        quality: getQualityLabel(cycles),
      }
    })
  }
  
  // Get sleep quality label
  const getQualityLabel = (cycles) => {
    switch(cycles) {
      case 3: return "Minimum"
      case 4: return "Adequate"
      case 5: return "Optimal"
      case 6: return "Extended"
      default: return ""
    }
  }

  const times = mode === "sleep" ? calculateWakeUpTimes() : calculateBedTimes()
  const selectedTime = times.find((t) => t.cycles === selectedCycle) || times[2]
  
  // Get time until alarm/bedtime
  const getTimeUntil = () => {
    if (!selectedTime) return ""
    
    try {
      // Handle cases where the time is in the past
      if (selectedTime.time < currentTime) {
        return "Time passed"
      }
      
      return formatDistanceToNow(selectedTime.time, { addSuffix: true })
    } catch (e) {
      return ""
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${
      theme === "dark" 
        ? "bg-gradient-to-b from-[#0a1520] via-[#0c2a3a] to-[#1a5469]" 
        : "bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]"
    } relative overflow-hidden transition-colors duration-500`}>
      {/* Stars or clouds background */}
      <div className="absolute inset-0 overflow-hidden">
        {theme === "dark" ? (
          // Stars for dark mode
          Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.floor(i % 3) + 1 + "px",
                height: Math.floor(i % 3) + 1 + "px",
                top: (i * 7) % 100 + "%",
                left: (i * 13) % 100 + "%",
                opacity: (i % 5 + 2) / 10,
                animation: `twinkle ${(i % 5) + 2}s infinite alternate ${i % 2}s`
              }}
            />
          ))
        ) : (
          // Clouds for light mode
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/60 blur-xl"
              style={{
                width: 100 + (i * 30) + "px",
                height: 50 + (i * 15) + "px",
                top: (i * 10) % 70 + "%",
                left: (i * 20) % 100 + "%",
                opacity: 0.6,
                animation: `float ${10 + (i % 5)}s infinite alternate ${i * 2}s`
              }}
            />
          ))
        )}
      </div>

      {/* Theme toggle */}
      <button 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-colors z-30"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      {/* Info button */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-6 left-6 bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-colors z-30"
      >
        <Info size={20} />
      </button>

      {/* Info overlay */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center p-6" onClick={() => setShowInfo(false)}>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md text-white" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Sleep Cycle Information</h2>
            <p className="mb-4">Sleep cycles are approximately 90 minutes long and consist of different stages of sleep (light sleep, deep sleep, and REM sleep).</p>
            <p className="mb-4">Waking up at the end of a complete sleep cycle helps you feel more refreshed compared to waking up in the middle of deep sleep.</p>
            <ul className="mb-4">
              <li className="mb-2"><strong>3 cycles (4.5 hours):</strong> Minimum sleep for basic functioning, but not sustainable.</li>
              <li className="mb-2"><strong>4 cycles (6 hours):</strong> Adequate sleep for short periods.</li>
              <li className="mb-2"><strong>5 cycles (7.5 hours):</strong> Optimal sleep for most adults.</li>
              <li className="mb-2"><strong>6 cycles (9 hours):</strong> Extended sleep that some people need.</li>
            </ul>
            <p>It takes about 14 minutes for the average person to fall asleep, which is factored into these calculations.</p>
            <button className="bg-white/20 hover:bg-white/30 mt-4 py-2 px-4 rounded-full transition-colors" onClick={() => setShowInfo(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Content container */}
      <div className="w-full max-w-md mx-auto px-6 relative z-10 flex flex-col h-screen">
        <div className="flex flex-col h-full justify-between py-12">
          {/* Current time */}
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Clock size={24} className={theme === "dark" ? "text-white/80" : "text-black/80"} />
            </div>
            <h1 className={`${theme === "dark" ? "text-white/80" : "text-black/80"} font-inter text-sm uppercase tracking-wider mb-2`}>Current Time</h1>
            <p className={`${theme === "dark" ? "text-white" : "text-black"} font-playfair text-5xl`}>{format(currentTime, "h:mm a")}</p>
          </div>

          {/* Mode toggle */}
          <div className="flex justify-center my-8">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex">
              <button 
                onClick={() => setMode("sleep")} 
                className={`py-2 px-6 rounded-full transition-colors ${mode === "sleep" ? "bg-white/20" : ""} 
                  ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                <div className="flex items-center space-x-2">
                  <Bed size={18} /> 
                  <span>Bedtime Now</span>
                </div>
              </button>
              <button 
                onClick={() => setMode("wake")} 
                className={`py-2 px-6 rounded-full transition-colors ${mode === "wake" ? "bg-white/20" : ""} 
                  ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                <div className="flex items-center space-x-2">
                  <AlarmClock size={18} /> 
                  <span>Wake at</span>
                </div>
              </button>
            </div>
          </div>

          {/* Wake-up time input (only shown in "wake" mode) */}
          {mode === "wake" && (
            <div className="flex flex-col items-center mb-4">
              <label className={`mb-2 ${theme === "dark" ? "text-white/80" : "text-black/80"}`}>
                I want to wake up at:
              </label>
              <input
                type="text"
                value={wakeUpTimeInput}
                onChange={handleWakeUpTimeChange}
                placeholder="7:00 AM"
                className={`bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 text-center w-48 
                  ${theme === "dark" ? "text-white" : "text-black"}
                  focus:outline-none focus:ring-2 ${theme === "dark" ? "focus:ring-white/30" : "focus:ring-black/30"}`}
              />
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-white/60" : "text-black/60"}`}>
                Format: 7:00 AM or 19:00
              </p>
            </div>
          )}

          {/* Time options */}
          <div className="flex flex-col items-center justify-center space-y-6 my-8">
            {times.map((time) => (
              <button
                key={time.cycles}
                onClick={() => setSelectedCycle(time.cycles)}
                className={`flex justify-between w-full max-w-xs transition-all duration-300 rounded-xl px-6 py-3 
                  ${selectedCycle === time.cycles 
                  ? `${theme === "dark" ? "bg-white/15" : "bg-black/10"} backdrop-blur-md` 
                  : `${theme === "dark" ? "bg-white/5" : "bg-black/5"} hover:bg-white/10`}`}
              >
                <div className="text-left">
                  <p className={`font-playfair text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {time.formatted}
                  </p>
                  <p className={`text-sm ${theme === "dark" ? "text-white/60" : "text-black/60"}`}>
                    {time.cycles} cycles • {time.hours.toFixed(1)} hrs
                  </p>
                </div>
                <div className={`flex items-center justify-center px-3 rounded-lg ${
                  selectedCycle === time.cycles ? 
                    (theme === "dark" ? "bg-white/20" : "bg-black/10") : 
                    "bg-transparent"
                }`}>
                  <span className={theme === "dark" ? "text-white/80" : "text-black/80"}>{time.quality}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Time until section */}
          <div className="text-center mb-8">
            <p className={`${theme === "dark" ? "text-white/60" : "text-black/60"} font-inter text-sm uppercase tracking-wider mb-1`}>
              {mode === "sleep" ? "Wake up in" : "Go to bed in"}
            </p>
            <p className={`${theme === "dark" ? "text-white" : "text-black"} font-playfair text-2xl`}>
              {getTimeUntil()}
            </p>
            <p className={`mt-4 ${theme === "dark" ? "text-white/70" : "text-black/70"} font-inter text-sm`}>
              {mode === "sleep" 
                ? "Set an alarm and wake up feeling refreshed" 
                : `Go to bed at this time to wake up at ${format(wakeUpTime, "h:mm a")}`}
            </p>
          </div>
        </div>
      </div>

      {/* Add styles for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes float {
          0% { transform: translateX(-5px) translateY(0); }
          50% { transform: translateX(5px) translateY(-10px); }
          100% { transform: translateX(-5px) translateY(0); }
        }
      `}</style>
    </div>
  )
}