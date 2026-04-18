import SwiftUI
import SwiftData

struct SleepDetailView: View {
    @Bindable var session: SleepSession
    @Environment(\.modelContext) private var context

    var body: some View {
        Form {
            Section("Times") {
                DatePicker("Bedtime", selection: $session.startTime)
                DatePicker("Wake time", selection: $session.endTime)
                LabeledContent("Duration", value: durationText)
            }

            Section("Quality") {
                Picker("Rating", selection: Binding(
                    get: { session.quality ?? 0 },
                    set: { session.quality = $0 == 0 ? nil : $0 }
                )) {
                    Text("Not rated").tag(0)
                    ForEach(1...5, id: \.self) { i in
                        Text(String(repeating: "★", count: i)).tag(i)
                    }
                }
                .pickerStyle(.segmented)
            }

            Section("Notes") {
                TextField("Optional notes", text: Binding(
                    get: { session.notes ?? "" },
                    set: { session.notes = $0.isEmpty ? nil : $0 }
                ), axis: .vertical)
                .lineLimit(3...6)
            }

            Section {
                LabeledContent("Source", value: session.source.capitalized)
            }
        }
        .navigationTitle("Sleep Record")
        #if os(iOS)
        .navigationBarTitleDisplayMode(.inline)
        #endif
        .onChange(of: session.startTime) { _, _ in updateDuration() }
        .onChange(of: session.endTime) { _, _ in updateDuration() }
    }

    private var durationText: String {
        let h = session.durationMinutes / 60
        let m = session.durationMinutes % 60
        return m == 0 ? "\(h)h" : "\(h)h \(m)m"
    }

    private func updateDuration() {
        session.durationMinutes = Int(session.endTime.timeIntervalSince(session.startTime) / 60)
        try? context.save()
    }
}
