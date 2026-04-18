import Foundation
import Observation

struct CorrelationPoint: Identifiable {
    let id = UUID()
    let date: Date
    let factorValue: Double
    let quality: Double
}

struct CorrelationResult {
    let category: LifestyleCategory
    let r: Double
    let n: Int
    let points: [CorrelationPoint]

    var strength: String {
        let abs = Swift.abs(r)
        if n < 7 { return "Not enough data" }
        switch abs {
        case ..<0.2: return "No clear relationship"
        case 0.2..<0.4: return "Weak"
        case 0.4..<0.6: return "Moderate"
        default: return "Strong"
        }
    }
}

struct WeeklyAggregate: Identifiable {
    let id = UUID()
    let weekStart: Date
    let avgQuality: Double
    let avgDurationHours: Double
}

@Observable
final class AnalyticsViewModel {
    func correlations(sessions: [SleepSession], entries: [LifestyleEntry]) -> [CorrelationResult] {
        let entriesByDate = Dictionary(grouping: entries, by: \.date)

        return LifestyleCategory.allCases.compactMap { category in
            var points: [CorrelationPoint] = []
            for session in sessions {
                guard let quality = session.quality else { continue }
                let dateKey = LifestyleEntry.dateString(from: session.sleepDate)
                let dayEntries = entriesByDate[dateKey] ?? []
                let match = dayEntries.first { $0.category == category.rawValue }
                guard let entry = match else { continue }
                points.append(CorrelationPoint(date: session.startTime, factorValue: entry.value, quality: Double(quality)))
            }
            let r = pearson(points.map(\.factorValue), points.map(\.quality))
            return CorrelationResult(category: category, r: r, n: points.count, points: points)
        }
    }

    func weeklyAggregates(sessions: [SleepSession], weeks: Int = 12) -> [WeeklyAggregate] {
        let cal = Calendar.current
        let now = Date()
        return (0..<weeks).compactMap { weekOffset -> WeeklyAggregate? in
            let weekStart = cal.date(byAdding: .weekOfYear, value: -weekOffset, to: cal.startOfWeek(for: now))!
            let weekEnd = cal.date(byAdding: .day, value: 7, to: weekStart)!
            let week = sessions.filter { $0.startTime >= weekStart && $0.startTime < weekEnd }
            guard !week.isEmpty else { return nil }
            let rated = week.compactMap(\.quality)
            let avgQ = rated.isEmpty ? 0 : Double(rated.reduce(0, +)) / Double(rated.count)
            let avgD = week.map { $0.duration / 3600 }.reduce(0, +) / Double(week.count)
            return WeeklyAggregate(weekStart: weekStart, avgQuality: avgQ, avgDurationHours: avgD)
        }.reversed()
    }

    private func pearson(_ xs: [Double], _ ys: [Double]) -> Double {
        guard xs.count > 1, xs.count == ys.count else { return 0 }
        let n = Double(xs.count)
        let xMean = xs.reduce(0, +) / n
        let yMean = ys.reduce(0, +) / n
        let num = zip(xs, ys).map { ($0 - xMean) * ($1 - yMean) }.reduce(0, +)
        let dx = xs.map { pow($0 - xMean, 2) }.reduce(0, +)
        let dy = ys.map { pow($0 - yMean, 2) }.reduce(0, +)
        let denom = sqrt(dx * dy)
        return denom == 0 ? 0 : num / denom
    }
}

private extension Calendar {
    func startOfWeek(for date: Date) -> Date {
        let comps = dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        return self.date(from: comps) ?? date
    }
}
