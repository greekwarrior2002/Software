import XCTest
@testable import SleepTracker

final class AnalyticsTests: XCTestCase {
    private let vm = AnalyticsViewModel()

    func testPerfectPositiveCorrelation() {
        let sessions = makeSessions(qualities: [1, 2, 3, 4, 5, 6, 7])
        let entries = makeEntries(values: [10, 20, 30, 40, 50, 60, 70], category: .caffeine, forSessions: sessions)
        let results = vm.correlations(sessions: sessions, entries: entries)
        let caffeine = results.first { $0.category == .caffeine }!
        XCTAssertEqual(caffeine.r, 1.0, accuracy: 0.001)
        XCTAssertEqual(caffeine.n, 7)
    }

    func testInsufficientDataSuppressed() {
        let sessions = makeSessions(qualities: [3, 4, 5])
        let entries = makeEntries(values: [10, 20, 30], category: .caffeine, forSessions: sessions)
        let results = vm.correlations(sessions: sessions, entries: entries)
        let caffeine = results.first { $0.category == .caffeine }!
        XCTAssertEqual(caffeine.strength, "Not enough data")
    }

    func testWeeklyAggregatesAreChronological() {
        let sessions = makeSessions(qualities: Array(repeating: 3, count: 14))
        let aggregates = vm.weeklyAggregates(sessions: sessions, weeks: 4)
        let dates = aggregates.map(\.weekStart)
        XCTAssertEqual(dates, dates.sorted())
    }

    // MARK: - Helpers

    private func makeSessions(qualities: [Int]) -> [SleepSession] {
        qualities.enumerated().map { i, q in
            let start = Calendar.current.date(byAdding: .day, value: -i, to: Date())!
                .addingTimeInterval(-8 * 3600)
            let end = start.addingTimeInterval(8 * 3600)
            let s = SleepSession(startTime: start, endTime: end, quality: q)
            return s
        }
    }

    private func makeEntries(values: [Double], category: LifestyleCategory, forSessions sessions: [SleepSession]) -> [LifestyleEntry] {
        zip(sessions, values).map { session, value in
            LifestyleEntry(date: session.sleepDate, category: category, value: value)
        }
    }
}
