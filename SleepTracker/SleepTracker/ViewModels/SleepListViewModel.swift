import Foundation
import SwiftData
import Observation

@Observable
final class SleepListViewModel {
    var isRefreshing = false
    var errorMessage: String?

    private let healthKit: HealthKitServiceProtocol

    init(healthKit: HealthKitServiceProtocol = HealthKitService()) {
        self.healthKit = healthKit
    }

    func refreshFromHealthKit(context: ModelContext) async {
        isRefreshing = true
        defer { isRefreshing = false }
        do {
            try await healthKit.requestAuthorization()
            let thirtyDaysAgo = Calendar.current.date(byAdding: .day, value: -30, to: .now)!
            let fetched = try await healthKit.fetchSleepSessions(since: thirtyDaysAgo)
            for session in fetched {
                context.insert(session)
            }
            try context.save()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func delete(_ sessions: [SleepSession], context: ModelContext) {
        sessions.forEach { context.delete($0) }
        try? context.save()
    }
}
