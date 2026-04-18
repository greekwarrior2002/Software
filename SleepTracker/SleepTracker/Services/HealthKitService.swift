import Foundation
import HealthKit

protocol HealthKitServiceProtocol {
    func requestAuthorization() async throws
    func fetchSleepSessions(since: Date) async throws -> [SleepSession]
    func writeSleepSession(_ session: SleepSession) async throws
}

final class HealthKitService: HealthKitServiceProtocol {
    private let store = HKHealthStore()

    private var readTypes: Set<HKObjectType> {
        [HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!]
    }

    private var writeTypes: Set<HKSampleType> {
        [HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!]
    }

    func requestAuthorization() async throws {
        guard HKHealthStore.isHealthDataAvailable() else { return }
        try await store.requestAuthorization(toShare: writeTypes, read: readTypes)
    }

    func fetchSleepSessions(since: Date) async throws -> [SleepSession] {
        let type = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let predicate = HKQuery.predicateForSamples(withStart: since, end: nil)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)

        let samples: [HKCategorySample] = try await withCheckedThrowingContinuation { continuation in
            let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: [sortDescriptor]) { _, results, error in
                if let error { continuation.resume(throwing: error); return }
                continuation.resume(returning: (results as? [HKCategorySample]) ?? [])
            }
            store.execute(query)
        }

        return consolidateSleepSamples(samples)
    }

    func writeSleepSession(_ session: SleepSession) async throws {
        let type = HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
        let sample = HKCategorySample(
            type: type,
            value: HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue,
            start: session.startTime,
            end: session.endTime
        )
        try await store.save(sample)
    }

    // Merges consecutive sleep samples where the gap between them is < 5 minutes.
    private func consolidateSleepSamples(_ samples: [HKCategorySample]) -> [SleepSession] {
        let sleepOnly = samples.filter { $0.value != HKCategoryValueSleepAnalysis.inBed.rawValue }
        guard !sleepOnly.isEmpty else { return [] }

        var sessions: [SleepSession] = []
        var blockStart = sleepOnly[0].startDate
        var blockEnd = sleepOnly[0].endDate

        for sample in sleepOnly.dropFirst() {
            let gap = sample.startDate.timeIntervalSince(blockEnd)
            if gap < 5 * 60 {
                blockEnd = max(blockEnd, sample.endDate)
            } else {
                sessions.append(SleepSession(startTime: blockStart, endTime: blockEnd, source: "healthkit"))
                blockStart = sample.startDate
                blockEnd = sample.endDate
            }
        }
        sessions.append(SleepSession(startTime: blockStart, endTime: blockEnd, source: "healthkit"))
        return sessions
    }
}

final class MockHealthKitService: HealthKitServiceProtocol {
    func requestAuthorization() async throws {}

    func fetchSleepSessions(since: Date) async throws -> [SleepSession] {
        let now = Date()
        return (0..<7).map { i in
            let start = Calendar.current.date(byAdding: .day, value: -i, to: now)!
                .addingTimeInterval(-8 * 3600)
            let end = start.addingTimeInterval(7.5 * 3600)
            return SleepSession(startTime: start, endTime: end, quality: Int.random(in: 2...5), source: "healthkit")
        }
    }

    func writeSleepSession(_ session: SleepSession) async throws {}
}
