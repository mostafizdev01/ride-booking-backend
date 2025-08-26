import { Payment } from "../payment/payment.model";
import { IRide, RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { User } from "../user/user.model"

const getUserStats = async (id: string) => {
  const user = await User.findById(id).lean().populate('rides');

  if (!user) {
    throw new Error("user not found")
  }
  const rides = user.rides ?? []

  const now = new Date()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const todayRides = rides.filter(
    (r: any) => new Date(r.createdAt) >= todayStart && r.status === RideStatus.COMPLETED
  )

  const yesterdayRides = rides.filter(
    (r: any) =>
      new Date(r.createdAt) >= yesterdayStart &&
      new Date(r.createdAt) < todayStart &&
      r.status === RideStatus.COMPLETED
  )

  const todayEarnings = todayRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)
  const yesterdayEarnings = yesterdayRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)

  let earningsGrowth = 0
  if (yesterdayEarnings === 0 && todayEarnings > 0) earningsGrowth = 100
  else if (yesterdayEarnings > 0) earningsGrowth = ((todayEarnings - yesterdayEarnings) / yesterdayEarnings) * 100

  const ratings = rides.filter((r: any) => r.rating?.score).map((r: any) => r.rating.score)
  const totalRatings = ratings.length
  const averageRating = totalRatings > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / totalRatings : 0

  const totalRequested = rides.length
  const accepted = rides.filter((r: any) => r.timestamps?.acceptedAt).length
  const completed = rides.filter((r: any) => r.status === RideStatus.COMPLETED).length
  const cancelled = rides.filter((r: any) => r.status === RideStatus.CANCELED).length

  const acceptanceRate = totalRequested > 0 ? (accepted / totalRequested) * 100 : 0
  const cancellationRate = totalRequested > 0 ? (cancelled / totalRequested) * 100 : 0

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    isActive: user.isActive,
    _id: user._id,
    role: user.role,
    totalEarnings: user.totalEarnings,
    todayEarnings,
    earningsGrowth: `${earningsGrowth.toFixed(1)}%`,
    ridesCompletedToday: todayRides.length,
    ridesCompletedYesterday: yesterdayRides.length,
    ridesChange: todayRides.length - yesterdayRides.length,
    averageRating: averageRating.toFixed(1),
    totalRatings,
    acceptanceRate: `${acceptanceRate.toFixed(0)}%`,
    cancellationRate: `${cancellationRate.toFixed(0)}%`,
    totalRides: completed,
  }
}

