export const useLeaveCalculator = () => {
  // 勞基法特休計算公式
  const calculateLegalAnnualLeave = (onboardDate) => {
    if (!onboardDate) return 0
    const start = new Date(onboardDate)
    const today = new Date()
    let diffYears = today.getFullYear() - start.getFullYear()
    const monthDiff = today.getMonth() - start.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())) {
      diffYears--
    }

    const totalMonths =
      (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth())

    if (totalMonths < 6) return 0
    if (totalMonths < 12) return 3
    if (diffYears < 2) return 7
    if (diffYears < 3) return 10
    if (diffYears < 5) return 14
    if (diffYears < 10) return 15
    return Math.min(15 + (diffYears - 10 + 1), 30)
  }

  return {
    calculateLegalAnnualLeave,
  }
}
