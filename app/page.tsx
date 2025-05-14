"use client"

import { useState, useEffect } from "react"
import { format, addMinutes } from "date-fns"

export default function SleepCycleCalculator() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedCycle, setSelectedCycle] = useState(5) // Default to 5 cycles (optimal)

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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
      }
    })
  }

  const wakeUpTimes = calculateWakeUpTimes()
  const selectedTime = wakeUpTimes.find((t) => t.cycles === selectedCycle) || wakeUpTimes[2]
  const optimalTimeRange = `${format(addMinutes(selectedTime.time, -15), "h:mm a")} – ${format(
    addMinutes(selectedTime.time, 15),
    "h:mm a",
  )}`

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a1520] via-[#0c2a3a] to-[#1a5469] relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              top: Math.random() * 60 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Content container */}
      <div className="w-full max-w-sm mx-auto px-6 relative z-10 flex flex-col h-screen">
        <div className="flex flex-col h-full justify-between py-12">
          {/* Current time */}
          <div className="text-center">
            <h1 className="text-white/80 font-inter text-sm uppercase tracking-wider mb-2">Current Time</h1>
            <p className="text-white font-playfair text-4xl">{format(currentTime, "h:mm a")}</p>
          </div>

          {/* Wake up times */}
          <div className="flex flex-col items-center justify-center space-y-10 my-8">
            {wakeUpTimes.map((time) => (
              <button
                key={time.cycles}
                onClick={() => setSelectedCycle(time.cycles)}
                className={`text-4xl font-playfair transition-all duration-300 ${
                  selectedCycle === time.cycles
                    ? "text-white bg-white/10 backdrop-blur-md px-12 py-4 rounded-full"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {time.formatted}
              </button>
            ))}
          </div>

          {/* Sleep cycle info */}
          <div className="text-center mb-8">
            <p className="text-white font-inter text-lg mb-2">
              Wake up easy between
              <br />
              {format(addMinutes(selectedTime.time, -15), "h:mm a")} –{" "}
              {format(addMinutes(selectedTime.time, 15), "h:mm a")}
            </p>
            <p className="text-white/60 font-inter text-sm">
              {selectedCycle} sleep cycles • {selectedTime.hours.toFixed(1)} hours
            </p>
          </div>

          {/* Next cycle button */}
          <button
            onClick={() => {
              const currentIndex = wakeUpTimes.findIndex((t) => t.cycles === selectedCycle)
              const nextIndex = (currentIndex + 1) % wakeUpTimes.length
              setSelectedCycle(wakeUpTimes[nextIndex].cycles)
            }}
            className="bg-transparent border border-white/50 text-white rounded-full py-4 px-8 font-inter text-lg hover:bg-white/10 transition-colors"
          >
            Next Sleep Cycle
          </button>
        </div>
      </div>
    </div>
  )
}