const getEarningsStats = async (id: string) => {
  const user = await User.findById(id)
    .populate<{ rides: IRide[] }>("rides")
    .lean<{ rides: IRide[] }>()

  if (!user) throw new Error("User not found")

  const rides: IRide[] = user.rides ?? []

  // === Helper function to group array ===
  const groupBy = <T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> =>
    arr.reduce((acc, curr) => {
      const key = keyFn(curr)
      if (!acc[key]) acc[key] = []
      acc[key].push(curr)
      return acc
    }, {} as Record<string, T[]>)

  // === Today Earnings ===
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayRides = rides.filter(
    r => r.status === RideStatus.COMPLETED && r.timestamps.completedAt! >= todayStart
  )
  const todayEarnings = todayRides.reduce((sum, r) => sum + r.fare, 0)

  // === Weekly Earnings (last 7 days) ===
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 6)

  const weeklyRides = rides.filter(
    r => r.status === RideStatus.COMPLETED && r.timestamps.completedAt! >= weekStart
  )

  const weeklyGrouped = groupBy(weeklyRides, r =>
    r.timestamps.completedAt!.toLocaleDateString("en-US", { weekday: "short" })
  )

  const weeklyData = Object.entries(weeklyGrouped).map(([day, rides]) => ({
    name: day,
    earnings: rides.reduce((sum, r) => sum + r.fare, 0),
    rides: rides.length,
    hours: rides.length * 1, // প্রতি ride ~1 hour
  }))

  // === Monthly Earnings (week-wise) ===
  const monthStart = new Date(todayStart)
  monthStart.setDate(1)

  const monthlyRides = rides.filter(
    r => r.status === RideStatus.COMPLETED && r.timestamps.completedAt! >= monthStart
  )

  const monthlyGrouped = groupBy(monthlyRides, r => {
    const date = r.timestamps.completedAt!.getDate()
    return `Week ${Math.ceil(date / 7)}`
  })

  const monthlyData = Object.entries(monthlyGrouped).map(([week, rides]) => ({
    name: week,
    earnings: rides.reduce((sum, r) => sum + r.fare, 0),
    rides: rides.length,
    hours: rides.length * 1,
  }))

  // === Yearly Earnings (month-wise) ===
  const yearStart = new Date(todayStart.getFullYear(), 0, 1)

  const yearlyRides = rides.filter(
    r => r.status === RideStatus.COMPLETED && r.timestamps.completedAt! >= yearStart
  )

  const yearlyGrouped = groupBy(yearlyRides, r =>
    r.timestamps.completedAt!.toLocaleDateString("en-US", { month: "short" })
  )

  const yearlyData = Object.entries(yearlyGrouped).map(([month, rides]) => ({
    name: month,
    earnings: rides.reduce((sum, r) => sum + r.fare, 0),
    rides: rides.length,
    hours: rides.length * 1,
  }))

  return {
    todayEarnings,
    weeklyData,
    monthlyData,
    yearlyData,
    totalEarnings: rides.reduce((sum, r) => sum + r.fare, 0),
    totalRides: rides.length,
  }
}
const getAnalytics = async (range: string = "7d") => {
  const days = range === "24h" ? 1 : parseInt(range.replace("d", ""), 10);

  const since = new Date();
  since.setDate(since.getDate() - days);

  // আগের same range
  const prevSince = new Date();
  prevSince.setDate(prevSince.getDate() - days * 2);

  // === Counts ===
  const totalUsers = await User.countDocuments();
  const totalDrivers = await User.countDocuments({ role: "DRIVER" });
  const totalRiders = await User.countDocuments({ role: "RIDER" });

  const offlineDrivers = await User.countDocuments({ role: "DRIVER", isActive: false });
  const onlineDrivers = await User.countDocuments({ role: "DRIVER", isActive: true });

  const onlineRiders = await User.countDocuments({ role: "RIDER", isActive: true });
  const offlineRiders = await User.countDocuments({ role: "RIDER", isActive: false });

  // 🔹 Active Users (এই সময়ের)
  const activeUsersNow = await User.countDocuments({ isActive: true, updatedAt: { $gte: since } });

  // 🔹 Active Users (আগের সময়ের)
  const activeUsersPrev = await User.countDocuments({ isActive: true, updatedAt: { $gte: prevSince, $lt: since } });

  // % change হিসাব
  const activeUsersChange =
    activeUsersPrev > 0
      ? ((activeUsersNow - activeUsersPrev) / activeUsersPrev) * 100
      : 100;

  const activeUsersTrend = activeUsersChange > 0 ? "up" : activeUsersChange < 0 ? "down" : "neutral";

  // === Rides ===
  const activeRides = await Ride.countDocuments({
    status: { $in: [RideStatus.IN_TRANSIT, RideStatus.PICKED_UP] },
  });
  const completedRides = await Ride.countDocuments({ status: RideStatus.COMPLETED });
  const totalRides = await Ride.countDocuments();

  // === Revenue ===
  const revenueAgg = await Ride.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: null, total: { $sum: "$fare" } } },
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  // === Ratings ===
  const ratingsAgg = await Ride.aggregate([
    { $match: { createdAt: { $gte: since }, "rating.score": { $exists: true } } },
    { $group: { _id: null, avg: { $avg: "$rating.score" } } },
  ]);
  const avgRating = ratingsAgg[0]?.avg || 0;

  // === Charts ===
  const ridesPerDay = await Ride.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const revenuePerDay = await Ride.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$fare" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalUsers,
    totalDrivers,
    totalRiders,
    onlineDrivers,
    offlineDrivers,
    onlineRiders,
    offlineRiders,
    activeUsers: {
      value: activeUsersNow,
      change: Number(activeUsersChange.toFixed(1)),
      trend: activeUsersTrend,
    },
    activeRides,
    completedRides,
    totalRides: {
      value: totalRides,
      change: 5.2,
      trend: "up"
    },
    revenue: { value: revenue, change: 8.7, trend: "up" },
    avgRating: avgRating.toFixed(1),
    responseTime: "2.3 min",
    charts: {
      ridesPerDay,
      revenuePerDay,
      userGrowth,
    },
  };
};


export const StatsService = {
  getUserStats,
  getEarningsStats,
  getAnalytics
}