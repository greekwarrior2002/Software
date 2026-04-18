import Foundation
import SwiftData

enum LifestyleCategory: String, CaseIterable, Codable {
    case caffeine
    case alcohol
    case exercise
    case stress
    case screenTime = "screen_time"
    case nap
    case medication
    case other

    var displayName: String {
        switch self {
        case .caffeine: return "Caffeine"
        case .alcohol: return "Alcohol"
        case .exercise: return "Exercise"
        case .stress: return "Stress"
        case .screenTime: return "Screen Time"
        case .nap: return "Nap"
        case .medication: return "Medication"
        case .other: return "Other"
        }
    }

    var defaultUnit: String {
        switch self {
        case .caffeine: return "mg"
        case .alcohol: return "drinks"
        case .exercise: return "minutes"
        case .stress: return "1-10"
        case .screenTime: return "minutes"
        case .nap: return "minutes"
        case .medication: return "dose"
        case .other: return ""
        }
    }

    var systemImage: String {
        switch self {
        case .caffeine: return "cup.and.saucer"
        case .alcohol: return "wineglass"
        case .exercise: return "figure.run"
        case .stress: return "brain.head.profile"
        case .screenTime: return "iphone"
        case .nap: return "zzz"
        case .medication: return "pills"
        case .other: return "ellipsis.circle"
        }
    }
}

@Model
final class LifestyleEntry {
    /// YYYY-MM-DD — day-scoped, not a full timestamp
    var date: String
    var category: String
    var value: Double
    var unit: String
    var notes: String?

    init(date: Date, category: LifestyleCategory, value: Double, notes: String? = nil) {
        self.date = LifestyleEntry.dateString(from: date)
        self.category = category.rawValue
        self.value = value
        self.unit = category.defaultUnit
        self.notes = notes
    }

    var resolvedCategory: LifestyleCategory {
        LifestyleCategory(rawValue: category) ?? .other
    }

    static func dateString(from date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        return f.string(from: date)
    }
}
