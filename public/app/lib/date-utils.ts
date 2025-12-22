export function getRelativeDate(dateString: string): string {
  // Convert to EST/EDT timezone
  const date = new Date(dateString)
  const now = new Date()
  
  // Check if date is in the future
  if (date > now) {
    return "in-progress"
  }
  
  // Check if it's today (same date) - handle timezone issues
  const dateDate = date.toDateString()
  const nowDate = now.toDateString()
  if (dateDate === nowDate) {
    return "today"
  }
  
  // Calculate time difference
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // If it's 0 days difference, it's today
  if (diffDays === 0) {
    return "today"
  }
  
  // Yesterday
  if (diffDays === 1) {
    return "yesterday"
  }
  
  // Weekly pattern
  if (diffDays >= 2 && diffDays < 7) {
    return "this week"
  }
  
  if (diffDays >= 7 && diffDays < 14) {
    return "last week"
  }
  
  if (diffDays >= 14 && diffDays < 21) {
    return "2 weeks ago"
  }
  
  if (diffDays >= 21 && diffDays < 28) {
    return "3 weeks ago"
  }
  
  // Monthly pattern (calendar-based with day consideration)
  const monthsDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
  const currentDay = now.getDate()
  const originalDay = date.getDate()
  
  // Adjust months difference based on day of month
  let adjustedMonthsDiff = monthsDiff
  if (currentDay < originalDay) {
    adjustedMonthsDiff = monthsDiff - 1
  }
  
  // Special case: if it's been more than 25 days and we're in the next month, call it "1 month ago"
  if (diffDays >= 25 && monthsDiff === 1) {
    return "1 month ago"
  }
  
  if (adjustedMonthsDiff === 1) {
    return "1 month ago"
  }
  
  if (adjustedMonthsDiff >= 2 && adjustedMonthsDiff < 3) {
    return "2 months ago"
  }
  
  if (adjustedMonthsDiff >= 3 && adjustedMonthsDiff < 4) {
    return "3 months ago"
  }
  
  if (adjustedMonthsDiff >= 4 && adjustedMonthsDiff < 5) {
    return "4 months ago"
  }
  
  if (adjustedMonthsDiff >= 5 && adjustedMonthsDiff < 6) {
    return "5 months ago"
  }
  
  if (adjustedMonthsDiff >= 6 && adjustedMonthsDiff < 7) {
    return "6 months ago"
  }
  
  if (adjustedMonthsDiff >= 7 && adjustedMonthsDiff < 8) {
    return "7 months ago"
  }
  
  if (adjustedMonthsDiff >= 8 && adjustedMonthsDiff < 9) {
    return "8 months ago"
  }
  
  if (adjustedMonthsDiff >= 9 && adjustedMonthsDiff < 10) {
    return "9 months ago"
  }
  
  if (adjustedMonthsDiff >= 10 && adjustedMonthsDiff < 11) {
    return "10 months ago"
  }
  
  if (adjustedMonthsDiff >= 11 && adjustedMonthsDiff < 12) {
    return "11 months ago"
  }
  
  // Yearly pattern
  const yearsDiff = now.getFullYear() - date.getFullYear()
  const monthsInYear = now.getMonth() - date.getMonth()
  const totalMonthsDiff = yearsDiff * 12 + monthsInYear
  
  if (totalMonthsDiff >= 12 && totalMonthsDiff < 18) {
    return "1 year ago"
  }
  
  if (totalMonthsDiff >= 18 && totalMonthsDiff < 24) {
    return "1½ years ago"
  }
  
  if (totalMonthsDiff >= 24 && totalMonthsDiff < 30) {
    return "2 years ago"
  }
  
  if (totalMonthsDiff >= 30 && totalMonthsDiff < 36) {
    return "2½ years ago"
  }
  
  if (totalMonthsDiff >= 36 && totalMonthsDiff < 48) {
    return "3 years ago"
  }
  
  if (totalMonthsDiff >= 48 && totalMonthsDiff < 60) {
    return "4 years ago"
  }
  
  if (totalMonthsDiff >= 60 && totalMonthsDiff < 72) {
    return "5 years ago"
  }
  
  // Continue pattern for older dates
  const exactYears = Math.floor(totalMonthsDiff / 12)
  return `${exactYears} years ago`
} 