import Foundation
import SwiftData
import Observation

@Observable
final class LogEntryViewModel {
    var startTime = Date()
    var endTime = Date()
    var quality: Int? = nil
    var notes = ""

    var factorDate = Date()
    var factorCategory: LifestyleCategory = .caffeine
    var factorValue = ""
    var factorNotes = ""

    func saveSleepSession(context: ModelContext) throws {
        let session = SleepSession(
            startTime: startTime,
            endTime: endTime,
            quality: quality,
            source: "manual",
            notes: notes.isEmpty ? nil : notes
        )
        context.insert(session)
        try context.save()
        reset()
    }

    func saveLifestyleEntry(context: ModelContext) throws {
        guard let value = Double(factorValue), value >= 0 else { return }
        let entry = LifestyleEntry(
            date: factorDate,
            category: factorCategory,
            value: value,
            notes: factorNotes.isEmpty ? nil : factorNotes
        )
        context.insert(entry)
        try context.save()
        resetFactor()
    }

    private func reset() {
        startTime = Date()
        endTime = Date()
        quality = nil
        notes = ""
    }

    private func resetFactor() {
        factorValue = ""
        factorNotes = ""
    }
}
