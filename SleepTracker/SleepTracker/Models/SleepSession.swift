import Foundation
import SwiftData

@Model
final class SleepSession {
    var startTime: Date
    var endTime: Date
    var durationMinutes: Int
    /// 1–5 subjective quality score; nil if not rated
    var quality: Int?
    /// "healthkit" | "manual" | "web"
    var source: String
    var notes: String?

    init(startTime: Date, endTime: Date, quality: Int? = nil, source: String = "manual", notes: String? = nil) {
        self.startTime = startTime
        self.endTime = endTime
        self.durationMinutes = Int(endTime.timeIntervalSince(startTime) / 60)
        self.quality = quality
        self.source = source
        self.notes = notes
    }

    var duration: TimeInterval { endTime.timeIntervalSince(startTime) }

    /// Calendar date the user went to bed (date of startTime, or previous day if before 6 AM)
    var sleepDate: Date {
        let cal = Calendar.current
        let hour = cal.component(.hour, from: startTime)
        let base = hour < 6 ? cal.date(byAdding: .day, value: -1, to: startTime)! : startTime
        return cal.startOfDay(for: base)
    }
}
